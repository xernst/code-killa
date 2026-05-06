// Build-time GitHub stats pill. Server component — no client JS.
// Renders ★ N · committed Xh ago when both fields populated.
// Returns null when both stars and lastCommitISO are unavailable so the
// pill simply disappears on Cloudflare CI without a network egress.

import { cn } from "@/lib/utils";
import { githubStats, formatRelative } from "@/lib/github-stats";

export default function GitHubStatsPill({ className }: { className?: string }) {
  const { stars, lastCommitISO } = githubStats;
  const rel = formatRelative(lastCommitISO);

  if (stars === null && rel === null) return null;

  let label: string;
  let aria: string;
  if (stars !== null && rel !== null) {
    label = `[ ★ ${stars} · committed ${rel} ]`;
    aria = `${stars} stars on GitHub, last commit ${rel}`;
  } else if (stars !== null) {
    label = `[ ★ ${stars} ]`;
    aria = `${stars} stars on GitHub`;
  } else {
    label = `[ committed ${rel} ]`;
    aria = `last commit ${rel}`;
  }

  return (
    <a
      href="https://github.com/xernst/promptdojo"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      className={cn(
        "inline-flex items-center gap-1.5 border border-green-700/50 bg-green-950/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-green-400 transition hover:border-green-500 hover:text-green-300",
        className,
      )}
    >
      {label}
    </a>
  );
}
