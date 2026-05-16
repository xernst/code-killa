import type { Metadata } from "next";
import Link from "next/link";
import { getV2Toc, getV2Chapter } from "@/lib/content-v2";
import HomeClient from "@/components/v2/HomeClient";
import PhaseBandedRail from "@/components/v2/PhaseBandedRail";
import EmailSignup from "@/components/EmailSignup";
import StatStrip from "@/components/StatStrip";
import StreakWidget from "@/components/StreakWidget";
import PyodidePreloader from "@/components/PyodidePreloader";
import Wordmark from "@/components/Wordmark";
import FooterSocials from "@/components/FooterSocials";
import HeroBugSnippet from "@/components/HeroBugSnippet";
import JsonLd, { SITE_URL } from "@/components/JsonLd";
import { formatDateShort, githubStats } from "@/lib/github-stats";

// Dynamic metadata so the description always reflects the actual chapter
// + step counts at build time. Per audit-v5/code-review.md (the hardcoded
// "25 chapters, 624 steps" lied — actual was 26 / 515).
export async function generateMetadata(): Promise<Metadata> {
  const toc = getV2Toc();
  const chapters = toc.chapters.length;
  const steps = toc.chapters.reduce(
    (a: number, c: { stepCount: number }) => a + c.stepCount,
    0,
  );
  return {
    metadataBase: new URL("https://promptdojo.dev"),
    title: "promptdojo, the free python school for the ai era",
    description: `ai is reshaping every job. promptdojo teaches you to build with it: read what ai writes, catch what it gets wrong, and ship real work. ${chapters} chapters, ${steps} runnable steps. free for individuals, forever.`,
    alternates: { canonical: "https://promptdojo.dev/" },
    openGraph: {
      type: "website",
      title: "promptdojo, the free python school for the ai era",
      description: `your job just changed. learn to build with ai or fall behind. ${chapters} chapters, ${steps} runnable steps, runs in your browser. free for individuals, forever.`,
      url: "https://promptdojo.dev/",
      siteName: "promptdojo",
      images: [{ url: "/og/launch/wedge", width: 1600, height: 900, alt: "promptdojo, the free python school for the ai era" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "promptdojo, everyone's a builder now",
      description: "your job just changed. learn to build with ai or fall behind. free for individuals, forever.",
      creator: "@TFisPython",
      images: ["/og/launch/wedge"],
    },
  };
}

export default async function Home() {
  const toc = getV2Toc();

  const v2ChaptersWithStepIds = await Promise.all(
    toc.chapters.map(async (entry) => {
      const detail = await getV2Chapter(entry.slug);
      const firstLessonSlug = detail?.lessons[0]?.slug ?? null;
      const hasOverview = !!detail?.overview && detail.overview.trim().length > 0;
      const stepIds = detail
        ? detail.lessons.flatMap((l) => l.steps.map((s) => s.id))
        : [];
      const lessonSummaries = detail
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
          // PR 2 — drives chapter-tile time budget and phase-band aggregate.
          estMinutes: entry.estMinutes,
          firstLessonSlug,
          hasOverview,
        },
        stepIds,
        lessons: lessonSummaries,
      };
    }),
  );
  const v2Chapters = v2ChaptersWithStepIds.map((c) => c.meta);
  const totalChapters = v2Chapters.length;
  const totalSteps = v2Chapters.reduce((a, c) => a + c.stepCount, 0);
  const stepIdsByChapter: Record<string, string[]> = Object.fromEntries(
    v2ChaptersWithStepIds.map((c) => [c.meta.slug, c.stepIds]),
  );
  // PR 4 — feeds the welcome-back resolver. Pure data, no chapter blob.
  const chapterSummaries = v2ChaptersWithStepIds.map((c) => ({
    slug: c.meta.slug,
    title: c.meta.title,
    number: c.meta.number,
    totalSteps: c.meta.stepCount,
    lessons: c.lessons,
  }));

  // Course schema describes the whole school. `Course.hasCourseInstance` is
  // the modern shape Google + AI engines actually consume; we mark it free
  // and self-paced with the per-build chapter count baked in. Per launch-week
  // SEO audit 2026-05-11.
  const courseSchema = {
    "@type": "Course",
    "@id": `${SITE_URL}/#course`,
    name: "promptdojo, python school for the ai era",
    description: `free, runnable python school for anyone whose job is being reshaped by ai. ${totalChapters} chapters, ${totalSteps} steps, runs in your browser via pyodide. free for individuals, forever.`,
    url: SITE_URL,
    provider: { "@id": `${SITE_URL}/#org` },
    inLanguage: "en",
    educationalLevel: "Beginner",
    learningResourceType: "Interactive Tutorial",
    isAccessibleForFree: true,
    teaches: [
      "reading ai-generated python",
      "catching ai-introduced bugs",
      "directing ai coding agents deliberately",
      "mutation, scope, and state in python",
      "calling llm apis from python",
    ],
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: `PT${Math.round(totalSteps * 3)}M`,
        inLanguage: "en",
        location: { "@type": "VirtualLocation", url: SITE_URL },
      },
    ],
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        category: "free",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
    ],
  };

  return (
    <main id="main" className="mx-auto max-w-6xl px-5 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-16">
      <JsonLd data={courseSchema} />
      <PyodidePreloader />

      <header className="relative mb-16 pt-2 sm:pt-6">
        <div className="mb-10 flex items-start justify-between gap-4">
          <Wordmark size="text-base sm:text-lg" className="lowercase tracking-tight" />
          <StreakWidget />
        </div>

        <h1 className="t-hero">
          everyone&apos;s a builder{" "}
          <em className="italic text-green-500">now.</em>
        </h1>

        <p className="t-body mt-12 max-w-2xl">
          your job just changed. learn to build with ai or fall behind.
        </p>
        <p className="t-body-sm mt-3 max-w-2xl text-ink-400">
          {totalChapters} chapters · {totalSteps} runnable steps · runs in
          your browser · free for individuals, forever.
        </p>

        <div className="mt-10">
          <HeroBugSnippet />
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/learn/v2/before-you-build/the-situation-named-honestly/0"
            className="dojo-btn-primary"
          >
            start learning free <span aria-hidden>→</span>
          </Link>
          <a
            href="https://x.com/intent/follow?screen_name=TFisPython"
            target="_blank"
            rel="noopener noreferrer"
            className="dojo-btn-secondary"
          >
            follow along on x <span aria-hidden>↗</span>
          </a>
        </div>
        <p className="mt-4 t-mono-meta">
          new to python?{" "}
          <Link
            href="/learn/v2/variables/naming-things/0"
            className="text-ink-300 underline decoration-ink-700 underline-offset-4 hover:text-green-400 hover:decoration-green-500"
          >
            start at chapter 1
          </Link>
          {" · or "}
          <a
            href="#chapters"
            className="text-ink-300 underline decoration-ink-700 underline-offset-4 hover:text-green-400 hover:decoration-green-500"
          >
            pick a chapter ↓
          </a>
        </p>
      </header>

      <HomeClient
        chapters={chapterSummaries}
        stepIdsByChapter={stepIdsByChapter}
      />

      <section className="mt-16">
        <div className="t-eyebrow mb-6">the three things you actually learn</div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              title: "read what ai wrote",
              body:
                "ai wrote most of your codebase. you can't read it. that's the new illiteracy.",
            },
            {
              title: "catch what it got wrong",
              body:
                "the bugs ai ships are not the bugs humans ship. you've never been trained on them.",
            },
            {
              title: "direct it deliberately",
              body:
                "if you don't understand mutation, you're a passenger in your own ide.",
            },
          ].map((card) => (
            <div key={card.title} className="dojo-card">
              <div className="t-h3">{card.title}</div>
              <p className="t-body-sm mt-2">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <StatStrip className="mt-24 mb-12" />

      <EmailSignup />

      <section>
        <h2 className="t-eyebrow mb-12">
          the {totalChapters}-chapter path from cursor-passenger to cursor-driver.
        </h2>
        <PhaseBandedRail
          chapters={v2Chapters}
          stepIdsByChapter={stepIdsByChapter}
        />
      </section>

      <footer className="mt-16 flex flex-wrap items-baseline justify-between gap-3 border-t border-ink-800 pt-6 t-mono-meta">
        {/* Lesson keyboard hint hidden on the home page — it has no
            "spot in the lesson" yet, so the kbd promise is unearned.
            UI audit 2026-05-07. The hint stays on lesson pages where
            it's contextual. */}
        <span className="text-ink-500">the free python school for the ai era</span>
        <div className="t-mono-meta flex flex-wrap items-baseline gap-x-3 sm:gap-x-2">
          {(() => {
            const lc = formatDateShort(githubStats.lastCommitISO);
            return lc ? <span>shipped {lc}</span> : null;
          })()}
          <span aria-hidden="true" className="text-ink-400">·</span>
          <Link href="/changelog" className="hover:text-green-400">
            changelog
          </Link>
          <span aria-hidden="true" className="text-ink-400">·</span>
          <a
            href="https://github.com/xernst/promptdojo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400"
          >
            github
          </a>
          <span aria-hidden="true" className="text-ink-400">·</span>
          <FooterSocials />
        </div>
      </footer>
    </main>
  );
}
