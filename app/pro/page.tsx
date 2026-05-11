// /pro — pricing + feature comparison. drives App Store / Play Store install.
// server component; pricing is static. Phase 4 will wire real store badges
// + the live founders counter. for now: lucide Smartphone glyph placeholders
// and a hardcoded 23/100 claimed count.
//
// Required disclosure copy near the monthly/yearly CTAs is App Store §3.1.2 —
// "auto-renews until canceled. cancel anytime in settings." do not remove.

import Link from "next/link";
import type { Metadata } from "next";
import { Smartphone, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "pro · the python school, paid — promptdojo",
  description:
    "the full python school in your pocket. $9.99 monthly, $59 yearly, $129 lifetime for the first 100 buyers. 26 chapters, pyodide ide on phone, ai tutor, cloud sync, offline mode.",
  alternates: { canonical: "/pro" },
};

const FOUNDERS_CLAIMED = 23; // hardcode for now; Phase 4 reads from KV
const FOUNDERS_TOTAL = 100;

type Tier = {
  id: "monthly" | "yearly" | "founders";
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  cta: string;
  loud: boolean;
  highlight?: string;
};

const tiers: Tier[] = [
  {
    id: "monthly",
    name: "monthly",
    price: "$9.99",
    cadence: "/ mo",
    blurb: "try the whole school. cancel any month.",
    cta: "start monthly",
    loud: false,
  },
  {
    id: "yearly",
    name: "yearly",
    price: "$59",
    cadence: "/ yr",
    blurb: "$4.91/mo equivalent. 41% off monthly. the default.",
    cta: "start yearly",
    loud: true,
    highlight: "best value",
  },
  {
    id: "founders",
    name: "founders",
    price: "$129",
    cadence: "once",
    blurb: "lifetime. no renewal. first 100 only — then $199.",
    cta: "claim founders",
    loud: false,
    highlight: `${FOUNDERS_CLAIMED} / ${FOUNDERS_TOTAL} claimed`,
  },
];

type Row = {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
};

const featureRows: Row[] = [
  { feature: "chapters", free: "3 free", pro: "26 pro" },
  { feature: "pyodide ide on phone", free: false, pro: true },
  { feature: "ai tutor on 2nd failure", free: false, pro: true },
  { feature: "cloud sync across devices", free: false, pro: true },
  { feature: "offline mode", free: false, pro: true },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) {
    return (
      <span className="inline-flex items-center gap-2 text-green-400">
        <Check className="h-4 w-4" aria-hidden />
        <span className="sr-only">yes</span>
      </span>
    );
  }
  if (v === false) {
    return (
      <span className="inline-flex items-center gap-2 text-ink-600">
        <X className="h-4 w-4" aria-hidden />
        <span className="sr-only">no</span>
      </span>
    );
  }
  return <span className="t-body-sm text-ink-200">{v}</span>;
}

