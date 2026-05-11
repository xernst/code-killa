// deep-link.ts — Capacitor universal-link handler for promptdojo mobile.
// Bridges iOS Universal Links + Android App Links into the WKWebView/Chromium
// shell so magic-link emails (/auth/verify?token=...) and lesson-resume URLs
// (/lesson/resume?...) launch the app instead of bouncing to Safari/Chrome.
// Without this bridge, paid users tap "sign in" in Mail and lose the session.

import { App, type URLOpenListenerEvent } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";

/**
 * Shape of the `@capacitor/app` surface we touch. Narrowed so we can detect
 * a missing/stubbed plugin (e.g., during Next.js static export) and bail
 * without throwing.
 */
type AppLike = {
  addListener: (
    eventName: "appUrlOpen",
    listenerFunc: (event: URLOpenListenerEvent) => void,
  ) => Promise<PluginListenerHandle> | PluginListenerHandle;
};

/**
 * Route a parsed deep-link URL into the in-WebView SPA. We delegate to the
 * existing Cloudflare Pages Function at /api/auth/verify (which sets the
 * session cookie and 302s back to the lesson) by hitting the same-origin
 * path inside the WebView. The token query-param name is `token` — verified
 * against functions/api/auth/verify.ts:42.
 */
function routeDeepLink(rawUrl: string): void {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    // Malformed URL from the OS — silently drop. A thrown error here would
    // crash the app on launch when the OS hands us garbage.
    return;
  }

  const { pathname, searchParams } = parsed;

  if (pathname.startsWith("/auth/verify")) {
    const token = searchParams.get("token");
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      const next = searchParams.get("next");
      const qs = next
        ? `?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`
        : `?token=${encodeURIComponent(token)}`;
      window.location.assign(`/auth/verify${qs}`);
    }
    return;
  }

  if (pathname.startsWith("/lesson/resume")) {
    // Preserve the full query string so /lesson/resume can read whichever
    // params it expects (lesson id, step index, etc.) without us re-parsing.
    const search = parsed.search || "";
    window.location.assign(`/lesson/resume${search}`);
    return;
  }
}

/**
 * Type guard that confirms the imported `App` module exposes the methods
 * we need. Capacitor plugins resolve to a no-op shim when the runtime is a
 * plain browser (next dev / next export preview), so `addListener` may be
 * absent or non-functional.
 */
function isAppPluginAvailable(candidate: unknown): candidate is AppLike {
  if (typeof candidate !== "object" || candidate === null) return false;
  const maybe = candidate as { addListener?: unknown };
  return typeof maybe.addListener === "function";
}

/**
 * Detect whether we are running inside a Capacitor native shell. We avoid
 * a hard dependency on `@capacitor/core` here — checking the global window
 * shape is sufficient and keeps this file safe to evaluate in the web build.
 */
function isCapacitorRuntime(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean };
  };
  return typeof w.Capacitor?.isNativePlatform === "function"
    ? w.Capacitor.isNativePlatform()
    : false;
}

/**
 * Wire up the Capacitor `appUrlOpen` listener. Returns a cleanup function
 * suitable for a React `useEffect` return. The cleanup is a no-op when we
 * never attached (web build, missing plugin, SSR).
 */
export function initDeepLinks(): () => void {
  // SSR / static export: do nothing. The Next.js build evaluates this module
  // during `next build`, where `window` is undefined.
  if (typeof window === "undefined") {
    return () => {};
  }

  // Web build running in a real browser (the marketing funnel). No native
  // deep-link surface here — universal links are an OS-level concern.
  if (!isCapacitorRuntime()) {
    return () => {};
  }

  if (!isAppPluginAvailable(App)) {
    return () => {};
  }

  let handle: PluginListenerHandle | null = null;
  let cancelled = false;

  const addResult = App.addListener("appUrlOpen", (event) => {
    routeDeepLink(event.url);
  });

  // `addListener` is async in newer Capacitor versions; older versions
  // return the handle synchronously. Handle both shapes without `any`.
  if (addResult instanceof Promise) {
    addResult
      .then((h) => {
        if (cancelled) {
          void h.remove();
          return;
        }
        handle = h;
      })
      .catch(() => {
        // Listener registration failed — nothing to clean up.
      });
  } else {
    handle = addResult;
  }

  return () => {
    cancelled = true;
    if (handle) {
      void handle.remove();
      handle = null;
    }
  };
}
