---
xp: 1
estSeconds: 200
concept: pricing-process-debt
---

# The incumbent trap — when your cost model is a fossil

In Chapter 26 we used the phrase "process debt" to describe what
locks incumbent service businesses out of an AI-native rebuild. The
same concept applies, with a different surface area, to LLM products
that priced themselves against a model that no longer exists.

Call this **process debt of pricing models**. It's what happens when
the price curve has moved but everything about your company — your
pricing page, your sales motion, your headcount, your support
playbook, your CFO's spreadsheet — still assumes yesterday's costs.

## The shape of the trap

A company shipping an LLM feature in 2023 made dozens of decisions
calibrated to GPT-4 pricing. None of them looked load-bearing at the
time:

- The pricing page lists $99/month. The deck explained the price in
  terms of "compute cost per request × expected requests."
- Sales was hired to sell the $99 plan. Commissions, quota, OTE all
  calibrated for that price point.
- The product team scoped features against "how many calls per user
  can we afford?" The answer was 100/day.
- Support was sized for a customer base willing to pay $99 — i.e.,
  power users who use the product a lot.
- The CFO model assumed 70% gross margin on those calls and modeled
  three years out from that.

By 2026, the underlying API costs have fallen 10-100×. In a frictionless
market, this should be pure margin upside. **In practice it is a
strategic catastrophe**, because:

1. A new entrant prices the same feature at $9/month and still has
   80% margin. The $99 product is undefendable on the pricing page —
   buyers compare and churn.
2. Dropping the price to $9 to compete blows up the sales motion.
   Reps quit because they can't make quota on a $9 ACV. The deck
   doesn't work. The CFO model collapses.
3. Adding features fast enough to justify the $99 requires shipping
   2-3× the surface area of the new entrant, which the team is not
   structured for.
4. Keeping the price flat and losing customers slowly is the path of
   least resistance — and the path to irrelevance.

This is the same trap that hit Jasper. It is the trap currently
hitting every "AI for ___" company that raised at 2023 valuations,
shipped against 2023 model prices, and built an org chart against
2023 sales motions. The cost curve moved underneath them and the
company couldn't move with it.

## Why incumbents can't escape

The new entrant doesn't have any of this debt. They priced from day
one against Haiku-4.5 economics. Their sales motion, their support
team, their product surface, their CFO model — all sized for $9
ACV from the start. They get the same margin on a $9 product that
the incumbent got on $99, because their cost basis is two orders of
magnitude lower.

The incumbent is stuck. Their options are:

- **Stay at $99, lose customers slowly.** Death by attrition.
- **Drop to $9, blow up the sales motion.** Self-inflicted layoffs
  and a quarter or two of pain.
- **Add 10× more features at $99 to justify the price.** Requires a
  bigger team than the unit economics now support.

There is no "just lower the price" button. The whole company was
built around a number that no longer exists. This is what process
debt looks like inside an LLM company — and it compounds in the
wrong direction every quarter the model prices keep falling.

## The strategic lesson

If you are building today, **assume the model price you're paying
today is the highest price you will ever pay** for that level of
capability. Price your product against where the cost curve will be
in twelve months, not where it is today.

If you are working at an incumbent that priced against 2023 or 2024
models, **the strategic question is not "how do we cut API costs?"**
It is "**how do we restructure the entire company — pricing, sales,
features, headcount — to be viable against a competitor with a 10×
lower cost basis?**" That question is uncomfortable. It's the only
one that matters.

The next step is a quick check on which features become viable as
prices fall. Then the build steps put a real cost model in your
hands so you can see this dynamic on your own products.