export default function ProPage() {
  return (
    <main
      id="main"
      className="mx-auto max-w-5xl px-6 pt-20 pb-12 sm:pt-24 sm:pb-16"
    >
      {/* ───────── 1. HERO ─────────────────────────────────────── */}
      <section className="pb-16">
        <div className="mb-6 inline-flex items-center gap-2 t-eyebrow">
          <span>❯</span>
          <span>pro</span>
        </div>
        <h1 className="t-hero">
          the python school, <em className="t-emph">paid.</em>
        </h1>
        <p className="t-body mt-8 max-w-2xl">
          $9.99 monthly. $59 yearly. $129 lifetime for the{" "}
          <em className="italic text-ink-100">first 100 buyers.</em>
        </p>
        <p className="t-body-sm mt-4 max-w-2xl">
          the web tier is a preview — three chapters, no ide. the app is the
          whole school: 26 chapters, pyodide on your phone, an ai tutor that
          explains your bugs in plain english, cloud sync, offline mode.
        </p>
      </section>

      {/* ───────── 2. PRICING TILES ────────────────────────────── */}
      <section className="pb-16">
        <div className="t-eyebrow mb-3">pricing</div>
        <h2 className="t-section">
          pick one. <em className="t-emph">cancel anytime.</em>
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {tiers.map((t) => {
            const isLoud = t.loud;
            const cardClass = isLoud
              ? "dojo-card-highlight flex flex-col"
              : "dojo-card flex flex-col";
            return (
              <div key={t.id} className={cardClass}>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="t-eyebrow">{t.name}</div>
                  {t.highlight ? (
                    <div
                      className={
                        "t-mono-meta " +
                        (isLoud ? "text-green-400" : "text-ink-400")
                      }
                    >
                      {t.highlight}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black tracking-[-0.03em] text-ink-100">
                    {t.price}
                  </span>
                  <span className="t-mono-meta">{t.cadence}</span>
                </div>

                <p className="t-body-sm mt-4">{t.blurb}</p>

                <div className="mt-6">
                  <button
                    type="button"
                    disabled
                    className={
                      isLoud ? "dojo-btn-primary w-full" : "dojo-btn-secondary w-full"
                    }
                    aria-label={`${t.cta} — available in the app`}
                  >
                    {t.cta} →
                  </button>
                </div>

                {t.id === "founders" ? (
                  <div className="mt-4 t-mono-meta">
                    locked-in. no subscription. all future chapters included.
                  </div>
                ) : (
                  <div className="mt-4 t-mono-meta">
                    auto-renews until canceled. cancel anytime in settings.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── 3. FEATURE COMPARISON ───────────────────────── */}
      <section className="pb-16">
        <div className="t-eyebrow mb-3">what you get</div>
        <h2 className="t-section">
          free preview <em className="t-emph">vs</em> pro.
        </h2>

        <div className="mt-8 overflow-hidden border border-ink-800">
          <table className="w-full border-collapse font-display text-sm">
            <thead>
              <tr className="border-b border-ink-800 bg-ink-900 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-400">
                <th className="p-4 text-left font-bold">feature</th>
                <th className="p-4 text-left font-bold">free preview</th>
                <th className="p-4 text-left font-bold text-green-400">pro</th>
              </tr>
            </thead>
            <tbody>
              {featureRows.map((r, i) => (
                <tr
                  key={r.feature}
                  className={
                    "border-b border-ink-800 " +
                    (i % 2 ? "bg-ink-950" : "bg-ink-900")
                  }
                >
                  <td className="p-4 text-ink-200">{r.feature}</td>
                  <td className="p-4">
                    <Cell v={r.free} />
                  </td>
                  <td className="p-4">
                    <Cell v={r.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────── 4. APP STORE BADGES (placeholder) ───────────── */}
      <section className="pb-16">
        <div className="t-eyebrow mb-3">get the app</div>
        <h2 className="t-section">
          paid is <em className="t-emph">in the app.</em>
        </h2>
        <p className="t-body-sm mt-4 max-w-2xl">
          apple in-app purchase and google play billing only — there is no web
          checkout. download the app, pick a tier, start chapter 1.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div
            className="dojo-btn-secondary"
            aria-label="app store badge placeholder"
          >
            <Smartphone className="h-4 w-4" aria-hidden />
            app store
          </div>
          <div
            className="dojo-btn-secondary"
            aria-label="play store badge placeholder"
          >
            <Smartphone className="h-4 w-4" aria-hidden />
            google play
          </div>
        </div>
        <p className="t-mono-meta mt-4">store badges land in phase 4.</p>
      </section>

      {/* ───────── 5. FINE PRINT ───────────────────────────────── */}
      <section className="pb-16">
        <div className="t-eyebrow mb-3">fine print</div>
        <ul className="mt-6 space-y-3 t-body-sm max-w-2xl">
          <li>
            monthly and yearly auto-renew until canceled. cancel anytime in
            your device settings.
          </li>
          <li>
            founders is a one-time charge. no renewal. all future chapters
            included for life.
          </li>
          <li>
            payment is taken by apple or google. refunds follow their standard
            policy — see{" "}
            <Link
              href="/terms"
              className="text-green-400 underline underline-offset-2 hover:text-green-300"
            >
              terms
            </Link>
            .
          </li>
          <li>
            data handling is in the{" "}
            <Link
              href="/privacy"
              className="text-green-400 underline underline-offset-2 hover:text-green-300"
            >
              privacy policy
            </Link>
            .
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/" className="dojo-btn-tertiary">
            ← home
          </Link>
          <Link href="/about" className="dojo-btn-tertiary">
            about →
          </Link>
        </div>
      </section>
    </main>
  );
}
