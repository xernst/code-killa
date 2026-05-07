// GET /api/load — return the signed-in user's saved progress.
//
// Email is taken from the HMAC-signed session cookie, NOT a query
// parameter — so a logged-in user can only read their own progress.
// Replaces the prior trustless / email-as-key model (audit-v5 critical).
//
// 401 if no valid session, 404 if no payload saved yet.

import { readSessionCookie, verifySession } from "./_lib/session";

type KV = { get: (key: string) => Promise<string | null> };
type Env = { PROGRESS_KV: KV; SESSION_SECRET: string };
type Ctx = { request: Request; env: Env };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  if (!ctx.env?.PROGRESS_KV || !ctx.env?.SESSION_SECRET) {
    return json({ ok: false, error: "service not configured" }, 503);
  }

  const cookie = readSessionCookie(ctx.request);
  const session = await verifySession(cookie, ctx.env.SESSION_SECRET);
  if (!session) return json({ ok: false, error: "not signed in" }, 401);

  const value = await ctx.env.PROGRESS_KV.get(session.email);
  if (!value) return json({ ok: false, found: false }, 404);

  return new Response(value, {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
};
