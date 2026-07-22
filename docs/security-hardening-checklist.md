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

**Do this AFTER step 1 (migration applied), against a Supabase PREVIEW
branch — never against the production project.** Supabase's GitHub
integration auto-creates a preview branch per PR (you'll see a `[supa]:`
bot comment on the PR with its project ref); use that.

The script needs three **test-scoped** env vars — deliberately named
differently from the app's real `NEXT_PUBLIC_SUPABASE_*` vars so it can
never accidentally run against your real `.env.local` by habit:

```
SUPABASE_TEST_URL
SUPABASE_TEST_ANON_KEY
SUPABASE_TEST_SERVICE_ROLE_KEY
```

Get these from the **preview branch's own** Settings → API page (not the
production project's). Pick ONE of these two ways to run it — neither
involves pasting a key into chat, a commit, or a log:

### Option A — GitHub Actions (recommended if you want Claude to see the result)

1. Add the three values above as **repository secrets** (Settings → Secrets
   and variables → Actions → New repository secret) using those exact
   names.
2. Trigger `.github/workflows/rls-test.yml` — Actions tab → "RLS isolation
   test" → **Run workflow** (it's `workflow_dispatch`-only, it never runs
   automatically, so it won't spam test users on every push).
3. GitHub Actions automatically redacts any secret value that appears in
   logs, and the script itself never prints the URL/keys/JWTs/IDs anyway.
4. Share the run URL (or ask Claude to check it via the GitHub API) — the
   PASS/FAIL summary is all that's in the log.

### Option B — run it yourself locally

```bash
# Create an untracked .env.test.local (already covered by .gitignore's
# `.env*` pattern — confirm with `git check-ignore -v .env.test.local`)
node --env-file=.env.test.local scripts/test-rls.mjs
```

Paste the console output back — it only ever prints check names,
PASS/FAIL, and Postgres error codes, never the URL/keys/JWTs/IDs.

### What it checks

Two throwaway auth users + bookings, plus one throwaway anonymous
(not-linked) profile. Verifies: anonymous reads/updates/deletes are
blocked (except the one intentionally-open `whatsapp_opened` column);
anonymous insert only succeeds in the intended shape and can't set
`payment_status`/`status` at creation time; an authenticated user can read
their own booking but not another user's, can't write another user's
booking, can't set protected fields even on their **own** booking
(`payment_status`, `status`, `paypal_order_id`, `paid_amount`,
`paid_currency`, `notes`), and can't insert a booking under another real
user's `explorer_id` (impersonation); the service-role path used by the
admin API / PayPal routes still works. Refuses to run at all if
`SUPABASE_TEST_URL` resolves to the production project ref
(`nslvqdxbpkgqppidwbff`). Cleans up every fixture it created in a `finally`
block regardless of outcome.

**Expected output:** all checks `✅ PASS`. If anything fails, share the
full output (it's pre-redacted, safe to paste) so it can be diagnosed — do
not merge this PR with a failing RLS test.

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
