// Site-wide ember pill linking to @TFisPython on X.
//
// Per HEADOFIT-plan §PR 4: tracks via href only (no analytics V1). Lives
// in app/layout.tsx so it appears site-wide; if it competes with the IDE
// on lesson pages we can later move it to /, /onboarding only.

import { cn } from "@/lib/utils";

export default function FollowOnXPill({ className }: { className?: string }) {
  return (
    <a
      href="https://x.com/TFisPython"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 border border-green-700/50 bg-green-950/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-green-400 transition hover:border-green-500 hover:text-green-300",
        className,
      )}
    >
      [ follow @TFisPython on x ]
    </a>
  );
}
