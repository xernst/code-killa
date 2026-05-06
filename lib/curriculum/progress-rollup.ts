// Pure rollup helpers — no DOM, no localStorage. Server-safe.
// Take a manifest-derived `stepIdsByChapter` map and a ProgressV2 blob and
// answer "how many steps in this chapter has the user passed?" without
// the caller having to know the step-id format the build script emits.

import type { ProgressV2 } from "@/lib/storage";

/**
 * Number of steps the user has passed in the given chapter, scoped strictly
 * to that chapter's step ids. Skipped/failed/pending steps return 0.
 */
export function chapterDoneCount(
  progress: ProgressV2 | null | undefined,
  chapterSlug: string,
  stepIdsByChapter: Record<string, string[]>,
): number {
  if (!progress) return 0;
  const ids = stepIdsByChapter[chapterSlug];
  if (!ids || ids.length === 0) return 0;
  let n = 0;
  for (const id of ids) {
    if (progress.steps[id]?.status === "passed") n += 1;
  }
  return n;
}

/**
 * Total passed steps across the whole curriculum. Used by the global
 * <CourseProgress /> header pill.
 */
export function totalStepsCompleted(
  progress: ProgressV2 | null | undefined,
): number {
  if (!progress) return 0;
  let n = 0;
  for (const s of Object.values(progress.steps)) {
    if (s.status === "passed") n += 1;
  }
  return n;
}
