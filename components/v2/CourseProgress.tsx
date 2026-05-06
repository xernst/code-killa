"use client";

// Global header pill — "❯ 47/624 ─── ~8%". Single mono surface that makes
// every page feel cohort-aware. Reads localStorage on mount + on every
// promptdojo:progress-v2 event so the count stays fresh.
//
// Hides on /onboarding (we don't want learners to feel watched while they
// answer five questions). Also hides for fresh users — a "0/624" pill is
// the loudest "you've done nothing" signal a learner can see, and that's
// the wrong vibe for a free zero-cost school.
//
// Per design-kit/audit-v2/04-ui-design.md §3 Tier 1.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { loadProgressV2 } from "@/lib/storage";
import { totalStepsCompleted } from "@/lib/curriculum/progress-rollup";
import toc from "@/lib/generated/v2/manifest.toc.json";
import ProgressHairline from "./ProgressHairline";

const TOTAL_STEPS = toc.chapters.reduce(
  (a: number, c: { stepCount: number }) => a + c.stepCount,
  0,
);

export default function CourseProgress() {
  const pathname = usePathname();
  const [done, setDone] = useState<number | null>(null);

  useEffect(() => {
    function refresh() {
      setDone(totalStepsCompleted(loadProgressV2()));
    }
    refresh();
    window.addEventListener("promptdojo:progress-v2", refresh);
    return () =>
      window.removeEventListener("promptdojo:progress-v2", refresh);
  }, []);

  if (pathname?.startsWith("/onboarding")) return null;
  if (done === null || done === 0) return null;

  const pct =
    TOTAL_STEPS > 0 ? Math.round((done / TOTAL_STEPS) * 100) : 0;

  return (
    <div className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-400 sm:flex">
      <span className="text-green-500">❯</span>
      <span>
        {done}/{TOTAL_STEPS}
      </span>
      <ProgressHairline
        value={done}
        max={TOTAL_STEPS}
        height="sm"
        className="w-24"
      />
      <span>~{pct}%</span>
    </div>
  );
}
