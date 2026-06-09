# Ivera Technical Audit
**Date:** 2026-06-09  
**Stack:** Next.js 16.2.6 (App Router), React 19, TypeScript strict, Tailwind CSS v4, Supabase JS v2, Framer Motion, Gemini AI

---

## Build & Lint Results

```
npm run lint   → ✅ 0 errors, 0 warnings
npm run build  → ✅ 29 pages compiled, 0 TypeScript errors
```

All 29 routes render cleanly in production mode.

---

## 1. Routes

| Route | Type | Notes |
|-------|------|-------|
| `/` | Static | Dual UX: new vs returning user |
| `/tours` | Dynamic (SSR) | Category filter via searchParams |
| `/tours/[slug]` | SSG (8 pages) | generateStaticParams for all tours |
| `/quest/[tourSlug]` | SSG (8 pages) | generateStaticParams |
| `/free-tbilisi-quest` | Static | ⚠️ Not linked from anywhere |
| `/my-trip` | Static | Client-side data load |
| `/profile` | Static | Client-side data load |
| `/leaderboard` | Static | Client-side data load |
| `/admin/orders` | Static | Client-side auth check |
| `/_not-found` | Static | 404 fallback |

**Issue:** `/free-tbilisi-quest` is a valid route that builds correctly but has zero entry points in the UI. No nav link, no homepage link, no referral from any other page.

---

## 2. API Routes

| Route | Runtime | Method | Notes |
|-------|---------|--------|-------|
| `/api/ai/quest-hint` | Node.js | POST | GEMINI_API_KEY server-side only ✅ |
| `/api/ai/hero-chronicle` | Node.js | POST | GEMINI_API_KEY server-side only ✅ |
| `/api/ai/tour-recommendation` | Node.js | POST | GEMINI_API_KEY server-side only ✅ |

All three API routes correctly use `export const runtime = "nodejs"` and access `process.env.GEMINI_API_KEY` (server-side only). No AI key exposure to client bundles confirmed.

**Fallback behavior:** Each route returns a template fallback when:
- `GEMINI_API_KEY` is not set
- Gemini API returns an error
- Response doesn't parse correctly

All fallbacks are non-empty strings — no blank/null responses sent to client. ✅

---

## 3. Supabase Sync

### Client initialization
```typescript
// src/lib/supabase/client.ts
export const supabase = url && key ? createClient<Database>(url, key) : null;
```
Nullable pattern throughout — all services check `if (!supabase) return`. Safe for environments where Supabase vars are missing. ✅

### Tables used
| Table | Status | Notes |
|-------|--------|-------|
| `explorer_profiles` | Active | Created via ExplorerPass modal |
| `bookings` | Active | Created via BookingWidget |
| `quest_progress` | Active | Synced per mission completion |
| `leaderboard_entries` | Active | Written on quest completion |
| `qr_missions` | Defined | Not actively used in booking flow |
| `ai_interactions` | Optional | Migration 002 — fails silently if absent |

### Migration status
- **001_enhance_bookings.sql** — Must be run in Supabase SQL editor. Adds booking_code, base_price_per_person, base_total, discount_applied, discount_reason, savings, final_price_per_person, final_total, currency, seats_left_at_booking, xp_reward, whatsapp_opened, whatsapp_message, status, updated_at columns to bookings table.
- **002_ai_interactions.sql** — Optional. Creates `ai_interactions` table. Fails silently if missing (logging.ts catches all errors).

