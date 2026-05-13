// POST /api/subscribe — Cloudflare Pages Function.
// Forwards email subscription to Beehiiv's Public API v2 server-side
// so the BEEHIIV_API_KEY never ships to the client.
//
// Env vars (set via wrangler / Cloudflare Pages dashboard):
//   BEEHIIV_API_KEY        — from beehiiv.com → Settings → API
//   BEEHIIV_PUBLICATION_ID — from beehiiv.com → Settings → Publication
//   AUTH_KV (binding)      — shared rate-limit store; if missing, the
//                            limiter is skipped (subscribe still works,
//                            relying on Cloudflare WAF + Beehiiv's own
//                            upstream limits as the only defense)

import { ipFrom, isRateLimitedKV, tooManyRequests } from "./_lib/rate-limit";

type AuthKV = {
  get: (key: string) => Promise<string | null>;
  put: (
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ) => Promise<void>;
};

type Env = {
  BEEHIIV_API_KEY?: string;
  BEEHIIV_PUBLICATION_ID?: string;
  AUTH_KV?: AuthKV;
};
type Ctx = { request: Request; env: Env };

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIMEOUT_MS = 8_000;
const MAX_EMAIL_LEN = 254; // RFC 5321 envelope local + domain

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  const ip = ipFrom(ctx.request);

  // KV-backed cross-isolate rate limit. The previous in-memory Map was
  // per-isolate, not per-IP, on Workers — effectively no limit under
  // sustained traffic. AUTH_KV is reused (cheap, no new binding needed;
  // the `rl:subscribe:ip:` key prefix in rate-limit.ts isolates from
  // auth keys). Soft-fail if AUTH_KV is missing so subscribe still works
  // in a misconfigured deploy.
  if (ctx.env.AUTH_KV) {
    const blocked = await isRateLimitedKV(ctx.env.AUTH_KV, "subscribe:ip", ip, {
      max: 5,
      windowSeconds: 60,
    });
    if (blocked) return tooManyRequests();
  } else {
    console.warn("[subscribe] AUTH_KV not bound — rate limit skipped");
  }

  let body: unknown;
  try {
    body = await ctx.request.json();
  } catch {
    return json({ ok: false, error: "invalid request" }, 400);
  }

  const rawEmail =
    body && typeof body === "object" && "email" in body
      ? (body as { email?: unknown }).email
      : undefined;
  if (typeof rawEmail !== "string" || rawEmail.length > MAX_EMAIL_LEN) {
    return json({ ok: false, error: "enter a valid email" }, 400);
  }
  const email = rawEmail.trim().toLowerCase();
  if (!email || !VALID_EMAIL.test(email)) {
    return json({ ok: false, error: "enter a valid email" }, 400);
  }

  const apiKey = ctx.env.BEEHIIV_API_KEY;
  const publicationId = ctx.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return json(
      { ok: false, error: "subscription not configured yet — check back soon" },
      503,
    );
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "promptdojo",
          utm_medium: "landing",
          referring_site: "promptdojo.dev",
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[subscribe] beehiiv non-2xx", res.status, text.slice(0, 500));
      return json({
        ok: false,
        error: "couldn't subscribe — try again in a moment",
      });
    }

    return json({
      ok: true,
      message: "you're in. check your inbox for the welcome.",
    });
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === "TimeoutError";
    console.error("[subscribe] fetch error", isTimeout ? "timeout" : String(err));
    return json({
      ok: false,
      error: isTimeout ? "beehiiv timed out — try again" : "network hiccup — try again",
    });
  }
};
