---
xp: 1
estSeconds: 110
concept: cosine-threshold-cutoff
code: |
  # naive top-k vs. threshold-then-top-k.
  scored = [
      ("chunk_42", 0.91),
      ("chunk_07", 0.87),
      ("chunk_18", 0.84),
      ("chunk_31", 0.39),
      ("chunk_56", 0.12),
  ]

  THRESHOLD = 0.5

  def naive_top_k(scored, k):
      return sorted(scored, key=lambda x: x[1], reverse=True)[:k]

  def thresholded_top_k(scored, k, threshold):
      keep = [(c, s) for c, s in scored if s >= threshold]
      return sorted(keep, key=lambda x: x[1], reverse=True)[:k]

  print("naive top-5:    ", [c for c, _ in naive_top_k(scored, 5)])
  print("with threshold: ", [c for c, _ in thresholded_top_k(scored, 5, THRESHOLD)])
runnable: true
---

# The threshold is the single most important number in your pipeline

Run the editor. Naive top-5 returns all five chunks, including the
clearly-noise `chunk_56` at 0.12. The thresholded version filters
first, returning only the three relevant chunks even though you
asked for up to 5.

That's the property you want in production. **Top-k caps the upper
bound. The threshold sets the lower bound.** Use both.

## The cutoff is per-model

The right threshold depends on the embedding model's similarity
distribution. Here's the calibration you'll actually do:

1. Take 50 query+chunk pairs you KNOW are relevant. Compute cosine.
2. Take 50 query+chunk pairs you KNOW are irrelevant. Compute cosine.
3. The threshold is the value that separates them best.

For most modern embedding models, the right cutoff lands somewhere
between 0.4 and 0.7. Anything lower than 0.3 is essentially "model
guessed semantic similarity from grammar alone," not from meaning.
Anything higher than 0.9 means "near-duplicate" — usually not what
you want for retrieval breadth.

## What "score is below threshold" means in practice

When the threshold filters every candidate (no result clears the
bar), you have three options:

1. **Return empty.** The model gets no retrieved context. Your prompt
   should handle this case explicitly: "If you don't have enough
   information, say so." This is the right move.
2. **Return the best you have anyway.** The model will hallucinate
   from garbage. This is the bad move.
3. **Fall back to a different retriever** (keyword search, BM25, a
   broader corpus). This is the expensive-but-right move.

Option 1 is what production RAG systems do. The "I don't know"
response feels worse than a confident wrong answer, but it's
catastrophically less expensive.

## The threshold's siblings: dedupe and stable sort

A threshold catches noise. Dedupe catches redundancy. Stable sort
catches order-flicker. You need all three before you ship.

Dedupe pattern:

```python
seen = set()
deduped = []
for c, s in sorted(scored, key=lambda x: x[1], reverse=True):
    if c not in seen:
        seen.add(c)
        deduped.append((c, s))
```

Stable sort is automatic in Python — `sorted` is stable, so ties
preserve insertion order. That means if you sort by score and the
top-3 has two 0.87s, they come out in the order they were inserted.
Predictable. The reason this matters: when you re-run the same query
twice and the top-3 reshuffles between calls, the LLM's answer
shifts too. Stable sort kills that flicker.
