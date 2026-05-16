// POST /api/auth/logout — clears the session cookie.
// Doesn't delete saved progress in PROGRESS_KV; user can sign back in
// to restore.

import { buildClearCookie } from "../_lib/session";

// POST only. A GET alias would be a CSRF forced-logout vector: the session
// cookie is SameSite=Lax, which DOES send on cross-origin top-level GET
// navigations, so `<img src=".../api/auth/logout">` on any page could log the
// user out. SameSite=Lax blocks the cookie on cross-origin POST, so requiring
// POST closes the hole. The UI calls this with fetch(..., {method:"POST"}).
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
