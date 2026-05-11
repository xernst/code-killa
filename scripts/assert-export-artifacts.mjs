#!/usr/bin/env node
import { readFile } from "node:fs/promises";
const headersPath = process.env.HEADERS_PATH || "out/_headers";
const redirectsPath = process.env.REDIRECTS_PATH || "out/_redirects";
function fail(message) {
  console.error(`\x1b[31m✗\x1b[0m ${message}`);
  process.exit(1);
}
function pass(message) {
  console.log(`\x1b[32m✓\x1b[0m ${message}`);
}
const headers = await readFile(headersPath, "utf8").catch(() => null);
if (!headers) fail(`missing ${headersPath}`);
const redirects = await readFile(redirectsPath, "utf8").catch(() => null);
if (!redirects) fail(`missing ${redirectsPath}`);
for (const needle of [
  "Strict-Transport-Security:",
  "X-Content-Type-Options: nosniff",
  "Referrer-Policy: strict-origin-when-cross-origin",
  "X-Frame-Options: DENY",
  "Permissions-Policy: camera=(), microphone=(), geolocation=()",
]) {
  if (!headers.includes(needle)) fail(`out/_headers missing: ${needle}`);
}
if (!redirects.includes("/learn/v2/*") || !redirects.includes("200")) fail("out/_redirects missing the v2 passthrough rule");
if (!redirects.includes("/learn/:chapter/*") || !redirects.includes("/curriculum")) fail("out/_redirects missing the legacy redirect rule");
pass("out/_headers exists with baseline security headers");
pass("out/_redirects exists with v2 passthrough + legacy redirect rules");
