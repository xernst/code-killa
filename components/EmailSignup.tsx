"use client";

// Email signup form for the landing page. Server-side via the
// subscribeEmail action; no client-side API key exposure.
// Matches existing dojo-card / dojo-btn-* design tokens.

import { useActionState } from "react";
import { subscribeEmail, type SubscribeResult } from "@/app/actions/subscribe";

const initialState: SubscribeResult | null = null;

export default function EmailSignup() {
  const [state, action, pending] = useActionState(subscribeEmail, initialState);

  return (
    <section className="my-24 flex flex-col items-center border-y border-ink-800 py-16 text-center">
      <div className="t-eyebrow tracking-[0.4em]">stay in the loop</div>
      <h2 className="t-h2 mt-4 max-w-2xl text-ink-100">
        new chapters, the x-thread version of every lesson, the bugs ai shipped
        this week
      </h2>
      <p className="t-body-sm mt-4 max-w-xl text-ink-400">
        no spam, no upsell. one email when there's something worth reading.
        unsubscribe in one click.
      </p>

      <form
        action={action}
        className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          aria-label="email address"
          disabled={pending || state?.ok === true}
          className="flex-1 rounded-md border border-ink-700 bg-ink-950 px-4 py-3 text-ink-100 placeholder:text-ink-600 focus:border-green-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={pending || state?.ok === true}
          className="dojo-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "subscribing…" : state?.ok ? "subscribed ✓" : "subscribe"}
        </button>
      </form>

      <div className="mt-4 min-h-6 t-mono-meta" aria-live="polite">
        {state?.ok === false && (
          <span className="text-red-400">{state.error}</span>
        )}
        {state?.ok === true && (
          <span className="text-green-500">{state.message}</span>
        )}
      </div>
    </section>
  );
}
