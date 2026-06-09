# Deployment Reconciliation Audit

**Date:** June 2026  
**Status:** RESOLVED — no code conflict exists

---

## Root Cause

The "Need a Hint disappeared" symptom was caused by **two separate Vercel deployments being compared**:

| Deployment | Branch | Has AI features? |
|---|---|---|
| "Marketing version" | `main` | ❌ No — last commit `125439f` (marketing system) |
| "Gemini AI version" | `claude/ivera-web-app-audit-CzjwF` | ✅ Yes — full AI layer |

When Vercel deployed from `main`, the AI features (Hint, Chronicle, Free Quest, Recommendations) were absent because they were never merged from the feature branch.

**There is no code conflict.** The feature branch already contains 100% of the marketing work, because the feature branch was built on top of the marketing commits. The marketing homepage, dashboard, booking system, and Supabase flows are all intact.

---

## Git History — Feature Branch Commit Log

```
a9f5b48  AI security hardening, smoke test docs, and migration checklist
83641c2  Add Gemini AI layer: quest hints, hero chronicle, free mini quest, recommendations
b78c60c  Fix lint: move synchronous localStorage reads to lazy useState initializers
c40ca05  Add Supabase MCP server config and agent skills
c850104  Add full booking MVP: Supabase-first booking system
125439f  Add marketing and conversion system        ← main branch HEAD
199bc91  feat: premium quest/travel redesign
48056bf  feat: add production-ready animation system
...
```

`main` stops at `125439f`. All subsequent commits exist only on `claude/ivera-web-app-audit-CzjwF`.

---

## File Comparison: Feature Branch vs Main

### Files identical between both branches (marketing safe)

| File | Status |
|---|---|
| `src/app/page.tsx` | ✅ Identical — marketing homepage preserved |
| `src/app/layout.tsx` | ✅ Identical |
| `src/app/tours/page.tsx` | ✅ Identical |
| `src/app/tours/[slug]/page.tsx` | ✅ Identical |
| `src/app/leaderboard/page.tsx` | ✅ Identical |
| `src/data/tours.ts` | ✅ Identical |
| `src/data/missions.ts` | ✅ Identical |
| `src/lib/questProgress.ts` | ✅ Identical |
| `src/lib/discounts.ts` | ✅ Identical |
| `src/components/marketing/` | ✅ Identical |

### Files that exist ONLY on the feature branch (AI additions)

| File | Purpose |
|---|---|
| `src/lib/ai/gemini.ts` | Gemini REST client, server-side only |
| `src/lib/ai/prompts.ts` | Prompt builders |
| `src/lib/ai/logging.ts` | Optional Supabase logging |
| `src/app/api/ai/quest-hint/route.ts` | Quest hint API route |
| `src/app/api/ai/hero-chronicle/route.ts` | Chronicle API route |
| `src/app/api/ai/tour-recommendation/route.ts` | Recommendation API route |
| `src/app/free-tbilisi-quest/page.tsx` | Free mini-quest page |

### Files modified on feature branch vs main (both versions merged)

| File | What changed |
|---|---|
| `src/components/quest/MissionCard.tsx` | Added "Need a hint?" button |
| `src/app/quest/[tourSlug]/QuestClient.tsx` | Added Hero Chronicle section |
| `src/app/profile/page.tsx` | Added booking summary + tour recommendations |
| `src/data/rewards.ts` | Added Key of Tbilisi badge |
| `src/components/layout/BottomNav.tsx` | Center button → /my-trip |
| `src/components/layout/Header.tsx` | Notification bell + panel |
| `src/lib/whatsapp.ts` | Added booking message builders |
| `src/lib/supabase/bookingService.ts` | Full rewrite — Supabase-first |
| `src/lib/supabase/types.ts` | New booking columns |
| `src/lib/bookingTypes.ts` | NEW — booking type interfaces |
| `src/lib/localBookings.ts` | NEW — localStorage cache |
| `src/app/my-trip/page.tsx` | NEW — booking history page |
| `src/app/admin/orders/page.tsx` | NEW — admin dashboard |

---

## Verification Checklist

- [x] Marketing homepage (`src/app/page.tsx`) — **identical on both branches**
- [x] AI files exist on feature branch — `src/lib/ai/`, `src/app/api/ai/`
- [x] `/free-tbilisi-quest` exists — `src/app/free-tbilisi-quest/page.tsx`
- [x] Hero Chronicle in QuestClient — `generateChronicle()` function present
- [x] Profile recommendations — `fetchRecommendations` in `useEffect`
- [x] "Need a hint?" in MissionCard — `fetchHint()` and button present
- [x] GEMINI_API_KEY server-side only — no `NEXT_PUBLIC_GEMINI` anywhere
- [x] All Supabase flows intact — bookingService, explorerService, questService

---

## Resolution

**Action required: merge `claude/ivera-web-app-audit-CzjwF` into `main`.**

No code conflicts exist. The merge will fast-forward main to include all booking, AI, and documentation work while keeping the marketing design 100% intact.

After merge, Vercel must be configured to deploy from `main`.

See `docs/deployment-guide.md` for step-by-step instructions.
