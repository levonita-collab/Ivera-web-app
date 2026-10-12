# Security Audit — Ivera Web App

Date: 2026-10-12.

## Summary

The RLS/payment security hardening done in an earlier PR (#11, migration `007_security_hardening.sql`) is genuinely solid — verified by reading the actual SQL and the server code that depends on it, not just trusting the PR description. One confirmed **critical dependency vulnerability** (multiple Next.js CVEs including RCE vectors) was found and fixed this session. A few smaller, real gaps remain, listed below with severity.

## 1. Dependency vulnerabilities — FIXED (was CRITICAL)

`npm audit` at session start (once devDependencies were touched) showed the production dependency tree carrying **Next.js 16.2.6**, which has multiple published CVEs against it, including:
- Unauthenticated Remote Code Execution in the Image Optimization API when AVIF files are used (`GHSA-2xp9-vwfh-vxw4`)
- Remote Code Execution in `next/og` `ImageResponse` (`GHSA-vcvr-r3jv-pc5j`)
- SSRF in Image Optimization and in Server Actions rewrites
- Multiple cache-poisoning / cross-user content substitution / DoS advisories

**Fix applied:** upgraded `next` from the previously hard-pinned `16.2.6` to `^16.4.0` (same major version, no breaking API changes expected or observed). Verified: `npx tsc --noEmit`, `npx eslint .`, `npm run build`, all 44 routes smoke-tested with `curl` (200 on every route), and the full E2E suite — all clean after the upgrade.

`npm audit --omit=dev` now reports **0 vulnerabilities** in the production dependency tree.

Residual, accepted: 5 `high`-severity findings remain, all inside `eslint-config-next`'s own dependency tree (`braces` DoS via deeply-nested-pattern stack exhaustion). This is a **dev-only lint tool**, never shipped to production or run against untrusted input in this project's normal use; the only available fix (`npm audit fix --force`) would downgrade `eslint-config-next` two major versions below the Next.js version it needs to match, which is a worse trade. Left as-is; re-check when `eslint-config-next` publishes an update.

## 2. Supabase Row-Level Security — SOUND

Read `supabase/schema.sql` and all 9 migration files in full, especially `007_security_hardening.sql`. Confirmed:
- `bookings` and `explorer_profiles`: SELECT restricted to `auth.uid() = owner`; INSERT blocks impersonating another profile; UPDATE column-grants exclude `status`, `payment_status`, `paypal_order_id`, `paid_amount`, `notes` for anon/authenticated — only the service-role (server) can set those.
- `ai_interactions`: no public SELECT policy at all.
- `scripts/test-rls.mjs` is a real, substantive isolation test (9 assertions: cross-user read/write/delete denial, column-grant enforcement, impersonation blocking) — read in full, logic matches the migration's stated intent.

**Gap (process, not code):** this RLS test only runs via manual `workflow_dispatch`, never automatically on push/PR (`.github/workflows/rls-test.yml:10-11`). A future migration that accidentally loosens a policy would not be caught by CI. Recommendation (not actioned this session — needs Supabase preview-branch credentials this session doesn't have): wire it to run automatically against a per-PR preview branch.

**Accepted, documented risk (by the codebase's own migration comment, not new):** `quest_progress` and `leaderboard_entries` remain anonymous-writable with no ownership check. Impact is scoped to fabricated XP/mission data for an `explorer_id` that isn't the writer's own — no PII, no money. Matches this audit's own finding that XP is client-trusted (see `FUNCTIONAL_AUDIT.md`).

**Minor gap, not previously documented:** the `bookings` INSERT column-grant still permits the client to set the booking's own `price_per_person`/`discount_applied`/`final_total` fields at creation time. This never affects what's actually charged (PayPal independently recomputes server-side — see §3), but it does mean the admin dashboard's "Est. Value" aggregate and discount reporting are built from client-declared numbers. Low severity; worth tightening if those figures are used for real accounting.

## 3. PayPal payment flow — SOUND, one display-vs-charge gap fixed

- Amount charged is always recomputed server-side from the tour's real price (`calculateTourPrice()`, never from client input) — `src/app/api/paypal/create-order/route.ts:37-51`.
- Capture is verified against the booking's own linked order ID before accepting (`capture-order/route.ts:40-42`), and only marks paid using PayPal's own reported `COMPLETED` status.
- Idempotent at two layers: `PayPal-Request-Id` on order creation, and an atomic `.eq("payment_status","unpaid")` guard on the paid-marking update that no-ops a second/replayed capture or webhook delivery.
- Webhook signature is verified (`verifyPayPalWebhookSignature`) before acting on any webhook event.

**Fixed this session:** the pre-checkout "Pay with PayPal — €X.XX" button label previously computed its EUR amount from a separate client-only env var (`NEXT_PUBLIC_PAYPAL_GEL_EUR_RATE`), independent from the server's `PAYPAL_GEL_EUR_RATE` used for the actual charge. If an operator updated one without the other, the button would display a different amount than what PayPal actually charges — not an overcharge risk (the real charge was always server-authoritative, and the customer can cancel in PayPal's own popup before paying), but a real trust/correctness bug. Fixed by adding `GET /api/paypal/rate` (public, non-sensitive — just a number) and having the client fetch the authoritative rate on mount instead of reading its own env var. Verified via `npm run build` + route smoke test.

## 4. Admin panel access control — SOUND

`requireAdmin()` (`src/lib/supabase/adminAuth.ts`) validates a real Supabase Auth bearer token server-side, checks the resulting email against a server-only `ADMIN_EMAILS` allowlist, and **fails closed** if the allowlist is empty/unset. No client-supplied role/email is ever trusted. Applied consistently across `/api/admin/bookings` and its `[id]/status`/`[id]/refund` sub-routes.

**BLOCKED — not verified this session:** whether `ADMIN_EMAILS` is actually set in the live Vercel production project (Vercel env-var read access returned 403 for this session; see `BASELINE_AUDIT.md`). If it's unset in production, the admin panel fails closed (denies everyone) rather than failing open — so the worst case of this being unverified is "admin panel doesn't work yet," not a security hole.

## 5. XP / leaderboard / reward integrity — client-trusted by design, one false public promise

Full findings in `FUNCTIONAL_AUDIT.md`. Security-relevant summary: every XP-granting and mission-completion path is client-trusted (a user can set arbitrary XP via browser devtools). The practical blast radius today is low because nothing publicly displays other users' fabricated data (the leaderboard honestly shows only "you"). The one place this becomes a real product-integrity issue is the "Daily Quest Challenge" — see `KNOWN_ISSUES.md` #1, flagged for the owner's decision rather than unilaterally rewritten, since it may already correspond to something Levani handles manually.

## 6. Other checks performed

- **Secrets in repo:** no real secrets found committed; `.env.local.example` contains only placeholder values and clear inline comments about what's public vs. server-only. `src/lib/supabase/serviceClient.ts` throws if ever imported into browser code — a real, working safeguard against the service-role key leaking client-side.
- **Rate limiting on `/api/ai/*`:** none implemented (flagged previously in `docs/technical-audit.md`, never addressed, still true today). Low-to-medium severity — could allow Gemini-cost abuse via scripted requests. Not fixed this session (would need a decision on rate-limit strategy/storage — Vercel KV, Upstash, etc. — that affects infra cost, so flagged for the owner rather than unilaterally added).
- **Floating-point pricing:** all pricing math uses plain JS floats rounded with `Math.round()`/`toFixed(2)`, never integer minor units. Low risk in practice at these magnitudes (verified via the new unit tests, which exercise fractional/boundary inputs), but noted as the kind of design choice worth revisiting if the business scales to much larger transaction volumes or additional currencies.
