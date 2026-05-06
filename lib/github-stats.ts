// Typed accessor for the build-time GitHub stats payload. The JSON is
// regenerated on every prebuild by scripts/fetch-github-stats.mjs.
//
// Stars and lastCommitISO are nullable — the fetcher writes nulls on any
// network failure so the build never breaks. Components must hide gracefully
// when both fields are null.

import raw from "./generated/github.json";

export type GitHubStats = {
  stars: number | null;
  lastCommitISO: string | null;
  fetchedAt: string;
};

export const githubStats = raw as GitHubStats;

// Format an ISO timestamp as "Xm/h/d/w ago", falling back to a plain date
// string after 8 weeks. Returns null when the input is unparseable.
export function formatRelative(
  iso: string | null,
  now: Date = new Date(),
): string | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  const diffMs = now.getTime() - t;
  if (diffMs < 0) return iso.slice(0, 10);
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 8) return `${weeks}w ago`;
  return iso.slice(0, 10);
}

// "YYYY-MM-DD" or null. Used by StatStrip + footer "last commit" texts.
export function formatDateShort(iso: string | null): string | null {
  if (!iso || iso.length < 10) return null;
  return iso.slice(0, 10);
}
