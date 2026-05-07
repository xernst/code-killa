// POST /api/auth/logout — clears the session cookie.
// Doesn't delete saved progress in PROGRESS_KV; user can sign back in
// to restore.

import { buildClearCookie } from "../_lib/session";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const onRequestPost = async (): Promise<Response> => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "set-cookie": buildClearCookie(),
      "cache-control": "no-store",
    },
  });
};

// Same handler for GET so a `<a href>` logout link works too.
export const onRequestGet = onRequestPost;
