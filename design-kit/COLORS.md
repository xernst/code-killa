# Color System

One accent. One canvas. Tinted neutrals. Two semantic colors used once each.

## Tokens

| Token | Hex | RGB | Role |
| --- | --- | --- | --- |
| `--ink-950` | `#14140f` | `14 15 18` | Page background — never pure black (`#000`) |
| `--ink-900` | `#18181b` | `24 24 27` | Card / panel fill |
| `--ink-800` | `#27272a` | `39 39 42` | Borders, dividers |
| `--ink-700` | `#3f3f46` | `63 63 70` | Decorative only — too dim for body text |
| `--ink-500` | `#71717a` | `113 113 122` | Tertiary UI labels |
| `--ink-400` | `#a1a1aa` | `161 161 170` | Secondary text — meets WCAG AA on `--ink-950` |
| `--ink-300` | `#d4d4d8` | `212 212 216` | Body text on dark |
| `--ink-100` | `#f4f4f5` | `244 244 245` | Headlines on dark — never pure white (`#fff`) |
| `--ember` | `#2aa06a` | `242 104 60` | **Primary accent** — caret, links, CTA, single-word emphasis |
| `--ember-dim` | `#1f7a51` | `227 76 28` | Hover / active state for ember |
| `--ok` | `#86efac` | `134 239 172` | Success / pass — used **once**, in pyodide output |
| `--err` | `#ef4444` | `239 68 68` | Error / fail — used **once**, in WEDGE bug highlight |

## Rules

1. **Ember is the only chromatic accent.** No purple, cyan, neon, or rainbow gradients. If a third color is tempting, the design is broken.
2. **`--ok` and `--err` are reserved.** They appear once each in the canonical narrative — green in the pyodide success line, red in the mutable-default-argument bug. Don't repurpose them as decorative.
3. **No pure black, no pure white.** `--ink-950` and `--ink-100` look white/black to the eye but encode warmth — both have a barely-visible cool tint that prevents the dead-zone feel of `#000`/`#fff` on screens.
4. **Tint neutrals toward ember in motion.** When the cursor blinks, the surrounding ink momentarily picks up 1–2% ember warmth — the radial bg-glow handles this automatically.
5. **Light-mode is not in scope for V1.** The brand is dark-first. If V2 ships a light variant, this doc gets a Light section; until then, don't ship light surfaces.

## Contrast (WCAG AA)

All foreground/background combinations used in the kit clear AA at 14 px and AAA at 18 px+:

| Foreground | Background | Ratio | AA / AAA |
| --- | --- | --- | --- |
| `--ink-100` (#f4f4f5) | `--ink-950` (#14140f) | 16.4:1 | AAA ✓ |
| `--ink-300` (#d4d4d8) | `--ink-950` | 12.4:1 | AAA ✓ |
| `--ink-400` (#a1a1aa) | `--ink-950` | 7.4:1 | AAA ✓ |
| `--ember` (#2aa06a) | `--ink-950` | 5.8:1 | AA ✓ |
| `--ember` (#2aa06a) | `--ink-900` (#18181b) | 5.4:1 | AA ✓ |
| `--ink-100` | `--ember` | 2.8:1 | ⚠ large text only (≥ 24 px or ≥ 19 px bold) |
| `--ink-950` | `--ember` | 5.9:1 | AA ✓ — preferred for ember backgrounds |

**Rule:** white text on ember is allowed only at 24 px+ or 19 px+ bold (e.g., the `RUN` button). Use ink-950 on ember for all body and small UI.

## Pairing chart

| Surface | Background | Body text | Accent |
| --- | --- | --- | --- |
| Page (default) | `--ink-950` | `--ink-300` | `--ember` |
| Card / code block | `--ink-900` | `--ink-300` | `--ember` |
| CTA button | `--ember` | `--ink-950` | — |
| Output success block | `rgba(134,239,172,0.04)` over `--ink-900` | `--ink-100` | `--ok` (label only) |
| Error highlight | `rgba(239,68,68,0.14)` over `--ink-900` | `--err` | — |

## Don'ts

- Don't invent intermediate ink shades — use the steps above.
- Don't tint ember with red or yellow shifts mid-flow. Ember is a single hex.
- Don't use `--ink-700` as text color on `--ink-950`. Ratio is 1.7:1 — fails everything. It's a decorative-only token.
