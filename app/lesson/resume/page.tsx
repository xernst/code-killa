// One-keypress resume route. Reads lastVisitedV2 on mount and replaces
// to the deep step URL. Static-export compatible — pure client redirect.
//
// Resolution order:
//   1. lastVisitedV2 → deep step URL
//   2. has profile → /curriculum
//   3. fresh user → /onboarding
//
// Per design-kit/audit-v3/04-navigation-system.md PR 5.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getLastVisitedV2, loadProgressV2 } from "@/lib/storage";

export default function Resume() {
  const router = useRouter();

  useEffect(() => {
    const last = getLastVisitedV2();
    if (last) {
      router.replace(
        `/learn/v2/${last.chapterSlug}/${last.lessonSlug}/${last.stepIndex}`,
      );
      return;
    }
    const profile = loadProgressV2().profile;
    const hasProfile = profile && Object.keys(profile).length > 0;
    router.replace(hasProfile ? "/curriculum" : "/onboarding");
  }, [router]);

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <div className="t-eyebrow">resuming…</div>
    </main>
  );
}
