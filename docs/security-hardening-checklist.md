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

Two **completely separate** sets of secrets — don't cross them. Neither
set is ever prefixed `NEXT_PUBLIC_`.

### 2a. Production runtime (Vercel → Project → Settings → Environment Variables)

These power the live app. Set them for the Production (and Preview, if you
want `/admin/orders` to work on preview deployments too) environment.

| Variable | Where to get it | Required? |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → **production** project → Project Settings → API → `service_role` key | **Yes** — the admin API and PayPal routes won't function without it (they'll return 503, not crash) |
| `ADMIN_EMAILS` | Your own choice — comma-separated list, e.g. `levani@example.com` | **Yes** — without it, every admin request gets 403 |
| `PAYPAL_WEBHOOK_ID` | See step 3 below | Optional — the webhook route no-ops safely without it; the existing client-driven capture flow is unaffected |

After adding these in Vercel, redeploy (or trigger a new deployment) so the
running app picks them up.

### 2b. RLS test (GitHub → repo → Settings → Secrets and variables → Actions)

These are **only** used by `scripts/test-rls.mjs` / the `rls-test.yml`
workflow, against the **preview** branch — never the production project.
They must never be set as `NEXT_PUBLIC_` and must never be reused as the
production values above.

| Secret name | Value |
|---|---|
| `SUPABASE_TEST_URL` | The preview branch's own Project URL (Settings → API on the **preview** branch, ref `pvqnwfbmeeiwrnawaacs` — see the `[supa]:` bot comment on this PR) |
| `SUPABASE_TEST_ANON_KEY` | The preview branch's own anon/publishable key |
| `SUPABASE_TEST_SERVICE_ROLE_KEY` | The preview branch's own service_role key — used only for test fixture setup/teardown, never for the isolation assertions themselves |
| `SUPABASE_TEST_EXPECTED_REF` | `pvqnwfbmeeiwrnawaacs` — pins the test to this exact preview branch; the script refuses to run if the resolved ref doesn't match |

I (Claude) cannot create these secrets myself — GitHub doesn't expose a way
to set a repository secret's value through the API in a way that lets me
supply it, and I don't have the actual key values regardless. Add them via
the GitHub UI, then either trigger the workflow yourself or tell me to
trigger it (I can do that part, and read back the result).

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
(not-linked) profile.

| Check | Expected result |
|---|---|
| Anonymous reads bookings | **DENIED** |
| Anonymous inserts a booking (intended shape — no protected fields) | **ALLOWED** |
| Anonymous inserts a booking with `payment_status`/`status` set | **DENIED** |
| Anonymous updates a protected field (`notes`) | **DENIED** |
| Anonymous updates `whatsapp_opened` (intended exception) | **ALLOWED** |
| Anonymous deletes a booking | **DENIED** |
| User A reads their own booking | **ALLOWED** |
| User A reads User B's booking | **DENIED** |
| User A updates/deletes User B's booking | **DENIED** |
| User A sets protected fields (`payment_status`, `status`, `paypal_order_id`, `paid_amount`, `paid_currency`, `notes`) on their **own** booking | **DENIED** |
| User A inserts a booking under User B's `explorer_id` (impersonation) | **DENIED** |
| User A inserts a booking under their own `explorer_id` | **ALLOWED** |
| Service-role (admin/PayPal path) sets protected fields | **ALLOWED** |
| Cleanup, even after a failed check above | **PASS** |

A row marked **DENIED** passing means the database rejected it — that
denial IS the pass condition, not a test-process error. The script reports
each row as `✅ PASS` / `❌ FAIL` against its expected outcome, not against
"did it error."

Refuses to run at all if `SUPABASE_TEST_URL` resolves to the production
project ref (`nslvqdxbpkgqppidwbff`), or (if `SUPABASE_TEST_EXPECTED_REF`
is set) doesn't match that exact ref. Cleans up every fixture it created in
a `finally` block regardless of outcome.

**Expected output:** all checks `✅ PASS`. If anything fails, share the
full output (it's pre-redacted, safe to paste) so it can be diagnosed — do
not merge this PR with a failing RLS test.

---

## 6. Smoke-test the new API routes end-to-end

The RLS test proves the database enforces isolation. It does **not**
exercise the new Next.js routes on top of it (auth header handling, status
transition validation, PayPal amount/idempotency logic). Run these against
the preview deployment before merging. None of this needs credentials
pasted anywhere — it's you, signed in as yourself, clicking through the
live preview.

### 6a. Admin

| Check | Expected |
|---|---|
| A normal (non-admin) signed-in user opens `/admin/orders` | Sees the "Not authorized" screen, not the dashboard |
| An email outside `ADMIN_EMAILS` signs in and visits `/admin/orders` | 403 → "Not authorized" screen showing that email |
| An allowed admin email visits `/admin/orders` | Sees the bookings list |
| An allowed admin changes a booking to a valid next status (e.g. pending → confirmed) | Succeeds, UI updates |
| An allowed admin attempts an invalid transition (e.g. completed → pending) — no button renders for it in the UI, so test via a direct `PATCH /api/admin/bookings/[id]/status` with an out-of-sequence status | 409, no change |
| Two admins (or two tabs) submit conflicting status changes on the same booking around the same time | The second one gets a 409 ("changed concurrently"), not a silent overwrite — this is the `.eq("status", current)` guard in `updateBookingStatusServer` |

### 6b. PayPal (Sandbox — `PAYPAL_MODE` unset or `sandbox`)

| Check | Expected |
|---|---|
| Order is created for a fixed-price tour | Amount matches the server's own recalculated price (`create-order` never trusts a client-sent amount) |
| Attempt to tamper with the amount client-side before hitting "Pay" | No effect — the EUR amount sent to PayPal comes from `calculateTourPrice()` on the server, not from anything the browser sent |
| Click "Pay with PayPal" twice in quick succession / double-submit | No second charge — the `PayPal-Request-Id` idempotency key means PayPal returns the same order for a repeat request |
| Capture completes | The captured order ID matches the booking it was linked to (`capture-order` rejects a mismatched order — 403) |
| After capture | `payment_status` becomes `paid` **only** via the service-role write in `capture-order` / the webhook — never via a client-writable column |
| Refresh the success page right after paying | No duplicate capture — `capture-order` short-circuits to `alreadyPaid: true` |
| Send an invalid/forged webhook signature (PayPal dashboard → webhook page has a signature-tamper test, or just POST to `/api/paypal/webhook` without the `paypal-transmission-sig` header) | 401, rejected |
| Send the same valid webhook event twice (PayPal's own retry behavior, or **Resend** in the dashboard) | Second delivery is a no-op — `markBookingPaidServer`'s `.eq("payment_status", "unpaid")` guard means only the first actually changes anything |
| Simulate closing the tab right after PayPal approval, before `capture-order` runs (easiest via the webhook test-simulation for `PAYMENT.CAPTURE.COMPLETED`, since a real half-finished checkout is awkward to force) | Booking still ends up `paid` — the webhook is the independent-of-browser path |
| Compare the booking in `/admin/orders` and the customer's `/my-trip` | Same amount, same status, both reflecting the single source of truth in `bookings` |

---

## When everything above passes

Reply on the PR (or tell your engineer) that verification passed, including
the `test-rls.mjs` output and a note on the 6a/6b smoke tests. That's the
signal this PR is safe to merge and that IVERA is ready to move to the
final polishing phase before running paid ads, per the original request.
