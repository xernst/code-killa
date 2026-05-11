---
xp: 1
estSeconds: 220
concept: case-air-canada
---

# Case 1: Air Canada's chatbot invented a bereavement-refund policy

February 2024. The British Columbia Civil Resolution Tribunal ordered
Air Canada to pay damages to a passenger named Jake Moffatt. The
ruling is short and worth reading in full. The relevant facts:

Moffatt's grandmother died. He went to Air Canada's website to book a
last-minute flight to the funeral. The site had a customer-service
chatbot. He asked the chatbot whether the airline had a bereavement-
fare program and how to apply for the refund afterwards. The chatbot
answered, with confidence, that he could book the flight at the
regular price and apply for a partial bereavement refund within 90
days of travel.

That policy does not exist at Air Canada. The actual policy is that
bereavement fares must be booked in advance — they cannot be claimed
retroactively. Moffatt booked the flight, flew to the funeral, and
filed for the refund. Air Canada refused.

He filed in tribunal. Air Canada's defense, in writing: the chatbot
"is a separate legal entity" responsible for its own actions. The
tribunal rejected this. The ruling held that a company is liable for
information on its website regardless of whether the information came
from a human-written page or a chatbot. Air Canada was ordered to pay
the difference, plus tribunal fees, plus interest.

## Reading the trace

We don't have Air Canada's internal trace. But the public facts are
enough to reconstruct it.

- `rendered_prompt`: some variant of "you are an Air Canada customer
  service assistant. Help the user with their question."
- `tools_called`: unclear, possibly none. The chatbot may have had
  RAG over the public policy site, or it may have been pure LLM.
- `retrieved_chunks`: if RAG existed, it either pulled nothing
  relevant or pulled the general bereavement policy page (which says
  the program exists but requires advance booking) and the model
  invented the "apply within 90 days after travel" detail.
- `raw_output`: the chatbot's confident, fabricated policy.
- `output_after_postprocess`: identical to raw_output, since nothing
  in the response was structurally malformed.

The bug is not a parse bug (the output rendered fine). It is not a
retrieval miss in the sense that retrieval pulled the *wrong*
document — there was no document with that policy in it. The model
generated it.

## The class

This is **class 2 — prompt was ambiguous.** A naive read calls it
class 3 (true hallucination), and you'll see writers in the press do
exactly that. But the deeper failure is upstream: the system prompt
did not constrain the model to refuse policy claims that are not
verbatim in retrieved content. With no rule telling it "if you cannot
quote the policy directly, say you don't know and offer a phone
number," the model defaulted to fluent helpfulness. The system
*allowed* the model to make a policy promise it had not retrieved.
That is a prompt-layer failure, not a model failure.

If you reframe class 3 as "the model invented something with no
upstream signal that should have stopped it," then yes — class 3.
The two classifications point at the same fix, which is the point.

## The fix that would have caught it

Two layers, in order:

1. **A hard-coded policy refusal layer.** Any question that
   pattern-matches as "what is your policy on X" routes to a
   constrained prompt that includes the verbatim policy text and
   instructs the model to refuse if the policy is not present in the
   context. If retrieval returns nothing on a policy question, the
   chatbot says "I don't have that information — please call our
   bereavement desk at..." It does not generate a guess.

2. **An eval that asks "did the bot make a promise?"** Run every
   model response through a second LLM call (or a regex on commitment
   verbs: "will," "can," "apply," "refund," "within N days") and
   flag any response that makes a refund-related commitment without a
   cited policy chunk. The flagged ones never reach the customer
   without human review.

## What this case teaches

A customer-facing chatbot that can make commitments without
constraints is legally indistinguishable from a customer service rep
who can make commitments without training. Courts have now
established that the company owns those commitments. The post-mortem
template's step 5 — "the fix is at the layer of the root cause" —
applies here at the prompt-and-system-architecture layer, not at the
model layer. There is no version of GPT-4 you can swap in that fixes
this. The fix is the constraint around it.
