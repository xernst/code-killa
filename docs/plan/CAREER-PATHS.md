# Career Paths — Chapter Mapping (Task 6)

**Author:** Content & Curriculum agent team
**Date:** 2026-05-15
**Status:** DRAFT v1 — needs Josh's approval before Task 5 (path quizzes) is built on it.

---

## Why this is a draft, not an audit

Task 6 says "the current path mapping is in the master plan." It is not. `MASTER-PLAN.md`
predates the ten-path model entirely. This file is the mapping built from scratch, against
the real 31-chapter inventory plus the 4 new chapters from Tasks 1 and 2. Tasks 3, 5, and 6
all depend on it, so it needs a sign-off pass.

## Chapter inventory used

The 31 live chapters (`content/python/00-before-you-build` … `30-harness-engineering`) plus
4 new chapters:

- **`terminal`** — Intro to Terminal (Task 1)
- **`claude-cli`** — Intro to Claude CLI (Task 1)
- **`codex-cli`** — Intro to OpenAI Codex CLI (Task 1)
- **`team-skills`** — Anthropic Team Skills (Task 2)

New chapters get their own slugs. Final chapter *numbers* are the Platform team's call —
renumbering existing chapters would break URLs and `concept` IDs. Path **order** below is
logical sequence, independent of chapter number.

## Design rules used

- **Every path starts with `00-before-you-build`.** It is identity repair plus the LLM
  mental model the whole course assumes. No exceptions.
- **Every path includes the LLM-API core** (`13-llm-apis`, `14-structured-output`). That is
  the actual product of the course; a path that skips it is not a path.
- **Foundations depth scales with how hands-on the role is.** Developers and Operations
  get all of `01–07`. Designers and HR get a lighter foundations slice.
- **`06-tracebacks` is in every path that touches code.** Reading an error is the single
  highest-transfer skill; cutting it to save time is a false economy.
- **Skip what the role will not do.** A Designer does not need `git-and-github` or `mcp`.
  A Lawyer does not need `ai-video-generation`.

---

## The ten paths

### 1. Developer
**Chapters (35):** `00` → `terminal` → `claude-cli` → `codex-cli` → `01`–`07` → `08`–`12` →
`17` → `18` → `13`–`16` → `19` → `20` → `21` → `22` → `24` → `23` → `25` → `26`–`30`
**Estimated time:** 20–24 hours
**Exit outcome:** Reads, debugs, and directs any AI-generated Python. Ships and maintains
production agent harnesses. Completes the capstone CLI agent.
**Notes:** The full course. The 3 CLI chapters block this path — that is why Task 1 is first.

### 2. Marketer
**Chapters (13):** `00` → `01`–`05` → `06` → `12` → `13` → `14` → `19` → `21` → `27` → `28` → `29`
**Estimated time:** 10–12 hours
**Exit outcome:** Builds AI content pipelines, generates campaign creative at scale, QAs
model output before it ships.
**Skips:** OOP (`11`), modules (`08`), git (`17`), mutation (`07`), MCP (`15`), agent loops
(`16`), capstone (`25`), harness engineering (`30`).

### 3. Designer
**Chapters (11):** `00` → `01`–`04` → `06` → `12` → `13` → `14` → `19` → `27` → `28` → `29`
**Estimated time:** 9–11 hours
**Exit outcome:** Programmatic design workflows, batch asset generation, wires generation
into real pipelines instead of clicking through a UI.
**Skips:** loops-heavy and state-heavy chapters beyond the minimum; all shipping-discipline
chapters except prompting.

### 4. Customer Service
**Chapters (15):** `00` → `01`–`06` → `09` → `12` → `13` → `14` → `16` → `15` → `19` → `21` → `24`
**Estimated time:** 12–14 hours
**Exit outcome:** Builds and monitors support agents, catches bad AI responses before
customers do, routes and structures tickets with code.
**Notes:** `16-agent-loops` and `15-mcp` are the core — a support agent is an agent loop.
`24-debugging-output` matters because a wrong support answer is a customer-facing failure.

