# Supabase Migration Checklist

How to run each database migration safely.  
Open **Supabase Dashboard → SQL Editor → New query**, paste the SQL, and click **Run**.

---

## Migration 001 — Enhance Bookings Table

**File:** `supabase/migrations/001_enhance_bookings.sql`  
**Status:** ✅ REQUIRED — booking system will not save records without this  
**Safe to re-run:** Yes — all statements use `IF NOT EXISTS`

### What it does

Adds new columns to the `bookings` table:

| Column | Type | Purpose |
|---|---|---|
| `booking_code` | text | Human-readable code (`IVERA-YYYYMMDD-XXXX`) |
| `customer_name` | text | Explorer's name at time of booking |
| `customer_phone` | text | Optional phone (reserved) |
| `customer_email` | text | Optional email (reserved) |
| `tour_category` | text | Tour type (culture / adventure / wine / heritage) |
| `base_price_per_person` | numeric | Price before discount |
| `base_total` | numeric | Pre-discount total |
| `discount_applied` | numeric | Discount % applied |
| `discount_reason` | text | Why discount was applied |
| `savings` | numeric | GEL amount saved |
| `final_price_per_person` | numeric | Price after discount |
| `final_total` | numeric | Final amount the customer pays |
| `currency` | text | Always `GEL` |
| `seats_left_at_booking` | integer | Seats remaining at booking time |
| `xp_reward` | integer | XP awarded for this booking |
| `whatsapp_opened` | boolean | Whether user opened WhatsApp |
| `notes` | text | Internal notes |
| `updated_at` | timestamptz | Last modified time |

Also creates:
- Unique index on `booking_code` (excludes NULLs)
- Performance indexes on `created_at` and `status`
- Backfills `booking_code` for any existing rows that lack one

### How to verify it worked

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name IN ('booking_code', 'final_total', 'xp_reward', 'whatsapp_opened')
ORDER BY column_name;
```

Expected: 4 rows returned.

---

## Migration 002 — AI Interactions Logging Table

**File:** `supabase/migrations/002_ai_interactions.sql`  
**Status:** ⚙️ OPTIONAL — app works perfectly without this  
**Safe to re-run:** Yes — uses `CREATE TABLE IF NOT EXISTS`

### What it does

Creates a new table `ai_interactions` to log every AI feature usage:

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `explorer_id` | uuid | Which explorer triggered this (nullable) |
| `interaction_type` | text | One of: `quest_hint`, `hero_chronicle`, `recommendation` |
| `tour_slug` | text | Which tour (nullable) |
| `mission_id` | text | Which mission (nullable) |
| `input_summary` | text | Brief description of input sent to AI |
| `output_summary` | text | First 120 chars of AI response |
| `created_at` | timestamptz | When the interaction happened |

Also creates:
- 3 performance indexes (by explorer, type, date)
- Row Level Security enabled
- Insert policy: any authenticated or anonymous call can insert
- Read policy: anyone can read (tighten this when admin auth is ready)

### How to verify it worked

```sql
SELECT table_name, row_security
FROM information_schema.tables
WHERE table_name = 'ai_interactions';
```

Expected: 1 row, `row_security = YES`.

### Important

If this table does NOT exist, the app logs a silent failure and continues normally.  
The AI features (hints, chronicle, recommendations) work whether or not this migration is run.  
Only run this if you want to monitor AI usage in the Supabase dashboard.

---

## How to Run a Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`nslvqdxbpkgqppidwbff`)
3. Left sidebar → **SQL Editor**
4. Click **+ New query**
5. Open the migration file from `supabase/migrations/` and paste the entire content
6. Click **Run** (green button, top right)
7. Check the output: should say `Success. No rows returned.` for DDL statements
8. Run the verification query from the section above to confirm

---

## Migration Order

| Order | File | Required | Run Before |
|---|---|---|---|
| 1 | `001_enhance_bookings.sql` | ✅ Yes | First booking attempt |
| 2 | `002_ai_interactions.sql` | ⚙️ Optional | Using AI features |

Always run `001` before `002`. Migration `001` must exist before any booking is created from the live app.
