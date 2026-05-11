#!/usr/bin/env node
const BASE = (process.env.SMOKE_BASE || "https://promptdojo.dev").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 10000);
const routes = [
  "/",
  "/curriculum",
  "/about",
  "/robots.txt",
  "/sitemap.xml",
  "/learn/v2/variables",
  "/learn/v2/variables/naming-things/0",
  "/learn/v2/agent-loops/the-loop/0",
  "/learn/variables",
  "/learn/variables/naming-things/0",
];
const failures = [];
function log(ok, message, detail = "") {
  const mark = ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
  console.log(`${mark} ${message}${detail ? `\n    ${detail}` : ""}`);
  if (!ok) failures.push({ message, detail });
}
async function hit(path) {
  const res = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "promptdojo-smoke-routes/1.0" },
  });
  return { res, location: res.headers.get("location") };
}
for (const path of routes) {
  try {
    const { res, location } = await hit(path);
    if (path.startsWith("/learn/v2/")) {
      if (res.status !== 200) log(false, `${path} should return 200`, `got ${res.status} -> ${location || "<none>"}`);
      else log(true, `${path} returns 200 without redirect`);
      continue;
    }
    if (path === "/learn/variables" || path === "/learn/variables/naming-things/0") {
      if (res.status >= 300 && res.status < 400 && location?.includes("/curriculum")) log(true, `${path} redirects to /curriculum`, `${res.status} -> ${location}`);
      else log(false, `${path} should redirect to /curriculum`, `got ${res.status} -> ${location || "<none>"}`);
      continue;
    }
    if (res.status === 200) log(true, `${path} returns 200`);
    else log(false, `${path} should return 200`, `got ${res.status}`);
  } catch (error) {
    log(false, `${path} request failed`, error instanceof Error ? error.message : String(error));
  }
}
if (failures.length > 0) process.exit(1);
