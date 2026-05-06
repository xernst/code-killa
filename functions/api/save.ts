// Cloudflare Pages Function — POST /api/save
// Accepts { email, payload } and persists payload as JSON in KV under the email key.
// Last-write-wins. Trustless (no auth verification) by design — see LOGIN-SETUP.md.

type KV = {
  put: (key: string, value: string) => Promise<void>;
};
type Env = { PROGRESS_KV: KV };
type Ctx = { request: Request; env: Env };

const MAX_BYTES = 200_000;
const MAX_EMAIL = 200;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function onRequestPost(ctx: Ctx) {
  let body: { email?: unknown; payload?: unknown };
  try {
    body = await ctx.request.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > MAX_EMAIL) {
    return json({ error: "invalid email" }, 400);
  }

  if (!ctx.env?.PROGRESS_KV) {
    return json(
      { error: "kv binding missing — configure PROGRESS_KV in Pages settings" },
      503,
    );
  }

  const value = JSON.stringify({ payload: body.payload, savedAt: Date.now() });
  if (value.length > MAX_BYTES) {
    return json({ error: "payload too large", limit: MAX_BYTES }, 413);
  }

  await ctx.env.PROGRESS_KV.put(email, value);
  return json({ ok: true, savedAt: Date.now() });
}
