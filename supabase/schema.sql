-- Ivera Travel Quest — Supabase schema
-- Run this in the Supabase SQL editor to create all tables.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Explorer profiles
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists explorer_profiles (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  country       text,
  interest      text,           -- comma-separated interest slugs
  whatsapp_optional text,
  created_at    timestamptz not null default now()
);

alter table explorer_profiles enable row level security;

-- Anyone can insert their own profile; reads are open (leaderboard use).
create policy "Insert own profile"
  on explorer_profiles for insert with check (true);

create policy "Read any profile"
  on explorer_profiles for select using (true);

create policy "Update own profile"
  on explorer_profiles for update using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Bookings
-- ─────────────────────────────────────────────────────────────────────────────
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
                     check (status in ('pending','confirmed','cancelled')),
  whatsapp_message text,
  created_at       timestamptz not null default now()
);

alter table bookings enable row level security;

create policy "Insert booking"
  on bookings for insert with check (true);

create policy "Read own bookings"
  on bookings for select using (true);

create policy "Update booking status"
  on bookings for update using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Quest progress
-- ─────────────────────────────────────────────────────────────────────────────
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

create policy "Insert progress"
  on quest_progress for insert with check (true);

create policy "Read progress"
  on quest_progress for select using (true);

create policy "Update progress"
  on quest_progress for update using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Leaderboard entries
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists leaderboard_entries (
  id               uuid primary key default gen_random_uuid(),
  explorer_id      uuid references explorer_profiles(id) on delete set null,
  display_name     text not null,
  total_xp         int not null default 0,
  completed_quests int not null default 0,
  updated_at       timestamptz not null default now()
);

alter table leaderboard_entries enable row level security;

create policy "Insert leaderboard entry"
  on leaderboard_entries for insert with check (true);

create policy "Read leaderboard"
  on leaderboard_entries for select using (true);

create policy "Update own entry"
  on leaderboard_entries for update using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. QR missions
-- ─────────────────────────────────────────────────────────────────────────────
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

create policy "Read active missions"
  on qr_missions for select using (active = true);

-- Admin inserts/updates are done via service role key in a secure context.

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_bookings_explorer    on bookings(explorer_id);
create index if not exists idx_bookings_tour        on bookings(tour_slug);
create index if not exists idx_quest_explorer       on quest_progress(explorer_id);
create index if not exists idx_quest_tour           on quest_progress(tour_slug);
create index if not exists idx_leaderboard_xp       on leaderboard_entries(total_xp desc);
create index if not exists idx_qr_missions_code     on qr_missions(qr_code);
