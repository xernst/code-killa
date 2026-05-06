import type { Metadata } from "next";
import Link from "next/link";
import { getChapters } from "@/lib/content";
import { getV2Toc, getV2Chapter } from "@/lib/content-v2";
import HomeClient from "@/components/v2/HomeClient";
import StreakWidget from "@/components/StreakWidget";
import PyodidePreloader from "@/components/PyodidePreloader";
import Wordmark from "@/components/Wordmark";
import HeroBugSnippet from "@/components/HeroBugSnippet";

export const metadata: Metadata = {
  metadataBase: new URL("https://promptdojo.pages.dev"),
  title: "promptdojo — free interactive python course for ai builders",
  description:
    "free, open-source python course for pms, marketers, and ops folks who use cursor and claude code daily. 25 chapters, 624 interactive steps, runs in your browser. no signup, no paywall.",
  alternates: { canonical: "https://promptdojo.dev/" },
  openGraph: {
    type: "website",
    title: "promptdojo — free interactive python course for ai builders",
    description:
      "ai writes this. it's wrong. learn the python you need to read what ai wrote, catch what it got wrong, and direct it deliberately. 22 chapters, free forever.",
    url: "https://promptdojo.dev/",
    siteName: "promptdojo",
    images: [{ url: "/og/launch/wedge", width: 1600, height: 900, alt: "ai writes this. it's wrong." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "promptdojo — ai writes this. it's wrong.",
    description:
      "the python you need to direct ai agents, read what they wrote, and catch what they got wrong.",
    creator: "@TFisPython",
    images: ["/og/launch/wedge"],
  },
};

export default async function Home() {
  const toc = getV2Toc();

  const v2Chapters = await Promise.all(
    toc.chapters.map(async (entry) => {
      const detail = await getV2Chapter(entry.slug);
      const firstLessonSlug = detail?.lessons[0]?.slug ?? null;
      const hasOverview = !!detail?.overview && detail.overview.trim().length > 0;
      return {
        slug: entry.slug,
        title: entry.title,
        number: entry.number,
        blurb: entry.blurb,
        lessonCount: entry.lessonCount,
        stepCount: entry.stepCount,
        firstLessonSlug,
        hasOverview,
      };
    }),
  );

  const fallback = {
    chapterSlug: "variables",
    lessonSlug: "naming-things",
    stepIndex: 0,
  };

  const legacyChapters = getChapters();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <PyodidePreloader />

      <header className="relative mb-24 pt-8 sm:pt-14">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div className="text-[11px] uppercase tracking-[0.42em]">
            <Wordmark size="text-[11px]" />
          </div>
          <StreakWidget />
        </div>

        <h1
          className="font-display font-black leading-[0.9] tracking-[-0.045em] text-ink-100"
          style={{
            fontSize: "clamp(72px, 11vw, 128px)",
            fontVariationSettings: "'opsz' 144, 'SOFT' 0",
          }}
        >
          ai writes this.<br />
          <em className="italic text-ember-500">it&apos;s wrong.</em>
        </h1>

        <p className="mt-8 max-w-2xl font-display text-xl leading-snug text-ink-300">
          a python school for the version of you that lives in cursor.
          25 chapters · 624 interactive steps · runs in your browser · free forever.
        </p>

        <div className="mt-10">
          <HeroBugSnippet />
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/learn/v2/variables/naming-things/0"
            className="inline-flex items-center gap-2 bg-ember-500 px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-ink-950 transition hover:bg-ember-400"
          >
            start chapter 1 <span aria-hidden>→</span>
          </Link>
          <a
            href="#chapters"
            className="font-mono text-sm text-ink-400 hover:text-ember-400"
          >
            or pick your chapter ↓
          </a>
        </div>
      </header>

      <HomeClient
        fallback={fallback}
        chapters={v2Chapters.map((c) => ({
          slug: c.slug,
          title: c.title,
          number: c.number,
        }))}
      />

      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            title: "read what ai wrote",
            body:
              "most lessons start with code cursor or claude already produced. you learn to read it, predict its output, and judge whether it works.",
          },
          {
            title: "catch what it got wrong",
            body:
              "hallucinated apis, silent type bugs, off-by-one errors, broken imports. the bugs ai ships are different from the bugs humans ship. we drill those.",
          },
          {
            title: "direct it deliberately",
            body:
              "when you understand mutation, scope, and control flow, you can prompt the ai like a tech lead instead of a passenger.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-ink-800 bg-ink-950 p-5"
          >
            <div className="font-display text-lg font-semibold text-ink-50">
              {card.title}
            </div>
            <p className="mt-2 text-sm text-ink-400">{card.body}</p>
          </div>
        ))}
      </section>

      <section id="chapters" className="mt-16 scroll-mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xs uppercase tracking-widest text-ink-400">
            25 chapters · production-ai track included · free forever
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {v2Chapters.map((c) => {
            // Link to the chapter overview if the chapter has a body to show;
            // otherwise jump straight to lesson 1 (legacy fallback for
            // chapters authored before overview.md existed).
            const href = c.firstLessonSlug
              ? c.hasOverview
                ? `/learn/v2/${c.slug}`
                : `/learn/v2/${c.slug}/${c.firstLessonSlug}/0`
              : null;
            const titleClean = c.title.replace(/\s*—.*$/, "");
            const cardBody = (
              <>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-600">
                  ch {String(c.number).padStart(2, "0")}
                </div>
                <div className="mt-1 text-sm font-medium text-ink-100 group-hover:text-ember-300">
                  {titleClean.toLowerCase()}
                </div>
                <p className="mt-2 line-clamp-3 text-xs text-ink-500">
                  {c.blurb}
                </p>
                <div className="mt-3 font-mono text-[10px] text-ink-600">
                  {c.stepCount} steps · {c.lessonCount}{" "}
                  {c.lessonCount === 1 ? "lesson" : "lessons"}
                </div>
              </>
            );
            return href ? (
              <Link
                key={c.slug}
                href={href}
                className="group flex flex-col rounded-lg border border-ink-800 bg-ink-950 p-4 transition hover:border-ember-700/60 hover:bg-ink-900"
              >
                {cardBody}
              </Link>
            ) : (
              <div
                key={c.slug}
                className="flex flex-col rounded-lg border border-ink-800 bg-ink-950 p-4 opacity-60"
              >
                {cardBody}
              </div>
            );
          })}
        </div>
      </section>

      <details className="group mt-12 rounded-lg border border-ink-800 bg-ink-950">
        <summary className="cursor-pointer list-none px-4 py-3 text-xs uppercase tracking-widest text-ink-500 hover:text-ink-300">
          <span className="mr-2 inline-block transition group-open:rotate-90">
            ▸
          </span>
          legacy 28-chapter course (old style)
        </summary>
        <div className="grid grid-cols-1 gap-2 border-t border-ink-800 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {legacyChapters.map((c) => (
            <Link
              key={c.slug}
              href={`/learn/${c.slug}`}
              className="group flex items-center justify-between rounded-lg border border-ink-800 bg-ink-950 p-3 transition hover:border-ink-700 hover:bg-ink-900"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-600">
                  ch {String(c.number).padStart(2, "0")}
                </div>
                <div className="mt-0.5 text-sm font-medium text-ink-200 group-hover:text-ember-300">
                  {c.title.replace(/^Chapter\s+\d+\s*[—\-]\s*/, "").toLowerCase()}
                </div>
              </div>
              <div className="text-xs text-ink-600">{c.exercises.length} ex</div>
            </Link>
          ))}
        </div>
      </details>

      <footer className="mt-16 border-t border-ink-800 pt-6 text-xs text-ink-600">
        <p>
          Press{" "}
          <kbd className="rounded border border-ink-700 bg-ink-900 px-1 py-0.5 font-mono text-[10px] text-ink-300">
            ⌘⇧B
          </kbd>{" "}
          from anywhere to park a thought without losing your place.
        </p>
      </footer>
    </main>
  );
}
