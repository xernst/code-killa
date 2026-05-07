// Cheap in-memory per-IP rate limit. Workers isolates are short-lived
// and not guaranteed to share state, so this is belt-and-suspenders only;
// Cloudflare's WAF is the real defense against sustained abuse.
//
// Use:
//   const ip = ipFrom(ctx.request);
//   if (isRateLimited(ip, "auth-request", { max: 5, windowMs: 60_000 })) {
//     return tooManyRequests();
//   }

const buckets = new Map<string, number[]>();

export function ipFrom(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function isRateLimited(
  ip: string,
  scope: string,
  opts: { max: number; windowMs: number },
): boolean {
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < opts.windowMs);
  if (arr.length >= opts.max) {
    buckets.set(key, arr);
    return true;
  }
  arr.push(now);
  buckets.set(key, arr);
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
