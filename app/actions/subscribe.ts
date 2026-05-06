"use server";

// Server action that POSTs an email to Beehiiv's Public API v2.
// Keeps the BEEHIIV_API_KEY out of the client bundle.
//
// Env vars required (set in Vercel → Project → Settings → Environment Variables):
//   BEEHIIV_API_KEY        — from beehiiv.com → Settings → API
//   BEEHIIV_PUBLICATION_ID — from beehiiv.com → Settings → Publication (looks like pub_xxxxxxxx)
//
// Until those are set, the action returns a clear "coming soon" status
// so the form on the landing page degrades gracefully.

export type SubscribeResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeEmail(
  _prev: SubscribeResult | null,
  formData: FormData,
): Promise<SubscribeResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !VALID_EMAIL.test(email)) {
    return { ok: false, error: "enter a valid email" };
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return {
      ok: false,
      error: "subscription not configured yet — check back soon",
    };
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "promptdojo",
          utm_medium: "landing",
          referring_site: "promptdojo.dev",
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[subscribe] beehiiv api error", res.status, text);
      return { ok: false, error: "couldn't subscribe — try again in a moment" };
    }

    return { ok: true, message: "you're in. check your inbox for the welcome." };
  } catch (err) {
    console.error("[subscribe] network error", err);
    return { ok: false, error: "network hiccup — try again" };
  }
}
