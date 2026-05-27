# Ivera Supabase Security Check

Security assessment for MVP / controlled beta. Reviewed against the anon key + RLS configuration defined in `supabase/schema.sql`.

---

## Credentials summary

| Key | Where used | Risk if leaked |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side (browser) | Low — project URL only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side (browser) | Medium — see RLS section |
| Service role key | NOT used in app | Critical — never expose |

The anon key is intentionally public-facing. Its power is limited by Row Level Security policies. The service role key bypasses all RLS and must never appear in frontend code or be committed to the repo.

---

## Table-by-table RLS status

### `explorer_profiles`

| Policy | Status |
|---|---|
| Insert (anon) | ✅ Open — anyone can create a profile |
| Select (anon) | ✅ Open — leaderboard requires reading names |
| Update (anon) | ⚠️ Open — any client can update any row |
| Delete | ❌ No policy — blocked by default |

**Risk:** Any client could update another explorer's profile row (name, country) by guessing a UUID. For invite-only beta this is acceptable. Before public launch, add `auth.uid()` checks or restrict updates to service role only.

---

### `bookings`

| Policy | Status |
|---|---|
| Insert (anon) | ✅ Open — needed for booking capture |
| Select (anon) | ⚠️ Open — any client can read all bookings |
| Update (anon) | ⚠️ Open — status can be changed by any client |
| Delete | ❌ No policy — blocked by default |

**Risk:** Booking data (dates, people count, tour slugs) is readable by any client with the anon key. No PII beyond what's in the WhatsApp message. Before public launch, restrict Select and Update to service role or authenticated admin only.

---

### `quest_progress`

| Policy | Status |
|---|---|
| Insert (anon) | ✅ Open — needed for mission completion |
| Select (anon) | ✅ Open — needed for leaderboard and profile |
| Update (anon) | ⚠️ Open — any client can mark missions complete |
| Delete | ❌ No policy — blocked by default |

**Risk:** A client could insert arbitrary quest progress rows (fake XP). For beta this is low priority — XP is cosmetic and the leaderboard has no monetary value. Before scaling, add rate limiting or server-side validation.

---

### `leaderboard_entries`

| Policy | Status |
|---|---|
| Insert (anon) | ✅ Open — needed for leaderboard sync |
| Select (anon) | ✅ Open — public leaderboard |
| Update (anon) | ⚠️ Open — any client can change XP values |
| Delete | ❌ No policy — blocked by default |

**Risk:** XP values could be manipulated by a savvy client. Acceptable for beta (leaderboard is cosmetic). Harden before public launch with server-side XP calculation.

---

### `qr_missions`

| Policy | Status |
|---|---|
| Insert (anon) | ❌ No policy — blocked (correct) |
| Select (anon) | ✅ Filtered — only `active = true` rows |
| Update (anon) | ❌ No policy — blocked (correct) |
| Delete | ❌ No policy — blocked (correct) |

**Status: Most secure table.** Only the service role key (used via Supabase dashboard or a secure backend) can insert/update QR missions. ✅

---

## What is safe for MVP

- ✅ Anon key in frontend — standard Supabase pattern
- ✅ Service role key never in frontend code
- ✅ `qr_missions` locked to read-only for anon clients
- ✅ No payment data stored
- ✅ No passwords or auth tokens stored
- ✅ No sensitive PII (no email, phone number, or ID documents)
- ✅ RLS enabled on all 5 tables — no table is fully open

## What is unsafe for public launch

- ❌ `bookings` Select is open — booking data readable by any client
- ❌ `explorer_profiles` Update is open — profiles writable by any client
- ❌ `quest_progress` Update is open — XP manipulation possible
- ❌ `leaderboard_entries` Update is open — leaderboard manipulation possible
- ❌ No rate limiting on inserts
- ❌ No server-side validation of XP values

## Minimum recommended policies before public beta

Run in Supabase SQL Editor when ready to harden:

```sql
-- Restrict bookings to service role for select/update
drop policy if exists "Read own bookings" on bookings;
drop policy if exists "Update booking status" on bookings;

-- Restrict leaderboard updates to service role
drop policy if exists "Update own entry" on leaderboard_entries;

-- Restrict explorer_profiles update to service role
drop policy if exists "Update own profile" on explorer_profiles;
```

After dropping those policies, only the Supabase dashboard (service role key) can read/update bookings and modify XP. The app will still insert new rows as intended.

---

## Summary verdict

**Safe for invite-only beta.** All critical data (payments, auth) is absent. The main risk is cosmetic data manipulation (XP, leaderboard). Implement the hardening SQL above before opening to the public.
