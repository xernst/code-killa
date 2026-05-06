// Non-lesson chrome — floating glass pill, smoked-dark, sharp 0px corners
// (kit canon overrides Cartesian's 50px radius). Replaces the full-width
// sticky bar on /, /about, /curriculum, /changelog, /not-found.
//
// Per design-kit/audit-v4/HEADOFIT-plan.md PR 7. Founder rule: /about and
// /changelog STAY as routes — those nav links route normally; only
// course-section anchors scroll-on-home.

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import FollowOnXPill from "@/components/FollowOnXPill";
import LoginToSave from "@/components/LoginToSave";
import GitHubStatsPill from "@/components/GitHubStatsPill";
import ContinuePill from "@/components/SiteHeader/ContinuePill";
import HeaderDrawer from "@/components/SiteHeader/Drawer";

export default function FloatingNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header
        className="fixed left-1/2 top-3 z-40 -translate-x-1/2 border border-ink-800 bg-ink-950/60 backdrop-blur-md"
      >
        <div className="flex h-11 items-center gap-3 px-3 sm:px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-400 transition hover:text-green-400"
          >
            <span className="text-green-500">❯</span>
            <span>promptdojo</span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="site"
            className="hidden items-center gap-3 border-l border-ink-800 pl-3 md:flex"
          >
            <Link
              href="/curriculum"
              className="font-mono text-[11px] uppercase tracking-wider text-ink-400 hover:text-green-400"
            >
              the curriculum
            </Link>
            <Link
              href="/about"
              className="font-mono text-[11px] uppercase tracking-wider text-ink-400 hover:text-green-400"
            >
              about
            </Link>
            <Link
              href="/changelog"
              className="font-mono text-[11px] uppercase tracking-wider text-ink-400 hover:text-green-400"
            >
              changelog
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ContinuePill />
            {/* Desktop pills */}
            <div className="hidden items-center gap-2 md:flex">
              <GitHubStatsPill />
              <LoginToSave />
              <FollowOnXPill />
            </div>
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center justify-center p-1.5 text-ink-400 hover:text-green-400 md:hidden"
              aria-label="open menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>
      <HeaderDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
