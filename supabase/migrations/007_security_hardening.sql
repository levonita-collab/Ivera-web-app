-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 007: Security hardening — RLS tightening + column-level grants
--
-- Context: every table so far uses `using (true)` for select/insert/update,
-- meaning the public anon key can read and write ANY row in ANY table,
-- including other customers' names, phone numbers, prices, and payment
-- status. This migration closes that for the tables that hold real personal
-- data or money (bookings, explorer_profiles, ai_interactions), and leaves a
-- documented note for the two tables where tightening would break a real,
-- currently-working anonymous-user feature (quest_progress,
-- leaderboard_entries — see bottom of this file).
--
-- Companion changes (same PR):
--   - A new service-role client (src/lib/supabase/serviceClient.ts) now
--     handles every write that used to rely on the anon key having broad
--     access: admin status changes, PayPal payment writes. The service role
--     bypasses RLS entirely, so none of those flows depend on the anon-key
--     policies below.
--   - The admin dashboard now authenticates via Supabase Auth + a
--     server-only ADMIN_EMAILS allowlist instead of a public shared token.
--
-- Idempotent: safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. explorer_profiles ─────────────────────────────────────────────────────
-- Was: `using (true)` — any anon-key holder could read every explorer's
-- name, country, and WhatsApp number. Only the owning auth user (or the
-- service role, which bypasses RLS) should be able to read a profile.
-- Anonymous (not-yet-linked, auth_user_id IS NULL) profiles are no longer
-- publicly readable either — no application code reads them back this way
-- (the anonymous flow relies on the localStorage cache, not a Supabase
-- select), so this has no behavioural impact today.
drop policy if exists "Read any profile" on public.explorer_profiles;
create policy "Read own profile"
  on public.explorer_profiles for select
  using (auth.uid() is not null and auth.uid() = auth_user_id);

-- INSERT/UPDATE policies from migration 006 are unchanged and already
-- correctly scoped (anonymous insert allowed; update requires ownership
-- once auth-linked).

-- 2. bookings ───────────────────────────────────────────────────────────────
-- Was: `using (true)` for select AND update — any anon-key holder could
-- read every customer's name, dates, price, and payment status, and could
-- write `status: 'confirmed'` / `payment_status: 'paid'` on ANY booking
-- without ever paying, bypassing PayPal entirely.

-- 2a. SELECT — only the authenticated owner (via their linked
--     explorer_profiles row) can read their own bookings. Admin reads go
--     through the new service-role API instead.
drop policy if exists "Read own bookings" on public.bookings;
create policy "Read own bookings"
  on public.bookings for select
  using (
    auth.uid() is not null
    and explorer_id in (
      select id from public.explorer_profiles where auth_user_id = auth.uid()
    )
  );

-- 2b. UPDATE — instead of trying to model row-level ownership for a table
--     that anonymous (unauthenticated) users must also be able to touch
--     right after booking, we restrict by COLUMN. Only `whatsapp_opened`
--     (an analytics flag — did the customer's WhatsApp link open) and
--     `updated_at` remain writable by the public anon/authenticated roles.
--     Every sensitive column — status, payment_status, prices, paypal_*,
--     customer_name, notes — can now only be changed via the service role
--     (the new admin API and the PayPal routes, both migrated to use it in
--     this PR).
drop policy if exists "Update booking status" on public.bookings;
create policy "Update whatsapp-opened flag only"
  on public.bookings for update
  using (true)
  with check (true);

revoke update on public.bookings from anon, authenticated;
grant update (whatsapp_opened, updated_at) on public.bookings to anon, authenticated;

-- 3. ai_interactions ─────────────────────────────────────────────────────────
-- Was: `using (true)` for select — free-text quest-hint/recommendation logs
-- readable by anyone with the anon key. No application code reads this
-- table back (insert-only telemetry), so removing public read has no
-- behavioural impact. Admin/analytics reads go through the service role.
drop policy if exists "read_ai_interactions" on public.ai_interactions;
-- (insert_ai_interactions is unchanged — logging stays open, same as today)

-- ─────────────────────────────────────────────────────────────────────────────
-- Deliberately NOT tightened in this migration:
--
-- quest_progress, leaderboard_entries — both are written via
-- `.upsert(..., { onConflict: ... })` from anonymous (not-yet-signed-in)
-- browser sessions during the free quest flow (src/lib/supabase/
-- questService.ts → syncMissionCompletion). An upsert's ON CONFLICT DO
-- UPDATE branch is governed by the UPDATE policy, and anonymous requests
-- have no auth.uid() to check ownership against — restricting these would
-- break quest-progress sync and leaderboard XP for every anonymous player,
-- which is the primary way people try Ivera before creating an account.
--
-- Accepted risk: someone with the anon key could write fabricated XP/mission
-- data for an explorer_id that isn't theirs. Both tables hold only a chosen
-- display name, XP count, and quest-completion flags — no PII, no money.
-- Worst case is cosmetic (a fake leaderboard entry or inflated quest
-- progress), not a privacy or financial exposure. Revisit once anonymous
-- play is deprecated in favour of requiring an account before quest start.
-- ─────────────────────────────────────────────────────────────────────────────
