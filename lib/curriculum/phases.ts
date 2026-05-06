// Single source of truth for phase → chapter mapping.
// Both /about and / read from here. Authored once, drift-proof.
//
// chapterSlugs MUST exist in lib/generated/v2/manifest.toc.json. The
// PhaseBandedRail filters out unknown slugs at render-time, but a missing
// or extra slug means the home rail won't sum to 25 tiles.

export type Phase = {
  number: number;       // 1..5
  name: string;         // lowercase
  blurb: string;        // lowercase, comma-separated topics
  range: string;        // e.g. "ch 01–07"
  chapterSlugs: string[];
};

export const PHASES: Phase[] = [
  {
    number: 1,
    name: "foundations",
    blurb:
      "variables, functions, lists, dicts, loops, conditionals, tracebacks, mutation",
    range: "ch 01–07",
    chapterSlugs: [
      "variables",
      "functions",
      "lists-and-dicts",
      "loops",
      "conditionals",
      "tracebacks",
      "mutation-and-state",
    ],
  },
  {
    number: 2,
    name: "real python",
    blurb: "modules, error handling, files & i/o, classes, http",
    range: "ch 08–12",
    chapterSlugs: [
      "modules-and-imports",
      "error-handling",
      "files-and-io",
      "classes-basics",
      "http-and-apis",
    ],
  },
  {
    number: 3,
    name: "llm apis",
    blurb: "calling models, structured output, mcp, agent loops",
    range: "ch 13–16",
    chapterSlugs: [
      "llm-apis",
      "structured-output",
      "mcp",
      "agent-loops",
    ],
  },
  {
    number: 4,
    name: "shipping discipline",
    blurb: "git, secrets, prompting, traces, evals, retrieval, tradeoffs",
    range: "ch 17–24",
    chapterSlugs: [
      "git-and-github",
      "secrets-and-env",
      "prompting",
      "agent-traces",
      "evals",
      "context-and-retrieval",
      "production-tradeoffs",
      "debugging-output",
    ],
  },
  {
    number: 5,
    name: "capstone",
    blurb: "ship a working cli agent in 12 steps. ~100 lines of python.",
    range: "ch 25",
    chapterSlugs: ["capstone"],
  },
];

export function phaseForChapter(slug: string): Phase | undefined {
  return PHASES.find((p) => p.chapterSlugs.includes(slug));
}
