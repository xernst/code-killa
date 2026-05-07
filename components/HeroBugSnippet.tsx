// Hero bug snippet — the screenshot-anchor for the home page.
//
// The bug must be VISIBLE in the code. Previous versions ("missing
// check", "truthiness or") had bugs that lived in absence or in
// Python lore — a non-dev couldn't see the wrongness on the page.
//
// This version uses Python's ascending-sort default + a slice. The
// code reads as "get the top 3 by revenue." The reader who knows
// Python catches the bug instantly: sorted() goes low-to-high, so
// [:3] picks the WORST sellers, not the best. AI writes this
// constantly — confidently wrong because Python's default cuts
// against english intuition ("top 3" → the smallest 3 are NOT
// the top 3).
//
// Why this is the right hook:
//   - the code is short, readable to anyone who's seen Python
//   - the bug is invisible without Python knowledge — which is
//     literally what the course teaches you
//   - the consequence is visceral: "you featured your worst
//     products on the homepage for a week"
//   - the fix is one keyword (reverse=True) — small enough that
//     the reader thinks "i could learn that"

export default function HeroBugSnippet() {
  return (
    <div className="overflow-hidden border border-ink-800 bg-ink-900">
      {/* row 1 — chrome label, mirrors the wedge OG card */}
      <div className="flex items-center justify-between border-b border-ink-800 px-4 py-2">
        <div className="font-mono text-[11px] text-ink-500">cursor.py</div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
          ai-generated
        </div>
      </div>
      {/* row 2 — code body */}
      <div className="relative">
        <pre
          className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-ink-300"
          aria-label="ai-shipped python bug"
          style={{ fontVariantLigatures: "none" }}
        >
          <code>
            <span className="text-ink-500"># top 3 best sellers for the homepage</span>
            {"\n"}
            top_3 ={" "}
            <span
              style={{ color: "var(--err)", background: "rgba(239,68,68,0.14)" }}
            >
              <span className="text-green-500">sorted</span>(products, key=
              <span className="text-green-500">lambda</span> p: p.revenue)[:
              <span className="text-green-300">3</span>]
            </span>
            {"\n\n"}
            <span className="text-ink-500"># expected: 3 best-selling products</span>
            {"\n"}
            <span className="text-ink-500"># shipped:  3 worst sellers, featured all week</span>
          </code>
        </pre>
      </div>
      {/* row 3 — annotation strip. Display-line typography so each beat
          is its own quotable moment (per audit copy-v1/twitter.md). */}
      <div className="border-t border-ink-800 px-5 py-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-err">
          ascending by default
        </div>
        <p className="mt-2 font-display text-base leading-snug text-ink-100 sm:text-lg">
          <code className="font-mono text-green-400">sorted()</code> goes
          low-to-high unless you tell it.
          <br />
          you didn&apos;t. <span className="text-ink-300">your homepage featured your worst inventory.</span>
          <br />
          <span className="text-ink-300">
            this is the python every cursor user ships and never reads.
          </span>
        </p>
      </div>
    </div>
  );
}
