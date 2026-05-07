// POST /api/auth/request — send a magic-link sign-in email.
//
// Body: { email }
// Response: always 200 { ok: true } regardless of whether the email
// exists / was sent — prevents email-enumeration. Real failures are
// logged server-side.

import { sendEmail, type EmailEnv } from "../_lib/email";
import { normalizeEmail } from "../_lib/validate";
import { generateToken } from "../_lib/session";

type AuthKV = {
  put: (
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ) => Promise<void>;
};

type Env = EmailEnv & {
  AUTH_KV: AuthKV;
  SESSION_SECRET: string;
};

type Ctx = { request: Request; env: Env };

const TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  let body: { email?: unknown };
  try {
    body = (await ctx.request.json()) as { email?: unknown };
  } catch {
    return json({ ok: false, error: "invalid request" }, 400);
  }

  const email = normalizeEmail(body.email);
  if (!email) return json({ ok: false, error: "invalid email" }, 400);

  if (!ctx.env?.AUTH_KV || !ctx.env?.SESSION_SECRET) {
    console.error("[auth:request] AUTH_KV or SESSION_SECRET binding missing");
    return json({ ok: false, error: "auth not configured" }, 503);
  }

  const token = generateToken();
  await ctx.env.AUTH_KV.put(
    `auth:${token}`,
    JSON.stringify({ email, createdAt: Date.now() }),
    { expirationTtl: TOKEN_TTL_SECONDS },
  );

  const origin = new URL(ctx.request.url).origin;
  const link = `${origin}/api/auth/verify?token=${token}`;

  const result = await sendEmail(ctx.env, {
    to: email,
    subject: "your promptdojo sign-in link",
    text: [
      "click the link below to sign in to promptdojo:",
      "",
      link,
      "",
      "the link works once and expires in 15 minutes.",
      "if you didn't ask for this, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>click the link below to sign in to promptdojo:</p>
      <p><a href="${link}" style="color:#2aa06a;font-weight:bold">${link}</a></p>
      <p style="color:#666;font-size:13px">the link works once and expires in 15 minutes. if you didn't ask for this, you can ignore this email.</p>
    `,
  });

  if (!result.ok) {
    // Don't leak the failure to the client — log + return generic ok.
    console.error("[auth:request] email send failed:", result.error);
  }

  return json({ ok: true });
};
