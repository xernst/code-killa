// Hero bug snippet — static, ember-highlighted broken Python.
//
// The mutable-default-arg bug: a one-screen demonstration of why the AI
// codes you ship need a reader. PR 5 (dojoTheme) will harmonize these
// inline tokens with the global syntax mapping; for now, inline styling
// keeps PR 4 self-contained.

export default function HeroBugSnippet() {
  return (
    <pre
      className="overflow-x-auto rounded-none border-l-2 border-ember-500 bg-ink-900 p-5 font-mono text-sm leading-relaxed text-ink-300"
      aria-label="ai-shipped python bug"
      style={{ fontVariantLigatures: "none" }}
    >
      <code>
        <span className="text-ember-500">def</span>{" "}
        <span className="text-ember-300">collect_errors</span>(
        {"\n  "}
        msg: <span className="text-ember-500">str</span>,
        {"\n  "}
        bag: <span className="text-ember-500">list</span> ={" "}
        <span style={{ color: "var(--err)", background: "rgba(239,68,68,0.14)" }}>
          []
        </span>
        {"\n"}):{"\n  "}
        bag.append(msg){"\n  "}
        <span className="text-ember-500">return</span> bag
      </code>
      <div className="mt-3 border-t border-ink-800 pt-3 text-xs text-ink-500">
        mutable default arg. python evaluates the list once at definition.
        every caller mutates the same list.
      </div>
    </pre>
  );
}
