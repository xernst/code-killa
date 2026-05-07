// POST /api/save — persist signed-in user's progress to KV.
//
// Email is taken from the HMAC-signed session cookie, NOT the request
// body — so a logged-in user can only save under their own email.
// Replaces the prior trustless / email-as-key model (audit-v5 critical).
//
// Body: { payload: ProgressV2 }
// 401 if no valid session, 400 if payload malformed.

import {
  readSessionCookie,
  verifySession,
} from "./_lib/session";
import {
  MAX_PAYLOAD_BYTES,
  sanitizeProgressPayload,
} from "./_lib/validate";

type KV = {
  put: (key: string, value: string) => Promise<void>;
};
type Env = { PROGRESS_KV: KV; SESSION_SECRET: string };
type Ctx = { request: Request; env: Env };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  if (!ctx.env?.PROGRESS_KV || !ctx.env?.SESSION_SECRET) {
    return json({ ok: false, error: "service not configured" }, 503);
  }

  // Cheap guard before parsing the body — reject obviously oversized
  // requests so we don't burn CPU on a 50MB JSON.parse before checking
  // the byte cap.
  const contentLength = Number(ctx.request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_PAYLOAD_BYTES * 2) {
    return json({ ok: false, error: "payload too large" }, 413);
  }

  const cookie = readSessionCookie(ctx.request);
  const session = await verifySession(cookie, ctx.env.SESSION_SECRET);
  if (!session) return json({ ok: false, error: "not signed in" }, 401);

  let body: { payload?: unknown };
  try {
    body = (await ctx.request.json()) as { payload?: unknown };
  } catch {
    return json({ ok: false, error: "invalid json" }, 400);
  }

  const sanitized = sanitizeProgressPayload(body.payload);
  if (!sanitized.ok) {
    return json({ ok: false, error: sanitized.error ?? "invalid payload" }, 400);
  }

  const value = JSON.stringify({
    payload: sanitized.value,
    savedAt: Date.now(),
  });
  if (value.length > MAX_PAYLOAD_BYTES) {
    return json(
      { ok: false, error: "payload too large", limit: MAX_PAYLOAD_BYTES },
      413,
    );
  }

  await ctx.env.PROGRESS_KV.put(session.email, value);
  return json({ ok: true, savedAt: Date.now() });
};
