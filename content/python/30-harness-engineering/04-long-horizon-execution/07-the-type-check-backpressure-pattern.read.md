---
xp: 1
estSeconds: 220
concept: type-check-backpressure
---

# The post-edit hook that makes the model self-correct

The canonical hook example, worked end-to-end. This is the pattern Osmani points at when he talks about *backpressure* and the pattern HumanLayer specifically prescribes for TypeScript codebases.

The setup: agent is editing a TypeScript file. The agent's mental model of the code may not match reality — it might use a property that doesn't exist, miss a `null` check the linter cares about, or import from the wrong module. Without enforcement, the agent declares done; the human runs `tsc` and finds 12 errors.

The fix: a post-edit hook that runs `tsc --noEmit` after every TypeScript write, and on failure, *injects the errors back into the model's next turn*.

## The lifecycle, in one diagram

```
1. Model calls Edit("src/auth.ts", ...)
2. Harness runs the edit.
3. [post-edit hook fires]
   - hook: `tsc --noEmit src/auth.ts` (or full project, depending on config)
   - hook output is captured
4. If tsc exits 0: nothing added to model's context (silent success)
   If tsc exits non-zero: errors are added as a tool_result block on the next turn
5. Model receives the errors on its next turn, sees them as feedback, edits to fix
6. Edit-and-check loop continues until tsc passes.
```

The model never had to choose to run `tsc`. The harness ran it. The model only sees errors when there are errors. The recovery is automatic.

## Why this works

Three structural reasons:

1. **The model doesn't need to remember.** Even with a perfect AGENTS.md rule saying "always run tsc after edits," the rule could be forgotten under context rot. The hook can't be forgotten; it always fires.
2. **The feedback is precise.** Errors come back with file paths, line numbers, and the actual TypeScript error message. The model can fix the specific issue, not guess at "something might be wrong."
3. **It composes with the completion guard.** A post-edit hook keeps the model from accumulating errors. A pre-stop hook (or the completion guard from step 02) refuses to declare done while errors remain. Together they prevent the "I'm done — wait no I'm not — wait yes I am" flicker.

## Variations on the pattern

The same backpressure shape applies to other tools:

- **Post-edit Python** → `ruff check` + `mypy`
- **Post-edit Rust** → `cargo check`
- **Post-edit YAML** → `yamllint`
- **Post-write Markdown** → `markdownlint`
- **Post-bash on package install** → check that the install succeeded and version matches expectations
- **Post-API-call** → verify the response body has expected fields

Each one is the same shape: *do the thing, check the thing, inject errors on failure, silent on success.*

## What this is NOT

Three things to be clear about:

- **Not "the agent can't ship until perfect."** The hook can be configured with severity levels — block on errors, warn on style. Block-on-error is what most teams use.
- **Not "run the full test suite after every edit."** That's too slow. Most production setups run `tsc` (fast, types only) after each edit and the *full test suite* only at pre-commit. Tier the checks by speed.
- **Not magic.** If the project has a broken tsconfig or a test suite that fails for environmental reasons, the hook fails too. Make sure the underlying tooling works before you wire it to backpressure.

## What this costs

Two costs to know about:

- **Latency.** Every edit now waits on `tsc`. On a large codebase, `tsc` can take 30-60 seconds. The fix: use `tsc --incremental` or check only the touched files / dependents, not the whole project.
- **Context cost on failure.** When `tsc` fails, the errors are added to context. On a bad edit, that can be 500-2000 tokens of error output. The hook should *summarize* if errors are excessive — first 10 errors verbatim, then "... and 47 more, run `tsc` for the full list."

## Where this lives in real harnesses

- **Claude Code's hooks system** — the PostToolUse hook is exactly this lifecycle. Trivially configurable per-language.
- **Cursor's diagnostics integration** — automatic post-edit, integrated with VS Code's language servers.
- **Codex CLI** — supported via AGENTS.md and hooks scripts.
- **Aider's --auto-test flag** — runs tests after each edit; on failure, surfaces the test output for the next turn.

The pattern is everywhere because it's cheap to add and dramatically improves the quality of long-horizon work. It is the highest-leverage 30 lines of code in a harness.

## What's next

Two write steps. The first routes actions to hook lifecycles (pre vs post). The second is the completion guard — the function that decides whether to re-enter the loop on a claimed-done state. Then the checkpoint audits a full long-horizon harness across all six capabilities.
