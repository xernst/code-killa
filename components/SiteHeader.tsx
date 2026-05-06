// Site-wide header strip. Sticky on scroll with bottom border; hides on
// /onboarding for the focused 5-step flow. Single-row at all viewports —
// mobile collapses to [wordmark · ContinuePill · ≡] with the rest of the
// nav routed through HeaderDrawer.
//
// Per design-kit/audit-v4/HEADOFIT-plan.md PR 2.

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import FollowOnXPill from "@/components/FollowOnXPill";
import LoginToSave from "@/components/LoginToSave";
import GitHubStatsPill from "@/components/GitHubStatsPill";
import CourseProgress from "@/components/v2/CourseProgress";
import ContinuePill from "@/components/SiteHeader/ContinuePill";
import HeaderDrawer from "@/components/SiteHeader/Drawer";

export default function SiteHeader() {
  const pathname = usePathname();
  const onLesson = pathname?.startsWith("/learn/v2") ?? false;
  const onOnboarding = pathname?.startsWith("/onboarding") ?? false;
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Focused flow — header dimmed to nothing during onboarding.
  if (onOnboarding) return null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-400 transition hover:text-green-400"
          >
            <span className="text-green-500">❯</span>
            <span>promptdojo</span>
          </Link>
          <ContinuePill />
          {/* Desktop nav (>= md) */}
          <nav
            aria-label="site"
            className="hidden items-center gap-2 md:flex"
          >
            <GitHubStatsPill />
            {onLesson && <CourseProgress />}
            <LoginToSave />
            <FollowOnXPill />
          </nav>
          {/* Mobile hamburger (< md) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center justify-center p-2 text-ink-400 hover:text-green-400 md:hidden"
            aria-label="open menu"
            aria-expanded={drawerOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>
      <HeaderDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
