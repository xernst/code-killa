// Phase-banded curriculum rail. Server component shell that delegates to a
// client wrapper for the localStorage subscription. Tiles ship 8 fields each
// after PR 3 (eyebrow + difficulty + title + blurb + steps · time + done/total
// + 1px hairline). One subscription, many tiles.
//
// Per design-kit/audit-v2/04-ui-design.md §1 + §2.

import PhaseBandedRailClient, {
  type ChapterMeta,
} from "./PhaseBandedRailClient";

export type { ChapterMeta };

type Props = {
  chapters: ChapterMeta[];
  stepIdsByChapter: Record<string, string[]>;
  /** When true, render each chapter tile with its lesson list expanded. */
  expanded?: boolean;
  /** Optional per-chapter lesson summaries — required when `expanded` is true. */
  lessonsByChapter?: Record<
    string,
    { slug: string; title: string; stepCount: number }[]
  >;
  className?: string;
};

export default function PhaseBandedRail({
  chapters,
  stepIdsByChapter,
  expanded,
  lessonsByChapter,
  className,
}: Props) {
  return (
    <PhaseBandedRailClient
      chapters={chapters}
      stepIdsByChapter={stepIdsByChapter}
      expanded={expanded}
      lessonsByChapter={lessonsByChapter}
      className={className}
    />
  );
}
