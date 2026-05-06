// Single source of truth for syntax highlighting in lesson markdown.
//
// Default `rehype-highlight` registers ~27 highlight.js languages (kotlin,
// swift, vbnet, ruby, …) — none of which a Python course needs. That ships
// 100–140 KB gz to every lesson page.
//
// We pin to {python, bash, json} explicitly. Any code fence with a different
// language tag falls through unhighlighted, which is the right answer for
// this product.
//
// Per design-kit/audit-v5/performance.md — top win.

import rehypeHighlight from "rehype-highlight";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";

// Tuple form expected by react-markdown's `rehypePlugins` prop:
// [Plugin, options]. Not `as const` — react-markdown's Pluggable type
// requires a mutable tuple.
export const rehypeHighlightPinned: [
  typeof rehypeHighlight,
  { languages: Record<string, unknown>; detect: false },
] = [rehypeHighlight, { languages: { python, bash, json }, detect: false }];
