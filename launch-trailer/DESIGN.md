# Promptdojo — Launch Trailer Design

## Style Prompt

A 28-second launch trailer for a school built for the AI-coding era. Terminal-room confidence, dojo-mat geometry, no glossy SaaS energy. The aesthetic is a punk-rock dev manual: ink-black background, one ember accent, sharp serif headlines crashing into monospace code. The viewer should feel like they walked into a lit basement at 2 AM where someone is debugging a model. All-lowercase swagger. No emoji, no gradient text, no purple glow.

## Colors

| Hex | Role |
| --- | --- |
| `#0E0F12` | Background — never pure black |
| `#18181b` | Card / code-block fill |
| `#F2683C` | Ember — the only chromatic accent (caret, highlights, key word) |
| `#f4f4f5` | Headline white — never pure white |
| `#a1a1aa` | Secondary / supporting text |
| `#ef4444` | Error highlight — used once, in the WEDGE scene |
| `#86efac` | Success highlight — used once, in the IDE scene output |

## Typography

Cross-category pairing — serif display + monospace. Never two sans.

- **Display:** `Fraunces` — variable serif, weights 700–900, opsz axis pulled toward `144` for extreme display sharpness. Used for every headline.
- **Mono:** `Geist Mono` — modern terminal mono, weights 400 / 800. Used for code, eyebrow labels, the wordmark, and the closing footer.

Tracking: `-0.04em` on display sizes (60px+), `0` on mono.

## What NOT to Do

- **No two sans-serifs.** Don't pair Fraunces with Inter / Geist Sans / anything similar — the contrast lives in serif-vs-mono.
- **No gradient text.** Ember is solid `#F2683C`. No `background-clip: text`.
- **No center-stacked everything.** Lead the eye left in scenes 1–4, only the closing PRICE card is centered.
- **No exit animations on individual elements** before scene 5. Crossfade between scenes IS the exit; do not fade titles or subtitles out mid-scene.
- **No purple, cyan, or neon.** Ember is the only colored accent. Red and green are reserved for one moment each (error / pass).
- **No `Math.random()` or `Date.now()`.** Composition must render deterministically.
