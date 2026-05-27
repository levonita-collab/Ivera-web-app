# Ivera Production Smoke Test

Run this checklist before every Kakheti beta tour. Takes 10–15 minutes.  
Use a real phone (not a desktop browser) for all steps marked 📱.

---

## Setup

- [ ] Production URL: **https://ivera-web-app.vercel.app**
- [ ] Have Supabase Table Editor open in a second tab
- [ ] Use a fresh browser session (clear site data or use incognito)
- [ ] Test on both iPhone and Android if possible

---

## 1 📱 Open production URL on iPhone

- [ ] Safari on iPhone → open https://ivera-web-app.vercel.app
- [ ] Page loads within 3 seconds
- [ ] Hero image is visible and fills the screen
- [ ] "Start Your Journey" button is visible and tappable
- [ ] No white gaps, no horizontal scroll, no overflowing text

---

## 2 📱 Open production URL on Android

- [ ] Chrome on Android → open https://ivera-web-app.vercel.app
- [ ] Page loads within 3 seconds
- [ ] Hero image is visible
- [ ] Buttons are tappable at 390px width
- [ ] No layout issues

---

## 3 Create Explorer Pass

- [ ] Tap **Start Your Journey**
- [ ] Explorer Pass sheet slides up from bottom
- [ ] Enter a test name (e.g. "Smoke Test")
- [ ] Set country to "Test Country"
- [ ] Select at least one interest
- [ ] Tap **Create Explorer Pass**
- [ ] Sheet closes, dashboard appears with the test name visible
- [ ] Button label changes to "Saving…" briefly before closing

---

## 4 Verify explorer_profiles row in Supabase

- [ ] Supabase → Table Editor → `explorer_profiles`
- [ ] Row with name "Smoke Test" appears within 5 seconds
- [ ] `country` column shows "Test Country"
- [ ] `created_at` is today's date

---

## 5 Open Kakheti tour

- [ ] Tap **Explore Tours** or navigate to Tours page
- [ ] Tap **Kakheti Wine & Legends Quest**
- [ ] Tour detail page loads correctly
- [ ] Price shows **100 GEL per person** (not "100 GEL GEL")
- [ ] Duration shows **Full day**
- [ ] Included: Transportation, Professional guide, Lunch & wine tasting
- [ ] Route stops are all listed (Bodbe → Sighnaghi → wine tasting → supra)
- [ ] Tour image loads (no broken image)

---

## 6 Create booking for 2 people

- [ ] On the Kakheti tour page, scroll to **Book this Tour**
- [ ] Select a date at least 1 day from today
- [ ] Set people count to **2**
- [ ] Price summary shows: 100 GEL × 2 = **200 GEL total**
- [ ] Tap **Book via WhatsApp**
- [ ] Button briefly shows "Saving request…" then "Opening WhatsApp…"

---

## 7 Verify bookings row

- [ ] Supabase → Table Editor → `bookings`
- [ ] New row appears with:
  - `tour_slug` = `kakheti-wine-legends`
  - `people_count` = 2
  - `total_price` = 200
  - `status` = `pending`
  - `created_at` = today

---

## 8 Confirm WhatsApp message

- [ ] WhatsApp opened to Levani's number
- [ ] Message contains:
  - Tour name: Kakheti Wine & Legends Quest
  - Date (the one selected)
  - People: 2
  - Price per person: 100 GEL
  - Total price: 200 GEL
  - "Please confirm availability."
- [ ] Message is readable and correctly formatted
- [ ] Do NOT send (this is a smoke test)

---

## 9 Start Kakheti quest

- [ ] Navigate back to Kakheti tour page
- [ ] Tap **Start Quest** button
- [ ] Quest page loads with 5 missions listed:
  1. The Saint's Resting Place
  2. City of Love Panorama
  3. Guardian of the Walls
  4. The Amber Wine Ritual
  5. Tamada — Master of the Toast
- [ ] XP progress bar shows 0 / 475 XP
- [ ] Demo Scan ✦ button is visible on mission 1

---

## 10 Complete all 5 missions

- [ ] Tap **Demo Scan ✦** on mission 1 → turns gold, XP increases by 75
- [ ] Tap **Demo Scan ✦** on mission 2 → XP increases by 100 (total 175)
- [ ] Tap **Demo Scan ✦** on mission 3 → XP increases by 75 (total 250)
- [ ] Tap **Demo Scan ✦** on mission 4 → XP increases by 125 (total 375)
- [ ] Tap **Demo Scan ✦** on mission 5 → XP increases by 100 (total 475)
- [ ] Quest completion banner appears: "Quest Complete!"
- [ ] Wine Connoisseur badge is shown

---

## 11 Verify total XP is 475

- [ ] Quest completion banner shows **475 XP** earned
- [ ] Navigate to Profile page — total XP shows **475**
- [ ] Level indicator has updated

---

## 12 Verify quest_progress rows in Supabase

- [ ] Supabase → Table Editor → `quest_progress`
- [ ] Exactly 5 rows with `tour_slug = kakheti-wine-legends`
- [ ] All 5 show `completed = true`
- [ ] Mission IDs: kak-1, kak-2, kak-3, kak-4, kak-5

---

## 13 Verify leaderboard_entries update

- [ ] Supabase → Table Editor → `leaderboard_entries`
- [ ] Row with display name "Smoke Test" and `total_xp = 475`
- [ ] Navigate to Leaderboard page in the app
- [ ] "Smoke Test" appears in the list with 475 XP

---

## 14 Send feedback via WhatsApp

- [ ] On the quest completion screen, **Send Feedback via WhatsApp** button is visible
- [ ] Tap it — WhatsApp opens
- [ ] Message includes:
  - Explorer name: Smoke Test
  - XP earned: 475 XP
  - All 5 feedback questions
- [ ] Message is correctly formatted and readable

---

## 15 Check for console or layout issues

- [ ] Open DevTools (Chrome desktop) → Console tab
- [ ] Reload the app and run through the quest flow
- [ ] No red errors in console
- [ ] No "Failed to fetch" Supabase errors in normal operation
- [ ] No text overflow at 390px width
- [ ] All buttons are tappable (minimum 44px tap target)
- [ ] Images load on all pages

---

## Smoke test result

- [ ] ✅ All 15 checks passed → **Ready for beta tour**
- [ ] ❌ Any check failed → document below and fix before tour

**Issues found:**

| Step | Issue | Severity | Fixed? |
|---|---|---|---|
| | | | |
