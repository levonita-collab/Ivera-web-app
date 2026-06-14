# PayPal Setup Checklist (Sandbox)

One-time setup steps for the project owner before running the
[sandbox QA test plan](./paypal-sandbox-test.md). Complete both sections
below **before** the first sandbox booking is created.

---

## 1. Run the Supabase migration

**File:** `supabase/migrations/004_paypal_payments.sql`
**Status:** ✅ REQUIRED before any PayPal booking is created
**Safe to re-run:** Yes — all statements use `IF NOT EXISTS`

### Steps

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → select the Ivera project.
2. Left sidebar → **SQL Editor** → **+ New query**.
3. Open `supabase/migrations/004_paypal_payments.sql` in this repo, copy the entire contents, and paste it into the query editor.
4. Click **Run** (top right). It should report `Success. No rows returned.`

### What it does

Adds the following columns to the `bookings` table (all additive — existing
rows are unaffected except for the default backfill described below):

| Column | Type | Purpose |
|---|---|---|
| `payment_method` | text, default `'whatsapp'` | `'whatsapp'` or `'paypal'` |
| `payment_status` | text, default `'unpaid'` | `'unpaid'`, `'paid'`, or `'refunded'` |
| `paypal_order_id` | text | PayPal order ID once a PayPal payment is started |
| `paid_amount` | numeric(10,2) | Amount captured (EUR) |
| `paid_currency` | text | Currency of the captured amount (`'EUR'`) |
| `paid_at` | timestamptz | When payment was captured |

Also creates:
- An index on `payment_status` (used by the admin dashboard).
- A **unique** index on `paypal_order_id` (excluding NULLs) — guarantees one PayPal order can never settle two bookings.

### How to verify it worked

Run this in the SQL editor:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name IN (
    'payment_method', 'payment_status', 'paypal_order_id',
    'paid_amount', 'paid_currency', 'paid_at'
  )
ORDER BY column_name;
```

Expected: 6 rows returned, with `payment_method` defaulting to `'whatsapp'`
and `payment_status` defaulting to `'unpaid'`.

Then confirm existing (pre-migration) bookings were backfilled correctly:

```sql
SELECT payment_method, payment_status, count(*)
FROM bookings
GROUP BY payment_method, payment_status;
```

Expected: every existing booking row shows `payment_method = 'whatsapp'`
and `payment_status = 'unpaid'`. Nothing should be `'paid'` yet — that only
happens after a real PayPal capture.

---

## 2. Configure environment variables (Vercel)

Go to **Vercel Dashboard → Project → Settings → Environment Variables** and
add the following. Until these are set, the "Pay with PayPal" option stays
hidden and WhatsApp booking is unaffected.

| Variable | Example value | Visibility | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `AeA1...sandbox-client-id` | **Public** — sent to the browser | Used to load the PayPal JS SDK. Get it from your **Sandbox** REST app in the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications). |
| `PAYPAL_CLIENT_SECRET` | `EL3x...sandbox-secret` | **Sensitive — server only** | Never prefixed with `NEXT_PUBLIC_`. Only read by `src/lib/paypal/server.ts`, used to fetch an OAuth token for the create/capture order API routes. Must never appear in client bundles, logs, or commits. |
| `PAYPAL_MODE` | `sandbox` | Server only | Selects the PayPal API base URL (`api-m.sandbox.paypal.com` vs `api-m.paypal.com`). **Must stay `sandbox` until the full checklist in `docs/paypal-sandbox-test.md` passes and the payment/refund policy is published.** |
| `PAYPAL_GEL_EUR_RATE` | `0.34` | Server only | The **source of truth** GEL→EUR conversion rate. The `/api/paypal/create-order` route always recalculates the charge amount from this value — the client-supplied price is never trusted. |
| `NEXT_PUBLIC_PAYPAL_GEL_EUR_RATE` | `0.34` | **Public** — sent to the browser | Display-only estimate shown to the user before the order is created (e.g. "Pay with PayPal — €X.XX" button label). Has no effect on the actual charge. Keep this in sync with `PAYPAL_GEL_EUR_RATE` so the displayed estimate matches the real charge; if they drift, only the server value is ever charged. |

### Notes

- All five variables are **optional**. If `NEXT_PUBLIC_PAYPAL_CLIENT_ID` or
  `PAYPAL_CLIENT_SECRET` is missing, `isPayPalConfigured()` returns false, the
  PayPal section is not rendered, and `/api/paypal/*` routes return an error
  without crashing the app.
- If `PAYPAL_GEL_EUR_RATE` / `NEXT_PUBLIC_PAYPAL_GEL_EUR_RATE` are unset, both
  client and server fall back to the same hardcoded default
  (`DEFAULT_GEL_EUR_RATE = 0.34` in `src/lib/paypal/currency.ts`).
- After adding/changing any of these, redeploy (or restart `npm run dev`
  locally with the equivalent values in `.env.local` — see
  `.env.local.example`).
- Review `PAYPAL_GEL_EUR_RATE` against the current National Bank of Georgia
  rate periodically, and definitely before switching `PAYPAL_MODE` to `live`.

---

## Sign-off

- [ ] Migration 004 run and verified (Section 1).
- [ ] All 5 env vars set in Vercel for the environment(s) used for sandbox testing.
- [ ] `PAYPAL_MODE=sandbox` confirmed (not `live`).
- [ ] Proceed to [`docs/paypal-sandbox-test.md`](./paypal-sandbox-test.md) for the manual QA checklist.
