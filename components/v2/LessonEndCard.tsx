"use client";

// Renders at the very last step of a LESSON (not chapter), after the
// user has passed. Game Designer audit-v6: the macro-loop terminated
// silently — user finishes 8 steps and the breadcrumb just ticks.
// Every comparable learning game has a session-loop resolution surface.
//
// Compounding share density vs. ChapterEndCard: ~150 lesson-ends in
// the curriculum vs. 26 chapter-ends — 5.7× more "moments of triumph"
// to plant a tweet CTA on the V1→V2 follower gate.

import Link from "next/link";
import { Share2 } from "lucide-react";

interface LessonEndCardProps {
  chapterTitle: string;
  chapterSlug: string;
  lessonTitle: string;
  lessonSlug: string;
  stepCount: number;
  nextLessonTitle: string;
  nextLessonHref: string;
}

function siteOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://promptdojo.pages.dev";
}

function buildLessonTweet({
  lessonTitle,
  chapterTitle,
  url,
}: {
  lessonTitle: string;
  chapterTitle: string;
  url: string;
}): string {
  const intro = `just finished "${lessonTitle.toLowerCase()}" — ${chapterTitle.toLowerCase()}.`;
  const tail = `\n\nfree python school for people whose code is mostly written by ai now.\n\n${url} via @TFisPython`;
  const remaining = 280 - tail.length;
  const finalIntro =
    intro.length > remaining ? intro.slice(0, remaining - 1) + "…" : intro;
  return finalIntro + tail;
}

export default function LessonEndCard({
  chapterTitle,
  chapterSlug,
  lessonTitle,
  lessonSlug,
  stepCount,
  nextLessonTitle,
  nextLessonHref,
}: LessonEndCardProps) {
  const url = `${siteOrigin()}/learn/v2/${chapterSlug}/${lessonSlug}/0`;
  const tweetText = buildLessonTweet({ lessonTitle, chapterTitle, url });
  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <section className="my-8 flex flex-col items-start gap-4 border border-green-500/40 bg-ink-900 p-6">
      <div className="t-eyebrow text-green-500">lesson complete.</div>
      <h2 className="t-h2 max-w-2xl">
        you locked in{" "}
        <em className="t-emph">{lessonTitle.toLowerCase()}</em>{" "}
        in {stepCount} {stepCount === 1 ? "step" : "steps"}.
      </h2>
      <p className="t-body-sm max-w-2xl text-ink-400">
        next up:{" "}
        <span className="text-ink-200">{nextLessonTitle.toLowerCase()}</span>.
        keep the momentum.
      </p>
      <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link href={nextLessonHref} className="dojo-btn-primary">
          next lesson <span aria-hidden>→</span>
        </Link>
        <a
          href={tweetHref}
          target="_blank"
          rel="noopener noreferrer"
          className="dojo-btn-secondary inline-flex items-center gap-2"
        >
          <Share2 size={14} aria-hidden />
          tweet this lesson
        </a>
      </div>
    </section>
  );
}
