#!/usr/bin/env node
const BASE = (process.env.CHECK_BASE || "https://promptdojo.dev").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.CHECK_TIMEOUT_MS || 10000);
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
    headers: { "user-agent": "promptdojo-check-production/1.0" },
  });
  return { res, location: res.headers.get("location") };
}
for (const path of ["/learn/v2/variables/naming-things/0/", "/learn/v2/agent-loops/the-loop/0/", "/learn/variables/"]) {
  const { res, location } = await hit(path);
  if (path.startsWith("/learn/v2/")) log(res.status === 200, `${path} should stay live`, `got ${res.status} -> ${location || "<none>"}`);
  else log(res.status >= 300 && res.status < 400 && location?.includes("/curriculum"), `${path} should redirect to /curriculum`, `got ${res.status} -> ${location || "<none>"}`);
}
const { res: home } = await hit("/");
for (const header of ["strict-transport-security", "x-content-type-options", "referrer-policy", "x-frame-options", "permissions-policy"]) {
  log(Boolean(home.headers.get(header)), `homepage exposes ${header}`, home.headers.get(header) || "missing");
}
if (failures.length > 0) process.exit(1);
