// GET /api/auth/verify?token=... — consume a magic-link token, set the
// session cookie, redirect home.
//
// Tokens are single-use (deleted from KV after consumption) and TTL'd
// to 15 minutes by /api/auth/request.

import {
  buildSessionCookie,
  signSession,
} from "../_lib/session";

type AuthKV = {
  get: (key: string) => Promise<string | null>;
  delete: (key: string) => Promise<void>;
};

type Env = {
  AUTH_KV: AuthKV;
  SESSION_SECRET: string;
};

type Ctx = { request: Request; env: Env };

function htmlError(message: string, status = 400): Response {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>sign-in failed</title>
    <body style="font:14px/1.5 ui-monospace,monospace;background:#14140f;color:#fafaf7;padding:48px">
    <h1 style="color:#2aa06a;margin:0 0 12px">sign-in failed</h1>
    <p>${message}</p>
    <p><a href="/" style="color:#2aa06a">← back home</a></p>
    </body>`,
    {
      status,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  const url = new URL(ctx.request.url);
  const token = url.searchParams.get("token");

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return htmlError("invalid sign-in link.", 400);
  }
  if (!ctx.env?.AUTH_KV || !ctx.env?.SESSION_SECRET) {
    console.error("[auth:verify] AUTH_KV or SESSION_SECRET binding missing");
    return htmlError("auth is not configured on this deploy.", 503);
  }

  const raw = await ctx.env.AUTH_KV.get(`auth:${token}`);
  if (!raw) {
    return htmlError(
      "this link is expired or already used. request a new one.",
      410,
    );
  }

  let parsed: { email?: string };
  try {
    parsed = JSON.parse(raw) as { email?: string };
  } catch {
    return htmlError("malformed token.", 500);
  }
  const email = parsed.email;
  if (!email) return htmlError("malformed token.", 500);

  // Single-use — delete before issuing the cookie so a leaked token
  // can't be replayed.
  await ctx.env.AUTH_KV.delete(`auth:${token}`);

  const cookieValue = await signSession(email, ctx.env.SESSION_SECRET);
  return new Response(null, {
    status: 302,
    headers: {
      location: "/?signed-in=1",
      "set-cookie": buildSessionCookie(cookieValue),
      "cache-control": "no-store",
    },
  });
};
