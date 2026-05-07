// The whole course on one page. Server component using the same
// PhaseBandedRail data the home page builds, but expanded so each
// chapter shows its lesson list. Static-export safe — pure server
// component reading the build-time manifest.
//
// Per design-kit/audit-v3/04-navigation-system.md PR 5.

import type { Metadata } from "next";

import StatStrip from "@/components/StatStrip";
import CurriculumAccordion from "@/components/v2/CurriculumAccordion";
import { getV2Toc, getV2Chapter } from "@/lib/content-v2";

// Dynamic metadata so chapter/step counts always match getV2Toc.
// Per UI audit 2026-05-07.
export async function generateMetadata(): Promise<Metadata> {
  const toc = getV2Toc();
  const chapters = toc.chapters.length;
  const steps = toc.chapters.reduce((a, c) => a + c.stepCount, 0);
  return {
    title: "the curriculum · promptdojo",
    description: `${chapters} chapters, ${steps} runnable steps. read · run · fix. free, open-source, no signup.`,
    alternates: { canonical: "/curriculum" },
  };
}

export default async function Curriculum() {
  const toc = getV2Toc();
  const chaptersWithExtras = await Promise.all(
    toc.chapters.map(async (entry) => {
      const detail = await getV2Chapter(entry.slug);
      const firstLessonSlug = detail?.lessons[0]?.slug ?? null;
      const hasOverview =
        !!detail?.overview && detail.overview.trim().length > 0;
      const stepIds = detail
        ? detail.lessons.flatMap((l) => l.steps.map((s) => s.id))
        : [];
      const lessons = detail
        ? detail.lessons.map((l) => ({
            slug: l.slug,
            title: l.title,
            stepCount: l.steps.length,
          }))
        : [];
      return {
        meta: {
          slug: entry.slug,
          title: entry.title,
          number: entry.number,
          blurb: entry.blurb,
          lessonCount: entry.lessonCount,
          stepCount: entry.stepCount,
          estMinutes: entry.estMinutes,
          firstLessonSlug,
          hasOverview,
        },
        stepIds,
        lessons,
      };
    }),
  );

  const chapters = chaptersWithExtras.map((c) => c.meta);
  const lessonsByChapter = Object.fromEntries(
    chaptersWithExtras.map((c) => [c.meta.slug, c.lessons]),
  );

  const totalSteps = chapters.reduce((a, c) => a + c.stepCount, 0);

  return (
    <main id="main" className="mx-auto max-w-6xl px-6 pt-20 pb-10 sm:pt-24 sm:pb-16">
      <div className="t-eyebrow">the whole course</div>
      <h1 className="t-section mt-3">
        {chapters.length} chapters · {totalSteps} runnable steps · 8–15h
      </h1>
      <StatStrip className="mt-6" />
      <CurriculumAccordion
        chapters={chapters.map((c) => ({
          slug: c.slug,
          title: c.title,
          number: c.number,
          blurb: c.blurb,
          stepCount: c.stepCount,
          estMinutes: c.estMinutes,
          firstLessonSlug: c.firstLessonSlug,
          hasOverview: c.hasOverview,
          lessons: lessonsByChapter[c.slug] ?? [],
        }))}
        className="mt-12"
      />
    </main>
  );
}
