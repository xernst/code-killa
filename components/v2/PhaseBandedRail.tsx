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
  className?: string;
};

export default function PhaseBandedRail({
  chapters,
  stepIdsByChapter,
  className,
}: Props) {
  return (
    <PhaseBandedRailClient
      chapters={chapters}
      stepIdsByChapter={stepIdsByChapter}
      className={className}
    />
  );
}
