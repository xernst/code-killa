// POST /api/auth/iap-bind — bind a RevenueCat app_user_id to a verified
// promptdojo session email.
//
// Why this exists: without a server-mediated bind, the entitlement webhook
// at /api/entitlement would trust whatever app_user_id arrives in the RC
// payload. A paid attacker could set RC's appUserID to a victim's email
// and have the webhook grant pro to the victim's KV key. The bind record
// breaks that loop: the webhook resolves event.app_user_id -> bound email
// (from this record, signed by an authenticated session) and writes
// entitlement under the bound email, not under whatever string the mobile
// client supplied at IAP-configure time.
//
// Body: { app_user_id: string }
// Response: 200 { ok: true, app_user_id } | 401 (no session) | 400 (bad body)
//
// Storage: iap-bind:${app_user_id} -> { email: session.email, boundAt }
// TTL: 1 year (KV allows up to 1 year; renewed on every successful bind).

import { readSessionCookie, verifySession } from "../_lib/session";

type KV = {
  get: (key: string) => Promise<string | null>;
  put: (
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ) => Promise<void>;
};

type Env = {
  PROGRESS_KV: KV;
  SESSION_SECRET: string;
};
type Ctx = { request: Request; env: Env };

// Defensive cap. RevenueCat documents app_user_id up to 1500 chars but
// anything we'd realistically want is under 128 (a UUID is 36, an email
// is at most 254 by RFC). Tighter cap keeps the KV key bounded and makes
// fuzzing harder.
const APP_USER_ID_PATTERN = /^[A-Za-z0-9._@+-]{1,254}$/;
const BIND_TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year (KV max)

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  if (!ctx.env?.PROGRESS_KV || !ctx.env?.SESSION_SECRET) {
    return json({ ok: false, error: "auth not configured" }, 503);
  }

  const session = await verifySession(
    readSessionCookie(ctx.request),
    ctx.env.SESSION_SECRET,
  );
  if (!session) {
    return json({ ok: false, error: "not signed in" }, 401);
  }

  let body: { app_user_id?: unknown };
  try {
    const parsed = (await ctx.request.json()) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return json({ ok: false, error: "invalid request" }, 400);
    }
    body = parsed as { app_user_id?: unknown };
  } catch {
    return json({ ok: false, error: "invalid request" }, 400);
  }

  const appUserId = typeof body.app_user_id === "string" ? body.app_user_id : "";
  if (!APP_USER_ID_PATTERN.test(appUserId)) {
    return json({ ok: false, error: "invalid app_user_id" }, 400);
  }

  const record = {
    email: session.email,
    boundAt: new Date().toISOString(),
  };

  try {
    await ctx.env.PROGRESS_KV.put(
      `iap-bind:${appUserId}`,
      JSON.stringify(record),
      { expirationTtl: BIND_TTL_SECONDS },
    );
  } catch (err) {
    console.error("[iap-bind] KV put failed", session.email, appUserId, String(err));
    return json({ ok: false, error: "bind failed" }, 500);
  }

  return json({ ok: true, app_user_id: appUserId });
};
