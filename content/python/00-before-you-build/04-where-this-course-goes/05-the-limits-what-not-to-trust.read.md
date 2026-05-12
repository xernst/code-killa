---
xp: 1
estSeconds: 240
concept: trust-boundaries-and-blast-radius
---

# What you do not trust an LLM with

A model is a probability function. It is right most of the time and
catastrophically wrong some of the time. The difference between an
amateur and a builder is knowing which decisions you let it make and
which ones you don't.

This is not a safety lecture. It's a calibration. Five categories
where the answer is "never as final word, always with a system layer
on top."

## 1. Money movement

Never let a model authorize a wire transfer, refund, payment, or
charge unprompted. Models will hallucinate amounts. Models will
hallucinate authorizations. Models will, given the right prompt
injection, decide to send your customer's money to a wallet address
in an email signature. Every dollar moved goes through a deterministic
verification layer — usually a confirmation flow with a human, always
a hard ceiling that the model cannot exceed.

## 2. Legal, medical, financial advice to specific people

A model can summarize a contract. A model cannot tell your customer
whether to sign it. A model can explain what a symptom usually means.
A model cannot diagnose a person. A model can describe how a 401(k)
works. A model cannot tell a 58-year-old whether to roll theirs into
an IRA next month.

The distinction is generic explanation (fine) versus specific advice
to an identified person (not fine without a licensed human in the
loop). This isn't a vibes line — it's the line that, when crossed,
becomes the lawsuit.

## 3. Identity verification

Never use an LLM as the final check on "is this person who they say
they are." Models are good at language. They are bad at "this driver's
license number was issued in 2019 by the state of Ohio." Identity
verification belongs to a system that calls authoritative records,
not to a model that pattern-matches on what a license usually looks
like.

## 4. Irreversible actions

Anything that can't be undone — sending an email to 50,000 customers,
deleting a database, terminating a contract, posting publicly under
your brand — goes through a confirmation step, even if the rest of
the workflow is automated. The model can DRAFT the email. The model
can DRAFT the deletion. A human approves the irreversible part.

The rule of thumb: blast radius times reversibility. High blast,
low reversibility = human-in-the-loop, always.

## 5. Real-time facts (especially after training cutoff)

Models have a training cutoff. Ask one "who is the CEO of [company]"
and you'll often get the CEO from 18 months ago. Ask one "what's the
current price of [stock]" and you'll often get a number from 2024.
For anything that changes over time — prices, headcount, news, who
holds office, current law — the model is not the source of truth.
The retrieval layer is. (You'll learn that in ch22.)

## Why this matters: every output crosses a trust boundary

Your job as a builder is to decide, for every output the model
produces, whose responsibility the consequences are. If the output
goes straight to a customer, the model is the author. If the output
goes to a human reviewer first, the human is the author. If the
output triggers an action with real-world consequences, the system
that wraps the model is the author — and you wrote that system.

> An airline once had to honor a refund policy its chatbot invented.
> You're about to build chatbots.

That airline was Air Canada. Their chatbot told a bereaved customer
about a bereavement-discount policy that did not exist. The customer
booked the flight in reliance on the policy. The tribunal ruled the
airline was bound by what its chatbot said. The chatbot's invented
policy became real policy, retroactively, in a courtroom.

That story has friends. The NYC MyCity small-business chatbot told
business owners they could fire workers for reporting harassment.
The DPD shipping bot was prompt-injected into swearing at customers
and writing a poem about how bad DPD was. The Chevrolet dealership
chatbot agreed to sell a Chevy Tahoe for $1, in writing.

You will dissect those incidents in detail in **ch24 (debugging
output)**, when you have the tools to spot what each team should
have caught. For now, the lesson is small: a deployed LLM is a
deployed contract author. The author has to be supervised.

## The shape of the rest of the course

Every chapter after this one assumes you are building something that
will eventually be in front of a real user. The chapters on prompting,
evals, retrieval, and harness engineering are not academic. They are
the supervisory layer that keeps your agent from becoming the next
Air Canada.

The next two lessons are practical. First, a quick test of whether
you'd ship four real-sounding features. Then you write a function
that builds your own 30-day plan through the course.
