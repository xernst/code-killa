// Server component — renders /curriculum as a textbook-index accordion.
// Phase 1 default-open per CEO §8. Hairline rules between rows, no card
// chrome.
//
// Per design-kit/audit-v4/HEADOFIT-plan.md PR 8 + audit-v4/02-ui-design
// Pattern #6.

import { PHASES } from "@/lib/curriculum/phases";

type LessonSummary = { slug: string; title: string; stepCount: number };

export type AccordionChapter = {
  slug: string;
  title: string;
  number: number;
  blurb: string;
  stepCount: number;
  estMinutes: number;
  firstLessonSlug: string | null;
  hasOverview: boolean;
  lessons: LessonSummary[];
};

type Props = {
  chapters: AccordionChapter[];
  className?: string;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatMinutes(m: number): string {
  if (!Number.isFinite(m) || m <= 0) return "0m";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
}

function titleClean(t: string): string {
  return t.replace(/\s*—.*$/, "").toLowerCase();
}

export default function CurriculumAccordion({ chapters, className }: Props) {
  const bySlug = new Map(chapters.map((c) => [c.slug, c]));
  const wrapClass = `divide-y divide-ink-800 border-y border-ink-800${
    className ? ` ${className}` : ""
  }`;
  return (
    <article className={wrapClass}>
      {PHASES.map((phase) => {
        const phaseChapters = phase.chapterSlugs
          .map((s) => bySlug.get(s))
          .filter((c): c is AccordionChapter => !!c);
        const phaseMinutes = phaseChapters.reduce(
          (acc, c) => acc + c.estMinutes,
          0,
        );
        return (
          <details
            key={phase.number}
            className="group"
            open={phase.number === 1}
          >
            <summary className="flex cursor-pointer list-none items-baseline gap-4 py-6">
              <span className="font-mono text-2xl text-green-500 transition group-open:rotate-90">
                ❯
              </span>
              <div className="flex-1">
                <div className="t-eyebrow">phase {pad(phase.number)}</div>
                <h2 className="t-section mt-1">{phase.name}</h2>
                <p className="t-body-sm mt-2 max-w-2xl">{phase.blurb}</p>
              </div>
              <div className="t-mono-meta self-center text-right">
                {phase.range}
                <br />~{formatMinutes(phaseMinutes)}
              </div>
            </summary>
            <div className="divide-y divide-ink-800 border-t border-ink-800">
              {phaseChapters.map((c) => {
                const href = c.firstLessonSlug
                  ? c.hasOverview
                    ? `/learn/v2/${c.slug}`
                    : `/learn/v2/${c.slug}/${c.firstLessonSlug}/0`
                  : null;
                return (
                  <details key={c.slug} className="group/c py-4 pl-9">
                    <summary className="flex cursor-pointer list-none items-baseline gap-3">
                      <span className="font-mono text-ink-500 transition group-open/c:rotate-90">
                        +
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-ink-500">
                        ch {pad(c.number)}
                      </span>
                      <span className="t-h3">{titleClean(c.title)}</span>
                      <span className="ml-auto t-mono-meta">
                        {c.stepCount} steps · ~{formatMinutes(c.estMinutes)}
                      </span>
                    </summary>
                    <div className="mt-3 pl-9">
                      <p className="t-body-sm">{c.blurb}</p>
                      {c.lessons.length > 0 && (
                        <ol className="mt-3 space-y-1 font-mono text-[11px] text-ink-400">
                          {c.lessons.map((l, i) => (
                            <li
                              key={l.slug}
                              className="flex items-baseline gap-2"
                            >
                              <span className="text-ink-600 tabular-nums">
                                {pad(i + 1)}
                              </span>
                              <span>·</span>
                              <span>{l.title.toLowerCase()}</span>
                              <span className="ml-auto text-ink-600">
                                {l.stepCount}
                              </span>
                            </li>
                          ))}
                        </ol>
                      )}
                      {href && (
                        <a
                          href={href}
                          className="dojo-btn-tertiary mt-4 inline-flex"
                        >
                          open chapter <span aria-hidden>→</span>
                        </a>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </details>
        );
      })}
    </article>
  );
}
