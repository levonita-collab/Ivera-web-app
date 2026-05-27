# Ivera Beta QA Script

Manual test checklist for the Ivera Travel Quest web app. Run before each beta release.  
Testers do not need to be developers.

---

## Setup

- [ ] Open the live site: https://ivera-web-app.vercel.app
- [ ] Open Supabase Table Editor in a second tab (ask owner for access)
- [ ] Clear your browser localStorage before starting: DevTools → Application → Storage → Clear site data
- [ ] Use a mobile viewport (390px width) or test on a real phone

---

## Test 1 — Create Explorer Pass

- [ ] Open the home page
- [ ] Tap **Start Your Journey**
- [ ] The Explorer Pass bottom sheet appears
- [ ] Enter your name (e.g. "Beta Tester")
- [ ] Select a country and at least one interest
- [ ] Tap **Create Explorer Pass**
- [ ] The sheet closes and the dashboard appears showing your name

**Supabase check:**
- [ ] In Table Editor → `explorer_profiles` — your name appears within 5 seconds
- [ ] Note the `id` (UUID) — this is your explorer_id

---

## Test 2 — Refresh (no duplicate profile)

- [ ] Refresh the page
- [ ] Dashboard still shows your name and 0 XP
- [ ] In Supabase → `explorer_profiles` — still only ONE row with your name (no duplicate)

---

## Test 3 — Book Kakheti for 2 people

- [ ] Go to Tours → Kakheti Wine & Legends
- [ ] Scroll to the booking widget
- [ ] Select a date at least 1 day from today
- [ ] Set people count to **2**
- [ ] Verify total shown = price per person × 2 (check tour page for per-person price)
- [ ] Tap **Book via WhatsApp**
- [ ] WhatsApp opens with a pre-filled message containing the tour name, date, 2 people, and total price

**Supabase check:**
- [ ] In Table Editor → `bookings` — a new row appears with `status = pending`, `tour_slug = kakheti-wine-legends`, `people_count = 2`

---

## Test 4 — Book Batumi (price on request)

- [ ] Go to Tours → Batumi Black Sea Quest
- [ ] Scroll to the booking widget
- [ ] Verify the price area shows a "Price on Request" message (no numeric total)
- [ ] Select a date and tap **Request Price via WhatsApp**
- [ ] WhatsApp opens with a message requesting a custom quote (no price in the message)

**Supabase check:**
- [ ] In Table Editor → `bookings` — a new row appears with `tour_slug = batumi-black-sea-quest`, `price_per_person = null`, `total_price = null`

---

## Test 5 — Complete one quest mission

- [ ] Go to Tours → Tbilisi City Quest → **Start Quest**
- [ ] Tap **Demo Scan ✦** on the first mission
- [ ] Mission card turns gold/green with a checkmark
- [ ] XP counter increases at the top

**Supabase check:**
- [ ] In Table Editor → `quest_progress` — a row appears with your `explorer_id`, `tour_slug = tbilisi-city-quest`, `completed = true`
- [ ] In Table Editor → `leaderboard_entries` — a row appears with your name and XP

---

## Test 6 — Try completing the same mission again (no XP double)

- [ ] On the same quest page, the completed mission shows a green checkmark
- [ ] The **Demo Scan ✦** button is gone (cannot be clicked again)
- [ ] Refresh the page
- [ ] Mission still shows as completed
- [ ] XP total has NOT increased (same as before refresh)

**Supabase check:**
- [ ] In Table Editor → `quest_progress` — still only ONE row for that mission (no duplicate)

---

## Test 7 — Leaderboard updates

- [ ] Go to the Leaderboard page
- [ ] Your name appears in the list with your XP
- [ ] Complete more missions on a quest
- [ ] Return to Leaderboard — XP has updated

---

## Test 8 — Offline / local mode

- [ ] In Vercel settings or locally, remove/blank `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Restart the app locally with `npm run dev`
- [ ] Create an Explorer Pass — works, profile is saved in localStorage
- [ ] Complete a quest mission — works, XP is saved in localStorage
- [ ] Open booking — WhatsApp opens normally
- [ ] No errors or crashes appear in the browser console related to Supabase

---

## Test 9 — Mobile 390px viewport

- [ ] Resize browser to 390px width (or use Chrome DevTools device toolbar)
- [ ] Home page hero — headline visible, buttons accessible, no overflow
- [ ] Explorer Pass sheet — form fields and buttons fit within screen width
- [ ] Tour card — image and text readable, no cut-off
- [ ] Booking widget — date picker and people counter usable at 390px
- [ ] Quest page — mission cards readable, Demo Scan button tappable
- [ ] Leaderboard — list readable, no horizontal scroll

---

## Test 10 — Navigation

- [ ] All nav links work: Home, Tours, Leaderboard, Profile
- [ ] Tapping a tour opens the correct tour detail page
- [ ] Back navigation from quest returns to tour page
- [ ] No broken links or 404 errors on any page

---

## Pass criteria

All checkboxes checked = beta-ready.  
Any failure → report to developer with screenshot and the step that failed.
