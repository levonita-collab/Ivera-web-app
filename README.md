# Ivera Travel Quest Web App

A gamified Georgian travel web app — browse tours, calculate prices, book via WhatsApp, and complete XP quests.

## Tech Stack

- **Next.js 16** (App Router, static generation)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (entry animations)
- **lucide-react** (icons)
- **localStorage** (quest progress, profile)

## Pages

| Route | Type | Description |
|---|---|---|
| `/` | Client | Landing — hero, stats, featured tours, leaderboard teaser |
| `/tours` | Dynamic | All 8 tours with category filter |
| `/tours/[slug]` | SSG | Tour detail, booking widget, included/excluded |
| `/quest/[tourSlug]` | SSG+Client | Mission list, XP progress, demo scan, badge |
| `/leaderboard` | Client | Rankings with user XP from localStorage |
| `/profile` | Client | XP level, badges, name onboarding |

## Tours

| Tour | Price | Duration |
|---|---|---|
| Tbilisi City Quest | 40 GEL/person | 3–5 hrs |
| Mtskheta Sacred Route | 70 GEL/person | Full day |
| Gori + Uplistsikhe | 110 GEL/person | Full day |
| Kakheti Wine & Legends | 100 GEL/person | Full day |
| Kazbegi Mountain Quest | 130 GEL/person | Full day |
| Vardzia Cave Kingdom | 150 GEL/person | Full day |
| Kutaisi + Martvili Canyons | 150 GEL/person | Full day |
| Batumi 3-Day Black Sea | Price on Request | 3 days |

## Local Setup

```bash
git clone https://github.com/levonita-collab/Ivera-web-app.git
cd Ivera-web-app
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=995555443787
NEXT_PUBLIC_BRAND_NAME=Ivera
```

Add the same two variables in your **Vercel project settings → Environment Variables**.

## WhatsApp Booking

`src/lib/whatsapp.ts` generates deep links. Fixed-price tours get a message with tour name, date, people count, price per person, and total. Batumi (price on request) gets a custom quote request. The WhatsApp number is read from `NEXT_PUBLIC_WHATSAPP_NUMBER`.

## Brand Assets

To swap in real assets:

- **Logo**: add `public/images/logo-light.png` and `logo-dark.png`, then update `Header.tsx`
- **Tour images**: add `public/images/tours/*.jpg` (one per tour slug), then update `tours.ts` to use `image` paths and replace the `div` gradient backgrounds in `TourCard.tsx` and tour detail pages with `<Image>` from `next/image`
- **Colours**: edit `:root` in `src/app/globals.css` — change `--brand-gold`, `--brand-cream`, etc.

## Vercel Deployment

1. Connect `levonita-collab/Ivera-web-app` to Vercel
2. Framework: Next.js (auto-detected)
3. Add env vars: `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_BRAND_NAME`
4. Deploy `main` branch → production
5. Branch `claude/ivera-web-app-audit-CzjwF` deploys as preview URL

## MVP Feature List

- [x] 8 real Georgia tours with correct GEL pricing
- [x] Tour catalog with category filter (Culture / Adventure / Wine / Heritage)
- [x] Booking widget: date picker, people counter, auto-calculated total
- [x] WhatsApp deep link with pre-filled booking message
- [x] Batumi sends price-request message (not fixed total)
- [x] Date validation: WhatsApp link blocked if no date selected
- [x] Quest system: missions with XP, demo scan button
- [x] localStorage persistence: progress survives page refresh
- [x] All-missions-complete badge unlock
- [x] Leaderboard with demo players + user XP merged and sorted
- [x] Profile with XP level, badges, name onboarding
- [x] Mobile bottom navigation with İ centre button
- [x] Mobile-first layout, no horizontal scroll at 390px
- [x] 0 TypeScript errors, 0 lint errors
- [x] Production build passes (23 static pages)
