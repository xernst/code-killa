---
xp: 1
estSeconds: 220
concept: samsung-2023-chatgpt-paste
---

# Disaster 2: Samsung, early 2023 — engineers pasting source into ChatGPT

Spring 2023. Three weeks after Samsung Semiconductor lifted an
internal ban on ChatGPT, three separate engineers leaked
proprietary information by pasting it into the chat window:

1. An engineer pasted source code for a confidential
   semiconductor program into ChatGPT to ask for help debugging
   it.
2. A second engineer pasted internal test sequence code, asking
   ChatGPT to optimize it.
3. A third engineer pasted a recorded meeting transcript and
   asked ChatGPT to summarize it into minutes.

Each paste was a polite, well-intentioned use of a productivity
tool. Each paste sent confidential corporate IP through OpenAI's
API to be processed on their servers. At the time, OpenAI's
default terms allowed conversation data to be used for model
training. The engineers had read no policy that told them not
to. ChatGPT felt like a private notebook. It wasn't.

## What actually failed

The pre-2023 model of corporate security was built around a
boundary: data is "inside" the company or "outside." Email
attachments going outside got scanned. File-share access got
audited. USB ports got locked. ChatGPT broke this model in a
single keystroke: paste → submit → outside. The paste happened
inside the browser, on the corporate laptop, on the corporate
network. Every existing DLP control assumed the threat was
*deliberate exfiltration*. Pasting into a help tool is the
opposite — it's an engineer trying to do their job faster, with
zero adversarial intent.

The chain that failed:

1. **No policy explicitly named ChatGPT as out-of-bounds.** The
   ban had been lifted three weeks prior. Engineers assumed lift
   = approved.
2. **No DLP rule flagged "this paste contains code from an
   internal repo."** The corporate DLP suite knew what was in
   email, in Box, in Salesforce. It had no hook into a browser
   paste event.
3. **No enterprise plan with opt-out from training.** The free
   ChatGPT consumer plan defaulted to using conversations for
   training. Enterprise plans (with data-use opt-outs) existed
   but Samsung hadn't bought one.
4. **No internal AI tool engineers could use instead.** Samsung
   had not yet built or licensed a private LLM. The engineers
   had no sanctioned way to do the same task.

The third failure is the load-bearing one. If you tell engineers
"don't use AI for help" but give them no sanctioned alternative,
they will use AI for help. The policy is theater.

## How this connects to git

You're in a git lesson, so why this incident? Because the
Samsung paste is the same failure mode as committing a secret
to a repo, expressed through a different surface:

| Surface | Disaster pattern |
|---|---|
| `git add` + `git commit` + `git push` | Secret in version control. Public if repo is public; recoverable if repo gets breached. |
| Paste into ChatGPT consumer plan | Source / data leaves your perimeter, may be retained, may train the next public model. |
| Paste into a Slack channel | Source / data archived in Slack indefinitely, accessible to anyone with channel access. |

In every case, **the developer trusted a tool to be a private
notebook when it was actually a publishing surface.** The git
version of this is the one you'll hit first as a builder, but
the pattern repeats everywhere AI tools sit in the workflow.

This becomes the dominant pattern in chapter 18 (secrets and
env management), which is why this lesson sits right before
it. The git workflow is one of many places the same mistake
can land.

## The control chain that would have caught it

In order from earliest to latest:

- **An enterprise plan with training opt-out, configured by
  default in the corporate Chrome profile.** If the paste
  happens but the data doesn't train the model, the long-tail
  exposure shrinks dramatically. Doesn't prevent the paste; it
  caps the blast radius.
- **A browser-extension DLP rule that intercepts pastes
  containing patterns matching internal source (proprietary
  class names, internal package prefixes, the literal phrase
  "Samsung Confidential").** Catches the paste at the moment of
  attempt. Annoying for engineers; the cost of the annoyance is
  measured against the cost of the breach.
- **An internal AI assistant trained on internal docs, available
  via an internal URL, with a clear "use this, not ChatGPT"
  policy.** Removes the engineer's motivation to reach for the
  consumer tool in the first place.

The third is the most expensive but the most effective. Samsung
accelerated their internal tool program after this incident.

## What got rotated

Less "rotated" and more "policy-and-process changed":

- ChatGPT use was re-banned internally, this time with monitoring.
- An internal LLM project was put on a six-month delivery clock.
- The three engineers were disciplined (no public detail on how).
- A broader DLP review was opened across the semiconductor unit.

The leaked source code itself is, in principle, in OpenAI's
training data. Or it isn't. Nobody outside OpenAI can prove
either way. That's the part of this breach you can't undo and
can't audit. The most damaging consequences are the ones you
can't see.

## What you should take from this

When an AI tool is in your workflow, the question is never "do I
trust this tool?" — it's "**where does this data go after I hit
enter?**" For ChatGPT consumer plan, the answer was "OpenAI's
training set." For Cursor, the answer is whatever's in their
data-use policy this quarter. For Claude Code, the answer is
Anthropic's policy. For your company's internal tool, the answer
is "the same place as our other internal data."

Don't paste anything into anything until you can answer that
question. That's a habit. Build it now.
