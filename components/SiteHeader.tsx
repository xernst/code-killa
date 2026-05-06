// Site-wide header strip. Sticky on scroll with bottom border; hides on
// /onboarding for the focused 5-step flow. Wraps the existing pill
// components in a single nav landmark.
//
// Per design-kit/audit-v3/04-navigation-system.md PR 5.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import FollowOnXPill from "@/components/FollowOnXPill";
import LoginToSave from "@/components/LoginToSave";
import GitHubStatsPill from "@/components/GitHubStatsPill";
import CourseProgress from "@/components/v2/CourseProgress";
import ContinuePill from "@/components/SiteHeader/ContinuePill";

export default function SiteHeader() {
  const pathname = usePathname();
  const onLesson = pathname?.startsWith("/learn/v2") ?? false;
  const onOnboarding = pathname?.startsWith("/onboarding") ?? false;

  // Focused flow — header dimmed to nothing during onboarding.
  if (onOnboarding) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/95 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-400 transition hover:text-green-400"
        >
          <span className="text-green-500">❯</span>
          <span>promptdojo</span>
        </Link>
        <ContinuePill />
        <nav
          aria-label="site"
          className="flex flex-wrap items-center gap-2"
        >
          <GitHubStatsPill />
          {onLesson && <CourseProgress />}
          <LoginToSave />
          <FollowOnXPill />
        </nav>
      </div>
    </header>
  );
}
