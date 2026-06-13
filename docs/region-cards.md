# Region Cards — Asset Plan & Implementation

**Date:** 2026-06-13
**Goal:** Three premium, cinematic "region" cards (Kakheti, Kazbegi, Tbilisi) for the homepage —
luxury travel-tech + subtle quest-game atmosphere, consistent visual DNA, real Georgian locations.

---

## 1. Source Photo Selection

All three cards use **real existing photography** — no AI-generated locations, no Higgsfield
needed. Each source was chosen because it (a) is a recognizable, real Georgian landmark, and
(b) has no people/tourists in frame (per the "premium, not a snapshot" direction).

| Region | Source file | Why this one |
|--------|------------|--------------|
| **Tbilisi** | `public/images/tours/tbilisi-city-quest.jpg` (top 1500×900 crop) | The full image is a tourist-group snapshot, but the **top crop** isolates the ornate tiled facade and carved wooden balcony of the Abanotubani sulfur-bath district — instantly recognizable Old Tbilisi, zero people. |
| **Kakheti** | `public/images/tours/kakheti-wine-legends.jpg` (full frame, 1500×925) | Sighnaghi hilltop town over the Alazani Valley — the iconic "wine country on a hill" shot, no people, already well composed. |
| **Kazbegi** | `public/images/hero-gergeti.jpg` (full frame, 1376×768) | The newly supplied Gergeti Trinity Church + Mt Kazbek photo — exactly matches the "epic alpine atmosphere, clouds, sacred peak" brief. Already used for the homepage hero; reused here for consistency. |

**Higgsfield:** Not used — all three real photos were strong enough once graded. No generation
prompts were needed.

---

## 2. Cinematic Grading ("Visual DNA")

Script: `scripts/build-region-cards.mjs` (Node + `sharp`, re-runnable).

Each source is:
1. Cropped to a clean 4:3 composition, resized to **1200×900**.
2. `modulate()` — small per-image saturation/hue push toward warm tones (golden-hour feel for
   Kakheti and Tbilisi; Kazbegi was already golden-hour and needed minimal change).
3. Contrast lift via `linear(1.04, -6)`.
4. **Cinematic cast** overlay (full-frame diagonal gradient, indigo top-left → metallic gold
   bottom-right, `soft-light` blend) — this is the shared "luxury travel-tech + quest" tone that
   ties all three cards together.
5. **Gold glow accent** (radial gradient, top-right, `soft-light` blend) — subtle "quest unlock"
   highlight.
6. **Indigo shadow gradient** (bottom 60%, normal blend, up to 82% opacity) — guarantees the
   white/gold text overlay added in code stays readable on any photo.

No text, watermarks, or AI artifacts are baked into any image — all copy is HTML/CSS overlay.

---

## 3. Output Files

```
public/assets/regions/
├── kakheti-card.webp        (1200×900, ~105 KB)
├── kakheti-card-poster.jpg  (1200×900, ~83 KB  — JPEG fallback / OG use)
├── kazbegi-card.webp        (1200×900, ~60 KB)
├── kazbegi-card-poster.jpg  (1200×900, ~63 KB)
├── tbilisi-card.webp        (1200×900, ~170 KB)
└── tbilisi-card-poster.jpg  (1200×900, ~140 KB)
```

All under the ~170 KB ceiling; WebP is the primary format served via `next/image` (which also
applies its own runtime optimization/resizing). A 16×12 base64 blur placeholder is generated
per card and stored in `src/data/regions.ts` for an instant low-res preview while the full
image loads.

To regenerate after swapping a source photo: `node scripts/build-region-cards.mjs`.

---

## 4. Implementation

- **`src/data/regions.ts`** — typed `Region[]` with `slug`, `name`, `subtitle`, `routeHint`
  (quest count + route teaser), `href` (links to the matching tour detail page), `alt` text,
  and `blurDataURL`.
- **`src/components/home/RegionCard.tsx`** — the card component:
  - `next/image` with `fill`, `placeholder="blur"`, responsive `sizes`.
  - Baked-in grade + an extra in-code legibility gradient for the text block.
  - Map-pin badge (top-right) — the "route accent" element, scales up on hover.
  - Overlay: route hint (gold caps label), region name (serif, white), subtitle, and an
    "Explore Route →" pill.
  - Hover/tap: `framer-motion` — slight scale (1.015), gold-glow box-shadow, pill background
    flips to solid gold. All gated behind `useReducedMotion()`.
- **`src/app/page.tsx`** — new "Discover the Regions" section added between "Featured Quests"
  and "Today's Best Deal" (new-user homepage view only). Horizontal scroll on mobile
  (`overflow-x-auto`, cards at 78% width), 3-column grid from `sm:` breakpoint up.

### Card → destination mapping
- Tbilisi → `/tours/tbilisi-city-quest` (subtitle/route hint references the free starter quest)
- Kakheti → `/tours/kakheti-wine-legends`
- Kazbegi → `/tours/kazbegi-mountain-quest`

---

## 5. Verification

- `npm run lint` — 0 errors, 0 warnings
- `npm run build` — 29 routes, 0 TypeScript errors
- Manually verified in headless Chromium at 390px (mobile) and 1024px (desktop): images load,
  blur placeholder works, overlay text is legible on all three photos, hover state (gold glow +
  pill fill) works on desktop, horizontal scroll works on mobile.