**Risk:** If migration 001 has NOT been run in production, `createBooking()` will fail for every booking attempt (the new columns don't exist). The booking widget's `error_fallback` state would trigger, opening WhatsApp without a Supabase record — acceptable but loses tracking.

### Data consistency
- localStorage is the primary cache, Supabase is the secondary sync
- On profile page load, Supabase bookings overwrite localStorage display if count > 0
- On admin page, Supabase is the source of truth
- No timestamp-based conflict resolution — last-write wins

### Sync gaps
- Leaderboard data written to `leaderboard_entries` on mission completion, but leaderboard page reads from `DEMO_PLAYERS` (hardcoded) — real data is never displayed
- `getPendingBookingsCount()` reads from localStorage only — doesn't reflect Supabase status changes

---

## 4. Gemini AI Integration

### Security ✅
- Key stored as `GEMINI_API_KEY` (no `NEXT_PUBLIC_` prefix)
- All calls in `/app/api/ai/` routes with `runtime = "nodejs"`
- Key validation at module load: checks presence, length ≥ 20, prefix (AIza or AQ)
- Key prefix+length logged on startup, never the full key value

### Validation on load
```
[Ivera AI] GEMINI_API_KEY is not set. AI features will use fallback responses.
```
This log appears in build output (server-side rendering). Expected behavior when key is not set.

### Model used
`gemini-1.5-flash` — fast and cheap, appropriate for these use cases.

### Token limits
- Quest hint: 120 tokens (correctly sized for <60 word response)
- Hero Chronicle: 280 tokens (correctly sized for <180 word story)
- Tour recommendation: 250 tokens (correct for JSON array)

### Current status
`GEMINI_API_KEY` is empty in `.env.local` — AI features use fallbacks everywhere. The previously shared key was compromised (exposed in chat) and has been removed. A fresh key is needed from aistudio.google.com.

---

## 5. Environment Variable Handling

### Required env vars
| Var | Used in | Has fallback? |
|-----|---------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `client.ts` | No — returns `null` client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `client.ts` | No — returns `null` client |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `whatsapp.ts`, inline | ✅ `"995555443787"` |
| `NEXT_PUBLIC_ADMIN_TOKEN` | `admin/orders` | ✅ `"ivera2026"` |
| `GEMINI_API_KEY` | `gemini.ts` | ✅ Returns fallback text |

### Risks
- If Supabase vars are missing in Vercel, booking creation silently fails and falls back to WhatsApp-only. No user error shown.
- `NEXT_PUBLIC_ADMIN_TOKEN="ivera2026"` is the hardcoded fallback — anyone who guesses this can access admin. Must be overridden in Vercel env vars before beta.
- `NEXT_PUBLIC_BRAND_NAME` is declared in `.env.local` but never read in code — dead variable.

---

## 6. Fallback Behavior

| Feature | Failure scenario | Fallback |
|---------|-----------------|---------|
| AI Quest Hint | No key / API error | "Look carefully around the location. The answer is hidden in the story of this place." |
| Hero Chronicle | No key / API error | Template text using name, location, XP |
| Tour Recommendation | No key / API error | Deterministic rules (Kakheti done → Kazbegi+Mtskheta, etc.) |
| Booking to Supabase | Supabase unavailable | `error_fallback` state → WhatsApp-only booking |
| Profile sync | Supabase unavailable | localStorage only, no user-visible error |
| Mission sync | Supabase unavailable | Silently fails, XP still tracked in localStorage |

All critical user paths have fallbacks. The app is functional without Supabase and without Gemini. ✅

---

## 7. Build Stability

```
✓ Compiled successfully in 9.2s (Turbopack)
✓ TypeScript check passed
✓ 29 pages generated
✓ 3 API routes (dynamic/SSR)
✓ 8 SSG tour pages
✓ 8 SSG quest pages
```

No build warnings. No hydration mismatch risks observed (all `typeof window` guards in place for localStorage reads). ✅

---

## 8. Broken Links & Navigation Gaps

| Link | Target | Status |
|------|--------|--------|
| Bottom nav "My Trip" | `/my-trip` | ✅ Works |
| Bottom nav "Rewards" | `/leaderboard` | ✅ Works |
| Bottom nav "Quests" | `/tours` | ✅ Works |
| Tour card → detail | `/tours/[slug]` | ✅ Works |
| Tour detail → quest | `/quest/[slug]` | ✅ Works |
| Free Tbilisi Quest | `/free-tbilisi-quest` | ⚠️ No entry point |
| Admin | `/admin/orders` | ⚠️ No nav link (intentional) |
| Header bell notification "Check status" | WhatsApp wa.me link | ✅ Works |
| "View Kakheti Tour" from free quest | `/tours/kakheti-wine-legends` | ✅ Works |
| "View Kazbegi Tour" from free quest | `/tours/kazbegi-mountain-quest` | ✅ Works |

### Dead code
- `buildBookingLink()` in `whatsapp.ts` — exported but never imported anywhere. Should be removed or kept as legacy reference.
- `NEXT_PUBLIC_BRAND_NAME` — declared in `.env.local`, never used in source.

---

## 9. Image Paths

```
/public/images/tours/
├── batumi-black-sea.jpg      ✅
├── gori-uplistsikhe.jpg      ✅
├── kakheti-wine-legends.jpg  ✅
├── kazbegi-mountain-quest.jpg ✅
├── kutaisi-martvili-canyons.jpg ✅
├── mtskheta-sacred-route.jpg ✅
├── tbilisi-city-quest.jpg    ✅
└── vardzia-cave-kingdom.jpg  ✅
```

All 8 tour images exist. All `Image` components use `fill` with proper `sizes` attribute. ✅

The hero image (`kazbegi-mountain-quest.jpg`) is used in IveraHero but is hidden behind a `rgba(247,240,228,0.97)` gradient at the top — effectively invisible to users on most screen sizes. Not a broken image, but a design issue.

---

## 10. Mobile Layout

- Container: `max-w-2xl mx-auto w-full` — correct for mobile-first with desktop centering
- `pb-20` on main to clear bottom nav — correct
- `BottomNav` is `fixed bottom-0` — correct

**Issues:**
- No `env(safe-area-inset-bottom)` for notched iPhones — content may sit behind home indicator
- Hero section `min-h-screen` / `minHeight: "100svh"` — `svh` units have variable support; fallback `vh` may cause layout jump on iOS with URL bar
- Some touch targets are small: `text-[9px]` chip labels, `w-8 h-8` nav buttons (32px — below Apple's 44pt guideline)
- No `scrollbar-none` on horizontal scroll areas in Safari older than ~16

---

## 11. Performance Risks

**Positive:**
- All tour images are statically served from `/public/` — no external image domains needed
- Framer Motion animations are conditional on `useReducedMotion()` — accessibility safe
- AI calls are non-blocking (`.catch(() => {})` pattern throughout)
- Tour and quest pages are SSG — fast initial loads

**Risks:**
- No image optimization config in `next.config.ts` — relying on Next.js defaults
- `DashboardHome.tsx` loads all tour data and renders complex content on the homepage — no lazy loading
- Framer Motion bundle (~40kb gzipped) loaded on all pages via `motion/index.ts`
- The profile page fetches Supabase bookings AND tour recommendations in the same `useEffect` — parallel fetches not explicitly managed

---

## 12. Security Risks

### High Priority
| Risk | Location | Notes |
|------|----------|-------|
| Admin token in NEXT_PUBLIC_ | `admin/orders` | Exposed to client bundle. Any user who inspects JS can see the token value. SessionStorage check is bypassable. |
| RLS `USING (true)` | Supabase policies | Any anon authenticated request can read all bookings, all profiles. Intended for MVP but must tighten before real users. |
| No rate limiting on AI routes | `/api/ai/*` | AI endpoints have no rate limiting. Abuse could drain Gemini quota. |

### Medium Priority
| Risk | Location | Notes |
|------|----------|-------|
| No input sanitization | BookingWidget | User-controlled date/people values sent to Supabase — TypeScript types provide some safety, but no server-side validation |
| WhatsApp message injection | `buildWhatsAppBookingMessage` | User name from profile is embedded in WhatsApp message. If name contains special chars, `encodeURIComponent` handles it. Low risk. |
| Stale Supabase anon key | `.env.local` | The anon key in `.env.local` is committed to the repo. Anon keys are safe to expose (by design), but should be in `.gitignore`-protected `.env.local`. |

### Low Priority
| Risk | Location | Notes |
|------|----------|-------|
| No CSRF protection | API routes | Next.js API routes with JSON body don't need CSRF — browser can't trick a cross-origin POST with JSON content-type |
| No Content Security Policy | `next.config.ts` | No CSP headers configured — relevant if user-generated content is ever displayed |

---

## 13. RLS / Security Documentation

Current Supabase RLS policies (from migration files):

### `bookings` table
```sql
-- From 001_enhance_bookings.sql
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "owner_read_bookings" ON bookings FOR SELECT USING (explorer_id = auth.uid() OR auth.uid() IS NULL);
CREATE POLICY "service_update_bookings" ON bookings FOR UPDATE USING (true);
```

**Issue:** `auth.uid() IS NULL` in the SELECT policy means unauthenticated requests can read ALL bookings (because `auth.uid()` is null for anon, and the condition is `OR auth.uid() IS NULL` which is always true for anon). This is equivalent to `USING (true)` for reads.

### `ai_interactions` table
```sql
CREATE POLICY "insert_ai_interactions" ON ai_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "read_ai_interactions" ON ai_interactions FOR SELECT USING (true);
```

Both policies allow unrestricted access. This is noted in the migration file as temporary.

**Before production:**
- Implement Supabase Auth for admin access
- Replace `USING (true)` with `USING (auth.uid() = explorer_id)` for read policies
- Create a separate service role for admin queries (bypasses RLS safely)

---

## 14. Branches & Deployment State

### Branches
| Branch | Latest commit | Notes |
|--------|--------------|-------|
| `main` | `7f6010b` — Fix Tbilisi price | Production branch |
| `claude/ivera-web-app-audit-CzjwF` | `45e7763` — Fix Tbilisi price | Feature branch (in sync with main) |

Both branches are at equivalent states (same code, cherry-pick applied).

### Deployment
- Vercel deploys from GitHub main branch (assumed)
- `ivera.info` returns HTTP 403 from external fetch — likely Vercel Deployment Protection enabled
- If Deployment Protection is on, the domain is password-protected to external users

### To fix ivera.info access:
1. Vercel Dashboard → Settings → Deployment Protection → Disable (or set to "Ivera team only")
2. Confirm Production Branch = `main`
3. Confirm all env vars are set in Vercel (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_WHATSAPP_NUMBER, GEMINI_API_KEY)
4. Trigger redeploy

---

## Summary

### Technical Strengths
- Build is clean (0 lint errors, 0 TypeScript errors, 29 pages)
- AI key security is correctly implemented (server-side only)
- Fallback behavior covers all failure scenarios
- localStorage + Supabase dual-layer is robust
- SSG for tour/quest pages = fast loads

### Technical Debt (by priority)
1. **Run Supabase migrations** (`001_enhance_bookings.sql`) — without this, all bookings fail silently
2. **Admin security** — `NEXT_PUBLIC_ADMIN_TOKEN` exposed to client; RLS `USING (true)` policies
3. **Free quest has no entry point** — routing is correct, discovery is not
4. **Leaderboard reads hardcoded DEMO_PLAYERS** — real data in Supabase is never displayed
5. **No rate limiting on AI routes** — add before launching (even simple IP-based throttle)
6. **`completionMessage`/`unlockText`** fields in mission data go unused
7. **`buildBookingLink()`** dead code in `whatsapp.ts`
8. **`NEXT_PUBLIC_BRAND_NAME`** dead env var
9. **Safe area insets** missing for notched iPhones
10. **No cancellation policy / FAQ** — customer service gap, not a code gap
