# PayPal Sandbox Test Plan

Manual QA checklist for the PayPal payment option added in
`claude/ivera-web-app-audit-CzjwF`. Run this **in PayPal Sandbox only** —
do not set `PAYPAL_MODE=live` until every test below passes and the
business has a published payment/refund policy.

Before starting, complete [`docs/paypal-setup-checklist.md`](./paypal-setup-checklist.md)
(run the Supabase migration and set the Vercel env vars).

## Setup

1. Create a PayPal Developer account → https://developer.paypal.com/dashboard/applications
2. Create a **Sandbox** REST app and note the Client ID + Secret.
3. Create two Sandbox test accounts (Dashboard → Sandbox → Accounts):
   - one **Business** account (acts as Ivera's PayPal account)
   - one **Personal** account with funds (acts as the traveller paying)
4. Set the following in `.env.local` (and restart `npm run dev`):
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=<sandbox client id>
   PAYPAL_CLIENT_SECRET=<sandbox client secret>
   PAYPAL_MODE=sandbox
   ```
5. Open Supabase Table Editor on the `bookings` table in a second tab.

---

## 1. Missing env vars → PayPal button hidden

- [ ] Comment out `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and restart the dev server.
- [ ] Open any fixed-price tour page (e.g. `/tours/tbilisi-city-quest`).
- [ ] Confirm **no** "Pay with PayPal" section is rendered.
- [ ] Confirm "Book via WhatsApp" still works normally.
- [ ] Restore the env var and restart before continuing.

## 2. Fixed-price tour → PayPal button visible

- [ ] Open `/tours/tbilisi-city-quest` (or any tour with a numeric `pricePerPersonGel`).
- [ ] Select a date and people count (1–5, below the "custom group" threshold).
- [ ] Confirm the "or pay online now" divider and **Pay with PayPal — €X.XX** button appear below the WhatsApp CTA.
- [ ] Confirm the EUR amount note ("PayPal payments are processed in EUR…") is visible.
- [ ] Confirm the GEL price in the summary box above is unchanged.

## 3. Batumi / Price on Request → PayPal button hidden

- [ ] Open the Batumi 3-Day Black Sea Quest tour (`pricePerPersonGel: null`).
- [ ] Confirm only the "Request Price via WhatsApp" CTA is shown.
- [ ] Confirm **no** PayPal section is rendered.
- [ ] Repeat for any tour where selecting 6+ people triggers `needsQuote` (group quote) — confirm PayPal is hidden in that state too.

## 4. Create PayPal sandbox order

- [ ] On a fixed-price tour, select date + people, click **Pay with PayPal**.
- [ ] Confirm a new row appears in Supabase `bookings` with `payment_method = 'paypal'`, `payment_status = 'unpaid'`.
- [ ] Confirm the PayPal Smart Buttons render below the "Pay with PayPal" area.
- [ ] In DevTools Network tab, inspect the `/api/paypal/create-order` request/response:
  - Request body has `tourSlug`, `peopleCount`, `bookingCode`, `bookingId`.
  - Response has `{ id: "<PAYPAL_ORDER_ID>", eurAmount: <number> }`.
- [ ] Confirm the Supabase row's `paypal_order_id` now equals the returned order ID (set by `linkPaypalOrder`).
- [ ] **Tamper test**: try resubmitting `/api/paypal/create-order` with a `peopleCount` that doesn't match what you selected (e.g. via DevTools) and confirm the returned `eurAmount` is recalculated server-side from `tourSlug` + `peopleCount`, never trusting a client-supplied price.

## 5. Capture sandbox payment

- [ ] Click the rendered PayPal button → PayPal popup/redirect opens.
- [ ] Log in with the **Personal** sandbox test account and approve the payment.
- [ ] Confirm `/api/paypal/capture-order` returns `{ success: true, status: "COMPLETED" }`.
- [ ] Confirm the widget transitions to the "Payment Received!" screen with the booking code.

## 6. Supabase booking updated to paid

- [ ] Refresh the Supabase `bookings` row from step 4.
- [ ] Confirm:
  - `payment_status = 'paid'`
  - `payment_method = 'paypal'`
  - `paypal_order_id` matches the captured order ID
  - `paid_amount` and `paid_currency = 'EUR'` are populated
  - `paid_at` is set
  - `status = 'confirmed'`

## 7. Admin shows "PayPal ✓ €X"

- [ ] Open `/admin/orders`, log in with the admin token.
- [ ] Find the booking from step 4–6.
- [ ] Confirm a blue **"PayPal ✓ €X.XX"** badge is shown next to (or instead of) the WhatsApp badge.

## 8. WhatsApp booking still works

- [ ] On the same tour, fill in date + people and click **Book via WhatsApp** (not PayPal).
- [ ] Confirm the existing flow is unaffected: booking is saved with `payment_method = 'whatsapp'`, `payment_status = 'unpaid'`, WhatsApp opens with the prefilled message, and the success screen appears.

## 9. Payment failure does not mark booking paid

- [ ] Start a new PayPal booking (creates a fresh `unpaid` row + linked order).
- [ ] In the PayPal sandbox popup, **cancel** the payment instead of approving it.
- [ ] Confirm the widget returns to the idle form (via `onCancel`/`onError`) without crashing.
- [ ] Confirm the Supabase row remains `payment_status = 'unpaid'` with no `paid_at`.
- [ ] Optional: simulate a capture error by calling `/api/paypal/capture-order` with a `bookingId` that has no linked `paypal_order_id` (or a mismatched `orderId`) — confirm it returns `403 "This order does not match the booking."` and does **not** call `markBookingPaid`.

## 10. Page refresh does not duplicate payment

- [ ] After a successful capture (step 5–6), reload the tour page.
- [ ] Re-open `/api/paypal/capture-order` manually (e.g. via DevTools) with the same `bookingId` and `orderId` used previously.
- [ ] Confirm the response is `{ success: true, status: "COMPLETED", alreadyPaid: true }` and PayPal's capture API is **not** called again (no new entry in PayPal Sandbox dashboard transactions, `paid_amount`/`paid_at` unchanged in Supabase).

---

## Sign-off

- [ ] All 10 checks above pass in Sandbox.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] Payment & refund policy text is published on the site before flipping `PAYPAL_MODE=live`.
- [ ] `PAYPAL_GEL_EUR_RATE` reviewed against the current National Bank of Georgia rate before going live.
