-- 009: let the website create bookings without reading them back.
--
-- Problem: since 007_security_hardening, anonymous visitors may INSERT a
-- booking but have no SELECT on it ("Read own bookings" requires a signed-in
-- owner). The site inserted with `.insert(...).select("id")`, i.e.
-- INSERT … RETURNING, which Postgres rejects under RLS with
-- "new row violates row-level security policy for table bookings".
-- Every guest booking failed to save from early July 2026 on.
--
-- Fix: the client generates the booking's UUID itself and inserts it without
-- RETURNING. That needs INSERT on the `id` column, which 007's column
-- allowlist left out. Granting it is safe: a client-chosen id that already
-- exists only fails on the primary key (no UPDATE is granted on other
-- columns, so nothing can be overwritten), and all other restrictions from
-- 007 (status, payment fields, RLS insert check) stay as they are.

grant insert (id) on public.bookings to anon, authenticated;

-- Rollback:
--   revoke insert (id) on public.bookings from anon, authenticated;
