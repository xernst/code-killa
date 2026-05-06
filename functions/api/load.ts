// Cloudflare Pages Function — GET /api/load?email=X
// Returns the saved payload for an email key, or 404 if none exists.
// Trustless (no auth verification) by design — see LOGIN-SETUP.md.

type KV = {
  get: (key: string) => Promise<string | null>;
};
type Env = { PROGRESS_KV: KV };
type Ctx = { request: Request; env: Env };

const MAX_EMAIL = 200;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function onRequestGet(ctx: Ctx) {
  const url = new URL(ctx.request.url);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@") || email.length > MAX_EMAIL) {
    return json({ error: "invalid email" }, 400);
  }

  if (!ctx.env?.PROGRESS_KV) {
    return json(
      { error: "kv binding missing — configure PROGRESS_KV in Pages settings" },
      503,
    );
  }

  const value = await ctx.env.PROGRESS_KV.get(email);
  if (!value) return json({ found: false }, 404);

  return new Response(value, {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
