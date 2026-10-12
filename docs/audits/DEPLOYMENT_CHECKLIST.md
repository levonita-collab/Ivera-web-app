# Deployment Checklist — Ivera Web App

This covers (a) how a normal change ships, and (b) the specific manual checks needed before/after merging this audit's branch, written for someone who isn't a professional developer. See `docs/BEGINNER_RUNBOOK.md` for a slower, step-by-step version of the Git/GitHub parts.

## A. Normal deploy flow for this project (already in place, nothing to change)

1. Work happens on a feature branch, never directly on `main`.
2. A Pull Request (PR) is opened on GitHub. Vercel automatically builds a **Preview** deployment for that PR — a live, working URL you can click and test before anything goes to the real site.
3. Once you're happy with the preview, the PR is merged into `main`.
4. Vercel automatically deploys `main` to **production** (your real site) within a minute or two of the merge.
5. **Rollback:** in the Vercel dashboard → your project → Deployments tab, every previous production deployment stays listed with its own URL. Click the three-dot menu on any earlier one → "Promote to Production" to instantly roll back — no code changes or waiting needed.

## B. Before merging THIS audit's branch — what you (the owner) need to check

I could not check these myself this session — not because they're necessarily broken, but because my access to your live Supabase and Vercel accounts is limited in this sandboxed session. None of these block the code changes from being safe to merge; they're about whether your **production environment** (separate from the code) is configured correctly.

### 1. Confirm the security-hardening database migration is actually applied to production

- Open your Supabase project dashboard → SQL Editor.
- Run: `select policyname from pg_policies where tablename = 'bookings';`
- You should see policy names including `"Read own bookings"` and `"Insert booking (no impersonation)"`. If instead you see something generic like `"Enable read access for all users"` or nothing at all, the migration in `supabase/migrations/007_security_hardening.sql` has not been applied to production yet — copy its contents into the SQL Editor and run it.

### 2. Confirm these environment variables are set in Vercel (Project → Settings → Environment Variables)

- `SUPABASE_SERVICE_ROLE_KEY` — required for the admin dashboard and PayPal routes to work at all. Get it from Supabase → Project Settings → API → `service_role` key. **Never share this value or put it in a file prefixed `NEXT_PUBLIC_`.**
- `ADMIN_EMAILS` — your own sign-in email (the one you'll use to log into `/admin/orders`), comma-separated if more than one person needs access. If this is missing, the admin dashboard will deny everyone (safe default, but you won't be able to use it either).
- `PAYPAL_GEL_EUR_RATE` and `NEXT_PUBLIC_PAYPAL_GEL_EUR_RATE` — should be set to the **same number**, reviewed against a current GEL→EUR rate. (After this session's fix, the actual charge screen always uses the server-side value regardless, so this mainly affects the pre-click button text — but keeping them in sync avoids any confusing moment.)
- `GEMINI_API_KEY` — if unset, AI hint/chat features silently fall back to generic text instead of erroring. Worth checking this is set and the key is fresh (a prior internal doc flagged an old key as possibly compromised/rotated — confirm whichever key is live now is one you generated yourself).
- `PAYPAL_MODE` — should read `sandbox` until you've deliberately decided to go live with real payments, then `live`.

### 3. Run the RLS isolation test against a Supabase *preview* branch (never production)

This repo already has a ready-made test for exactly this (`scripts/test-rls.mjs`), wired to a GitHub Action (`.github/workflows/rls-test.yml`) that you trigger manually:
- GitHub → your repo → Actions tab → "RLS Isolation Test" (left sidebar) → "Run workflow" button.
- It needs `SUPABASE_TEST_URL` / `SUPABASE_TEST_*` secrets pointed at a **preview** Supabase branch, not your real database (it creates and deletes test users/rows). If those secrets aren't set yet, this step is skippable for now but should be set up before heavy marketing traffic.

### 4. If you plan to accept real payments soon

- Read `docs/paypal-setup-checklist.md` and `docs/paypal-sandbox-test.md` (already in the repo) and actually click through the 10-point sandbox test plan with a real PayPal sandbox account — no record exists that this was ever done.
- Publish the payment/refund policy page content you're comfortable with (the page already exists at `/payment-policy` — just make sure the wording reflects your real policy).
- Only then flip `PAYPAL_MODE` to `live`.

## C. Quick local commands (run from the project folder in a terminal)

```bash
npm ci              # install exact dependencies
npm run lint         # should show 0 errors
npx tsc --noEmit      # should show nothing (no errors)
npm test             # unit tests — should say "23 passed"
npm run test:e2e     # end-to-end tests — should say "6 passed"
npm run build         # production build — should finish without errors
```

If any of these fail after a future change, don't deploy until it's green again — that's exactly what they're there to catch.
