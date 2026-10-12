# Implementation Log — Stabilization Audit

Date: 2026-10-12. Branch: `claude/ivera-web-app-audit-CzjwF` (reset from a stale base to current `main` before starting — see `docs/audits/BASELINE_AUDIT.md` §0). All items below are in a single commit on this branch; see the PR for the exact diff.

---

### 1. Footer copyright year hardcoded to 2025

- **Problem:** `src/components/layout/Footer.tsx:11` had `const year = 2025;` — already a year stale at the time of this audit (today is 2026).
- **Root cause:** literal value, never updated.
- **Fix:** `const year = new Date().getFullYear();`. Also removed an unused `t` destructure flagged by ESLint in the same file.
- **Files:** `src/components/layout/Footer.tsx`
- **Tests:** none added (trivial, visually self-evident); verified by reading the rendered output logic.
- **Risk:** none.

### 2. ESLint baseline errors (5 real errors, pre-existing)

- **Problem:** `npx eslint .` failed with 5 errors at session start (see `BASELINE_AUDIT.md` for the exact list) — React Compiler incompatibility in `/packages`, two unescaped-quote JSX errors in `ReviewsSection`, and a `setState`-in-effect anti-pattern in `AuthContext`.
- **Root cause (per-item):**
  - `packages/page.tsx`: `useMemo(todayStr, [])` passed a named function instead of an inline arrow.
  - `packages/page.tsx`: the `pricing` `useMemo` depended on `selectedTours`, an unmemoized array recomputed every render — so the memoization was already a no-op; simplified to a plain computed value instead of fighting the compiler to "preserve" a memoization that did nothing.
  - `ReviewsSection.tsx`: raw `"` characters in JSX text.
  - `AuthContext.tsx`: `setLoading(false)` called synchronously inside a `useEffect` body when `!supabase`. Fixed by deriving the initial `loading` state directly from `!!supabase` at `useState` time instead of via an effect — matches the pattern already used elsewhere in this codebase (e.g. `useIsMobile`) to avoid the same lint rule.
- **Files:** `src/app/packages/page.tsx`, `src/components/marketing/ReviewsSection.tsx`, `src/contexts/AuthContext.tsx`, `src/app/about/page.tsx` (unused-var warning cleanup)
- **Tests:** `npx eslint .` — 0 errors, 0 warnings (was 5 errors, 4 warnings).
- **Risk:** none — all behavior-preserving; verified via full build + E2E pass afterward.

### 3. Three independently-drifted copies of the combo-discount tiers

