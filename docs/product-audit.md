# Ivera Product Audit
**Date:** 2026-06-09  
**Auditor:** Claude Code  
**Method:** Full codebase review (all pages, components, data, API routes)

---

## What the Product Is

Ivera is a mobile-first web app that layers a gamified quest system on top of guided tours in Georgia. Tourists create an "Explorer Pass" (a lightweight profile), browse 8 curated tours, book via WhatsApp with the guide Levani, and then complete QR-coded missions at stops during the actual tour. They earn XP and badges, can generate an AI "Hero Chronicle" story, and see themselves on a leaderboard. There is also a free 3-mission demo quest in central Tbilisi with no payment required.

---

## 1. Homepage Clarity

**New user (no profile):**  
The hero section shows "Your journey begins in Georgia." over a Kazbegi mountain photo. The photo is almost completely hidden behind a very heavy cream overlay (`rgba(247,240,228,0.97)` at the top) — effectively invisible on most screens. The headline works. Below it: 5 value chips (Local Georgian expert, English-speaking guide, Small private groups, WhatsApp booking, No payment now), two CTAs, and a quiet "Explore all 8 routes →" link.

**Returning user (has profile):**  
Dashboard shows personalized greeting, XP level progress, next recommended tour, earned badges, and a leaderboard preview. This is well-executed.

**Issues:**
- The hero photo is nearly invisible — defeats the purpose of using a cinematic image
- No mention of the free Tbilisi mini-quest anywhere on the homepage
- "Start Your Journey" opens Explorer Pass modal without explaining what Explorer Pass is or what the user gets
- Three competing CTAs in the hero (Start Journey / WhatsApp / Explore routes) dilutes focus

---

## 2. First-Screen Conversion

**Score: 5/10**

The primary CTA "Start Your Journey" is prominent (full-width gold button). The secondary "Build Custom Trip on WhatsApp" is visible. However:

- A tourist who doesn't know what Ivera is faces: brand name, a "Georgia Travel Quests" tagline, and two CTAs with different destinations. There's no 10-second explanation of the concept.
- "Start Your Journey" leads to a profile form — not what a tourist expects from that phrase. They expect to see tours.
- The "Explore all 8 routes →" link is tiny text (`text-[11px]`, `color: rgba(255,255,255,0.35)`) and nearly invisible.
- Below the fold: Featured quests, Best Deal, How It Works, Group Discounts, Daily Quest Challenge, WhatsApp CTA — this is well-structured but only reachable by scrolling.

---

## 3. CTA Hierarchy

**Hero section CTAs (new user):**
1. "Start Your Journey" (gold button, large) → Explorer Pass modal
2. "Build Custom Trip on WhatsApp" (ghost button) → WhatsApp
3. "Explore all 8 routes →" (nearly invisible) → /tours

**Problem:** The primary CTA takes the user to a form, not to tours. For a first-time tourist who hasn't decided anything yet, the most useful action is "show me the tours", not "tell me your name." The CTA hierarchy prioritizes email-capture-equivalent behavior over discovery.

**Recommendation (not implementing now):** Swap primary/secondary — make "Explore Tours" primary, "Start Journey" secondary.

---

## 4. Explorer Pass Flow

The Explorer Pass is a bottom-sheet modal asking for:
- Name (required)
- Country (optional)
- Interests: Wine / Mountains / History / Food / Adventure (optional chips)

**What works:**
- Clean, fast, low-friction
- Background sync to Supabase without blocking UI
- Dismissable by tapping backdrop

**What is missing:**
- No explanation of what Explorer Pass gives you before the modal opens
- No "you will earn XP and badges" hook before the form
- After submitting, user sees DashboardHome which shows 0 XP and no badges — anticlimactic
- No confirmation message or animation after creating pass

---

## 5. Tours Catalog (`/tours`)

**What works:**
- Category filter tabs (All / Culture / Adventure / Wine / Heritage)
- Tour cards show: image, category badge, XP, duration, urgency badge, price, "View Quest →"
- Urgency badges ("3 spots left today", "Last seat!") are attention-grabbing
- Discount badges (−5%, −10%, −15%) are visible

**Issues:**
- Page is entirely static — no "Book via WhatsApp" shortcut on listing page
- No "Try the Free Quest" CTA anywhere on the tours page
- No visible filter for "Free" — new users can't discover `/free-tbilisi-quest`
- No sort option (price / XP / duration)
- The Batumi tour shows "Price on Request" — not clear if that's more or less expensive

---

## 6. Tour Detail Pages (`/tours/[slug]`)

**What works:**
- Cinematic hero image with title overlay
- Meta strip (region, duration, "Small private group")
- Price + "No payment now" badge
- Long description
- Booking Widget (date picker + people + discount calculation)
- Urgency strip with seats left + discount %
- Route timeline with numbered stops
- Included/Excluded lists
- Quest Missions preview (locked, shows title/location/description/points)
- "Start Quest →" CTA
- Combo Pass CTA
- Bottom WhatsApp CTA with trust badges

