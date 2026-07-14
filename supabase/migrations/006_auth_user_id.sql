-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 006: Link explorer_profiles to Supabase Auth
--
-- Adds auth_user_id to explorer_profiles so authenticated users own their
-- profile row. Existing anonymous profiles (auth_user_id IS NULL) are
-- preserved — they continue to work via their UUID primary key stored in
-- localStorage. Bookings stay linked to explorer_profiles.id with no change.
--
-- Idempotent: safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add auth_user_id column (nullable, references auth.users)
alter table public.explorer_profiles
  add column if not exists auth_user_id uuid
    references auth.users(id) on delete set null;

-- 2. Unique partial index — allows many NULLs (anonymous profiles), but only
--    one row per authenticated user. Postgres unique indexes skip NULL values
--    so this is the correct approach for a nullable unique column.
create unique index if not exists idx_explorer_profiles_auth_user_id
  on public.explorer_profiles (auth_user_id)
  where auth_user_id is not null;

-- 3. Regular index for fast lookup by auth_user_id
create index if not exists idx_explorer_profiles_auth_user_id_lookup
  on public.explorer_profiles (auth_user_id);

-- 4. Update RLS policies
--    Goal: public read (unchanged), INSERT allows both anonymous and
--    authenticated paths, UPDATE restricts auth-linked rows to their owner.

drop policy if exists "Read any profile" on public.explorer_profiles;
create policy "Read any profile"
  on public.explorer_profiles for select
  using (true);

drop policy if exists "Insert own profile" on public.explorer_profiles;
create policy "Insert own profile"
  on public.explorer_profiles for insert
  with check (
    -- Anonymous insert (no auth_user_id) — legacy background sync path
    auth_user_id is null
    -- Authenticated insert — must match the calling user
    or auth.uid() = auth_user_id
  );

drop policy if exists "Update own profile" on public.explorer_profiles;
create policy "Update own profile"
  on public.explorer_profiles for update
  using (
    -- Anonymous profile: any client can update (legacy localStorage path)
    auth_user_id is null
    -- Auth-linked profile: only the owning user can update
    or auth.uid() = auth_user_id
  );
