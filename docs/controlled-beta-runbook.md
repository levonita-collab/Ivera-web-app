# Ivera Controlled Beta Runbook — Kakheti Route

Step-by-step guide for running the first real beta test with tourists on the Kakheti Wine & Legends Quest.

No developer knowledge required.

---

## Before the tour (day before or morning of)

### 1. Verify Supabase is working
- Open Supabase → Table Editor → `explorer_profiles`
- Confirm you can see the table (rows may or may not be present)
- If the table is not visible or gives an error, check your Supabase project is active

### 2. Verify WhatsApp is working
- Open the Ivera site on your phone
- Go to any tour page → Booking Widget → tap **Book via WhatsApp**
- Confirm WhatsApp opens with the pre-filled message
- Do NOT send the message — just confirm it works

### 3. Create a test Explorer Pass
- Open the Ivera site in a fresh browser (or incognito mode)
- Tap **Start Your Journey**
- Enter a test name (e.g. "Beta Test 01")
- Fill country and interests
- Tap **Create Explorer Pass**
- Confirm the dashboard appears with your name
- Open Supabase → `explorer_profiles` — confirm the test name appears within 5 seconds

### 4. Print QR cards
- Print all 5 Kakheti QR cards (see `docs/qr-beta-setup.md`)
- Label them Mission 1–5 on the back
- Laminate or put in card sleeves
- Pack them in order

### 5. Check route missions in the app
- Open the Kakheti Quest page on your phone
- Confirm all 5 missions are listed:
  1. The Saint's Resting Place (Bodbe)
  2. City of Love Panorama (Sighnaghi viewpoint)
  3. Guardian of the Walls (Sighnaghi walls)
  4. The Amber Wine Ritual (wine tasting)
  5. Tamada — Master of the Toast (supra)
- Tap Demo Scan on mission 1 to confirm the flow works
- Clear your browser data after testing (don't carry test XP into the real tour)

### 6. Prepare guide instructions
Share this with the guide before the tour:
- "When we arrive at each location, I'll give you a card. Show it to the tourist and ask them to open the Ivera app."
- "They should tap Demo Scan on the matching mission card in the app."
- "If the scan doesn't work, tap it again — it should complete immediately."
- "We do missions in order: Bodbe → Sighnaghi view → Sighnaghi walls → wine cellar → supra."

---

## During the tour

### At each location

1. **Arrive at the location**
2. Ask the tourist to open the Ivera site on their phone (bookmark: ivera-web-app.vercel.app)
3. Navigate to: **Tours → Kakheti Wine & Legends → Start Quest**
4. If no Explorer Pass exists, ask them to create one first (takes 30 seconds)
5. **Show the QR card** for that mission
6. Ask them to tap **Demo Scan** on the matching mission in the app
7. Confirm the mission turns gold/green and XP increases
8. Share the unlock text / story at that location (from mission cards)

### Observe and note

During the tour, note anything that causes confusion:
- Did the tourist find the app easily?
- Did they understand which mission to tap?
- Was the Demo Scan button visible?
- Were the mission descriptions easy to read on mobile?
- Any moments where they lost interest or got confused?

Record notes on paper or voice memo. These are your most valuable beta insights.

### If something breaks

| Problem | Solution |
|---|---|
| App not loading | Check phone has data connection; try reloading |
| Mission already completed | User may have tapped it before arriving — continue to next mission |
| Explorer Pass lost | Ask user to create a new one on the spot |
| Demo Scan not responding | Tap the back button and re-enter the quest page |
| WhatsApp won't open | Check phone has WhatsApp installed; try from a different browser |

---

## After the tour

### 1. Check bookings table
- Supabase → Table Editor → `bookings`
- Filter by today's date
- Confirm a booking row exists for the Kakheti tour
- Note the `status` — it should be `pending`
- Update to `contacted` once you send the WhatsApp reply

### 2. Check quest_progress
- Supabase → Table Editor → `quest_progress`
- Look for rows with `tour_slug = kakheti-wine-legends`
- Confirm the tourist's missions are recorded (5 rows expected for a complete run)
- Note: rows only appear if the tourist had an Explorer Pass with a supabase sync

### 3. Check leaderboard
- Supabase → Table Editor → `leaderboard_entries`
- Confirm the tourist's name and XP appear
- Kakheti total XP: 475 XP (75 + 100 + 75 + 125 + 100)

### 4. Ask the tourist 5 feedback questions

Either verbally at the end of the tour, or send them this WhatsApp message:

> "Thank you for joining the Ivera beta! Could you share quick feedback? 
> 1. Was the quest easy to understand?
> 2. Which mission did you enjoy most?
> 3. Did Demo Scan work smoothly?
> 4. Would you recommend this experience?
> 5. What should we improve?"

Alternatively, the app shows a **Send Feedback via WhatsApp** button when all missions are complete — point them to it before they leave.

### 5. Record your own notes

After each beta run, record:
- [ ] Did the tourist complete all 5 missions?
- [ ] Which mission had the most positive reaction?
- [ ] Which mission was confusing or skipped?
- [ ] Did the booking widget work correctly?
- [ ] Was the XP sync visible in Supabase?
- [ ] What would you change for the next beta?

---

## Feedback questions reference

1. Was the quest easy to understand?
2. Which mission did you enjoy most?
3. Did QR scanning (Demo Scan) work smoothly?
4. Would you recommend this experience?
5. What should we improve?

---

## Beta success criteria

A beta run is considered successful if:
- [ ] Tourist creates an Explorer Pass
- [ ] Tourist completes at least 3 of 5 missions
- [ ] Booking row appears in Supabase
- [ ] At least one piece of feedback is collected
- [ ] No critical app failures occur
