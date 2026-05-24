# Ivera — Georgian Travel Experiences

Web app for Ivera, a Georgian travel company offering curated small-group tours.

## Stack

- **Next.js 16** (App Router, static generation)
- **Tailwind CSS v4**
- **TypeScript**
- **Deployment**: GitHub → Vercel

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, featured tours, WhatsApp CTA |
| `/quests` | Full tour listing |
| `/quests/[slug]` | Tour detail with booking CTA |
| `/about` | Brand story and contact |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Brand Assets

Brand tokens live in `src/app/globals.css` under `:root`. Swap the CSS variables when the real palette arrives:

```css
:root {
  --primary: #0a7070;      /* replace with brand primary */
  --accent:  #f5e6c8;      /* replace with brand accent */
}
```

## Tour Content

All tour data is in `src/lib/quests.ts`. Replace the placeholder quests with real content. Each quest needs:
- `slug`, `title`, `tagline`, `description`
- `duration`, `groupSize`, `price`, `region`
- `highlights[]`
- `imageAlt` and `imagePlaceholderColor` (replace with `next/image` `src` path when images arrive)

## Contact

WhatsApp: +995 555 443 787
