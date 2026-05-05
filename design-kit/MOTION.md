# Motion

How the brand moves. Quiet ambient pulse, sharp content entrances, no exit drama until the closing frame.

## The heartbeat

The ember cursor blinks at **1.0 Hz** — once per second, on the second. This is the brand's heartbeat. It appears in the wordmark, the trailer's HOOK scene, and any "alive" UI surface (e.g., the `> ` prompt in the in-browser IDE).

```css
@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.cursor { animation: blink 1s steps(1) infinite; }
```

`steps(1)` is intentional — a hard on/off, never a fade. Fades feel like sleep.

## Entrance vocabulary

Three patterns, picked deliberately per element. Mix at least three within any scene.

| Pattern | Use for | GSAP signature |
| --- | --- | --- |
| **Slam** | Hero headlines, the punchline | `gsap.from(el, { y: 60, opacity: 0, duration: 0.6, ease: "expo.out" })` |
| **Drift** | Tagline, secondary copy, eyebrow labels | `gsap.from(el, { y: 24, opacity: 0, duration: 0.5, ease: "power2.out" })` |
| **Stagger** | Code blocks, agent trace lines, step lists | `gsap.from(els, { x: 24, opacity: 0, duration: 0.35, ease: "power2.out", stagger: 0.08 })` |
| **Pop** | Buttons, badges, single highlight elements | `gsap.from(el, { scale: 0.6, opacity: 0, duration: 0.5, ease: "back.out(1.6)" })` |

**Always use `gsap.from()` for entrances.** The CSS position is the ground truth; the tween describes the journey to get there.

## Easing palette

Match ease to content emotion:

| Ease | Feel | Use for |
| --- | --- | --- |
| `expo.out` | Sharp arrival, soft tail | Headlines, hero reveals |
| `power3.out` | Confident, linear-leaning | Eyebrows, supporting type |
| `power2.out` | Default, neutral | Body copy, list items |
| `back.out(1.6)` | Slight overshoot | Badges, buttons, "$0" reveal |
| `sine.inOut` | Breathing, ambient | Background glow, idle decoratives |
| `steps(1)` | Hard on/off | Cursor blink, glitch frames |

**Don't use:** `bounce`, `elastic`, `power4.in` for entrances (lurchy), or `linear` for anything except infinite ambient loops.

## Scene-transition rule

In multi-scene compositions (trailer, intro reels, slideshows):

1. **Every scene transition uses the same primary transition** for 60–70% of cuts. The launch trailer uses a 0.4s crossfade with `power2.inOut`. Don't introduce a different transition every scene.
2. **No exit animations on individual elements** before the final scene. The transition IS the exit. If you fade a title out before the scene change, you've broken the rule.
3. **Final scene may exit.** The closing PRICE scene fades the bg-glow, corner mark, and content to black. Only the last scene gets this license.

## Timing budgets

| Surface | Budget | Why |
| --- | --- | --- |
| Trailer scene | 5–6 s | Fixed reading time: 3 s on screen = readable in 2. |
| Page hero entrance | < 1.2 s total | Don't make first paint wait on choreography. |
| Hover state | 120–180 ms | Anything slower feels laggy. |
| Cursor blink | 1.0 Hz exactly | The brand heartbeat. Don't change it. |
| Background ambient | 13–28 s | Slow enough to be invisible. Fast enough to feel alive. |

## What doesn't move

- The mark and wordmark themselves. They're shapes, not animations. The cursor underscore inside them blinks; the rest stays still.
- Body copy after entrance. Don't loop bouncing letters or shimmer effects.
- Code blocks. They appear via stagger and then sit. No syntax-highlight crawls, no auto-scroll.

## Determinism

No `Math.random()`, no `Date.now()`, no `setTimeout` based animations. Every motion must render identically on every replay. If a stochastic effect is needed, use a seeded PRNG (mulberry32) with the seed committed in source.

## Handoff

The launch trailer at `launch-trailer/index.html` is the canonical motion reference until V2. When in doubt about timing or eases, scrub through the trailer and copy the pattern.