**Issues:**
- Booking Widget: date field is required but the error message appears inline below the button, not near the date field — easy to miss
- No reviews/testimonials on tour detail page
- No "meet your guide" section (no Levani photo or bio)
- Quest missions preview says "Unlocks on the tour" but doesn't explain HOW (QR scan at location) clearly enough
- The `BookingWidget` state "error_retry" shows "Supabase error, try again" — this is technical language not appropriate for tourists

---

## 7. Booking via WhatsApp

**Flow:** Select date → select people → price breakdown auto-calculates → "Book via WhatsApp" button → generates IVERA-YYYYMMDD-XXXX code → creates Supabase record → opens WhatsApp with pre-filled message including booking code.

**What works:**
- Pre-filled WhatsApp message is clear and professional
- Booking code is generated for reference
- Dual-layer: saves to Supabase AND localStorage
- Fallback: if Supabase fails, WhatsApp still opens (error_fallback state)
- Group discount calculation is automatic and shown clearly

**Issues:**
- No date picker calendar — users type the date in an `<input type="date">` which looks different across browsers
- No minimum date enforced in the UI (could select past dates — `today` var exists but only sets `min` attribute, not validated client-side)
- No clear indication of expected response time from Levani in the booking widget itself (though bottom of page says "within 2 hours")
- For 6+ people, opens WhatsApp directly without saving to Supabase — no booking record created
- "Booking confirmed" state is misleading — it says "Booking sent!" but it's only sent to WhatsApp, not actually confirmed by Levani

---

## 8. Quest Mission Flow (`/quest/[tourSlug]`)

**Flow:** Page shows XP progress, mission cards (each with title, location, description, type badge), a "Demo Scan ✦" button, and "Need a clue?" hint link.

**What works:**
- Clean dark theme, premium aesthetic
- "Demo Scan" simulates completion clearly
- "Need a clue?" is subtle and non-intrusive (good per spec)
- Completion screen: badge, XP earned, "Generate My Hero Chronicle" button, WhatsApp feedback link
- Background Supabase sync on mission completion

