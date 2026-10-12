# Known Issues — Ivera Web App

Date: 2026-10-12. Ranked by what needs the owner's attention first. Items marked "needs your decision" are deliberately **not** fixed automatically — they involve a real business-rule choice, not a pure code bug.

## 1. "Daily Quest Challenge: Top 3 today earn a free bonus seat" — this promise has no code behind it (needs your decision)

The homepage/leaderboard advertise, word for word: *"The 3 highest-scoring explorers each day earn a free bonus seat on any Ivera tour."* There is **no code anywhere** that computes a daily top-3 or grants anything — no cron job, no Supabase function, nothing. It's static marketing text (`src/components/marketing/DailyQuestChallenge.tsx` + `src/lib/i18n/dictionary.ts`).

**This might already be fine in practice if you personally track and honor this manually** (e.g. you check the leaderboard yourself and message the top 3 on WhatsApp) — I don't know your actual process, so I didn't change the copy. If that's NOT happening, a real customer could complete quests expecting a reward that never arrives, which is a trust problem worth fixing before this gets more traffic. Options, your call:
- **(a)** Keep the promise, and I build the real mechanism (requires: deciding whether the leaderboard needs sign-in to be fair, what timezone "daily" resets in, and how a "bonus seat" actually gets fulfilled/tracked as redeemed).
- **(b)** Soften the copy to something always-true today, e.g. "Top explorers get noticed — message us your XP for a surprise," until the real mechanism exists.
- **(c)** Tell me you already do this manually and it's fine as-is.

## 2. The leaderboard isn't actually a leaderboard yet (lower priority than #1)

It only ever shows your own XP, never other real travellers — confirmed honest (no fake data), but the name implies competition that doesn't exist yet. Building a real cross-user ranking requires: deciding if anonymous (not-signed-in) players should be rankable at all (today's RLS setup makes that hard to do safely), and whether you want public rankings to show real names. Flagged, not built, pending that decision.

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
