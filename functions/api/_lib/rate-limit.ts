// Sliding-window rate limit, backed by KV so the counter outlives the
// Worker isolate. CF Pages Functions run across many short-lived isolates;
// any in-memory Map enforces a per-isolate limit, not a per-IP one, which
// is functionally no limit at all under sustained abuse. This module is
// the real defense; Cloudflare's WAF is the additional layer.

type RateLimitKV = {
  get: (key: string) => Promise<string | null>;
  put: (
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ) => Promise<void>;
};

export function ipFrom(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

// Per-bucket sliding-window counter. Same shape as tutor.ts:bumpCounter
// (deliberately mirrored — we want one rate-limit pattern in the codebase).
// At worst, a rapid-fire concurrent caller hits the cap ±1; strict atomicity
// is not worth the overhead for a magic-link-request limiter.
export async function isRateLimitedKV(
  kv: RateLimitKV,
  scope: string,
  identifier: string,
  opts: { max: number; windowSeconds: number },
): Promise<boolean> {
  const key = `rl:${scope}:${identifier}`;
  const now = Date.now();
  const windowMs = opts.windowSeconds * 1_000;

  let arr: number[] = [];
  const raw = await kv.get(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        arr = (parsed as unknown[])
          .filter((t): t is number => typeof t === "number")
          .filter((t) => now - t < windowMs);
      }
    } catch {
      // ignore — bad blob, treat as empty
    }
  }

  if (arr.length >= opts.max) return true;
  arr.push(now);
  await kv.put(key, JSON.stringify(arr), {
    expirationTtl: opts.windowSeconds,
  });
  return false;
}

export function tooManyRequests(): Response {
  return new Response(
    JSON.stringify({ ok: false, error: "too many requests — try again in a minute" }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
        "retry-after": "60",
      },
    },
  );
}
