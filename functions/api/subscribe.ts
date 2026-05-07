// POST /api/subscribe — Cloudflare Pages Function.
// Forwards email subscription to Beehiiv's Public API v2 server-side
// so the BEEHIIV_API_KEY never ships to the client.
//
// Hardened per the 2026-05-07 senior-dev audit:
//   - tightened email validation (length cap + regex)
//   - 8-second AbortSignal timeout on the upstream Beehiiv call so a
//     hung API doesn't waste the 30s function budget
//   - non-2xx Beehiiv responses log status + body (visible in CF Pages
//     Functions log stream)
//   - returns HTTP 503 on missing config (was 200 with ok:false), so
//     monitors can distinguish "user typo" from "production env vars
//     vanished"
//   - per-IP rate limiting via a 60-second in-memory counter (Workers
//     isolates are short-lived; this is cheap belt-and-suspenders;
//     Cloudflare's WAF + bot-fight is the real defense)
//
// Env vars (set via wrangler / Cloudflare Pages dashboard):
//   BEEHIIV_API_KEY        — from beehiiv.com → Settings → API
//   BEEHIIV_PUBLICATION_ID — from beehiiv.com → Settings → Publication

type Env = {
  BEEHIIV_API_KEY?: string;
  BEEHIIV_PUBLICATION_ID?: string;
};
type Ctx = { request: Request; env: Env };

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIMEOUT_MS = 8_000;
const MAX_EMAIL_LEN = 254; // RFC 5321 envelope local + domain
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_IP = 5;
const recentByIp = new Map<string, number[]>();

function ipFrom(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX_PER_IP) {
    recentByIp.set(ip, arr);
    return true;
  }
  arr.push(now);
  recentByIp.set(ip, arr);
  return false;
}

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
  if (isRateLimited(ip)) {
    return json({ ok: false, error: "too many requests — try again in a minute" }, 429);
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