**Issues:**
- "Demo Scan ✦" label may confuse real users during an actual tour — they will expect QR scanning, not a button
- No QR scanner implemented (the `qrCode` field exists in data but there's no camera/QR component)
- The `completionMessage` and `unlockText` fields in mission data are never shown in the UI — wasted data
- No "what to do at this location" instructions — description explains the mission but not the logistics
- After all missions complete, the completion block appears at the top (above mission list) — users may not scroll up to see it if they were scrolling down

---

## 9. XP / Badges / Leaderboard

**XP system:**
- Earned by completing missions and booking tours (bookingBonusXp)
- Tracked in localStorage, synced to Supabase
- Levels: Traveller (0) → Explorer (300) → Adventurer (750) → Quest Master (1500) → Georgian Legend (3000+)

**Badges:**
- 9 badges (1 free: Key of Tbilisi, 8 paid tour completions)
- Shown on profile page
- Not shown anywhere public (no badge wall, no sharing)

**Leaderboard:**
- Shows demo players (Nino G., Luka T., etc. — hardcoded fake data)
- User appears if they have XP > 0
- XP bars show relative proportion
- Top 3 claim: "earn a free bonus seat on any tour" — no mechanism to claim this reward exists

**Issues:**
- Leaderboard is fake — zero real competition until beta gets users
- "Free bonus seat" promise has no redemption mechanism
- Badges cannot be shared externally
- No push notifications when someone passes you on leaderboard

---

## 10. Free Tbilisi Quest (`/free-tbilisi-quest`)

**Content:** 3 missions in central Tbilisi (Freedom Square, Old City, Peace Bridge), 200 XP, Key of Tbilisi badge.

**What works:**
- Clear "FREE QUEST" badge
- Static hint fallbacks + AI hints from `/api/ai/quest-hint`
- Completion screen cross-sells Kakheti and Kazbegi tours with WhatsApp CTAs
- Beautiful dark UI consistent with paid quests
- "Demo Complete ✦" button for simulation

**CRITICAL ISSUE:**
- **The free quest is not linked from anywhere.** Not from the homepage, not from the tours listing, not from the bottom nav, not from the header. Users can only reach it by knowing the URL `/free-tbilisi-quest`. This is the primary lead magnet and it is invisible.

---

## 11. Hero Chronicle

**What works:**
- Available after completing all missions on any paid quest
- "Generate My Hero Chronicle" button calls `/api/ai/hero-chronicle`
- Falls back to a template story if Gemini is unavailable
- Shows the story in a purple card with "Send Chronicle via WhatsApp" button
- Shares via WhatsApp naturally (where Levani is also the contact)

**Issues:**
- No way to save/export the chronicle other than WhatsApp
- No social sharing (Instagram, Facebook, copy to clipboard)
- Chronicle button is hidden below "View Profile" button — users may not scroll to it
- No "here's what a chronicle looks like" preview before generating (users don't know what they're getting)

---

## 12. Profile / Recommendations

**Profile shows:** Explorer Passport card, XP/level bar, interests chips, stats grid (Total XP / Tours / Badges), Booking Summary, Earned Badges list, "Your Next Adventure" AI recommendations.

**What works:**
- Beautiful passport metaphor
- Animated XP counter
- Booking summary with status colors
- AI recommendations are non-blocking (fetched after render)

**Issues:**
- Profile shows "?" avatar for users with no name — but they can't reach profile without having created a pass... actually they can, via bottom nav
- If no profile exists, everything shows 0 and "Explorer" — the page works but is uninspiring
- Recommendations section only shows if Supabase profile exists (profile.supabaseId check) — new users see nothing
- "View My Trip" link in profile goes to /my-trip which shows empty for new users

---

## 13. Mobile Experience

The app is built mobile-first with max-w-2xl container. Bottom nav provides 5-tab navigation. Sticky header with notification bell.

**What works:**
- Consistent padding and spacing throughout
- Framer Motion animations respect `useReducedMotion()`
- Image handling with `sizes` attribute
- Touch targets generally adequate (buttons at py-2 minimum)

**Issues:**
- Bottom nav "My Trip" center FAB overlaps content on short screens
- No "safe area" insets for notch phones (no env(safe-area-inset-*) CSS)
- Hero section uses `min-h-screen` which may not work correctly on mobile browsers with URL bar
- Some text is very small (text-[10px], text-[9px]) — may be unreadable on small screens
- The date input on BookingWidget looks different on iOS vs Android

---

## 14. Trust and Credibility

**Present:**
- "No payment now" badge on every tour
- "English-speaking guide"
- "Small private group"
- WhatsApp number embedded in all booking links (995555443787)
- "Levani confirms within 2 hours"

**Missing:**
- No photo of Levani anywhere
- No bio or about section
- No testimonials or reviews
- No social proof (Instagram link, press mentions, number of tours completed)
- No certificate or license mention
- No privacy policy or terms link
- The "official" feel of "Georgia Travel Quests" branding is undercut by the lack of any human presence

---

## 15. Does a First-Time Tourist Understand What To Do?

**Journey:**
1. Lands on homepage → sees "Your journey begins in Georgia" → probably understands it's travel related
2. Reads value chips → gets the idea: guided, WhatsApp booking, no payment now
3. "Start Your Journey" → asked for name — confused, expected to see tours
4. Probably hits "Explore all 8 routes" instead → /tours
5. Browses tour cards → understands tours are real and have prices
6. Clicks a tour → reads description, sees booking widget → WhatsApp link → sends message
7. Waits for response from Levani

**What they miss:**
- That there's a FREE quest they can try right now
- That "quests" mean missions at real locations during the tour
- Why they should create an Explorer Pass (no hook before the form)
- What the XP and badges are for (only visible after profile is created)

---

## Summary

### What Works Well
- Premium aesthetic — dark theme, gold, serif fonts look genuine and upmarket
- Tour detail pages are thorough and informative
- Booking flow is complete (code generation, WhatsApp, Supabase, localStorage fallback)
- Price/discount logic is solid
- Quest completion with Hero Chronicle is a differentiator
- Admin dashboard is functional for beta

### What Is Confusing
- The word "quest" applied to a guided tour — not immediately obvious what it means
- Explorer Pass value prop not explained before the form appears
- "Demo Scan" vs real QR scanning — mixed expectations
- "Need a clue?" is too subtle — users who need help most won't find it
- Leaderboard with fake players next to real user feels dishonest

### What Blocks Conversion
1. **Free mini-quest is invisible** — the best top-of-funnel asset has no entry point
2. **No Levani introduction** — tourists don't book from strangers
3. **No testimonials** — zero social proof
4. **CTA leads to form, not tours** — primary CTA creates friction instead of discovery

### What Should Be Improved First (ranked)
1. Add free mini-quest link to homepage and nav
2. Add Levani photo + short bio somewhere visible
3. Add 2-3 testimonials to homepage or tour pages
4. Explain Explorer Pass value before opening modal
5. Make hero image visible (reduce gradient opacity)
6. Fix "Start Your Journey" to go to tours, not form (or rename it)
7. Add social sharing for Hero Chronicle (clipboard copy, Instagram text)

### What Should Not Be Touched Now
- The booking system (complete and working)
- The quest/mission system (correct implementation)
- The pricing/discount logic (solid)
- The dark theme and visual design (high quality)
- The Supabase + localStorage dual-layer pattern
- The AI fallback system
