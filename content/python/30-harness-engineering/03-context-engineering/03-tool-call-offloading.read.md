---
xp: 1
estSeconds: 220
concept: tool-call-offloading
---

# A 2000-line log doesn't belong in your context window

Imagine: the agent runs `npm run build`. The build fails. The tool output is 2,400 lines of webpack stack traces, dependency warnings, deprecation notices, and the actual error buried somewhere on line 1,872.

The naive harness pipes all 2,400 lines back into the model's context. The agent now has 2,400 lines of attention tax. Half the context window is gone. Subsequent tool calls have less room to work with. The next compaction will have to be more aggressive. Context rot accelerates.

The harness-engineering response is **tool-call offloading**: store the full output to the filesystem (or object store), put a short summary into context, let the model `cat` more on demand.

## The pattern, concretely

A wrapper around the tool execution that does three things:

1. Run the tool, capture full output.
2. Write full output to a tempfile (`/tmp/agent-tool-output-<id>.log`).
3. Return to the model: the first 5 lines + the last 5 lines + the file path.

In code shape (not for grading, just for illustration):

```python
def run_tool_with_offload(name, args):
    full_output = run_tool(name, args)
    if count_tokens(full_output) < 2000:
        return full_output                       # small output, pass through

    path = f"/tmp/agent-tool-{name}-{rand()}.log"
    write_file(path, full_output)
    head = "\n".join(full_output.split("\n")[:5])
    tail = "\n".join(full_output.split("\n")[-5:])
    return (
        f"[stored at {path}, {len(full_output.split(chr(10)))} lines, first 5 + last 5:]\n"
        f"{head}\n...\n{tail}\n"
        f"[use `cat`/`grep`/`sed` to read more]"
    )
```

The model reads "stored at /tmp/agent-tool-build-3892.log, 2,400 lines, here's the start and end." If it needs the actual error, it runs `grep -i error /tmp/agent-tool-build-3892.log` and gets back 30 lines — the relevant ones.

Net effect: instead of 2,400 lines into context, the model sees ~12 lines for the summary and ~30 lines for the targeted grep. Total: 42 lines vs 2,400. Same task, 60x less context spend.

## Where offloading is canonical

Three real implementations to know:

- **Claude Code's bash tool** — its post-processing logic does exactly this for long stdout. The leaked-source analysis (Hasan, Khan) confirms the pattern.
- **Cursor's terminal integration** — similar behavior on long-running commands.
- **HumanLayer's custom CLIs** — they wrote a Linear-specific CLI partly *because* MCP server outputs were too verbose; the custom CLI returns one-line summaries with `--id N` flags for fetching more.

The pattern recurs because it's the cleanest fix for a real problem.

## Tool outputs aren't the only thing to offload

Three other things production harnesses move out of context onto the filesystem:

- **Large file reads.** When the model asks to read a 1,500-line file, return the first 100 lines + the structure (function names, class names, line numbers). On demand, the model asks for a slice (`Read lines 800-900`).
- **Web fetch results.** A scraped page can be 30k tokens of HTML noise. Strip to main content, store the rest. Most browser-tool harnesses already do this.
- **Database query results.** A SELECT returning 500 rows doesn't belong in context. Store to disk, return first 5 + last 5 + count + schema.

In each case the principle is the same: **the filesystem is your context spillway.** Use it.

## What you give up

Two genuine costs of offloading:

- **Extra tool round-trips.** The model has to make a second tool call to read what it needs. That costs latency. The fix: make the offload summary good enough that a second call is rare.
- **The model has to know the offload exists.** If the harness silently truncates without telling the model "the rest is at /tmp/...", the model has no way to retrieve it. The summary line is load-bearing — it tells the model the data still exists.

Both costs are small compared to the cost of pollutting context. Offloading is one of those cheap wins that's nearly free if you implement it once.

## Where it doesn't help

Offloading shortens *tool output*. It doesn't help with the other two big context-bloat sources:

- **Long conversation history** — that's compaction (last step).
- **Bloated rule and tool surface at session start** — that's progressive disclosure (next step).

Three problems, three different mitigations. The drill at step 05 will make you match the right one to the right scenario.
