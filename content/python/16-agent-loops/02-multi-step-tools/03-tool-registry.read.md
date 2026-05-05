---
xp: 2
estSeconds: 90
concept: tool-definitions-vs-tool-functions
code: |
  # two halves of "a tool". the model needs the SCHEMA to know it exists.
  # your code needs the FUNCTION to actually run it.

  TOOL_DEFINITIONS = [
      {
          "name": "search",
          "description": "Search the web. Returns up to 3 result URLs.",
          "input_schema": {
              "type": "object",
              "properties": {"q": {"type": "string"}},
              "required": ["q"],
          },
      },
      {
          "name": "read_page",
          "description": "Fetch a URL and return its plain text.",
          "input_schema": {
              "type": "object",
              "properties": {"url": {"type": "string"}},
              "required": ["url"],
          },
      },
  ]

  TOOL_FUNCTIONS = {
      "search":    lambda q:   f"3 results for {q}",
      "read_page": lambda url: f"<text from {url}>",
  }

  # send TOOL_DEFINITIONS to the model. dispatch through TOOL_FUNCTIONS.
  for d in TOOL_DEFINITIONS:
      print(f"{d['name']}: {d['description']}")
---

# A tool is two things, not one

The mental shortcut is "a tool is a function." It's almost right and
it's the source of the second-most-common bug in beginner agent code.
The full picture:

- **Tool definition** — what the *model* sees. A name, a description,
  and a JSON schema for its input. The model uses the description to
  decide whether this tool is the right one for the next step.
- **Tool function** — what *your code* runs. A Python function (or
  callable) that takes the same arguments the schema describes and
  returns a string the model can read.

The model never executes Python. It only sees the schema. Your loop
never reads the description. It only calls the function. Both halves
have to exist and they have to agree on the name.

## Why descriptions matter more than you'd think

The model picks tools based on the `description` field. If your
description is `"Search."` the model will guess about when to use it.
If your description is `"Search the web for current information.
Returns up to 3 result URLs as plain text. Use when the user asks
about events after your knowledge cutoff."` the model picks correctly
on the first try.

Bad descriptions are why your agent calls `search` for "what's two
plus two" — the model has no signal that this isn't what `search`
is for.

## Why JSON Schema, not Python type hints

The model produces JSON. Your loop receives JSON. The schema lives in
the tool definition because the *model* validates against it before
emitting a `tool_use` block. Python type hints don't reach the wire.

In real agents you'll see two patterns:

```python
# pattern 1 — handwritten schemas (clearest, most explicit)
{"name": "search", "input_schema": {"type": "object", "properties": {...}}}

# pattern 2 — derive from Pydantic / dataclasses (less typing)
{"name": "search", "input_schema": SearchArgs.model_json_schema()}
```

Both ship in production. Frameworks like LangChain default to pattern
2; you'll learn pattern 1 here because you'll read it in everyone's
code, including the SDK examples.

## What to register: every tool, every turn

A subtle thing: you send the *full* tool list every API call. The
model doesn't remember which tools you registered last turn. Each
turn includes the messages-so-far AND the full tool list. That's by
design — it lets you add or remove tools mid-conversation if needed,
e.g. "now that the user is logged in, also offer `delete_account`."

For most loops you'll just keep the list constant.
