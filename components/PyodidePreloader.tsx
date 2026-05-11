"use client";

// Boot Pyodide BEFORE the user reaches a lesson, but only when they show
// REAL intent. Per launch-week perf audit (2026-05-11), the homepage
// Pyodide warmup was firing inside Lighthouse runs, blowing TBT to 4060ms
// and tanking the homepage perf score to 56. Tightened thresholds:
//   1. mouseover on any link to /learn/v2/* (hover = "I'm about to click")
//   2. touchstart on any link to /learn/v2/* (mobile equivalent)
//   3. scrolling past 90% of the viewport (was 60% — too aggressive)
//   4. fallback: 25s after mount (was 8s — homepage bouncers leave before)
//
// Additional gates: skip warmup when Data Saver is on or the connection
// is 2g/slow-2g. Pyodide is 12 MB; respecting saveData is table stakes.
//
// The worker is a singleton in lib/use-pyodide.ts so repeat preloads are
// no-ops. The point: visitors who read the home page and bounce don't
// pay the 12 MB Pyodide tax. Visitors who actually engage still get warm
// Pyodide before their first lesson IDE mounts.

import { useEffect } from "react";
import { warmPyodide } from "@/lib/use-pyodide";

declare global {
  interface Window {
    __ck_pyodide_warm?: boolean;
  }
}

// Network Information API typing — not in lib.dom.d.ts yet.
type NetworkInformation = {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  saveData?: boolean;
};

function shouldSkipWarmup(): boolean {
  const conn = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;
  if (!conn) return false;
  if (conn.saveData === true) return true;
  if (conn.effectiveType === "slow-2g" || conn.effectiveType === "2g") return true;
  return false;
}

export default function PyodidePreloader() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__ck_pyodide_warm) return;
    if (shouldSkipWarmup()) return;

    const startWarmup = () => {
      if (window.__ck_pyodide_warm) return;
      window.__ck_pyodide_warm = true;
      try {
        warmPyodide();
      } catch {
        // Worker blocked — lesson page falls back to its own boot path.
      }
    };

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

    // Intent signal 3: user scrolled past 90% of first viewport (was 60%).
    // 60% triggered while readers were still in the hero — too soon.
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.9) {
        cleanup();
        fire();
      }
    };

    // Fallback: 25s after mount (was 8s). Bouncers leave inside 15s;
    // the rare reader who stays past 25s without scrolling or hovering
    // still gets warm Pyodide.
    const fallbackTimer = window.setTimeout(() => {
      cleanup();
      fire();
    }, 25000);

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
