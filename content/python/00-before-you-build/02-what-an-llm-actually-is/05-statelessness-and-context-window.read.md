---
xp: 1
estSeconds: 240
concept: statelessness-and-context
---

# The model has no memory. The harness fakes it.

Here is a fact that surprises almost every new builder: **the model
has no memory between calls.** Each API call is a cold start. The
model that responds to your second message has no idea your first
message ever happened — unless the system around it re-sends your
first message as part of the input every single time.

It does. That's what's happening when you "have a conversation" with
ChatGPT or Claude. You think you're talking to something that
remembers you. You're not. You're sending it the entire transcript,
over and over, with one new line tacked on at the end.

## The goldfish-with-a-notebook metaphor

One useful image:

> Goldfish with a notebook — the goldfish (model) forgets every
> session; the notebook (harness) is what carries state.

The model is the goldfish. Zero memory. Every interaction is
encountered fresh. The harness — the code wrapping the model that
your chat app is built out of — is the notebook. It keeps the
history. It writes the history into the prompt before each call. The
goldfish reads the notebook, generates the next line, and forgets
everything again.

This is the single most important fact about LLM systems. Memorize
it. **The model is stateless. State lives in the harness.**

## What this means concretely

When you say "remember that I prefer Python" to a chatbot and three
turns later it correctly uses Python, the model didn't remember
anything. What happened is:

1. Turn 1: you said "remember that I prefer Python."
2. Turn 2: the harness sent the model `[turn 1, turn 2]`.
3. Turn 3: the harness sent the model `[turn 1, turn 2, turn 3]`.
4. Turn 4: the harness sent `[turn 1, turn 2, turn 3, turn 4]`.

The model at turn 4 sees your Python preference because it's sitting
right there in the input, re-sent for the fourth time. The model
isn't remembering. The model is reading.

When the conversation grows past the context window (next section),
the early turns get dropped or summarized. At that point your
"preference for Python" can quietly vanish from the prompt, and the
model will helpfully start writing JavaScript again. Not because it
forgot. Because the harness ran out of room.

This is also why "memory" features (Claude memory, ChatGPT memory)
are interesting: they're attempts to upgrade the notebook. The
goldfish is still a goldfish. What's improved is the harness's
strategy for what to write in the notebook before each call.

## The context window: a fixed-size scratchpad

Every model has a hard upper limit on how many tokens it can see at
once. Older models had 4,000-token windows (about 3,000 words).
Modern models have 200,000-token windows (about 150,000 words, the
length of a novel) or larger. Either way, the limit is **fixed and
finite**.

That window is everything the model is aware of in this moment. The
system prompt, the conversation history, any retrieved documents,
any tool outputs, your latest message — all of it has to fit, or it
doesn't get seen.

Another way to see it:

> LLM is a Boggle player who only sees the letters currently on the
> tray.

The Boggle player can be brilliant. Can be terrible. Doesn't matter —
they can only play the letters currently visible. If the letter you
need isn't on the tray, it might as well not exist. Same with the
model. If the document you need isn't in the context window, the
model has no access to it. Doesn't matter that it was discussed
yesterday, or referenced in turn 4, or sitting in a file on disk.
Not in the window, not in the game.

## Why this drives so much of the rest of the course

A lot of what you'll spend chapters 10-25 learning is just sophisticated
ways to manage what's in that scratchpad. The whole discipline goes by
a few names:

- **Context engineering** — deciding what gets put into the window,
  in what order, with what framing
- **RAG (retrieval-augmented generation)** — pulling the right
  documents into the window just in time for each query
- **Conversation summarization** — compressing turn 1-50 into a short
  summary so turn 51 still has room to be useful
- **Memory systems** — picking what to write down in the notebook so
  the goldfish has the right context next time

You don't need to know any of those yet. You just need to know **why
they exist**: because the model is stateless, and the context window
is finite, and somebody has to decide what goes in.

That somebody is the harness. By the end of this course, that
somebody will be you.

## One last reframe

When you start building, every problem you hit will eventually reduce
to one of these three:

1. **The right information isn't in the context window.** (Fix:
   retrieve it.)
2. **The information IS in the window but the model isn't using it
   well.** (Fix: change the prompt structure or the system prompt.)
3. **The window is full and important information got pushed out.**
   (Fix: summarize, trim, or restructure.)

That's most of the job. Three problems. One stateless goldfish. A
finite scratchpad. Welcome to LLM engineering.
