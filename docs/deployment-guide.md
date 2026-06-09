# Ivera — Deployment Guide

## Source of Truth Branch

**`main`** is the production branch.

All work is developed on `claude/ivera-web-app-audit-CzjwF` and must be merged into `main` before deployment.

---

## Current State (June 2026)

| Branch | Status | Deploy? |
|---|---|---|
| `main` | Stops at marketing system (commit `125439f`) | ❌ Outdated |
| `claude/ivera-web-app-audit-CzjwF` | Contains ALL features | ✅ This is the correct version |

**Action needed:** Merge the feature branch into main. This is a clean fast-forward — no conflicts exist.

---

## How to Merge to Main

```bash
git checkout main
git merge claude/ivera-web-app-audit-CzjwF --no-ff -m "Merge: unified marketing + AI + booking system"
git push origin main
```

Or create a pull request on GitHub from `claude/ivera-web-app-audit-CzjwF` → `main`.

---

## Vercel Configuration

1. In Vercel dashboard → your project → **Settings → Git**
2. Set **Production Branch** to: `main`
3. Ensure **Preview Deployments** are enabled for other branches (optional)
4. After merging, Vercel auto-deploys `main`

### ⚠️ Avoid deploying old Vercel deployments

Vercel keeps a list of past deployments. Do NOT click "Promote to Production" on any old deployment — always let the latest `main` push trigger a fresh build.

---

## What the Correct Production Build Must Include

After deployment, verify these are working:

### Marketing & Design
- [ ] Homepage (`/`) — marketing hero, daily challenge block, how discounts work section
- [ ] Tour listing (`/tours`) — urgency badges, last seats alerts
- [ ] Tour detail pages (`/tours/[slug]`) — booking widget with price breakdown
- [ ] Leaderboard (`/leaderboard`) — XP rankings

### Booking & Supabase
- [ ] Explorer Pass creation on first visit
- [ ] Booking via WhatsApp (`BookingWidget`) — creates Supabase record
- [ ] My Trip page (`/my-trip`) — shows booking history
- [ ] Admin orders page (`/admin/orders`) — token-gated dashboard

### Quest System
- [ ] Quest pages (`/quest/[slug]`) — all missions functional
- [ ] XP saving and profile update
- [ ] Quest completion badge

### AI Layer (Gemini)
- [ ] Subtle "Need a clue?" below mission description — shows clue on tap
- [ ] Hero Chronicle button after completing all missions
- [ ] Free Tbilisi mini-quest (`/free-tbilisi-quest`) — 3 missions, 200 XP, Key of Tbilisi badge
- [ ] Profile tour recommendations ("Your Next Adventure" section)
- [ ] All AI features fall back gracefully if `GEMINI_API_KEY` is missing

---

## Environment Variables in Vercel

Go to Vercel → Project → Settings → Environment Variables.

| Variable | Required | Scope |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | All |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ Yes | All |
| `NEXT_PUBLIC_BRAND_NAME` | Optional | All |
| `GEMINI_API_KEY` | Optional (AI fallbacks work without it) | Server only — **NOT** `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_ADMIN_TOKEN` | Optional (defaults to `ivera2026`) | All |

---

## How to Confirm Correct Version is Live

After deployment opens in production, run these quick checks:

1. **Homepage loads** with gold/dark marketing design
2. **Navigate to** `/quest/kakheti-wine-legends` → mission cards visible
3. **Under any mission description**, small grey text "Need a clue?" is visible
4. **Navigate to** `/free-tbilisi-quest` → page loads with 3 missions
5. **Navigate to** `/my-trip` → page loads (may be empty if no bookings)
6. **Open DevTools → Network → filter "ai"** → no requests to Gemini from browser (they go server-side)
7. **Check page count**: should be 26+ pages in Vercel build log

---

## Rollback Procedure

If a deployment breaks something:

1. In Vercel → Deployments → find the last known good build
2. Click the three dots → **Instant Rollback**
3. Investigate the issue on the feature branch before re-deploying

Do not manually edit files in Vercel — all changes go through git.

---

## Future Branches

For new features, branch from `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

Never develop directly on `main`.
