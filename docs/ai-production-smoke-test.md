# Ivera AI — Production Smoke Test

Manual checklist to verify all AI features in production.  
Run after every deployment that touches AI routes or Gemini configuration.  
No developer knowledge required — follow steps exactly.

---

## Setup

- [ ] Open the live app in a **mobile browser** (or use Chrome DevTools → device toolbar → 390px)
- [ ] Open **browser DevTools** in a second tab: F12 → Network tab and Console tab
- [ ] You will need a WhatsApp number to test sharing

---

## Test 1 — Quest Hint (with valid Gemini key)

**Purpose:** AI hint is generated and displayed.

- [ ] Navigate to `/quest/kakheti-wine-legends`
- [ ] Find an incomplete mission card (any one)
- [ ] Tap **"Need a hint?"** (small purple button in the footer of the card)
- [ ] A spinner appears briefly, then a purple hint box appears
- [ ] **Pass**: The hint text is a clue, not a direct answer
- [ ] **Pass**: The hint mentions the location or atmosphere
- [ ] The button text changes to **"Hint shown"** and becomes disabled
- [ ] Open DevTools → **Network** tab → find the `POST /api/ai/quest-hint` request
  - [ ] Response contains `{ "hint": "...", "fallback": false }`
  - [ ] **CRITICAL**: The request and response must NOT contain the API key string

---

## Test 2 — Quest Hint Fallback (missing or invalid key)

**Purpose:** App degrades gracefully when Gemini is unavailable.

- [ ] In Vercel dashboard (or your hosting): temporarily set `GEMINI_API_KEY` to a blank or invalid value and redeploy
  - Alternatively: test on local dev server with `GEMINI_API_KEY=` in `.env.local`
- [ ] Navigate to a quest mission card and tap **"Need a hint?"**
- [ ] **Pass**: A hint still appears — the static fallback text:
  > "Look carefully around the location. The answer is hidden in the story of this place."
- [ ] **Pass**: No error is shown to the user
- [ ] **Pass**: No error in the browser console
- [ ] Restore the valid `GEMINI_API_KEY` and redeploy

---

## Test 3 — Hero Chronicle (after quest completion)

**Purpose:** Post-quest story generation works.

- [ ] Complete all 5 Kakheti missions (use "Demo Scan ✦" on each)
- [ ] The quest completion screen appears with badge + trophy
- [ ] Tap **"Generate My Hero Chronicle"**
- [ ] A spinner with "Writing your chronicle…" appears
- [ ] Within ~10 seconds, a purple Chronicle card appears with a cinematic story paragraph
- [ ] **Pass**: Story mentions the tour name, at least one location, XP earned, and badge name
- [ ] **Pass**: Story does NOT mention locations from other quests
- [ ] **Pass**: Story is under 200 words

---

## Test 4 — Chronicle WhatsApp Share

**Purpose:** Chronicle can be shared via WhatsApp.

- [ ] After Chronicle appears (Test 3), tap **"Send Chronicle via WhatsApp"**
- [ ] **Pass**: WhatsApp opens (app or web)
- [ ] **Pass**: The pre-filled message contains the chronicle text
- [ ] **Pass**: Message includes "via Ivera Travel Quests"
- [ ] Do NOT send the message — just verify the content and close

---

## Test 5 — Free Tbilisi Quest

**Purpose:** `/free-tbilisi-quest` is fully functional and converts users.

- [ ] Navigate to `/free-tbilisi-quest`
- [ ] **Pass**: Page loads with "FREE QUEST" green badge and 3 mission cards
- [ ] **Pass**: Total XP shown is 0 / 200
- [ ] Tap **"Need a hint?"** on Mission 1 — a hint appears
- [ ] Complete all 3 missions using "Demo Complete ✦"
- [ ] **Pass**: XP tracker shows 200 / 200
- [ ] **Pass**: Completion screen shows "Key of Tbilisi" badge
- [ ] **Pass**: Two WhatsApp CTAs appear:
  - "Book Kakheti via WhatsApp"
  - "Book Kazbegi via WhatsApp"
- [ ] Tap "Book Kakheti via WhatsApp" → WhatsApp opens with a pre-filled booking message
- [ ] Navigate to `/profile` → "Key of Tbilisi" badge appears in Passport Stamps
- [ ] Total XP on profile reflects 200 additional XP

---

## Test 6 — Profile Tour Recommendations

**Purpose:** "Your Next Adventure" block appears with relevant recommendations.

- [ ] Open `/profile`
- [ ] **Pass**: A section with a purple sparkle icon and "Your Next Adventure" heading appears
- [ ] **Pass**: Two tour recommendations are shown, each with a title, reason sentence, and "View" link
- [ ] Tap a "View" link → leads to the correct tour detail page (e.g., `/tours/kakheti-wine-legends`)
- [ ] **Pass**: Recommendations reflect completed tour history:
  - No quests done → Key of Tbilisi + Kakheti
  - Kakheti done → Kazbegi + Mtskheta
  - Tbilisi done → Kakheti + Kazbegi

---

## Test 7 — AI Interactions Logging (optional — requires migration 002)

**Purpose:** AI usage is recorded in Supabase (if migration was run).

- [ ] Open Supabase Dashboard → Table Editor
- [ ] Check if `ai_interactions` table exists
  - If it doesn't exist, skip this test — the app still works
- [ ] Trigger a hint, chronicle, and recommendation from the app
- [ ] Refresh the `ai_interactions` table
- [ ] **Pass**: New rows appear for each interaction
- [ ] **Pass**: Rows contain `interaction_type`, `tour_slug`, `input_summary`, `output_summary`
- [ ] **Pass**: No API key value appears in any row

---

## Test 8 — API Key Not Exposed in Browser

**Purpose:** Confirms the Gemini key is never sent to the client.

- [ ] Open DevTools → **Network** tab → filter: `Fetch/XHR`
- [ ] Trigger any AI feature (hint, chronicle, recommendation)
- [ ] Open each request to `/api/ai/*` — inspect **Headers** and **Response**
  - [ ] **CRITICAL PASS**: `GEMINI_API_KEY` does not appear in any request/response header or body
- [ ] DevTools → **Sources** tab → search all scripts for "GEMINI"
  - [ ] **CRITICAL PASS**: No results found
- [ ] DevTools → **Application** tab → Local Storage, Session Storage
  - [ ] **CRITICAL PASS**: No Gemini key in storage

---

## Pass Criteria

All checked = AI layer production-ready.  
Any ❌ failure → report the test number, step, screenshot, and network response to the developer.

**Most critical checks:**
- Test 1: AI hint works
- Test 2: Fallback works (never shows raw error to user)
- Test 8: Key not exposed anywhere in browser
