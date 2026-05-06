"use client";

// Client wrapper around the phase-banded chapter rail. Hoists a single
// localStorage subscription so the 25 tiles share state instead of
// triggering 25 listeners.
//
// Per design-kit/audit-v2/04-ui-design.md §2 (chapter tile density).

import Link from "next/link";
import { useEffect, useState } from "react";
import { PHASES } from "@/lib/curriculum/phases";
import { loadProgressV2 } from "@/lib/storage";
import { chapterDoneCount } from "@/lib/curriculum/progress-rollup";
import ProgressHairline from "./ProgressHairline";

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
  stepIdsByChapter: Record<string, string[]>;
  className?: string;
};

export default function PhaseBandedRailClient({
  chapters,
  stepIdsByChapter,
  className,
}: Props) {
  const bySlug = new Map(chapters.map((c) => [c.slug, c]));
  const [doneBySlug, setDoneBySlug] = useState<Record<string, number>>({});

  useEffect(() => {
    function refresh() {
      const progress = loadProgressV2();
      const next: Record<string, number> = {};
      for (const c of chapters) {
        next[c.slug] = chapterDoneCount(progress, c.slug, stepIdsByChapter);
      }
      setDoneBySlug(next);
    }
    refresh();
    window.addEventListener("promptdojo:progress-v2", refresh);
    return () =>
      window.removeEventListener("promptdojo:progress-v2", refresh);
  }, [chapters, stepIdsByChapter]);

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
        const tier =
          phase.number === 1
            ? "foundations"
            : phase.number <= 3
              ? "core"
              : "advanced";
        const tierColor =
          phase.number === 1
            ? "text-green-700"
            : phase.number <= 3
              ? "text-green-500"
              : "text-ink-100";
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
                <ChapterTile
                  key={c.slug}
                  chapter={c}
                  tier={tier}
                  tierColor={tierColor}
                  doneSteps={doneBySlug[c.slug] ?? 0}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ChapterTile({
  chapter: c,
  tier,
  tierColor,
  doneSteps,
}: {
  chapter: ChapterMeta;
  tier: string;
  tierColor: string;
  doneSteps: number;
}) {
  const href = c.firstLessonSlug
    ? c.hasOverview
      ? `/learn/v2/${c.slug}`
      : `/learn/v2/${c.slug}/${c.firstLessonSlug}/0`
    : null;
  const titleClean = c.title.replace(/\s*—.*$/, "").toLowerCase();

  const body = (
    <>
      {/* row 1 — eyebrow strip with difficulty tier */}
      <div className="flex items-baseline justify-between">
        <span className="t-eyebrow text-ink-500">
          ch {String(c.number).padStart(2, "0")}
        </span>
        <span className={`t-mono-meta ${tierColor}`}>{tier}</span>
      </div>
      {/* row 2 — title + blurb */}
      <div className="mt-2">
        <div className="t-h3 group-hover:text-green-300">{titleClean}</div>
        <p className="t-body-sm mt-2 line-clamp-2">{c.blurb}</p>
      </div>
      {/* row 3 — meta strip */}
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="t-mono-meta">
          {c.stepCount} steps · ~{formatMinutes(c.estMinutes)}
        </span>
        <span className="t-mono-meta tabular-nums text-ink-300">
          {doneSteps}/{c.stepCount}
        </span>
      </div>
      {/* row 4 — 1px completion hairline (decoration, no aria) */}
      <ProgressHairline
        value={doneSteps}
        max={c.stepCount}
        height="xs"
        className="mt-3"
      />
    </>
  );

  if (!href) {
    return (
      <div className="dojo-card-interactive flex flex-col opacity-60">
        {body}
      </div>
    );
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
