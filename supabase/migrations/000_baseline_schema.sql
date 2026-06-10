-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 000: Baseline schema
--
-- Creates the core Ivera tables so the migration chain is self-contained and can
-- build a fresh database (e.g. Supabase preview branches) from migrations alone.
-- Previously these tables lived only in schema.sql (applied by hand), which meant
-- later migrations (001 alters bookings, 002 references explorer_profiles, 003
-- alters explorer_profiles) had nothing to run against on a clean database.
--
-- Fully idempotent: safe to run against an existing project. Tables use
-- CREATE TABLE IF NOT EXISTS; policies are dropped-then-created so re-runs don't
-- error (Postgres has no CREATE POLICY IF NOT EXISTS).
--
-- This represents the schema BEFORE this PR's new field; migration 003 adds the
-- explorer_profiles.language column on top of this baseline.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Explorer profiles ────────────────────────────────────────────────────────
create table if not exists explorer_profiles (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  country       text,
  interest      text,
  whatsapp_optional text,
  created_at    timestamptz not null default now()
);

alter table explorer_profiles enable row level security;

drop policy if exists "Insert own profile" on explorer_profiles;
create policy "Insert own profile"
  on explorer_profiles for insert with check (true);

drop policy if exists "Read any profile" on explorer_profiles;
create policy "Read any profile"
  on explorer_profiles for select using (true);

drop policy if exists "Update own profile" on explorer_profiles;
create policy "Update own profile"
  on explorer_profiles for update using (true);

-- 2. Bookings ─────────────────────────────────────────────────────────────────
create table if not exists bookings (
  id               uuid primary key default gen_random_uuid(),
  explorer_id      uuid references explorer_profiles(id) on delete set null,
  tour_slug        text not null,
  tour_title       text not null,
  selected_date    date not null,
  people_count     int not null check (people_count >= 1),
  price_per_person numeric(10,2),
  total_price      numeric(10,2),
  status           text not null default 'pending'
                     check (status in ('pending','contacted','confirmed','completed','cancelled')),
  whatsapp_message text,
  created_at       timestamptz not null default now()
);

alter table bookings enable row level security;

drop policy if exists "Insert booking" on bookings;
create policy "Insert booking"
  on bookings for insert with check (true);

drop policy if exists "Read own bookings" on bookings;
create policy "Read own bookings"
  on bookings for select using (true);

drop policy if exists "Update booking status" on bookings;
create policy "Update booking status"
  on bookings for update using (true);

-- 3. Quest progress ───────────────────────────────────────────────────────────
create table if not exists quest_progress (
  id            uuid primary key default gen_random_uuid(),
  explorer_id   uuid references explorer_profiles(id) on delete set null,
  tour_slug     text not null,
  mission_id    text not null,
  completed     boolean not null default false,
  points_earned int not null default 0,
  completed_at  timestamptz not null default now(),
  unique (explorer_id, tour_slug, mission_id)
);

alter table quest_progress enable row level security;

drop policy if exists "Insert progress" on quest_progress;
create policy "Insert progress"
  on quest_progress for insert with check (true);

drop policy if exists "Read progress" on quest_progress;
create policy "Read progress"
  on quest_progress for select using (true);

drop policy if exists "Update progress" on quest_progress;
create policy "Update progress"
  on quest_progress for update using (true);

-- 4. Leaderboard entries ──────────────────────────────────────────────────────
create table if not exists leaderboard_entries (
  id               uuid primary key default gen_random_uuid(),
  explorer_id      uuid references explorer_profiles(id) on delete set null,
  display_name     text not null,
  total_xp         int not null default 0,
  completed_quests int not null default 0,
  updated_at       timestamptz not null default now()
);

alter table leaderboard_entries enable row level security;

drop policy if exists "Insert leaderboard entry" on leaderboard_entries;
create policy "Insert leaderboard entry"
  on leaderboard_entries for insert with check (true);

drop policy if exists "Read leaderboard" on leaderboard_entries;
create policy "Read leaderboard"
  on leaderboard_entries for select using (true);

drop policy if exists "Update own entry" on leaderboard_entries;
create policy "Update own entry"
  on leaderboard_entries for update using (true);

-- 5. QR missions ──────────────────────────────────────────────────────────────
create table if not exists qr_missions (
  id            uuid primary key default gen_random_uuid(),
  tour_slug     text not null,
  mission_id    text not null,
  qr_code       text not null unique,
  location_name text not null,
  points        int not null default 100,
  unlock_text   text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (tour_slug, mission_id)
);

alter table qr_missions enable row level security;

drop policy if exists "Read active missions" on qr_missions;
create policy "Read active missions"
  on qr_missions for select using (active = true);

-- Indexes ─────────────────────────────────────────────────────────────────────
create index if not exists idx_bookings_explorer    on bookings(explorer_id);
create index if not exists idx_bookings_tour        on bookings(tour_slug);
create index if not exists idx_quest_explorer       on quest_progress(explorer_id);
create index if not exists idx_quest_tour           on quest_progress(tour_slug);
create index if not exists idx_leaderboard_xp       on leaderboard_entries(total_xp desc);
create index if not exists idx_qr_missions_code     on qr_missions(qr_code);
