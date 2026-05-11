// /terms — subscription terms. required by apple for auto-renew IAP.
// server component. lowercase. matches the privacy + about voice.
// last updated 2026-05-11.

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "terms · promptdojo",
  description:
    "subscription terms for promptdojo: billing, auto-renewal, cancellation, refunds, governing law, arbitration. plain english.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "2026-05-11";
const CONTACT_EMAIL = "support@promptdojo.dev";

export default function TermsPage() {
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
          <span>terms</span>
        </div>
        <h1 className="t-hero">terms.</h1>
        <p className="t-mono-meta mt-6">last updated {LAST_UPDATED}</p>
        <p className="t-body mt-6 max-w-2xl">
          if you subscribe to promptdojo pro, these are the rules. plain
          english. no surprises.
        </p>
      </section>

      {/* ───────── 1. WHAT YOU'RE BUYING ───────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">what you&apos;re buying</div>
        <h2 className="t-section">
          access to the <em className="t-emph">pro</em> tier.
        </h2>
        <p className="t-body mt-6 max-w-2xl">
          a subscription unlocks every chapter, the pyodide ide on phone, the
          ai tutor, cloud sync, and offline mode in the promptdojo app. pro
          features stop the moment your subscription ends.
        </p>
        <ul className="mt-6 space-y-3 t-body">
          <li>
            <strong className="text-ink-100">monthly</strong> — $9.99 / month.
            auto-renews each month.
          </li>
          <li>
            <strong className="text-ink-100">yearly</strong> — $59 / year.
            auto-renews each year.
          </li>
          <li>
            <strong className="text-ink-100">founders</strong> — $129 one-time.
            no renewal. lifetime access for the first 100 buyers; after that,
            lifetime is $199.
          </li>
        </ul>
        <p className="t-body-sm mt-6 max-w-2xl">
          prices are in usd. local taxes may apply at the store. apple and
          google may convert prices for your region.
        </p>
      </section>

      {/* ───────── 2. BILLING ──────────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">billing</div>
        <h2 className="t-section">
          paid via <em className="t-emph">apple</em> or <em className="t-emph">google.</em>
        </h2>
        <p className="t-body mt-6 max-w-2xl">
          purchases happen through apple in-app purchase or google play
          billing. we never see your card. payment is taken at purchase and at
          each renewal. the charge appears on your apple or google statement.
        </p>
      </section>

      {/* ───────── 3. AUTO-RENEWAL ─────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">auto-renewal</div>
        <h2 className="t-section">
          renews until <em className="t-emph">canceled.</em>
        </h2>
        <p className="t-body mt-6 max-w-2xl">
          monthly and yearly subscriptions auto-renew at the end of each
          period. you&apos;ll be charged within 24 hours of the renewal date
          unless you cancel at least 24 hours before. the price at renewal is
          the price in effect for your tier at that time.
        </p>
        <p className="t-body mt-4 max-w-2xl">
          founders is one-time. it does not renew.
        </p>
      </section>

      {/* ───────── 4. CANCELLATION ─────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">cancellation</div>
        <h2 className="t-section">
          cancel <em className="t-emph">anytime.</em>
        </h2>
        <p className="t-body mt-6 max-w-2xl">
          we do not cancel for you — apple and google own the subscription. to
          cancel:
        </p>
        <ul className="mt-6 space-y-3 t-body">
          <li>
            <strong className="text-ink-100">ios.</strong> settings → your name
            → subscriptions → promptdojo → cancel.
          </li>
          <li>
            <strong className="text-ink-100">android.</strong> google play →
            menu → subscriptions → promptdojo → cancel.
          </li>
        </ul>
        <p className="t-body mt-6 max-w-2xl">
          after canceling, you keep pro access until the end of the current
          paid period. no partial refunds.
        </p>
      </section>

      {/* ───────── 5. REFUNDS ──────────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">refunds</div>
        <h2 className="t-section">
          handled by <em className="t-emph">the store.</em>
        </h2>
        <p className="t-body mt-6 max-w-2xl">
          apple&apos;s standard refund policy applies to ios purchases —
          contact apple support at{" "}
          <a
            href="https://reportaproblem.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline underline-offset-2 hover:text-green-300"
          >
            reportaproblem.apple.com
          </a>
          . google play&apos;s policy applies to android — contact google play
          support.
        </p>
        <p className="t-body mt-4 max-w-2xl">
          we do not issue refunds for partial billing periods. if you cancel
          mid-cycle, you keep access through the end of the cycle and are not
          refunded the unused portion.
        </p>
        <p className="t-body mt-4 max-w-2xl">
          if a refund is granted, your pro access ends immediately.
        </p>
      </section>

      {/* ───────── 6. CONTENT UPDATES ──────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">content updates</div>
        <p className="t-body mt-4 max-w-2xl">
          we update lessons regularly. some chapters may be revised, replaced,
          or retired as the field changes. your subscription is for ongoing
          access to the current curriculum — not for any specific chapter
          existing forever.
        </p>
      </section>

      {/* ───────── 7. ACCOUNT SUSPENSION ───────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">account suspension</div>
        <p className="t-body mt-4 max-w-2xl">
          we may suspend or terminate access if you abuse the service, share
          credentials at scale, attempt to circumvent the iap system, or
          otherwise violate these terms. flagrant abuse forfeits any active
          subscription without refund.
        </p>
      </section>

      {/* ───────── 8. DISCLAIMER ───────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">disclaimer</div>
        <p className="t-body mt-4 max-w-2xl">
          promptdojo is provided &quot;as is&quot;. we don&apos;t promise the
          curriculum will get you a job, get you promoted, or make you a
          senior engineer. we try hard. we cannot guarantee outcomes.
        </p>
        <p className="t-body mt-4 max-w-2xl">
          to the extent permitted by law, our total liability for any claim
          related to the service is limited to the amount you paid us in the
          12 months before the claim.
        </p>
      </section>

      {/* ───────── 9. GOVERNING LAW + ARBITRATION ──────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">governing law</div>
        <h2 className="t-section">
          delaware. <em className="t-emph">arbitration.</em>
        </h2>
        <p className="t-body mt-6 max-w-2xl">
          these terms are governed by the laws of the state of delaware,
          without regard to conflict-of-laws rules.
        </p>
        <p className="t-body mt-4 max-w-2xl">
          any dispute arising out of or relating to these terms or the service
          will be resolved by binding individual arbitration under the rules
          of the american arbitration association, seated in wilmington,
          delaware. you and we waive the right to a jury trial and to
          participate in a class action. you may opt out of arbitration within
          30 days of first subscribing by emailing{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-green-400 underline underline-offset-2 hover:text-green-300"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      {/* ───────── 10. CHANGES ─────────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">changes to terms</div>
        <p className="t-body mt-4 max-w-2xl">
          we may update these terms. material changes will be notified by
          email at least 30 days before they take effect. if you don&apos;t
          agree, cancel before the effective date.
        </p>
      </section>

      {/* ───────── 11. CONTACT ─────────────────────────────────── */}
      <section className="py-10 border-t border-ink-800">
        <div className="t-eyebrow mb-3">contact</div>
        <p className="t-body mt-4 max-w-2xl">
          questions about these terms — write to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-green-400 underline underline-offset-2 hover:text-green-300"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/privacy" className="dojo-btn-tertiary">
            privacy →
          </Link>
          <Link href="/pro" className="dojo-btn-tertiary">
            pro →
          </Link>
          <Link href="/" className="dojo-btn-tertiary">
            ← home
          </Link>
        </div>
      </section>
    </main>
  );
}
