# Security Hardening — Apply & Verify Checklist

Manual steps to apply and verify this PR against your real Supabase/PayPal
project. This PR's author (Claude, in a sandboxed environment with no live
Supabase/PayPal credentials) could not run these steps — they need to be
run by whoever has access to the project.

Do these in order. Each step says how to know it worked.

---

## 1. Apply the migration

**File:** `supabase/migrations/007_security_hardening.sql`

Open **Supabase Dashboard → SQL Editor → New query**, paste the entire file
contents, and click **Run**. It's idempotent (safe to re-run).

**What it changes:** see `docs/supabase-security-check.md` for the full
table-by-table before/after. Short version — `bookings` and
`explorer_profiles` stop being world-readable/writable via the anon key;
`ai_interactions` stops being world-readable.

**Verify it worked:**
```sql
select tablename, policyname, cmd
from pg_policies
where tablename in ('bookings', 'explorer_profiles', 'ai_interactions')
order by tablename, cmd;
```
Expect to see `"Read own bookings"` and `"Update whatsapp-opened flag only"`
on `bookings`, `"Read own profile"` on `explorer_profiles`, and no SELECT
policy at all on `ai_interactions`.

---

## 2. Add the new environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (and
your local `.env.local` if you develop locally). None of these are
`NEXT_PUBLIC_` — they must stay server-only.

| Variable | Where to get it | Required? |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → `service_role` key | **Yes** — the admin API and PayPal routes won't function without it (they'll return 503, not crash) |
| `ADMIN_EMAILS` | Your own choice — comma-separated list, e.g. `levani@example.com` | **Yes** — without it, every admin request gets 403 |
| `PAYPAL_WEBHOOK_ID` | See step 3 below | Optional — the webhook route no-ops safely without it; the existing client-driven capture flow is unaffected |

After adding these in Vercel, redeploy (or trigger a new deployment) so the
running app picks them up.

---

## 3. Register the PayPal webhook (optional but recommended)

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications) → your app (sandbox or live, matching `PAYPAL_MODE`).
2. Under **Webhooks**, click **Add Webhook**.
3. URL: `https://<your-production-domain>/api/paypal/webhook`
4. Subscribe to: `PAYMENT.CAPTURE.COMPLETED` and `PAYMENT.CAPTURE.REFUNDED`.
5. Copy the generated **Webhook ID** into `PAYPAL_WEBHOOK_ID`.

**Why this matters:** if a customer approves payment in the PayPal popup and
closes the tab before the app's own capture-order call finishes, PayPal
already charged them but our database never heard about it. The webhook is
PayPal telling us directly, independent of the browser — so the booking
still gets marked paid.

**Verify it worked:** in the PayPal dashboard's webhook page, use **Send
test webhook simulation** for `PAYMENT.CAPTURE.COMPLETED` for a real linked
order (or a fresh sandbox purchase), then check your Vercel function logs
for `/api/paypal/webhook` — should show `verified: true`.

---

## 4. Add yourself to the admin allowlist and sign in

1. Make sure your email is in `ADMIN_EMAILS` (step 2).
2. Sign in on the live site with an Explorer Pass account using that exact
   email (Sign Up / Sign In → same auth system as everywhere else on the
   site — there's no separate admin login anymore).
3. Visit `/admin/orders`.

**Expected:**
- Not signed in → "Sign In" prompt (no more token field).
- Signed in, email not in `ADMIN_EMAILS` → "Not authorized" screen showing
  your email, telling you to ask for access.
- Signed in, email in `ADMIN_EMAILS` → the orders dashboard loads normally.

Try changing a booking's status and confirm it updates. Try the "Mark
refunded" button on a paid booking (only appears once `payment_status` is
`paid`).

---

## 5. Run the RLS isolation test

**Do this AFTER step 1 (migration applied).**

```bash
node --env-file=.env.local scripts/test-rls.mjs
```

(Or export the three required vars — `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — in
your shell first if you're not using a `.env.local`.)

The script creates two throwaway auth users + bookings, checks that user A
can read their own booking but not user B's, can't write user B's status or
notes, confirms the intentionally-open `whatsapp_opened` column still works
for anyone, confirms a fully anonymous client reads zero bookings — then
deletes everything it created.

**Expected output:** `5/5 checks passed.` If anything fails, paste the full
output back so it can be diagnosed — do not merge this PR with a failing
RLS test.

---

## 6. Smoke-test the PayPal flow end-to-end

Using PayPal Sandbox credentials (`PAYPAL_MODE` unset or `sandbox`):

1. Book a fixed-price tour, choose "Pay with PayPal", complete a sandbox
   payment.
2. Confirm the booking shows `payment_status: paid` in `/my-trip` and in
   `/admin/orders`.
3. Refresh the success page (or resubmit the same capture request) —
   confirm it doesn't double-charge or error; `capture-order` should return
   `alreadyPaid: true` instantly.
4. If you configured the webhook (step 3), also confirm the webhook log
   shows the event and that the booking would still end up `paid` even if
   you simulate closing the tab right after PayPal approval (test webhook
   simulation is the easiest way to check this without a real half-finished
   checkout).

---

## When all six steps pass

Reply on the PR (or tell your engineer) that verification passed, including
the `test-rls.mjs` output. That's the signal this PR is safe to merge and
that IVERA is ready to move to the final polishing phase before running
paid ads, per the original request.
