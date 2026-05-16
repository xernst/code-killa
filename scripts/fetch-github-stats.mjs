// Build-time GitHub stats fetcher. Writes lib/generated/github.json with
// { stars, lastCommitISO, fetchedAt }. On any failure (network down, rate
// limit, non-200, JSON parse error) writes a null-fallback payload and
// exits 0 — the build NEVER fails because of this script.
//
// The site renders the stars/committed pill only when both fields are
// non-null. No GITHUB_TOKEN needed; we accept the 60/hr unauthed rate limit.
//
// Per design-kit/audit-v2/HEADOFIT-plan.md PR 6.

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_API = "https://api.github.com/repos/xernst/promptdojo";
const COMMITS_API = `${REPO_API}/commits?per_page=1`;
// Anchor to the repo root via this file's location, not process.cwd() — so
// the output lands in <repo>/lib/generated regardless of the caller's cwd.
const GENERATED_DIR = fileURLToPath(new URL("../lib/generated/", import.meta.url));
const OUT_PATH = join(GENERATED_DIR, "github.json");

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "promptdojo-build", Accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(5_000),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }
  return res.json();
}

async function main() {
  const fetchedAt = new Date().toISOString();
  let stars = null;
  let lastCommitISO = null;

  try {
    const [repo, commits] = await Promise.all([
      fetchJson(REPO_API),
      fetchJson(COMMITS_API),
    ]);
    if (typeof repo?.stargazers_count === "number") {
      stars = repo.stargazers_count;
    }
    const commitDate = commits?.[0]?.commit?.author?.date;
    if (typeof commitDate === "string" && commitDate.length > 0) {
      lastCommitISO = commitDate;
    }
    console.log(
      `[fetch-github-stats] ok: stars=${stars} lastCommit=${lastCommitISO}`,
    );
  } catch (err) {
    console.log(
      `[fetch-github-stats] soft-fail: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(
    OUT_PATH,
    JSON.stringify({ stars, lastCommitISO, fetchedAt }, null, 2),
    "utf8",
  );
}

main().catch(async (err) => {
  // Last-resort fallback — even if main() throws past its own try/catch,
  // ship a null payload so the build never fails.
  console.log(
    `[fetch-github-stats] hard-fail: ${err instanceof Error ? err.message : String(err)}`,
  );
  try {
    await mkdir(GENERATED_DIR, { recursive: true });
    await writeFile(
      OUT_PATH,
      JSON.stringify(
        { stars: null, lastCommitISO: null, fetchedAt: new Date().toISOString() },
        null,
        2,
      ),
      "utf8",
    );
  } catch {
    // even the fallback write failed — let the build continue
  }
  process.exit(0);
});
