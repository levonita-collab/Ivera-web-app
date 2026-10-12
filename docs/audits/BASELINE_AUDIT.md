# Baseline Audit — Ivera Web App

Date: 2026-10-12
Scope: ground-truth engineering/security/QA pass requested via the "Master Engineering, Functional Audit & Stabilization" prompt.

## 0. Repository & environment facts (verified directly, not assumed)

- Repo: `levonita-collab/Ivera-web-app`. Stack confirmed from `package.json`: Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind 4, Supabase JS client, Framer Motion. No PayPal SDK package — PayPal is called via raw `fetch` against PayPal's REST API from server routes.
- This session started on branch `claude/ivera-web-app-audit-CzjwF`. That branch was **stale**: its one commit was already merged into `main` as PR #10 months ago, and `main` had since gained ~15 more merged PRs (security hardening, AI guide, PayPal, `/experience`, `/discover`, private tours, etc.). Per this project's own branch-recovery convention, the branch was reset to current `main` (`git checkout -B claude/ivera-web-app-audit-CzjwF origin/main`) before any work began, rather than building on stale history. No work was lost — the stale branch had no unmerged commits.
- Working tree was clean at the start (`git status`: nothing to commit). No uncommitted work existed to preserve.

## 1. Baseline check results (before any fix)

| Check | Result |
|---|---|
| `npm ci` | PASS — 404 packages, clean install |
| `npx eslint .` | **FAIL** — 5 real errors, 4 warnings (see below) |
| `npx tsc --noEmit` | PASS — 0 errors |
| `npm run build` (`next build`) | PASS — all 43 routes built. Note: ESLint is **not** wired into `next build` in this project (no "Running ESLint" step appears in build output), so lint errors do not block deploys today. |
| `npm audit` | **FAIL** — 8 vulnerabilities before any devDependency was touched (1 moderate, 7 high... see Security Audit for the full, more serious list once devDependencies were added) |
| Automated test suite | **NONE EXISTED** — no `test` script, no test framework in `package.json`, no `*.test.*`/`e2e/` files anywhere in the repo |
| CI | One GitHub Actions workflow exists (`.github/workflows/rls-test.yml`), manually-triggered only (`workflow_dispatch`), not run on push/PR |

### The 5 pre-existing ESLint errors (exact baseline, before any fix)

1. `src/app/packages/page.tsx:39` — `useMemo(todayStr, [])` passed a named function reference instead of an inline arrow — incompatible with the React Compiler, which Next 16 runs by default.
2. `src/app/packages/page.tsx:89` — "Compilation Skipped: Existing memoization could not be preserved" — the compiler flagged that `pricing`'s `useMemo` dependency array included `selectedTours`, itself an unmemoized array recomputed every render, so the memoization was never actually effective.
3. `src/components/marketing/ReviewsSection.tsx:60` — two `react/no-unescaped-entities` errors for raw `"` characters around review text.
4. `src/contexts/AuthContext.tsx:61` — `react-hooks/set-state-in-effect`: `setLoading(false)` called synchronously inside a `useEffect` body, flagged as a cascading-render anti-pattern.

All five are fixed — see `IMPLEMENTATION_LOG.md`. Confirmed: `npx eslint .` now returns 0 errors, 0 warnings.

## 2. Prior audit documentation already in the repo

The repo already contains 19 prior audit/runbook documents under `docs/` (technical-audit.md, backend-audit.md, product-audit.md, customer-experience-audit.md, marketing-audit.md, security-hardening-checklist.md, supabase-security-check.md, deployment-reconciliation-audit.md, priority-roadmap.md, and others, spanning 2026-05-26 through 2026-08-01). These were read in full before starting fresh work, specifically to avoid re-diagnosing what was already known and to catch where the doc trail had gone stale relative to current `main`. Key correction made during this audit: several items the old docs call "still open" (free-quest homepage visibility, Levani's photo/founder section, real guest reviews) are **already fixed in current `main`** via later, undocumented work — verified directly against the live code rather than trusted from the docs. See `FUNCTIONAL_AUDIT.md` for the corrected, current-as-of-today status of every item.

## 3. What this audit pass could and could not verify

**Verified directly** (read actual source, ran actual commands, got actual output): all application code, the Supabase schema/migrations/RLS policies as written in the repo, the booking/payment/XP/leaderboard logic, lint/typecheck/build/unit-test/E2E-test results, `npm audit` output, local dev-server behavior.

**BLOCKED — could not verify in this session:**
- **Live production Supabase state.** The Supabase MCP connector failed to connect this session (`ERR_PROXY_TUNNEL`). This means: whether migration `007_security_hardening.sql` was actually applied to the **production** database (vs. just existing as a file in the repo), whether `SUPABASE_SERVICE_ROLE_KEY`/`ADMIN_EMAILS` are set in production, and real production row counts/data could not be checked from here.
- **Live Vercel production environment variables.** The Vercel MCP connector is connected, but a direct attempt to list this project's environment variable names returned `403 Forbidden` — this session's Vercel access does not include env-var read permission. Whether `ADMIN_EMAILS`, `PAYPAL_MODE`, `PAYPAL_WEBHOOK_ID`, `GEMINI_API_KEY`, etc. are actually set in the live Vercel project is unverified.
- **PayPal live/sandbox mode and real payment capture.** No PayPal sandbox credentials are available in this session; the PayPal code paths were audited by reading the code, not by executing a real sandbox transaction.
- **Whether a real beta tour or any of the five manual QA scripts in `docs/` (`production-smoke-test.md`, `ai-production-smoke-test.md`, `paypal-sandbox-test.md`, `controlled-beta-runbook.md`, `beta-qa-script.md`) were ever actually run.** All five remain blank-checkbox templates in the repo with no recorded results.

These are flagged as **BLOCKED**, not assumed safe or unsafe. See `DEPLOYMENT_CHECKLIST.md` for exactly what the owner needs to check manually for each one, with precise steps.
