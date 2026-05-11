---
xp: 1
estSeconds: 130
concept: top-k-is-not-enough
code: |
  # cosine scores for 5 candidate chunks against a single query.
  scored = [
      ("chunk_42", 0.91),  # clearly relevant
      ("chunk_07", 0.87),  # relevant
      ("chunk_18", 0.84),  # related
      ("chunk_31", 0.39),  # tangential
      ("chunk_56", 0.12),  # completely unrelated
  ]

  # naive top-k: take the highest 3 regardless of how low they go.
  top_3 = sorted(scored, key=lambda x: x[1], reverse=True)[:3]
  for c, s in top_3:
      print(f"{c}: {s:.2f}")
runnable: true
---

# Top-k retrieves the closest chunks. The closest chunks are not always the right answer.

You've already built the parts: chunked the document, embedded the
chunks, embedded the query, computed cosine similarity. The naive
last step is `sorted(scored, reverse=True)[:3]`. Take the top three.
Done.

That's the move that makes a demo work and production fail. The
top-3 has three rows whether your corpus is full of the answer or
empty of it. The third-best chunk in an empty-corpus query is
useless garbage, and the model will dutifully use it.

## Two patterns you ship instead

**Pattern 1: distance threshold.** Before slicing the top-k, drop
any candidate whose score is below a cutoff (typical: 0.5 for
cosine similarity on a well-aligned embedding model). Run the
editor. `chunk_56` at 0.12 is clearly noise; the threshold drops it
before the model ever sees it.

The cutoff depends on the embedding model:
- `text-embedding-3-small`: ~0.4-0.5 for "this is relevant"
- `text-embedding-3-large`: ~0.5-0.6 (tighter distribution)
- `voyage-3` and similar reranker-aware models: ~0.7+
- A model you fine-tuned: measure on a held-out set.

The threshold is the most important number in your RAG pipeline.
Most people never tune it.

**Pattern 2: rerank.** Top-k by cosine gets you a candidate set of
maybe 20 chunks. A reranker (a small model whose job is to score
relevance directly, not as a side effect of embedding distance)
re-ranks those 20 into the top 3 you actually send to the LLM.
Cohere Rerank, Jina Reranker, and Voyage Rerank are the usual
choices. They're cheap and they double the quality of retrieval
without changing anything else in the pipeline.

## What goes wrong without these

The four classic failure shapes for naive top-k:

1. **Tangential hits.** Question: "what's our refund policy?" Top-3
   includes a chunk that mentions refunds but is about Q4 finance
   reporting. Model writes "Per our Q4 report, refunds are at 12%."
2. **Duplicates.** The same paragraph appears in two documents. Top-3
   is [doc_a/p3, doc_b/p3, doc_a/p4]. You wasted a slot on a copy.
3. **Empty corpus.** No relevant chunk exists, top-3 returns three
   garbage chunks, the model treats them as authoritative and
   hallucinates from noise.
4. **Order matters.** The model attends more strongly to the FIRST
   chunk in the prompt than the third. If your sort is unstable, the
   answer quality flickers between identical-similarity ties.

This lesson teaches the three fixes that catch all four failures:
threshold, dedupe, stable sort.
