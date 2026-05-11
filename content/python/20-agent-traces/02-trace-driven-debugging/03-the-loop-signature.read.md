---
xp: 1
estSeconds: 110
concept: repeated-identical-calls-means-loop
code: |
  # the mechanical signature of a loop:
  #   same `tool` + same `args` for k consecutive turns.
  trace = [
      {"turn": 1, "tool": "search", "args": {"q": "auth"}},
      {"turn": 2, "tool": "search", "args": {"q": "auth"}},
      {"turn": 3, "tool": "search", "args": {"q": "auth"}},
      {"turn": 4, "tool": "lookup", "args": {"id": 42}},
  ]

  def detect_loop(trace, k=3):
      for i in range(len(trace) - k + 1):
          window = trace[i:i + k]
          first = (window[0]["tool"], frozenset(window[0]["args"].items()))
          if all(
              (t["tool"], frozenset(t["args"].items())) == first
              for t in window
          ):
              return True
      return False

  print(detect_loop(trace, k=3))
runnable: true
---

# A loop has a mechanical signature

Run the editor. The trace has four turns. Turns 1, 2, 3 are identical
calls. Turn 4 is something different. `detect_loop(trace, k=3)`
returns `True` because there exists a window of 3 consecutive identical
calls (turns 1, 2, 3).

The trick is comparing `args`. `args` is a dict. Dicts aren't
hashable, so you can't put them in a set or use them as dict keys.
The fix is `frozenset(args.items())`. A frozenset is hashable and
preserves the (key, value) pairs — so two dicts with the same content
produce the same frozenset, even if the iteration order differs.

That one detail is why loop detection is harder than it looks. Your
agent might call `search(q="auth", limit=10)` and the next turn the
model orders the args differently as `search(limit=10, q="auth")`.
A naive comparison treats those as different calls. The frozenset
trick collapses them to the same fingerprint.

## What `k` should be

`k = 3` is the production default — two repeats is just polling, three
is intent. Some teams use `k = 2` with a confidence threshold (a
second identical call is suspicious; flag and review). For an agent
loop you control, `k = 3` is the breakpoint where you should
short-circuit the loop and return an error rather than burn more
tokens.

## Where this fires

- A bad `tool_use_id` matching — the model thinks the tool didn't
  return, so it asks again.
- A vague prompt where every search returns the same top-3 results
  and the model can't tell it already saw them.
- A buggy retry layer that calls the tool again after a `429` but
  forgets to update the `messages` list with the new attempt.

The fix is almost always upstream of the loop. The loop is just
the symptom your trace surfaces.
