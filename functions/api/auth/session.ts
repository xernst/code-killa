// GET /api/auth/session — returns { email } if logged in, else 401.
// Lets the client UI render "saved as X" without exposing the cookie
// to JS.

import { readSessionCookie, verifySession } from "../_lib/session";

type Env = { SESSION_SECRET: string };
type Ctx = { request: Request; env: Env };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  if (!ctx.env?.SESSION_SECRET) {
    return json({ ok: false, error: "auth not configured" }, 503);
  }
  const cookie = readSessionCookie(ctx.request);
  const session = await verifySession(cookie, ctx.env.SESSION_SECRET);
  if (!session) return json({ ok: false }, 401);
  return json({ ok: true, email: session.email });
};
