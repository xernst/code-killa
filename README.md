# promptdojo

> Codecademy teaches Python like it's 1995. Boot.dev gamifies the same curriculum. Both assume you want to be a software engineer.
>
> promptdojo is the school for people who use Cursor every day and need to know what it got wrong.

**Status**: building in public. Follow [@joshernst](https://twitter.com/joshernst) for daily progress.

This repo now ships in two halves of the same product:

1. **The interactive web app** — a 31-chapter Pyodide-in-the-browser, Codecademy-style step-by-step course at `localhost:3000`. Source lives at the root of this repo (Next.js, React 19, Tailwind 4, CodeMirror 6). This is the primary product surface.
2. **The 17-chapter book of foundations** — a long-form, Codecademy-rhythm Python primer as plain folders (`01-getting-started/` through `17-inheritance-and-dunders/`) covering the language-fluency floor. Currently the foundations only; the AI-builder chapters (LLM APIs, MCP, agents, evals, capstone, harness engineering) live in the web app.

Both share the same curriculum spine and the same point of view. Pick whichever surface you prefer; the wedge is identical.

---

## What this is

An open-source Python school for the AI-builder era. The curriculum inverts around the workflow you actually use: read code AI wrote, predict what it does, fix what it got wrong, write only what AI fluently can't.

Free forever. No accounts. No paywalls. No tracking. The web app runs 100% in your browser via Pyodide; the book is just folders of markdown and Python.

## Why this exists

Most "learn Python" platforms were designed for people becoming software engineers — data structures, algorithms, leetcode prep.

The audience here is different: a 29-year-old PM who uses Cursor every day, ships AI features, and wants to actually understand the 200 lines Claude just wrote. A 38-year-old marketing manager who wants to build internal AI tools at work. An indie founder who vibe-coded a SaaS and is now drowning in technical debt they can't read.

We skip what AI handles fluently. We double down on what AI gets wrong: hallucinated APIs, silent type bugs, off-by-one errors, traceback reading, environment setup, mutable default arguments, missing `await`s, stale stdlib usage. We teach the mental models you need to *direct* AI, not replace it.

---

## Two ways to use this repo

### A. The interactive web app (recommended)

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Five-question onboarding, then your first lesson. Every step runs live Python in your browser via Pyodide. Built on Next.js 16 + Pyodide-in-Web-Worker + CodeMirror 6 + localStorage. Zero backend. Vercel hobby tier hosts it forever.

The web curriculum lives in `content/python/` as YAML+Markdown — one folder per lesson, one file per step. Schema is documented in `lib/content/schema.ts`.

### B. The 17-chapter book

If you'd rather read the foundations chapters in your editor like a textbook, the 17 chapter folders are at the repo root (`01-getting-started/` through `17-inheritance-and-dunders/`):

```
NN-topic/
├── README.md          — the lesson narrative (read it first)
├── 01_lesson.py       — annotated runnable examples
├── exercise_1.py … exercise_5.py
├── solutions/         — peek only after trying
└── CHECKPOINT.md      — self-quiz
```

Run a file with the ▶ button in VS Code, or in a terminal:

```bash
brew install python@3.12 uv
python3 01-getting-started/01_lesson.py
```

Some later chapters require extra libraries (`httpx`, `rich`, `pytest`). Each chapter's README tells you what to install when you get there.

The web app is now the broader of the two surfaces — 31 chapters, covering everything from variables through harness engineering, LLM APIs, MCP, agent loops, evals, retrieval, and the capstone. The 17-chapter book is currently the foundations layer (variables through OOP) in long-form textbook style; the AI-builder material lives in the web app. Everything in the web app's `content/python/` is the canonical source for the interactive surface; the root chapter folders are the long-form companion for the language-fluency floor.

## Customize it — this is the magic

The course becomes genuinely great when you swap the stock examples for things from your actual life. 10 minutes of customization turns "another Python tutorial" into "a course *about me* that happens to teach Python." Drop the repo into Cursor / Cowork / Claude Code, paste in a "Running Cast" of your pets/team/project/dataset, and ask the AI to rewrite the examples while keeping every concept and exercise the same. See the legacy openclaw README for the full template.

## Philosophy: "vibe coding" doesn't mean skip the fundamentals

You're going to use AI to help you code. Great. But the AI will confidently hand you wrong code, especially about:

- Off-by-one errors in slicing
- Mutable default arguments (`def f(x=[])`)
- Missing `await` in async code
- Using stale APIs (`os.path` instead of `pathlib`, `urllib` instead of `httpx`, `%` instead of f-strings)
- Silently swallowing exceptions (`except: pass`)
- Forgetting type hints or returning the wrong type

This course makes you the person who catches those. The goal isn't memorizing syntax — it's developing the **judgment** to read, evaluate, and edit what the AI gives back.

## Chapter map (the 17-chapter book of foundations)

This is the long-form textbook companion — currently the language-fluency floor only (variables → OOP). The AI-builder material (LLM APIs, MCP, agents, evals, harness engineering) is in the web app, not the book.

| # | Chapter | You'll be able to |
|---|---------|-------------------|
| 01 | Getting Started | Run Python, use the REPL, print and comment, read tracebacks |
| 02 | Variables & Types | Store data; know `int`, `float`, `str`, `bool`, `None` |
| 03 | Strings | Format with f-strings; slice, split, join, transform text |
| 04 | Numbers & Math | Do arithmetic; use `math`; know float imprecision and `Decimal` |
| 05 | Input & Conversion | Take user input; cast types safely; understand truthiness |
| 06 | Control Flow | Branch with `if`/`elif`/`else`; pattern-match with `match`/`case` |
| 07 | Loops | Iterate with `for`, `while`, `range`, `enumerate`, `zip`, comprehensions |
| 08 | Lists | Mutability, sorting, slicing, the aliasing trap |
| 09 | Tuples & Sets | Immutability; set algebra; when to use each |
| 10 | Dictionaries | Keys, values, items, merging, counting, grouping |
| 11 | Functions | Define, call, return, defaults, docstrings, guard clauses |
| 12 | Scope, `*args`, Lambdas | LEGB, closures, unpacking at call sites |
| 13 | Modules & Packages | `import`, `__init__.py`, `__main__` guard |
| 14 | Files & `pathlib` | Modern file I/O, JSON, CSV, walking a tree |
| 15 | Error Handling | `try`/`except`, custom exceptions, EAFP style |
| 16 | Classes & OOP | Objects, `__init__`, instance vs class attrs, `@property` |
| 17 | Inheritance & Dunders | `super()`, `__repr__`, `__eq__`, container protocol |

## Web app curriculum (31 chapters)

**31 chapters · 95 lessons · 800+ runnable step-typed micro-screens.** Chapter ordering and lesson counts are generated from `content/python/*/chapter.yaml`; this table is the canonical surface.

| # | Chapter | Lessons | Focus |
|---|---|---|---|
| 00 | before you build | 4 | what an LLM is, where you fit (the re-education on-ramp; zero Python) |
| 01 | variables | 3 | naming + rebind, the four types on sight, print/repr/f-strings |
| 02 | functions | 3 | def/return, args+defaults, the most-hallucinated bug AI ships |
| 03 | lists & dicts | 3 | the bones of every API response, comprehensions, nested data |
| 04 | loops | 3 | predict-the-output, while/break, enumerate+zip |
| 05 | conditionals | 2 | truthiness traps, elif + match-case, where AI silently bugs |
| 06 | tracebacks | 3 | reading the stack, the five error classes, debug-by-print |
| 07 | mutation & state | 2 | why-it-breaks, copy vs reference |
| 08 | modules & imports | 2 | venv pain, from-imports + aliases |
| 09 | error handling | 3 | try/except, catching specifics, raising + custom |
| 10 | files & I/O | 3 | read/write, pathlib, csv + JSONL |
| 11 | classes basics | 3 | reading AI's classes, instance vs class, dataclasses |
| 12 | HTTP & APIs | 3 | making the call, status codes, parsing nested responses |
| **13** | **LLM APIs** | **3** | **messages, roles, response shape (Claude + OpenAI SDK), the model picker** |
| **14** | **structured output** | **2** | **Pydantic schemas, JSON validation, the missing-field bug** |
| **15** | **MCP** | **3** | **Model Context Protocol — servers, tools, when MCP > custom** |
| **16** | **agent loops** | **5** | **stop_reason, tool_use, the request → tool → respond cycle** |
| **17** | **git + GitHub** | **2** | **the three states, gh CLI, the AI-builder git workflow** |
| **18** | **secrets** | **1** | **.env, os.getenv, .gitignore, leaked-key recovery** |
| **19** | **prompting** | **4** | **structuring prompts that work for Cursor + Claude Code** |
| **20** | **agent traces** | **2** | **reading what the agent left behind — turns, tool calls, stop reasons** |
| **21** | **evals** | **3** | **assertions on AI output, not vibes — pytest-style eval suites** |
| **22** | **context & retrieval** | **4** | **feeding the model real data — RAG, long-context, fine-tune (a practitioner's heuristic)** |
| **23** | **production tradeoffs** | **3** | **cost, latency, quality — picking the right model per call** |
| **24** | **debugging output** | **3** | **when the model returns confidently wrong stuff and you have to find it** |
| **25** | **capstone** | **6** | **ship the system — one working tool that uses everything above** |
| **26** | **agent harnesses** | **3** | **the layer between you and the raw API** |
| **27** | **AI image generation** | **3** | **from prompt to production asset** |
| **28** | **AI video generation** | **3** | **Sora, Veo, Higgsfield, and the second wave** |
| **29** | **programmatic design** | **3** | **code-driven video and the new design pipeline** |
| **30** | **harness engineering** | **5** | **the discipline behind the model — the moat the rest of the AI-education market doesn't teach** |

Chapters 13–30 are the AI-first-builder wedge — the part of the course no other Python school is teaching in 2026. Lessons average 8–10 typed steps in the canonical sequence: `read → mc → read → predict → fill → fix → fix → write → checkpoint` (lesson length varies by topic).

## Stack

Web: Next.js 16 · React 19 · Tailwind 4 · Pyodide-in-Web-Worker · CodeMirror 6 · localStorage. Zero backend.
Book: Python 3.12+ · `uv` for envs · `httpx`, `pytest`, `anthropic`, `pandas` for the later chapters.

## Contributing

This is in active build. If you've used AI to write Python and gotten burned by something specific — hallucinated API, silent type bug, environment-setup hell — open an issue with the example. That's the curriculum.

For the book chapters: typo / unclear / dead link → PR. New chapter or structural change → issue first.

The core invariants I'm protecting:

- 17 chapters in the book (foundations only); 31 chapters in the web app.
- Each book chapter: narrative lesson → lesson file → 5 exercises → 5 solutions → checkpoint.
- Each web lesson: 8–10 typed steps, ~5–8 minutes, ending in a checkpoint.
- Modern Python (3.12+), type hints, `pathlib`, `httpx`, f-strings.
- Vibe-Coding Corner in every book chapter.

## License

MIT. Do whatever you want with it. If you customize and share, tag me — I'd love to see where it goes.

## Author

Built by [Josh Ernst](https://github.com/xernst). If this saved you time, a ⭐ means a lot.
More on AI, Python, and vibe-coding in 2026 on Twitter: [@joshernst](https://twitter.com/joshernst).
