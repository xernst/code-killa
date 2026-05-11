---
xp: 1
estSeconds: 130
concept: three-failure-shapes
code: |
  # most "agent broke" reports fit one of three trace shapes.
  trace = [
      {"turn": 1, "tool": "search", "args": {"q": "auth bug"}, "tokens": 220},
      {"turn": 2, "tool": "search", "args": {"q": "auth bug"}, "tokens": 240},
      {"turn": 3, "tool": "search", "args": {"q": "auth bug"}, "tokens": 260},
  ]

  def summarize(trace):
      tools = {(t["tool"], frozenset(t["args"].items())) for t in trace}
      total_tokens = sum(t["tokens"] for t in trace)
      return {
          "turns": len(trace),
          "distinct_calls": len(tools),
          "tokens": total_tokens,
      }

  print(summarize(trace))
runnable: true
---

# A trace turns a four-hour panic into a twenty-minute investigation

You read traces in lesson 1. Now you use them.

Most "the agent is broken" reports look the same from the outside:
the user sent a question, the agent answered something unhelpful, the
user is unhappy. The TRACE tells you which kind of broken it is.
Three patterns cover the majority of failures:

## Pattern 1: looping with no progress

Same tool, same arguments, repeated. The agent is asking the same
question to the same tool and getting the same answer. The signature
in the trace is mechanical: three or more rows where
`(tool, args)` is identical. Run the editor. The trace above has
three identical `search` calls. `summarize(trace)` returns
`distinct_calls = 1` against `turns = 3` — that ratio is the
loop signal.

## Pattern 2: tool routing bug

The model asked for `Search` (capitalized) and the router did a
case-sensitive lookup against a lowercase registry. The router
returned `"(unknown tool)"` as a fallback string. The agent treated
that string as a real search result and made up an answer from it.
The trace shows tool calls that "succeeded" with garbage results
that look real if you don't squint.

## Pattern 3: prompt bloat

Turn 1 uses 200 tokens. Turn 5 uses 4000. The chat history is
accumulating every prior tool result. The agent is rereading the
whole conversation on every turn, paying for it, and slowly losing
focus as the context fills with irrelevant chatter. The trace's
`tokens` column is the signal.

## What you're going to do

This lesson teaches the mechanical signatures of each pattern,
then you fix two of them in code. By the end you'll have a
`bug_report(trace)` that classifies any trace into one of the
three failure shapes (or `clean` if none fire), which is exactly
the kind of helper you'd paste into your on-call rotation.
