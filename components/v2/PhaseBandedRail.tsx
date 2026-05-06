// Phase-banded curriculum rail. Server component — reads no localStorage.
// Renders 5 phase bands stacked vertically with a green left rail per band.
// Each band shows phase eyebrow + range/time meta + a compact tile grid.
//
// Per design-kit/audit-v2/04-ui-design.md §1 (curriculum visualization).
// Replaces the flat 25-up grid that previously rendered on /. PR 3 promotes
// the tile from 4 fields to 8.

import Link from "next/link";
import { PHASES } from "@/lib/curriculum/phases";

export type ChapterMeta = {
  slug: string;
  title: string;
  number: number;
  blurb: string;
  lessonCount: number;
  stepCount: number;
  estMinutes: number;
  firstLessonSlug: string | null;
  hasOverview: boolean;
};

type Props = {
  chapters: ChapterMeta[];
  className?: string;
};

export default function PhaseBandedRail({ chapters, className }: Props) {
  const bySlug = new Map(chapters.map((c) => [c.slug, c]));

  return (
    <div
      id="chapters"
      className={`scroll-mt-8 space-y-24 ${className ?? ""}`.trim()}
    >
      {PHASES.map((phase) => {
        const phaseChapters = phase.chapterSlugs
          .map((s) => bySlug.get(s))
          .filter((c): c is ChapterMeta => !!c);
        const phaseMinutes = phaseChapters.reduce(
          (acc, c) => acc + c.estMinutes,
          0,
        );
        return (
          <section
            key={phase.number}
            className="border-l-2 border-green-700 pl-6"
          >
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="t-eyebrow">
                  phase {String(phase.number).padStart(2, "0")} · {phase.name}
                </div>
                <p className="t-body-sm mt-2 max-w-2xl">{phase.blurb}</p>
              </div>
              <div className="t-mono-meta">
                {phase.range} · ~{formatMinutes(phaseMinutes)}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {phaseChapters.map((c) => (
                <ChapterTile key={c.slug} chapter={c} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ChapterTile({ chapter: c }: { chapter: ChapterMeta }) {
  const href = c.firstLessonSlug
    ? c.hasOverview
      ? `/learn/v2/${c.slug}`
      : `/learn/v2/${c.slug}/${c.firstLessonSlug}/0`
    : null;
  const titleClean = c.title.replace(/\s*—.*$/, "").toLowerCase();

  const body = (
    <>
      <div className="t-eyebrow text-ink-500">
        ch {String(c.number).padStart(2, "0")}
      </div>
      <div className="t-h3 mt-2 group-hover:text-green-300">{titleClean}</div>
      <p className="t-body-sm mt-2 line-clamp-2">{c.blurb}</p>
      <div className="t-mono-meta mt-auto pt-3">
        {c.stepCount} steps · ~{formatMinutes(c.estMinutes)}
      </div>
    </>
  );

  if (!href) {
    return <div className="dojo-card-interactive flex flex-col opacity-60">{body}</div>;
  }
  return (
    <Link href={href} className="group dojo-card-interactive flex flex-col">
      {body}
    </Link>
  );
}

function formatMinutes(m: number): string {
  if (!Number.isFinite(m) || m <= 0) return "0m";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
}
