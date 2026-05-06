// Five-receipt stat strip for / and /about — chapters, steps, hours, MIT,
// last commit. Per design-kit/audit-v2/06-trust-signals.md.
//
// Server component. Reads totals from the v2 manifest TOC and the
// build-time GitHub stats. Hours range is hardcoded — honest range beats
// derived precision.

import toc from "@/lib/generated/v2/manifest.toc.json";
import { githubStats, formatDateShort } from "@/lib/github-stats";
import { cn } from "@/lib/utils";

const HOURS = "8–15h";

export default function StatStrip({ className }: { className?: string }) {
  const chapters = toc.chapters.length;
  const steps = toc.chapters.reduce(
    (a: number, c: { stepCount: number }) => a + c.stepCount,
    0,
  );
  const lastCommit = formatDateShort(githubStats.lastCommitISO);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 t-mono-meta",
        className,
      )}
    >
      <span>{chapters} chapters</span>
      <span className="text-ink-700">·</span>
      <span>{steps} steps</span>
      <span className="text-ink-700">·</span>
      <span>{HOURS}</span>
      <span className="text-ink-700">·</span>
      <span className="text-green-500">MIT</span>
      {lastCommit && (
        <>
          <span className="text-ink-700">·</span>
          <span>last commit {lastCommit}</span>
        </>
      )}
    </div>
  );
}
