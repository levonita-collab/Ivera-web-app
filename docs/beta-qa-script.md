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

## Test 5 — Complete Kakheti quest (5 missions)

- [ ] Go to Tours → Kakheti Wine & Legends → **Start Quest**
- [ ] Confirm 5 missions are listed in this order:
  - Mission 1: The Saint's Resting Place (Bodbe Monastery)
  - Mission 2: City of Love Panorama (Sighnaghi viewpoint)
  - Mission 3: Guardian of the Walls (Sighnaghi city walls)
  - Mission 4: The Amber Wine Ritual (wine tasting hall)
  - Mission 5: Tamada — Master of the Toast (supra table)
- [ ] Tap **Demo Scan ✦** on mission 1 — turns gold/green, XP increases
- [ ] Complete all 5 missions sequentially
- [ ] Quest completion banner appears with the Wine Connoisseur badge
- [ ] XP total shows 475 XP
- [ ] **Send Feedback via WhatsApp** button appears below the completion card
- [ ] Tapping it opens WhatsApp with pre-filled feedback questions and your name + XP

**Supabase check:**
- [ ] In Table Editor → `quest_progress` — 5 rows with `tour_slug = kakheti-wine-legends`
- [ ] In Table Editor → `leaderboard_entries` — row with your name and 475 XP

---

## Test 6 — No XP double on repeat tap

- [ ] Completed missions show a green checkmark — Demo Scan button is gone
- [ ] Refresh the page — all 5 still completed, XP unchanged at 475
- [ ] Navigate away and back — progress is preserved

**Supabase check:**
- [ ] In Table Editor → `quest_progress` — still only 5 rows (no duplicates)

---

## Test 7 — Leaderboard reflects Kakheti XP

- [ ] Go to the Leaderboard page
- [ ] Your name appears with 475 XP (Kakheti total)
- [ ] Complete missions on a second tour
- [ ] Return to Leaderboard — total XP has updated correctly

---

## Test 7b — Feedback flow

- [ ] After completing all 5 Kakheti missions, **Send Feedback via WhatsApp** button is visible
- [ ] Tap it — WhatsApp opens with pre-filled message
- [ ] Message includes explorer name, XP total (475), and all 5 feedback questions
- [ ] Message is readable and correctly formatted

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
