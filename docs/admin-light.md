# Ivera — Admin Light Guide

Quick reference for managing the Ivera Supabase backend without a full admin UI.

---

## 1. Environment variables

| Variable | Where to set | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Supabase anon/public key |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Vercel + `.env.local` | WhatsApp number (no `+`) |

> **Offline mode**: if the Supabase vars are missing or empty, the app works fully from localStorage. No errors are shown to users.

---

## 2. Supabase schema setup

1. Go to your Supabase project → **SQL Editor**
2. Paste the contents of `supabase/schema.sql`
3. Run — all 5 tables and RLS policies are created

---

## 3. Tables overview

| Table | Purpose | Key columns |
|---|---|---|
| `explorer_profiles` | One row per registered explorer | `id`, `name`, `country`, `interest` |
| `bookings` | Captured before each WhatsApp open | `tour_slug`, `selected_date`, `people_count`, `status` |
| `quest_progress` | Mission completions per explorer | `explorer_id`, `tour_slug`, `mission_id`, `points_earned` |
| `leaderboard_entries` | Aggregated XP + completed quests | `display_name`, `total_xp`, `completed_quests` |
| `qr_missions` | QR codes for real in-field scanning | `qr_code` (unique), `location_name`, `points`, `active` |

---

## 4. Booking status workflow

Bookings move through these statuses. Update manually in Supabase → Table Editor → bookings → edit the `status` cell.

| Status | Meaning |
|---|---|
| `pending` | WhatsApp opened, Levani hasn't replied yet |
| `contacted` | Levani sent a WhatsApp reply |
| `confirmed` | Customer confirmed, date is locked |
| `completed` | Tour has happened |
| `cancelled` | Booking cancelled by either party |

To update via SQL:
```sql
update bookings set status = 'confirmed' where id = '<booking-uuid>';
```

In Supabase **Table Editor → bookings**, you can:
- See all bookings by status
- Filter by `tour_slug` to see demand per tour
- Click any cell to edit the `status` value directly

---

## 5. Viewing the leaderboard

`leaderboard_entries` is the source of truth for displayed XP.  
It is updated automatically every time a mission is completed (background sync).

To see top explorers:
```sql
select display_name, total_xp, completed_quests
from leaderboard_entries
order by total_xp desc
limit 20;
```

---

## 6. Managing QR missions

Insert a QR mission manually via SQL:
```sql
insert into qr_missions (tour_slug, mission_id, qr_code, location_name, points, unlock_text)
values (
  'tbilisi-city-quest',
  'mission-narikala',
  'ivera::tbilisi-city-quest::mission-narikala',
  'Narikala Fortress',
  150,
  'You''ve reached the ancient fortress that has guarded Tbilisi for 1,500 years.'
);
```

To deactivate a mission (e.g. location closed):
```sql
update qr_missions set active = false where mission_id = 'mission-narikala';
```

---

## 7. Booking demand report

```sql
select
  tour_slug,
  count(*) as total_bookings,
  sum(people_count) as total_people,
  sum(total_price) as revenue_gel
from bookings
where status != 'cancelled'
group by tour_slug
order by total_bookings desc;
```

---

## 8. Data flow summary

```
User action          →  localStorage (instant)  →  Supabase (background, silent)
─────────────────────────────────────────────────────────────────────────────────
Create Explorer Pass →  ivera_profile            →  explorer_profiles
Complete mission     →  ivera_quest_{slug}       →  quest_progress + leaderboard_entries
Open WhatsApp book   →  (none)                   →  bookings (status=pending)
```

All Supabase writes are fire-and-forget. If they fail (no network, missing env vars), the user experience is unaffected.

---

## 9. Owner daily workflow

Run these in Supabase → **SQL Editor** each morning.

**New bookings to action:**
```sql
select *
from bookings
where status = 'pending'
order by created_at desc;
```

**Confirmed upcoming tours:**
```sql
select *
from bookings
where status = 'confirmed'
order by selected_date asc;
```

**Recent quest completions:**
```sql
select *
from quest_progress
order by completed_at desc
limit 50;
```

**Full leaderboard:**
```sql
select *
from leaderboard_entries
order by total_xp desc;
```

---

## 10. Adding Supabase to Vercel

1. Vercel dashboard → your project → **Settings → Environment Variables**
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy (or trigger via push)

Values are found in Supabase → **Project Settings → API**.
