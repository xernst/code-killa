// Pricing band — post-pivot. Free preview on web, paid in the app.
// Three tier tiles ($9.99/mo · $59/yr · $129 founders). Tight vertical
// rhythm per UI Designer audit (was min-h-[60vh] py-24, now py-12).

type Tier = {
  price: string;
  unit: string;
  label: string;
  badge?: string;
};

const tiers: readonly Tier[] = [
  { price: "$9.99", unit: "/mo", label: "monthly" },
  { price: "$59", unit: "/yr", label: "annual", badge: "41% off" },
  { price: "$129", unit: "lifetime", label: "founders", badge: "founders · first 100" },
];

export default function PriceBand() {
  return (
    <section className="my-16 border-y border-ink-800 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="t-eyebrow tracking-[0.4em]">pricing</div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.label} className="dojo-card-interactive flex flex-col items-center justify-center p-4">
              <div className="font-mono text-2xl font-bold leading-none text-ink-100">
                {t.price}
                <span className="ml-1 text-base font-normal text-ink-400">{t.unit}</span>
              </div>
              {t.badge ? (
                <div className="t-mono-meta mt-2 text-green-500">{t.badge}</div>
              ) : (
                <div className="t-mono-meta mt-2 text-ink-500">{t.label}</div>
              )}
            </div>
          ))}
        </div>
        <p className="t-body-sm mt-6 text-ink-400">
          free preview on the web. full school in the app.
        </p>
      </div>
    </section>
  );
}
