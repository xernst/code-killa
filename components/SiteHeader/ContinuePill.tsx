// One-keypress resume affordance in the global header. Reads
// lastVisitedV2 from localStorage and links to /lesson/resume.
// Hides when:
//   - no progress yet (fresh user)
//   - currently inside the lesson it would point to (would be a no-op)
//
// Per design-kit/audit-v3/04-navigation-system.md PR 5 + CEO §5.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  getLastVisitedV2,
  PROGRESS_EVENT_V2,
  type LastVisitedV2,
} from "@/lib/storage";
import toc from "@/lib/generated/v2/manifest.toc.json";

const CHAPTER_NUMBER_BY_SLUG: Record<string, number> = Object.fromEntries(
  (toc.chapters as Array<{ slug: string; number: number }>).map((c) => [
    c.slug,
    c.number,
  ]),
);

export default function ContinuePill() {
  const [last, setLast] = useState<LastVisitedV2 | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => setLast(getLastVisitedV2() ?? null);
    refresh();
    window.addEventListener(PROGRESS_EVENT_V2, refresh);
    return () => window.removeEventListener(PROGRESS_EVENT_V2, refresh);
  }, []);

  if (!last) return null;

  // Hide when the user is already in this lesson's tree.
  const insideThisLesson = pathname?.startsWith(
    `/learn/v2/${last.chapterSlug}/${last.lessonSlug}`,
  );
  if (insideThisLesson) return null;

  const chapterNumber = CHAPTER_NUMBER_BY_SLUG[last.chapterSlug];
  const chapterLabel =
    chapterNumber != null
      ? `ch ${String(chapterNumber).padStart(2, "0")}`
      : `ch ${last.chapterSlug}`;

  return (
    <Link
      href="/lesson/resume"
      className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-300 transition hover:text-green-400"
    >
      <span className="text-green-500">❯</span>
      continue · {chapterLabel} · step {last.stepIndex + 1}
    </Link>
  );
}
