# Ivera Supabase Security Check

Security assessment for public launch readiness. Reviewed against the RLS
configuration defined in `supabase/migrations/000_baseline_schema.sql`
through `007_security_hardening.sql`.

> **Update (Security Hardening PR):** the "unsafe for public launch" items
> below — `bookings` and `explorer_profiles` being world-readable/writable —
> are fixed by `supabase/migrations/007_security_hardening.sql`, a new
> service-role admin API, and moving PayPal's Supabase writes off the anon
> key. This file now documents the **post-hardening** state; the original
> per-table findings are kept below with a status column so the history is
> visible. See `docs/security-hardening-checklist.md` for how to apply and
> verify this migration on your project.

---

## Credentials summary

| Key | Where used | Risk if leaked |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side (browser) | Low — project URL only |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / anon key | Client-side (browser) | Medium — see RLS section |
| `SUPABASE_SERVICE_ROLE_KEY` (new) | Server-only: admin API routes, PayPal routes | **Critical** — bypasses RLS entirely. Never prefix with `NEXT_PUBLIC_`, never log it, never commit it. `src/lib/supabase/serviceClient.ts` throws if it's ever imported into browser code. |

The anon key is intentionally public-facing. Its power is limited by Row
Level Security policies. The service role key bypasses all RLS and must
never appear in frontend code or be committed to the repo.

---

## Table-by-table RLS status (after migration 007)

### `explorer_profiles` — PII: name, country, interest, WhatsApp number

| Policy | Before 007 | After 007 |
|---|---|---|
| Insert (anon) | ✅ Open | ✅ Open (unchanged — needed for the anonymous Explorer Pass flow) |
| Select (anon) | ❌ Open — any client could read every explorer's name + phone number | ✅ Restricted to `auth.uid() = auth_user_id` — only the signed-in owner |
| Update (anon) | ✅ Ownership-checked since migration 006 | Unchanged |
| Delete | ❌ No policy (blocked by default) | Unchanged |

**Verified safe to tighten:** no application code reads another user's or an
anonymous profile back via Supabase select — the anonymous flow relies on
the localStorage cache, not a live read. Confirmed via `src/lib/supabase/explorerService.ts`.

---

### `bookings` — customer name, dates, price, payment status

| Policy | Before 007 | After 007 |
|---|---|---|
| Insert (anon) | ✅ Open | ✅ Open (unchanged — booking must work without an account) |
| Select (anon) | ❌ Open — any client could read every customer's booking | ✅ Restricted to the signed-in owner (via `explorer_profiles.auth_user_id`) |
| Update (anon) | ❌ Open — any client could set `status: 'confirmed'` / `payment_status: 'paid'` on any booking without paying | ✅ Column-restricted: only `whatsapp_opened` + `updated_at` are grantable to `anon`/`authenticated`. Every other column (status, payment_status, prices, paypal_order_id, customer_name, notes) can only be written by the service role. |
| Delete | ❌ No policy (blocked by default) | Unchanged |

**Who still writes the restricted columns, and how:**
- `status` / `payment_status` transitions → new `PATCH /api/admin/bookings/[id]/status` and `/refund` routes, service-role client, admin-only (Supabase Auth + `ADMIN_EMAILS` allowlist).
- `paypal_order_id`, `paid_amount`, `paid_currency`, `paid_at` → `src/app/api/paypal/create-order` and `capture-order`, now using the service-role client (`src/lib/supabase/bookingServiceServer.ts`) instead of the anon key.

---

### `quest_progress` — NOT tightened (documented, accepted risk)

| Policy | Status |
|---|---|
| Insert (anon) | ✅ Open — needed for anonymous mission completion |
| Select (anon) | ✅ Open |
| Update (anon) | ⚠️ Open — any client can write arbitrary progress |

**Why left open:** `syncMissionCompletion()` upserts this table directly
from the browser for both anonymous and signed-in players. An upsert's
`ON CONFLICT DO UPDATE` branch is governed by the UPDATE policy, and an
anonymous request has no `auth.uid()` to check ownership against —
restricting this would break quest progress for every anonymous player,
which is the main way people try Ivera before creating an account.
**Impact if abused:** fabricated quest-completion rows for someone else's
`explorer_id` — no PII, no money, cosmetic only.

---

### `leaderboard_entries` — NOT tightened (documented, accepted risk)

| Policy | Status |
|---|---|
| Insert (anon) | ✅ Open — needed for leaderboard sync (same anonymous-upsert constraint as `quest_progress`) |
| Select (anon) | ✅ Open — intentional, it's a public leaderboard |
| Update (anon) | ⚠️ Open — any client can write arbitrary XP for any `explorer_id` |

**Correction from an earlier PR description:** this table *does* have a live
write path — `src/lib/supabase/explorerService.ts:upsertLeaderboardEntry()`,
called from `syncMissionCompletion()` in `questService.ts`, wired into
`QuestClient.tsx` on mission completion. A previous PR description
incorrectly stated "no write path exists"; that was wrong. The relevant
security fact for *this* PR is that the write is unauthenticated and
unscoped (same accepted-risk reasoning as `quest_progress` above — no PII,
cosmetic impact only).

---

### `ai_interactions` — AI feature usage logs (quest hints, chronicles, recommendations)

| Policy | Before 007 | After 007 |
|---|---|---|
| Insert (anon) | ✅ Open | ✅ Open (unchanged — logging must work without an account) |
| Select (anon) | ❌ Open — free-text prompts/summaries readable by anyone | ✅ Removed — no anon/authenticated read policy; only the service role can read these logs |

No application code reads this table back, so removing public read has no
behavioural impact.

---

### `qr_missions` — unchanged, already correct

| Policy | Status |
|---|---|
| Insert (anon) | ❌ No policy — blocked (correct) |
| Select (anon) | ✅ Filtered — only `active = true` rows |
| Update (anon) | ❌ No policy — blocked (correct) |
| Delete | ❌ No policy — blocked (correct) |

Only the service role (Supabase dashboard, or now the admin API if extended
to missions) can insert/update QR missions. No change needed.

---

## Summary verdict

**Before this PR:** unsafe for public launch — any anon-key holder could
read every customer's booking/profile PII and forge a `confirmed`/`paid`
booking status without paying, entirely bypassing PayPal.

**After this PR (once migration 007 is applied and verified — see
`docs/security-hardening-checklist.md`):** bookings and profile PII require
real ownership to read; all money- and status-relevant writes require the
service role via an authenticated admin API or the PayPal routes. The two
remaining open-write tables (`quest_progress`, `leaderboard_entries`) hold
no PII and no money — accepted as documented, low-severity risk tied to
supporting anonymous play.
