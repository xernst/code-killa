// One progress primitive used at three densities across the site:
//   - xs (1px) — chapter tile decoration on /
//   - sm (4px) — header CourseProgress pill
//   - md (6px) — StepFooter lesson XP bar
//
// Pass ariaLabel only when the bar is the canonical progress affordance for
// its surface. Decorative use (chapter tile) omits ariaLabel and the
// progressbar role entirely so screen readers don't read 25 of them.
//
// Per design-kit/audit-v2/04-ui-design.md §3 (progress indicators).

import { cn } from "@/lib/utils";

type Props = {
  value: number;
  max: number;
  height?: "xs" | "sm" | "md";
  ariaLabel?: string;
  className?: string;
};

const HEIGHT = {
  xs: "h-px",
  sm: "h-1",
  md: "h-1.5",
} as const;

export default function ProgressHairline({
  value,
  max,
  height = "xs",
  ariaLabel,
  className,
}: Props) {
  const pct =
    max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role={ariaLabel ? "progressbar" : undefined}
      aria-valuemin={ariaLabel ? 0 : undefined}
      aria-valuemax={ariaLabel ? max : undefined}
      aria-valuenow={ariaLabel ? value : undefined}
      aria-label={ariaLabel}
      className={cn(
        "w-full overflow-hidden bg-ink-800",
        HEIGHT[height],
        className,
      )}
    >
      <div
        className="h-full bg-green-500 transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
