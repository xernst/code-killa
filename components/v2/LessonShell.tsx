"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import DailyGoalDial from "./DailyGoalDial";

type MobileGate = "passive-pass-through" | "active-upsell";

type Props = {
  /**
   * Left rail — chapter / lesson / step navigation. v2-specific sidebar
   * comes from A8; the shell just hosts it.
   */
  sidebar: ReactNode;
  /**
   * Centre column — step prompt rendered by StepRouter (A3).
   */
  prompt: ReactNode;
  /**
   * Right column — PersistentIDE instance owned by the parent so it can
   * persist across steps without unmounting.
   */
  ide: ReactNode;
  /**
   * Optional header strip rendered above the prompt panel (lesson title,
   * progress bar, daily-goal dial). Falls back to nothing.
   */
  header?: ReactNode;
  /**
   * Optional footer rendered under the prompt panel — Hint / Skip / Continue
   * buttons usually live here (StepFooter, C2).
   */
  footer?: ReactNode;
  /**
   * Mobile gate behavior. Passive step types (read/mc/predict/fill/reorder)
   * render the full lesson UI on phone — no IDE column, but the prompt is
   * fully interactive. Active step types (write/checkpoint/fix) need the
   * editor and render an upsell card instead. Defaults to active-upsell to
   * preserve the historical behavior for any caller that forgets the prop.
   * Per phase 2 of plans/gleaming-orbiting-knuth.md.
   */
  mobileGate?: MobileGate;
};

// Mobile-gate copy lives here so the V3 toggle pattern is fully removed.
// Per design-kit/audit-v4/HEADOFIT-plan.md PR 3 + CEO §3.

export default function LessonShell({
  sidebar,
  prompt,
  ide,
  header,
  footer,
  mobileGate = "active-upsell",
}: Props) {
  return (
    <div className="flex h-[calc(100dvh-40px)] min-h-0 flex-col bg-ink-950 text-ink-100">
      <div className="flex h-full min-h-0 flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-ink-800 bg-ink-900 md:flex md:flex-col lg:w-60">
          {sidebar}
        </aside>
        {/* Single <main id="main"> — the skip-link target. Houses both the
            desktop two-column layout (md+) and the mobile gate (< md). */}
        <main id="main" className="flex min-h-0 w-full flex-1 flex-col">
          {/* Desktop / tablet layout — two-column grid, unchanged from V3. */}
          <div className="hidden min-h-0 w-full flex-1 md:grid md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
            <section className="flex min-h-0 min-w-0 flex-col border-r border-ink-800 md:max-w-[460px] lg:max-w-[520px]">
              {header && (
                <div className="flex items-start justify-between gap-3 border-b border-ink-800 bg-ink-900 px-5 py-3">
                  <div className="min-w-0 flex-1">{header}</div>
                  <DailyGoalDial compact className="shrink-0 pt-0.5" />
                </div>
              )}
              <div className="flex-1 min-h-0 overflow-auto px-4 py-5 sm:px-5 sm:py-6">
                {prompt}
              </div>
              {footer && (
                <div className="border-t border-ink-800 bg-ink-900 px-4 py-3 sm:px-5">
                  {footer}
                </div>
              )}
            </section>
            <section className="flex min-h-0 min-w-0 flex-1 flex-col">
              {ide}
            </section>
          </div>
          {/* Mobile gate (< md). Step-type-aware per phase 2 of
              plans/gleaming-orbiting-knuth.md (audit 2026-05-11).
              - Passive steps (read/mc/predict/fill/reorder): render the
                full lesson UI on phone. Header → prompt → footer, just
                like desktop minus the IDE column.
              - Active steps (write/checkpoint/fix): render the upsell
                card. These types REQUIRE the editor; the card preserves
                the save-my-spot growth funnel + X-follow CTA. */}
          {mobileGate === "passive-pass-through" ? (
            <div className="flex min-h-0 w-full flex-1 flex-col md:hidden">
              {header && (
                <div className="border-b border-ink-800 bg-ink-900 px-4 py-3">
                  {header}
                </div>
              )}
              <div className="flex-1 min-h-0 overflow-auto px-4 py-5">
                {prompt}
              </div>
              {footer && (
                <div className="border-t border-ink-800 bg-ink-900 px-4 py-3">
                  {footer}
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-0 w-full flex-1 flex-col md:hidden">
              <div className="flex-1 min-h-0 overflow-auto px-4 py-5">
                {prompt}
              </div>
              <div className="border-t border-ink-800 bg-ink-900 p-5">
                <h2 className="t-eyebrow mb-2">
                  this step needs the editor
                </h2>
                <p className="t-body-sm">
                  on desktop today; in the app (coming soon). save your
                  spot and we&apos;ll bring you back here when you&apos;re
                  ready.
                </p>
                <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/lesson/resume"
                    className="dojo-btn-primary inline-flex justify-center"
                  >
                    save my spot <span aria-hidden>→</span>
                  </Link>
                  <a
                    href="https://x.com/intent/follow?screen_name=TFisPython"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dojo-btn-secondary inline-flex justify-center"
                  >
                    follow on x for the app launch{" "}
                    <span aria-hidden>↗</span>
                  </a>
                </div>
                <p className="mt-3 t-mono-meta">
                  open this same url on a laptop to keep going today.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
