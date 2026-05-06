# Promptdojo — Brand Spec

> A school for builders in the AI-coding era.
> AI writes the code. You make sure it works.

---

## Voice

| Do | Don't |
| --- | --- |
| Confident, sharp, no-hedge | Apologetic, "as an AI" energy |
| Builder-class slang ("ship it", "the wedge") | Coursera-isms ("learners", "modules") |
| All-lowercase headlines for swagger | Title case marketing copy |
| Direct call-outs ("ai writes this. it's wrong.") | Soft-sell, fear-of-pushback |
| In-joke for devs (`>_`, `__main__`) | Stock-photo metaphors |

Tagline drafts (pick one when you're ready):
- *prompt the ai. ship the code.*
- *vibe-coders graduate here.*
- *the school for builders in the ai era.*
- *welcome to the dojo.*

---

## Colors

Lifted from the existing OG art so V1 keeps visual continuity. Don't add new colors before V2.

| Token | Hex | Use |
| --- | --- | --- |
| `--ink-950` | `#14140f` | Primary background |
| `--ink-900` | `#18181b` | Card / panel background |
| `--ink-800` | `#27272a` | Borders, dividers |
| `--ink-700` | `#3f3f46` | Muted UI |
| `--ink-400` | `#a1a1aa` | Secondary text |
| `--ink-300` | `#d4d4d8` | Body text on dark |
| `--ink-100` | `#f4f4f5` | Headlines on dark |
| `--ember` | `#2aa06a` | **Primary accent** — caret, links, CTA |
| `--ember-dim` | `#1f7a51` | Hover / active state |
| `--ok` | `#86efac` | Test pass, success |
| `--err` | `#ef4444` | Test fail, error highlight |

**Light mode** is not in scope for V1. Promptdojo is a dark-first brand — terminal-room energy.

---

## Typography

System stacks only. No web fonts in V1 (kills FOUT, kills page weight, no licensing surface).

```css
--font-display: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-mono:    ui-monospace, "SF Mono", Menlo, "Cascadia Mono", Consolas, monospace;
```

| Role | Font | Sizes |
| --- | --- | --- |
| Hero / chapter titles | Display, weight 800, letter-spacing -2 to -10 (tight) | 64–240 px |
| Section headings | Display, weight 700, letter-spacing -0.5 | 32–48 px |
| Body | Display, weight 400 | 16–18 px |
| Code / IDE blocks | Mono, weight 400 | 14–28 px |
| Eyebrow labels | Display, weight 600, **uppercase**, letter-spacing 4–14 | 12–32 px |

V2 upgrade path: load `Geist Sans` + `Geist Mono` from Vercel CDN if a custom voice is needed.

---

## Logo system

Six concept directions live in `logos/`. Open `preview.html` in a browser to compare on dark / light / ember backgrounds.

| File | Concept | Best for |
| --- | --- | --- |
| `caret-square.svg` | Terminal `❯` framed as a dojo doorway | Favicon, app icon, OG corner |
| `enso-prompt.svg` | Imperfect zen circle around `>_` | Hero mark, social avatar |
| `stacked-pd.svg` | Geometric `p` + `d` monogram | Sticker, T-shirt, app icon |
| `belt-stripes.svg` | Three-bar martial-arts rank | Course-progress motif, footer |
| `tatami-grid.svg` | 2×2 floor mat, one tile ember | Pattern, repeating background |
| `wordmark.svg` | `❯ promptdojo _` typographic lockup | Site header, README, slides |

**Pairing rules:**
- Pick **one** mark and **one** wordmark. Don't mix three.
- Mark goes solo at ≤ 32 px. Below that the wordmark loses legibility.
- Always anchor to ember as the only chromatic accent. Everything else is ink.
- Minimum clear space around any logo = the height of the `o` glyph in `promptdojo`.

---

## Motion

Reserved for V2. When motion is added (launch trailer, lesson intros), the rules are:
- Cuts on the beat, never mid-thought.
- One motion idea per shot. Camera move OR element move, not both.
- Ember caret blink at 1.0 Hz exactly — the heartbeat of the brand.

See `node_modules/remotion-best-practices` (skill) when shipping motion work.

---

## What this kit *isn't*

- Not a full design system — no component library, no spacing scale, no UI tokens. Tailwind 4 in `app/globals.css` is already the source of truth for that.
- Not motion / illustration / photography guidance — V2 problem.
- Not a name justification doc — that lives in your head and on X.
