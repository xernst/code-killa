// Levenshtein "did you mean" suggestion for /not-found. Threshold: <=4.
// Anything farther stays silent — better to say nothing than guess wrong.
//
// Per design-kit/audit-v4/HEADOFIT-plan.md PR 10.

"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const KNOWN_PATHS = [
  "/",
  "/about",
  "/curriculum",
  "/changelog",
  "/onboarding",
  "/lesson/resume",
];

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
}

// No-op subscribe: the suggestion is computed once from the URL the user
// landed on and never changes for the life of this mount.
const NO_SUBSCRIBE = () => () => {};

function computeSuggestion(): string | null {
  const path = window.location.pathname;
  let best: { path: string; dist: number } | null = null;
  for (const cand of KNOWN_PATHS) {
    const dist = levenshtein(path, cand);
    if (best === null || dist < best.dist) best = { path: cand, dist };
  }
  return best && best.dist > 0 && best.dist <= 4 ? best.path : null;
}

export default function DidYouMean() {
  // The suggestion depends on window.location.pathname, which does not exist
  // during SSR/prerender. not-found.tsx is a STATIC page — prerendered once
  // with an empty slot here, then served for every unknown URL. Computing it
  // in render would diverge from the prerendered HTML and throw a hydration
  // mismatch. useSyncExternalStore returns the server snapshot (null) for SSR
  // and the first hydration pass, then swaps in the client value — the
  // React-sanctioned way to render a client-only value mismatch-free.
  const suggestion = useSyncExternalStore(
    NO_SUBSCRIBE,
    computeSuggestion,
    () => null,
  );

  if (!suggestion) return null;

  return (
    <p className="mt-6 t-body">
      did you mean{" "}
      <Link
        href={suggestion}
        className="text-green-400 underline underline-offset-2 hover:text-green-300"
      >
        {suggestion}
      </Link>
      ?
    </p>
  );
}
