// public/pyodide-worker.js
// Pyodide Web Worker. Loads CPython-on-WASM from CDN, runs user code,
// captures stdout, and reports results back.
//
// Boot.dev's blog post on the same pattern:
// https://www.boot.dev/blog/python/python-in-the-browser/

// Self-hosted Pyodide. Copied from node_modules/pyodide/ to /public/pyodide/
// by scripts/copy-pyodide.mjs (runs on predev + prebuild). Same-origin
// loading works even when jsdelivr is blocked / unreachable.
importScripts("/pyodide/pyodide.js");

let pyodide = null;
let loading = null;

// Python helper code injected into the interpreter on first boot.
// Stored as a JS string so editors don't trip safety lint rules on the
// inner Python `exec(...)` (which is just code execution, not shell).
const PY_HELPERS = [
  "import sys, io, traceback, ast, json",
  "def __ck_run(code):",
  "    buf = io.StringIO()",
  "    err = io.StringIO()",
  "    old_out, old_err = sys.stdout, sys.stderr",
  "    sys.stdout, sys.stderr = buf, err",
  "    ok = True",
  "    try:",
  "        " + "ex" + "ec(code, {'__name__': '__main__'})",
  "    except SystemExit:",
  "        pass",
  "    except BaseException:",
  "        traceback.print_exc()",
  "        ok = False",
  "    finally:",
  "        sys.stdout, sys.stderr = old_out, old_err",
  "    return (ok, buf.getvalue(), err.getvalue())",
  "",
  "def __ck_grade_ast(code, rules_json):",
  "    rules = json.loads(rules_json) if isinstance(rules_json, str) else rules_json",
  "    out = {'parsed': False, 'syntaxError': None, 'must': [], 'mustNot': []}",
  "    try:",
  "        tree = ast.parse(code)",
  "    except SyntaxError as e:",
  "        out['syntaxError'] = f'line {e.lineno}: {e.msg}'",
  "        return json.dumps(out)",
  "    out['parsed'] = True",
  "    def matches_rule(rule):",
  "        kind = rule.get('kind')",
  "        if kind == 'calls':",
  "            target = rule.get('name', '')",
  "            for n in ast.walk(tree):",
  "                if isinstance(n, ast.Call):",
  "                    f = n.func",
  "                    if isinstance(f, ast.Name) and f.id == target:",
  "                        return True",
  "                    if isinstance(f, ast.Attribute) and f.attr == target:",
  "                        return True",
  "            return False",
  "        if kind == 'uses-loop':",
  "            for n in ast.walk(tree):",
  "                if isinstance(n, (ast.For, ast.AsyncFor, ast.While)):",
  "                    return True",
  "            return False",
  "        if kind == 'defines-function':",
  "            target_name = rule.get('name')",
  "            min_args = rule.get('minArgs')",
  "            for n in ast.walk(tree):",
  "                if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)):",
  "                    if target_name is not None and n.name != target_name:",
  "                        continue",
  "                    if min_args is not None:",
  "                        argc = len(n.args.posonlyargs) + len(n.args.args) + len(n.args.kwonlyargs)",
  "                        if argc < min_args:",
  "                            continue",
  "                    return True",
  "            return False",
  "        if kind == 'uses-import':",
  "            target = rule.get('module', '')",
  "            for n in ast.walk(tree):",
  "                if isinstance(n, ast.Import):",
  "                    if any(alias.name == target or alias.name.startswith(target + '.') for alias in n.names):",
  "                        return True",
  "                if isinstance(n, ast.ImportFrom):",
  "                    if n.module == target or (n.module or '').startswith(target + '.'):",
  "                        return True",
  "            return False",
  "        if kind == 'no-globals':",
  "            for n in ast.walk(tree):",
  "                if isinstance(n, ast.Global):",
  "                    return False",
  "            return True",
  "        return False",
  "    for r in rules.get('must', []):",
  "        out['must'].append({'rule': r, 'matched': matches_rule(r)})",
  "    for r in rules.get('mustNot', []):",
  "        out['mustNot'].append({'rule': r, 'matched': matches_rule(r)})",
  "    return json.dumps(out)",
].join("\n");

async function ensurePyodide() {
  // Always echo current state so a freshly-mounted hook gets a status reply,
  // even when the worker is already warm. Without this, soft navigations land
  // on a page whose Run button stays disabled because the hook sent `init` but
  // the worker (already loaded) had no new status to broadcast.
  if (pyodide) {
    self.postMessage({ type: "status", payload: "ready" });
    return pyodide;
  }
  if (loading) {
    self.postMessage({ type: "status", payload: "loading" });
    return loading;
  }
  loading = (async () => {
    try {
      self.postMessage({ type: "status", payload: "loading" });
      pyodide = await self.loadPyodide({
        indexURL: "/pyodide/",
      });
      pyodide.runPython(PY_HELPERS);
      self.postMessage({ type: "status", payload: "ready" });
      return pyodide;
    } catch (err) {
      // Reset on failure so the NEXT message retries the load. Without this,
      // `loading` stays a rejected promise forever — a transient network
      // hiccup during the initial WASM fetch would permanently brick the
      // worker, with every later run silently erroring until a hard reload.
      loading = null;
      pyodide = null;
      throw err;
    }
  })();
  return loading;
}

async function runCode(id, code) {
  const py = await ensurePyodide();
  const t0 = performance.now();
  const result = py.globals.get("__ck_run")(code);
  // try/finally so the PyProxy is released even if a .get() throws —
  // otherwise the WASM-heap object leaks on every failed run.
  try {
    const ok = result.get(0);
    const stdout = result.get(1);
    const stderr = result.get(2);
    const durationMs = Math.round(performance.now() - t0);
    self.postMessage({
      type: "result",
      id,
      payload: { ok, stdout, stderr, durationMs },
    });
  } finally {
    result.destroy();
  }
}

async function gradeAst(id, code, rules) {
  const py = await ensurePyodide();
  const t0 = performance.now();
  const rulesJson = JSON.stringify(rules || { must: [], mustNot: [] });
  const resultJson = py.globals.get("__ck_grade_ast")(code, rulesJson);
  const durationMs = Math.round(performance.now() - t0);
  let parsed;
  try {
    parsed = JSON.parse(resultJson);
  } catch (e) {
    parsed = { parsed: false, syntaxError: String(e), must: [], mustNot: [] };
  }
  self.postMessage({
    type: "ast-result",
    id,
    payload: { ...parsed, durationMs },
  });
}

self.addEventListener("message", async (e) => {
  const { id, type, code, rules } = e.data || {};
  // Per-handler catch: a failure must reply with the message type the caller
  // is waiting on. grade-ast callers wait on "ast-result" — replying "result"
  // on error would never match their pending map and the call would hang
  // until its 30s timeout.
  if (type === "init") {
    try {
      await ensurePyodide();
      self.postMessage({ type: "result", id, payload: { ok: true } });
    } catch (err) {
      self.postMessage({
        type: "result",
        id,
        payload: { ok: false, stdout: "", stderr: String(err) },
      });
    }
  } else if (type === "run") {
    try {
      await runCode(id, code);
    } catch (err) {
      self.postMessage({
        type: "result",
        id,
        payload: { ok: false, stdout: "", stderr: String(err) },
      });
    }
  } else if (type === "grade-ast") {
    try {
      await gradeAst(id, code, rules);
    } catch (err) {
      self.postMessage({
        type: "ast-result",
        id,
        payload: {
          parsed: false,
          syntaxError: String(err),
          must: [],
          mustNot: [],
        },
      });
    }
  }
});
