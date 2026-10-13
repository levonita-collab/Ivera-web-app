# Known Issues — Ivera Web App

Date: 2026-10-12. Ranked by what needs the owner's attention first. Items marked "needs your decision" are deliberately **not** fixed automatically — they involve a real business-rule choice, not a pure code bug.

## 1. ~~"Top 3 today earn a free bonus seat" had no code behind it~~ — RESOLVED (replaced)

Per the owner's decision, the competitive "top 3" promise and the leaderboard were replaced with a non-competitive points-and-prizes system (see `docs/IMPLEMENTATION_LOG.md`, "Rewards system"). Every rule lives in `src/data/rewardRules.ts`:
- **Daily tiers** (points earned in one calendar day, Tbilisi time): 150 XP → small gift from the guide; 300 XP → 10% off next tour; 600 XP + all 3 bonus tasks → 1 free seat. Gold is reachable in one day on Kazbegi, Vardzia and Kutaisi–Martvili: the two latter get an "expedition bonus" (+225 / +200 XP) for completing every mission, so per-mission points printed on existing QR cards stay unchanged.
- **Quest milestones** (one-time): free Key of Tbilisi quest + 1 paid quest → 20% off next tour; 2 fully completed paid quests → 1 free seat.
- **Diploma** for every fully completed quest (downloadable PNG); **personal group song** from Levani after any paid quest (requested via WhatsApp, written by hand).

Prizes are never granted automatically: the Rewards page builds a WhatsApp claim with a deterministic claim code and the evidence (date, points, quests, bonus tasks) for Levani to confirm with the guide. The same reward claimed twice produces the same code, so duplicates are visible in WhatsApp.

**Residual risk, accepted by design for now:** points are still computed client-side (see #3) and claims are tracked only in WhatsApp, not in a database ledger. Human confirmation by Levani/the guide is the control. If volume grows, the next step is a `reward_claims` table (Supabase) with admin approve/redeem buttons in `/admin/orders`.

## 2. ~~The leaderboard isn't actually a leaderboard~~ — RESOLVED (removed)

`/leaderboard` now permanently redirects to `/rewards`. Also removed: a hardcoded fake "Top Explorers" list (`DEMO_PLAYERS` — "Nino G.", "Luka T.", "Mariam K.") that returning users saw on their home dashboard; the earlier audit missed it because it only checked the leaderboard page.

## 3. XP and mission completion are not tamper-proof

Any visitor can open their browser's developer console and grant themselves arbitrary XP or mark any mission "complete" without scanning a QR code or answering anything — this already exists today (not something this session introduced). Today's blast radius is small (XP isn't shown to other users, no money is involved), but if XP ever becomes redeemable for something real (a discount, a prize), this needs server-side proof-of-completion first. Related to #1 and #2 above — worth solving together as one project.

## 4. Admin dashboard's "Est. Value" / discount totals are built from numbers the customer's browser sent, not re-verified

This doesn't affect what anyone is actually charged (PayPal always recomputes independently — see `SECURITY_AUDIT.md` §3), but a booking's stored discount/price fields in Supabase are client-declared at creation time. If you ever rely on the admin dashboard's totals for real bookkeeping, this is worth tightening (restrict those columns to server-only too, like `status`/`payment_status` already are).

## 5. Combo builder silently ignores a tour's own "last seats" discount

If a tour has its own last-minute discount (e.g. "−15%, last seats") and a customer adds it to a multi-tour combo on `/packages`, the combo builder charges that tour's **full price** before applying the combo discount — the last-seats discount just disappears, rather than either stacking or explicitly being the better deal. This is a pre-existing gap, not something this session introduced. Needs your call: should the better of the two discounts apply (matching how single-tour booking already works — "best discount wins, never stacks"), or is dropping it intentional because the combo discount is already meant to be the better deal regardless?

## 6. No rate limiting on the AI endpoints (`/api/ai/*`)

A script could hammer the hint/chat/chronicle endpoints and run up your Gemini API bill. Not fixed this session — needs a decision on where to store rate-limit state (Vercel KV, Upstash Redis, or similar — a small added cost).

## Already fixed this session (no action needed from you)

- Footer copyright year was hardcoded to 2025 — now computed from the real date.
- 6+ person "custom quote" bookings previously never created a record anywhere — you'd only know about them if you personally remembered the WhatsApp conversation. Now they show up in `/admin/orders` like every other booking.
- Three separate, slightly-drifted copies of the multi-tour combo discount percentages — unified into one function.
- The "Pay with PayPal — €X.XX" button could theoretically show a different amount than what's actually charged, if two separate environment variables ever got out of sync. Now the displayed amount always comes from the same source as the real charge.
- A critical security hole in the Next.js framework version itself (multiple CVEs, including remote-code-execution vectors) — upgraded to a patched version.
- 5 real code-quality bugs the linter was already flagging (none were visible to customers, but one — the memoization bug in `/packages` — meant a performance optimization wasn't actually doing anything).
