# Logo System

Two assets, one system. Don't pick a third.

## The mark

An imperfect ensō (zen brush circle) with `>_` inside. The ensō says "school"; the `>_` says "terminal." The contrast is the brand.

`logos/mark.svg` — color, dark canvas — primary.
`logos/mark-on-light.svg` — color, light canvas — for light backgrounds.
`logos/mark-mono.svg` — single-color, uses `currentColor` — for any tint or knockout.

**Use the mark for:** favicon, app icon, social avatar, sticker, T-shirt, watermark, anywhere ≤ 64 px.

## The wordmark

`❯ promptdojo _` — JetBrains Mono ExtraBold (800), ember caret, ember cursor underscore on the right.

`logos/wordmark.svg` — color, dark canvas — primary.
`logos/wordmark-on-light.svg` — color, light canvas.
`logos/wordmark-mono.svg` — single-color, `currentColor`.

**Use the wordmark for:** site header, README banner, OG art, slide titles, anywhere there's room for the full word.

## The lockup

`logos/lockup-vertical.svg` — mark stacked above the wordmark with the tagline below.

**Use the lockup for:** keynote opening slide, conference signage, the only place where mark + wordmark + tagline coexist. **Don't use it on the web** — it's too tall.

## Pairing rules

1. **Pick one mark, pick the wordmark, never use both at the same scale on the same surface.** Mark is the corner watermark; wordmark is the headline.
2. **Mark goes solo at ≤ 32 px.** Below that, the wordmark loses legibility — the mark holds up because the geometry is simple.
3. **Wordmark goes solo at ≥ 240 px wide.** Above that, the mark added next to it just makes both feel cluttered.
4. **The lockup is for moments, not surfaces.** A keynote opener, a final pitch slide, a print poster — and that's it.

## Clear space

Reserve a margin equal to **the height of the `o` in `promptdojo`** around any logo. No exception. Don't crop, don't tighten.

## Minimum sizes

| Asset | Digital min | Print min |
| --- | --- | --- |
| Mark | 16 px | 8 mm |
| Wordmark | 120 px wide | 30 mm wide |
| Lockup | 320 px wide | 80 mm wide |

Below these sizes the geometry collapses — characters merge, the ensō gap disappears, the cursor becomes invisible.

## What NOT to do

- **Don't recolor the mark in arbitrary hues.** Ember, white, ink, or `currentColor` only.
- **Don't pair the wordmark with a different typeface.** The wordmark IS JetBrains Mono ExtraBold. If you set it in Inter or Roboto, it's a different brand.
- **Don't add a stroke, shadow, glow, or gradient to the mark.** It's flat, ember + ink, by design.
- **Don't tilt or rotate.** The ensō is at its native angle on purpose. Tilting it makes it a moon.
- **Don't add the tagline next to the wordmark.** The tagline only appears in the lockup.
- **Don't crowd it.** See clear-space rule above.

## Asset matrix

| File | Format | Size / Aspect | Best for |
| --- | --- | --- | --- |
| `mark.svg` | SVG | 256 × 256 | All web/digital, scales infinitely |
| `mark-on-light.svg` | SVG | 256 × 256 | Light backgrounds |
| `mark-mono.svg` | SVG | 256 × 256 | Any custom tint via `color:` |
| `wordmark.svg` | SVG | 720 × 144 (5:1) | Site headers, READMEs |
| `wordmark-on-light.svg` | SVG | 720 × 144 (5:1) | Light contexts |
| `wordmark-mono.svg` | SVG | 720 × 144 (5:1) | Any custom tint |
| `lockup-vertical.svg` | SVG | 480 × 540 | Slide openers, posters |
| `exports/mark-{16,32,48,64,128,192,256,512,1024}.png` | PNG | square | Favicon set, app stores |
| `exports/mark-on-light-{256,512,1024}.png` | PNG | square | Light-bg raster needs |
| `exports/apple-touch-icon.png` | PNG | 180 × 180 | iOS home-screen |

Wordmark/lockup PNG raster: ship the SVG. Modern web rendering (HTML, READMEs, slide tools, social) accepts SVG natively. If a tool genuinely refuses SVG, open the SVG in a browser, screenshot it at 2× the needed size, and crop.
