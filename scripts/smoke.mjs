// Post-deploy smoke check for promptdojo.dev.
// Run after every push to catch the obvious failure modes a build can
// pass but production can't: blank homepage, 404 on lesson routes,
// API endpoint crashed.
//
// Usage:
//   pnpm smoke                                  # against prod (default)
//   SMOKE_BASE=http://localhost:3000 pnpm smoke # against local dev
//
// Exit code 0 if all checks pass, 1 otherwise.

// Strip a trailing slash so `${BASE}${path}` (path always starts with /)
// can't produce a double-slash URL when SMOKE_BASE is set with one.
const BASE = (process.env.SMOKE_BASE || "https://promptdojo.dev").replace(/\/$/, "");
const TIMEOUT_MS = 10_000;
const failures = [];

const log = {
  pass: (name) => console.log(`  \x1b[32m✓\x1b[0m ${name}`),
  fail: (name, why) => {
    console.log(`  \x1b[31m✗\x1b[0m ${name}\n      ${why}`);
    failures.push({ name, why });
  },
  group: (title) => console.log(`\n\x1b[1m${title}\x1b[0m`),
};

async function fetchText(path, init = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "promptdojo-smoke/1.0", ...(init.headers || {}) },
  });
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

function assertContains(name, text, needle) {
  if (text.includes(needle)) log.pass(name);
  else log.fail(name, `missing: ${JSON.stringify(needle)}`);
}

function assertStatus(name, got, want) {
  if (got === want) log.pass(name);
  else log.fail(name, `expected ${want}, got ${got}`);
}

async function check(name, fn) {
  try {
    await fn();
  } catch (err) {
    log.fail(name, err instanceof Error ? err.message : String(err));
  }
}

console.log(`smoke: ${BASE}`);

await check("homepage", async () => {
  log.group("homepage");
  const { status, text } = await fetchText("/");
  assertStatus("status 200", status, 200);
  assertContains("hero copy: 'ai writes this'", text, "ai writes this");
  assertContains("primary CTA: catch ai's first bug", text, "catch ai");
  assertContains("beginner path: new to python", text, "new to python");
  assertContains("email signup section", text, "subscribe in one click");
  assertContains("@TFisPython link", text, "TFisPython");
});

await check("about", async () => {
  log.group("about page");
  const { status, text } = await fetchText("/about/");
  assertStatus("status 200", status, 200);
  assertContains("about hero", text, "you live in cursor");
  // Verify the count is dynamic — should match home page derivation.
  // A literal "25 chapters" or "624 steps" would be the regression we
  // closed in commit 11eb16b.
  if (text.includes("25 chapters") || text.includes("624 ")) {
    log.fail("dynamic counts", "found hardcoded 25/624 — regression");
  } else {
    log.pass("dynamic counts");
  }
});

await check("lesson route", async () => {
  log.group("lesson route");
  const path = "/learn/v2/agent-loops/the-loop/0/";
  const { status, text } = await fetchText(path);
  assertStatus(`status 200 at ${path}`, status, 200);
  assertContains("lesson loads chapter title", text, "agent loops");
  assertContains("step content present", text, "stop_reason");
});

await check("subscribe api", async () => {
  log.group("subscribe API");
  // Bad body → 400
  {
    const { status } = await fetchText("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "not-a-valid-email" }),
    });
    assertStatus("invalid email → 400", status, 400);
  }
  // Valid email → either 503 (env vars missing) or 200 (live)
  {
    const { status, text } = await fetchText("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: `smoke-${Date.now()}@example.invalid` }),
    });
    if (status === 503) {
      log.pass("env vars not yet configured (503 expected pre-Beehiiv)");
    } else if (status === 200) {
      assertContains("success body", text, "you're in");
    } else if (status === 429) {
      log.pass("rate limit triggered (acceptable on rerun)");
    } else {
      log.fail("subscribe handler", `unexpected status ${status}`);
    }
  }
});

await check("sitemap + robots", async () => {
  log.group("seo files");
  const { status: smStatus, text: sm } = await fetchText("/sitemap.xml");
  assertStatus("sitemap 200", smStatus, 200);
  assertContains("sitemap includes home", sm, "<loc>https://promptdojo.dev/</loc>");
  const { status: rbStatus, text: rb } = await fetchText("/robots.txt");
  assertStatus("robots 200", rbStatus, 200);
  assertContains("robots links sitemap", rb, "sitemap.xml");
});

console.log("");
if (failures.length === 0) {
  console.log("\x1b[32mall checks passed\x1b[0m");
  process.exit(0);
} else {
  console.log(`\x1b[31m${failures.length} check(s) failed\x1b[0m`);
  process.exit(1);
}