### 5. Copywriter
**Chapters (12):** `00` → `01`–`05` → `06` → `12` → `13` → `14` → `19` → `22` → `21` → `24`
**Estimated time:** 10–12 hours
**Exit outcome:** AI writing pipelines, brand-voice control through prompting and retrieval,
QA on generated copy.
**Notes:** `22-context-and-retrieval` is in because brand voice and style guides are a
retrieval problem.

### 6. Data Analyst
**Chapters (16):** `00` → `01`–`07` → `08` → `09` → `10` → `12` → `13` → `14` → `22` → `21`
**Estimated time:** 13–15 hours
**Exit outcome:** Builds data pipelines, AI-assisted analysis, structured extraction from
messy sources.
**Notes:** `10-files-and-io` and `14-structured-output` are the spine — getting clean data
out of dirty inputs.

### 7. Project Manager
**Chapters (14):** `00` → `terminal` → `01`–`06` → `12` → `13` → `14` → `19` → `20` → `21` → `24` → `23` → `team-skills`
**Estimated time:** 12–14 hours
**Exit outcome:** Directs AI builds, reviews and signs off on AI output, ships small
internal tools, runs evals, knows when a build is production-ready.
**Notes:** This is the original "Maya" ICP. Heavy on read/direct/verify (`20-agent-traces`,
`21-evals`, `23-production-tradeoffs`), lighter on hand-authoring.

### 8. HR Specialist
**Chapters (11):** `00` → `01`–`04` → `06` → `12` → `13` → `14` → `19` → `18` → `team-skills` → `21`
**Estimated time:** 9–11 hours
**Exit outcome:** Deploys and governs team skills, sets AI access policy, evaluates AI
output quality for hiring and people workflows.
**Notes:** `team-skills` is the keystone chapter for this path. `18-secrets-and-env` is in
for the governance/access-control angle, not the engineering angle.

### 9. Operations
**Chapters (18):** `00` → `terminal` → `claude-cli` → `01`–`07` → `08` → `09` → `10` → `12` → `13` → `14` → `15` → `16` → `26`
**Estimated time:** 16–18 hours
**Exit outcome:** Builds department automations, wires AI into ops workflows, maintains
agent harnesses.
**Notes:** Second-most technical path after Developer. `15-mcp` and `16-agent-loops` plus
`26-agent-harnesses` are the automation core.

### 10. Lawyer
**Chapters (15):** `00` → `01`–`05` → `06` → `10` → `12` → `13` → `14` → `19` → `22` → `21` → `24` → `18` → `team-skills`
**Estimated time:** 13–15 hours
**Exit outcome:** Builds doc-review and research tools, verifies AI output rigorously,
governs AI access for a practice.
**Notes:** `22-context-and-retrieval` and `24-debugging-output` are critical — a
hallucinated citation in a legal context is a malpractice risk, not a bug. `team-skills`
covers the firm-governance angle.

---

## Gaps flagged for Josh

1. **Non-developer paths have no capstone.** `25-capstone` is a CLI agent — developer-shaped.
   The other nine paths end on a regular chapter, not a "ship something real" moment. Each
   path would land better with a short role-specific capstone (Marketer ships a campaign
   asset pipeline; Lawyer ships a doc-review tool). **Recommend: add lightweight per-path
   capstones in a later phase.** Not blocking launch.

2. **Customer Service leans entirely on `19-prompting` for conversation/tone design.** A
   dedicated "designing agent conversations" chapter would strengthen this path. Flag for
   future, not launch.

3. **The 3 CLI chapters appear in only 3 paths** (Developer, PM, Operations). They are
   genuinely optional for Designer/Marketer/Copywriter, who work in hosted tools. Confirm
   that is intended — if the thesis is "everyone should be comfortable in a terminal,"
   `terminal` arguably belongs in all ten paths as a short on-ramp.

4. **`17-git-and-github` is Developer-only.** Operations and Data Analyst arguably need
   version control too. Held it out to keep their paths shorter; reconsider if these roles
   are expected to collaborate on shared codebases.

## What unblocks once this is approved

- **Task 5** — ten path quizzes can be written, each testing the 3–5 most critical concepts
  in that path's chapter list.
- **Task 3** — A/B routing knows which chapters each path includes, so the placement survey
  can skip-ahead correctly.
- **Task 6** — this *is* Task 6; approval closes it.
