// /privacy — privacy policy. required for App Store + Play Store submission.
// server component. plain english, lowercase headings, matches the about page
// voice. last updated 2026-05-11.

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "privacy · promptdojo",
  description:
    "what promptdojo collects, what it does with it, what it doesn't do, and how to delete it. plain english.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "2026-05-11";
const CONTACT_EMAIL = "support@promptdojo.dev";

export default function PrivacyPage() {
  return (
    <main
      id="main"
      className="mx-auto max-w-3xl px-6 pt-20 pb-12 sm:pt-24 sm:pb-16"
    >
      <Link href="/" className="dojo-btn-tertiary">
        ← home
      </Link>

      <section className="pt-10 pb-8">
        <div className="mb-6 inline-flex items-center gap-2 t-eyebrow">
          <span>❯</span>
          <span>privacy</span>
        </div>
        <h1 className="t-hero">privacy.</h1>
        <p className="t-mono-meta mt-6">last updated {LAST_UPDATED}</p>
        <p className="t-body mt-6 max-w-2xl">
          short version: we keep almost nothing, sell nothing, and you can
          delete what little we have by emailing us.
        </p>
      </section>

      {/* ───────── 1. WHAT WE COLLECT ──────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">what we collect</div>
        <h2 className="t-section">three things. that&apos;s it.</h2>
        <ul className="mt-6 space-y-4 t-body">
          <li>
            <strong className="text-ink-100">progress in localStorage.</strong>{" "}
            which chapters you opened, which steps you finished. anonymous.
            lives on your device unless you opt in to sync.
          </li>
          <li>
            <strong className="text-ink-100">your email (optional).</strong>{" "}
            only if you sign in for cloud sync. used to send a magic link —
            no password, no marketing list.
          </li>
          <li>
            <strong className="text-ink-100">
              revenuecat anonymous customer id + receipt.
            </strong>{" "}
            if you subscribe in the app. used to check your tier across devices
            and validate the purchase with apple or google.
          </li>
        </ul>
      </section>

      {/* ───────── 2. WHAT WE DO WITH IT ───────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">what we do with it</div>
        <h2 className="t-section">
          <em className="t-emph">three</em> things only.
        </h2>
        <ul className="mt-6 space-y-3 t-body">
          <li>sync your progress across devices when you sign in.</li>
          <li>check whether your subscription is active.</li>
          <li>email you a magic link when you ask for one.</li>
        </ul>
      </section>

      {/* ───────── 3. WHAT WE DON'T DO ─────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">what we don&apos;t do</div>
        <h2 className="t-section">
          no <em className="t-emph">ad-tech</em>. no fingerprinting.
        </h2>
        <ul className="mt-6 space-y-3 t-body">
          <li>we don&apos;t sell your data. ever.</li>
          <li>we don&apos;t share it with advertisers, brokers, or partners.</li>
          <li>no third-party analytics fingerprinting. no pixels.</li>
          <li>no marketing list. no upsell email. no drip campaign.</li>
          <li>no profiling. no targeted ads. no resale.</li>
        </ul>
      </section>

      {/* ───────── 4. RETENTION ────────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">retention</div>
        <h2 className="t-section">
          kept while your account exists. then <em className="t-emph">30 days</em>.
        </h2>
        <p className="t-body mt-6 max-w-2xl">
          progress and email are kept for the life of your account. if you
          delete your account, everything is purged within 30 days. localStorage
          data lives on your device and is yours to clear at any time.
        </p>
        <p className="t-body mt-4 max-w-2xl">
          revenuecat retains receipt data per its own policy and per apple /
          google requirements — typically 7 years for tax and audit purposes.
          that data is not joined back to your name or email by us.
        </p>
      </section>

      {/* ───────── 5. YOUR RIGHTS ──────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">your rights</div>
        <h2 className="t-section">
          export, <em className="t-emph">delete</em>, ask.
        </h2>
        <ul className="mt-6 space-y-3 t-body">
          <li>
            <strong className="text-ink-100">export.</strong> email us; we send
            your data as json within 14 days.
          </li>
          <li>
            <strong className="text-ink-100">delete.</strong> email us; account
            and synced progress purged within 30 days.
          </li>
          <li>
            <strong className="text-ink-100">ask.</strong> any question about
            what we have on you — we answer.
          </li>
        </ul>
        <p className="t-body mt-6 max-w-2xl">
          gdpr / ccpa / similar applies if you live where it applies — same
          contact path, same response time.
        </p>
      </section>

      {/* ───────── 6. CHILDREN ─────────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">children</div>
        <p className="t-body mt-4 max-w-2xl">
          promptdojo is not directed at children under 13. we don&apos;t
          knowingly collect data from anyone under 13. if you believe a child
          has signed up, email us and we&apos;ll delete the account.
        </p>
      </section>

      {/* ───────── 7. CHANGES ──────────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">changes</div>
        <p className="t-body mt-4 max-w-2xl">
          if this policy changes in a way that matters, we&apos;ll update the
          date at the top and notify subscribers by email. minor wording fixes
          ship without a notice.
        </p>
      </section>

      {/* ───────── 8. CONTACT ──────────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">contact</div>
        <h2 className="t-section">
          email a <em className="t-emph">human.</em>
        </h2>
        <p className="t-body mt-6 max-w-2xl">
          questions, exports, deletions, anything else — write to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-green-400 underline underline-offset-2 hover:text-green-300"
          >
            {CONTACT_EMAIL}
          </a>
          . a person reads it.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/terms" className="dojo-btn-tertiary">
            terms →
          </Link>
          <Link href="/" className="dojo-btn-tertiary">
            ← home
          </Link>
        </div>
      </section>
    </main>
  );
}
