# Typography

A two-voice system. Editorial serif for the things that matter; monospace for code, labels, and the wordmark.

## Pairing

| Role | Family | Why |
| --- | --- | --- |
| **Display & body voice** | **Fraunces** (variable serif) | Editorial sharpness, italic personality, soft optical-size axis pulls toward extreme display contrast at large sizes. Says "we have an opinion." |
| **Code, labels, wordmark** | **JetBrains Mono** (monospace) | Honest dev tool. Mechanical precision. Says "this is real code." |

**Why these two:** the brand thesis is *editorial judgment + technical precision*. The serif takes the position; the mono shows the work. Two sans-serifs would give you neither — you'd just have hierarchy with nothing to say.

**Both are loaded in the live app** via `next/font/google`:

```ts
import { Fraunces, JetBrains_Mono } from "next/font/google";
const fraunces  = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "WONK"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
```

## Scale

Sized for video and web. Always pick the larger end if undecided.

| Role | Family | Weight | Size | Tracking |
| --- | --- | --- | --- | --- |
| Trailer hero | Fraunces (opsz 144) | 900 | 132–240 px | -0.045em |
| Page hero | Fraunces (opsz 144) | 900 | 84–110 px | -0.04em |
| Section heading | Fraunces | 700 | 36–56 px | -0.025em |
| Body | Fraunces | 400 | 18–22 px | -0.005em |
| Caption / supporting | Fraunces | 400 italic | 16–18 px | 0 |
| Eyebrow / label | JetBrains Mono | 800 | 14–24 px | +0.4em (uppercase) |
| Code (page) | JetBrains Mono | 400 | 16–18 px | 0 |
| Code (trailer) | JetBrains Mono | 400 | 22–28 px | 0 |
| Wordmark | JetBrains Mono | 800 | depends | -0.015em |

## Variable axes (Fraunces)

Fraunces has multiple variable axes. The brand uses three:

| Axis | Default | When to push |
| --- | --- | --- |
| `wght` (weight) | 900 for headlines, 400 for body | Push to 900 for impact, drop to 300 for ambient ghost text |
| `opsz` (optical size) | 144 for headlines, 14 for body | Always pin to 144 at hero sizes — it sharpens serifs dramatically |
| `SOFT` (softness) | 0 | Push to 50 for friendlier marketing copy; keep at 0 for dev / technical contexts |
| `WONK` (italic personality) | 0 | Don't touch — the italic axis already produces the wonky character |

Example for a hero headline:
```css
font-family: 'Fraunces', serif;
font-weight: 900;
font-variation-settings: 'opsz' 144, 'SOFT' 0;
letter-spacing: -0.04em;
line-height: 0.92;
```

## OpenType features

Always on for these contexts:

```css
.num, .stat-value, .timer { font-variant-numeric: tabular-nums; }
code, .code              { font-variant-ligatures: none; }
```

**`tabular-nums`** is mandatory anywhere digits stack — counters, $0, the agent trace step indices. Without it, columns visibly shift.
**`ligatures: none`** in code prevents JetBrains Mono's `=>` / `>=` ligatures from confusing learners about what's actually in the source.

## Light-on-dark adjustments

Light text on dark backgrounds reads heavier than dark-on-light. Two compensations:

1. **Body weight:** use 350 or 400 on dark, never 500+. Don't reach for "boldness" by adding weight — change size or color instead.
2. **Letter spacing:** add `letter-spacing: 0.01em` to display sizes only. Counters the optical halo that makes light letters appear cramped.

## Banned for this brand

- **Inter, Roboto, Open Sans, Lato, Poppins, Outfit, Sora.** Any of these → it's not promptdojo. The live app currently has Inter loaded as a third font (legacy from pyloft (the previous brand)) — when V1 rename ships, drop Inter from `app/layout.tsx`.
- **Two sans-serifs paired.** Always cross categories: serif + mono.
- **Centering everything.** Lead the eye left in scenes 1–4; reserve centered layout for the closing PRICE moment.
- **Title Case Headlines.** All headlines are sentence-case or all-lowercase. Title case smells corporate.

## Examples

**Right:**
> ❯ **ai writes this. *it's wrong.***
> Fraunces 900 + Fraunces 900 italic — single family, weight contrast and italic switch carry the punch.

**Wrong:**
> AI Writes This. **It's Wrong.**
> Title case + non-italic emphasis — same words, completely different tone.