- **Problem:** `src/app/packages/page.tsx`, `src/lib/whatsapp.ts` (`buildMultiTourLink`), and `src/components/marketing/ComboPassCTA.tsx` each hard-coded the same 2/3/4-tour discount thresholds separately. One copy (`whatsapp.ts`) had a latent bug: for `toursCount < 2` it would still return 5% instead of 0% (unreachable with today's only call site, which always passes `2`, but a real drift risk for future callers).
- **Root cause:** no shared source of truth for this specific discount axis (per-tour group-size discounts already had one, `getGroupSizeDiscount`, but the separate "how many distinct tours in a combo" discount didn't).
- **Fix:** added `getComboDiscount(toursCount)` to `src/lib/discounts.ts`, now the single source used by all three sites.
- **Files:** `src/lib/discounts.ts` (new function), `src/app/packages/page.tsx`, `src/lib/whatsapp.ts`, `src/components/marketing/ComboPassCTA.tsx`
- **Tests:** `src/lib/discounts.test.ts` — 6 new unit tests on `getComboDiscount` boundary values (0/1/2/3/4/7); `e2e/booking.spec.ts` exercises it live through the real `/packages` UI.
- **Risk:** none — verified identical output for the only real call site (always `2` tours → `5%`).

### 4. PayPal display amount could drift from the real charge amount

- **Problem:** the pre-checkout "Pay with PayPal — €X.XX" button computed its displayed amount from `NEXT_PUBLIC_PAYPAL_GEL_EUR_RATE` (a client-only env var), while the actual PayPal charge is computed server-side from the separate `PAYPAL_GEL_EUR_RATE`. If an operator updated one without the other, the two would silently diverge.
- **Root cause:** two independently-configured env vars with no mechanism keeping them in sync.
- **Fix:** added `GET /api/paypal/rate` (public, returns only `{ rate }`, no secrets) backed by the same `getServerGelEurRate()` the real charge uses. `BookingWidget.tsx` now fetches this once on mount and uses it for the display amount, falling back to the old client env var only if the fetch fails (e.g. offline) — so behavior degrades gracefully rather than breaking.
- **Files:** `src/app/api/paypal/rate/route.ts` (new), `src/components/tours/BookingWidget.tsx`
- **Tests:** covered indirectly by the existing `gelToEur` unit tests (same function, same rounding); route confirmed present in `npm run build` output and responds correctly via manual route smoke test.
- **Risk:** low — this only changes *when* the client learns the rate (now also from the server, not only from its own build-time env var), never the charge logic itself, which was already server-authoritative and untouched.

### 5. 6+ person "group quote" bookings never persisted anywhere

- **Problem:** `BookingWidget.tsx`'s `handleBook()`, for groups of 6 or more, opened WhatsApp directly and returned — `createBooking()` was never called. This matches a gap flagged (and never fixed) in this repo's own `docs/technical-audit.md`/`docs/product-audit.md` from 2026-06-09: these leads existed only inside a WhatsApp conversation, invisible to `/admin/orders`.
- **Root cause:** the group-quote branch was written as a pure WhatsApp-redirect shortcut, before the booking-persistence system existed, and never revisited once it did.
- **Fix:** the group-quote path now also calls `createBooking()` with a real booking code, the tour/date/people-count, and price fields left `null`/`0` with `discountReason: "Custom group rate (6+) — pending manual quote"` — mirroring exactly how the admin dashboard already handles unpriced/quote-pending tours (`booking.finalTotal != null && (...)` guards already existed and needed no changes). The Supabase write is fire-and-forget (`.catch(() => {})`) so a transient Supabase issue never blocks the customer's WhatsApp message from opening — matches the existing error-tolerance pattern used elsewhere in the same file.
- **Files:** `src/components/tours/BookingWidget.tsx`
- **Tests:** verified `tsc`/build pass with the new code path; not covered by a dedicated E2E test this session (would need to drive the "6 people" stepper and intercept the Supabase call — flagged as a good follow-up, not done here to keep this session's scope manageable).
- **Risk:** low. Does not change pricing, does not change what the customer sees or does — purely additive visibility for the business owner. Worth a manual check in the admin dashboard after a real 6+ person booking request comes in.

### 6. Critical Next.js dependency vulnerability

- **Problem:** `next` was pinned to the exact version `16.2.6`, which has multiple published CVEs including two distinct Remote Code Execution advisories (Image Optimization API with AVIF, and `next/og` `ImageResponse`), plus several SSRF and cache-poisoning advisories.
- **Root cause:** exact-pinned dependency, never patched since.
- **Fix:** upgraded to `next@^16.4.0` (same major version; also relaxed the exact pin to a caret range so future patch/minor security fixes install automatically). `postcss` and `sharp` (transitive, also flagged) were resolved as part of the same upgrade.
- **Files:** `package.json`, `package-lock.json`
- **Tests:** full `tsc`/`eslint`/`build` pass after the upgrade; all 44 routes build; manual `curl` smoke test of 15 key routes (all 200); full E2E suite (6/6) re-run and passing on the upgraded version. `npm audit --omit=dev` confirms 0 production vulnerabilities post-upgrade (was multiple high + 1 critical).
- **Risk:** low-moderate for a framework version bump, mitigated by the verification above — but this is the single highest-blast-radius change in this session, so flagged prominently. Recommend watching the Vercel preview deployment closely before merging to `main`.

---

## New infrastructure added (not a "fix," but part of this audit's scope)

- **`vitest.config.mts` + `src/lib/discounts.test.ts` + `src/lib/paypal/currency.test.ts`** — this project had zero automated tests before this session. 23 unit tests now cover the pricing/discount logic end-to-end, including every boundary case called out in the original audit brief (fractional amounts, zero discounts, multiple passengers, invalid/edge inputs, no accidental stacking).
- **`playwright.config.ts` + `e2e/*.spec.ts`** — 6 E2E smoke tests covering the homepage, free-quest reachability, language switching, a tour detail page, the combo discount UI, and leaderboard honesty.
- **`package.json`** — added `test` and `test:e2e` scripts.
- **`.gitignore`** — added Playwright's output directories.

## What this log deliberately does NOT include

Items in `docs/audits/KNOWN_ISSUES.md` that need the owner's product/business decision (the Daily Quest Challenge's unfulfilled reward promise, the non-functional multi-user leaderboard, client-trusted XP, the dropped last-seats discount inside combos, missing AI rate-limiting) were **investigated and documented, not auto-fixed** — per the audit brief's own instruction not to silently change business rules or prices.
