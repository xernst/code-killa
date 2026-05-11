"use client";

// Boot Pyodide BEFORE the user reaches a lesson, but only when they show
// real intent — not on every landing-page view. Triggers the 12 MB WASM
// download on:
//   1. mouseover on any link to /learn/v2/* (hover = "I'm about to click")
//   2. touchstart on any link to /learn/v2/* (mobile equivalent)
//   3. scrolling past 60% of the viewport (commit-to-content signal)
//   4. fallback: 8s after mount (long-tail; previously this fired in 1.5s)
//
// The worker is a singleton in lib/use-pyodide.ts so repeat preloads are
// no-ops. The point of this change: visitors who read the home page and
// bounce don't pay the 12 MB Pyodide tax. Visitors who actually engage
// (hover Start, scroll, or stay) still get warm Pyodide before their
// first lesson IDE mounts.

import { useEffect } from "react";
import { warmPyodide } from "@/lib/use-pyodide";

declare global {
  interface Window {
    __ck_pyodide_warm?: boolean;
  }
}

export default function PyodidePreloader() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__ck_pyodide_warm) return;

    const startWarmup = () => {
      if (window.__ck_pyodide_warm) return;
      window.__ck_pyodide_warm = true;
      try {
        // Critical: warmPyodide() targets the SAME singleton the lesson
        // runtime will reuse. Spawning a fresh Worker here would download
        // Pyodide twice — once into a preload worker that gets GC'd, then
        // again when the lesson route boots cold. (Bug caught by the
        // 2026-05-11 frontend audit.)
        warmPyodide();
      } catch {
        // Worker blocked — lesson page falls back to its own boot path.
      }
    };

    // Wrap in requestIdleCallback so the warmup never competes with
    // first paint or the user's first click.
    const fire = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(startWarmup, { timeout: 1500 });
      } else {
        setTimeout(startWarmup, 200);
      }
    };

    // Intent signal 1+2: hover/touch on any "go learn" link.
    const onIntent = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[href*='/learn/v2']");
      if (!link) return;
      cleanup();
      fire();
    };

    // Intent signal 3: user scrolled past 60% of first viewport.
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        cleanup();
        fire();
      }
    };

    // Fallback: 8s after mount, fire anyway. Long enough that bouncers
    // have already left; short enough that a thoughtful reader still
    // gets warm Pyodide if they decide to dive in.
    const fallbackTimer = window.setTimeout(() => {
      cleanup();
      fire();
    }, 8000);

    const cleanup = () => {
      document.removeEventListener("mouseover", onIntent, { capture: true });
      document.removeEventListener("touchstart", onIntent, { capture: true });
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(fallbackTimer);
    };

    document.addEventListener("mouseover", onIntent, { capture: true, passive: true });
    document.addEventListener("touchstart", onIntent, { capture: true, passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return cleanup;
  }, []);

  return null;
}
