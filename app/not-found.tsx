// Branded 404. Server component; the global header and footer come from
// the root layout. Per audit-v3/09-accessibility.md PR 1 + WCAG §3.3.5.
//
// Three recovery cards + StatStrip. No emojis, no exclamations.

import type { Metadata } from "next";
import Link from "next/link";
import StatStrip from "@/components/StatStrip";
import DidYouMean from "@/components/DidYouMean";
import { getV2Toc } from "@/lib/content-v2";

// Dynamic counts via getV2Toc — same source as home + about + curriculum.
// Per UI audit 2026-05-07.
export async function generateMetadata(): Promise<Metadata> {
  const toc = getV2Toc();
  const chapters = toc.chapters.length;
  const steps = toc.chapters.reduce((a, c) => a + c.stepCount, 0);
  return {
    title: "page not found · promptdojo",
    description: `this lesson does not exist (yet). ${chapters} chapters, ${steps} runnable steps, but not this one.`,
    robots: { index: false },
  };
}

export default function NotFound() {
  const toc = getV2Toc();
  const chapters = toc.chapters.length;
  const steps = toc.chapters.reduce((a, c) => a + c.stepCount, 0);
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 pt-20 pb-10 sm:pt-24 sm:pb-16">
      <div className="t-eyebrow">404 ─ page not found</div>
      <h1 className="t-section mt-4">this lesson does not exist (yet).</h1>
      <p className="t-body mt-6">
        the curriculum has {chapters} chapters and {steps} runnable steps, but not this one.
      </p>
      <DidYouMean />
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Link href="/" className="dojo-card-interactive">
          <div className="t-eyebrow">go</div>
          <div className="mt-2 text-ink-100">← home</div>
        </Link>
        <Link href="/about" className="dojo-card-interactive">
          <div className="t-eyebrow">read</div>
          <div className="mt-2 text-ink-100">about →</div>
        </Link>
        <Link
          href="/learn/v2/variables/naming-things/0"
          className="dojo-card-interactive"
        >
          <div className="t-eyebrow">start</div>
          <div className="mt-2 text-ink-100">↵ chapter 1</div>
        </Link>
      </div>
      <StatStrip className="mt-12" />
    </main>
  );
}
