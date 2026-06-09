# Ivera Priority Roadmap
**Date:** 2026-06-09  
**Based on:** Product Audit, Marketing Audit, CX Audit, Technical Audit

---

## Decision Framework

Items are placed in buckets based on two factors:
- **Impact** — how much will this improve conversion, trust, or retention?
- **Effort** — how long will this take to implement correctly?

High impact + low effort = Fix before beta.  
High impact + high effort = Improve after first beta (validate the hypothesis first).  
Low impact = After real users or not yet.

---

## A. Fix Before Beta
*These are blockers. Launch with them missing and you lose users you'll never get back.*

### A1. Link Free Tbilisi Quest from homepage — **CRITICAL**
**Impact:** Highest. This is the primary lead magnet. Zero users discover it without the link.  
**Effort:** 30 minutes (one component, one link).  
**What to add:**
- A card/banner on the homepage new-user view (below hero, above featured quests): "Try Ivera for free — 3 missions in central Tbilisi. No payment, no sign-up. [Try the Free Quest →]"
- A link in the tours listing page at the top: "New to Ivera? Try our free Tbilisi starter quest →"
- Optional: Add a bottom nav tooltip or a separate tab label for first-time users

### A2. Add Explorer Pass value proposition before the modal
**Impact:** High. Users dismiss the form because they don't know what they're signing up for.  
**Effort:** 15 minutes (copy change only).  
**What to add:** One sentence above the form inputs in the ExplorerPass modal:  
"Track your XP, unlock badges, and get personalised tour picks across all your Georgia adventures."

### A3. Introduce Levani — photo + 2 sentences
**Impact:** High. Trust-building is the #1 conversion gap for unfamiliar tourists.  
**Effort:** 2 hours (photo + text + component on homepage and/or tour detail).  
**What to add:** A "Meet Your Guide" section on the homepage (new-user view, near bottom) and/or on every tour detail page:
- Photo of Levani at a Georgian location
- "Hi, I'm Levani. Born in Tbilisi, I've been running private tours since 2019. Message me any time — I reply within 2 hours."
- Optional: "Currently running tours for guests from [X countries this year]"
- WhatsApp button: "Ask Levani a question"

### A4. Run Supabase migration 001_enhance_bookings.sql
**Impact:** Critical for data integrity. Without this, all booking Supabase creates fail silently.  
**Effort:** 5 minutes in Supabase SQL editor.  
**Action:** Open Supabase Dashboard → SQL Editor → paste `supabase/migrations/001_enhance_bookings.sql` → Run.

### A5. Set Gemini API key in Vercel
**Impact:** High. All AI features (Quest Hints, Hero Chronicle, Recommendations) currently use fallback text.  
**Effort:** 5 minutes in Vercel dashboard.  
**Action:** aistudio.google.com → Get API key → Vercel → Settings → Environment Variables → Add `GEMINI_API_KEY`.  
**Note:** The previous key was shared in chat and is compromised — do not reuse it. Generate a fresh key at aistudio.google.com.

### A6. Fix Vercel deployment protection (site returns 403)
**Impact:** Critical — users can't access the site.  
**Effort:** 5 minutes in Vercel dashboard.  
**Action:** Vercel → Settings → Deployment Protection → Disable or allow public access.  
Also confirm: Production Branch = `main`, all env vars set.

### A7. Override admin token in Vercel env vars
**Impact:** High security risk. Default token "ivera2026" is visible in code.  
**Effort:** 2 minutes.  
**Action:** Vercel → Environment Variables → Add `NEXT_PUBLIC_ADMIN_TOKEN=<strong-random-token>`. Share the token only with Levani.

### A8. Add 2–3 testimonials (even from beta testers)
**Impact:** High. Zero social proof blocks conversion for cold traffic.  
**Effort:** 2 hours to design + copy.  
**What to add:** A simple testimonial strip on the homepage (new-user view) with name, country, quote, and star rating. Even 2 real testimonials from friends/beta testers is better than none.  
Example structure:
```
"★★★★★ The Kazbegi quest was the highlight of my whole trip to Georgia."
— Sarah M., United Kingdom
```

---

## B. Improve After First Beta
*Validate that the core loop works with real users before investing in these.*

### B1. Reduce hero gradient opacity — let the mountain breathe
**Impact:** Medium. The hero image (Kazbegi) is barely visible. Reduces atmospheric impact.  
**Effort:** 10 minutes.  
**What to change:** In `IveraHero.tsx`, reduce the cream overlay from `rgba(247,240,228,0.97)` to `rgba(247,240,228,0.85)` at the top so the mountain photo shows through.

### B2. Add social sharing to Hero Chronicle
**Impact:** Medium-High. Chronicle is the product's best viral moment. WhatsApp-only sharing keeps it private.  
**Effort:** 4 hours.  
**What to add:**
- "Copy to clipboard" button (Web Clipboard API)
- Instagram Stories share (via Web Share API — supported on mobile browsers)
- Optional: "Download as image" using html-to-image or canvas

### B3. Replace leaderboard fake data with real Supabase data
**Impact:** Medium-High. Fake data destroys trust if noticed. Real data creates genuine competition.  
**Effort:** 3 hours (add Supabase query to leaderboard page + handle empty state).  
**Query:** `leaderboard_entries` table ordered by `total_xp DESC`, join with `explorer_profiles` for display names.  
**Empty state:** "Be the first on the leaderboard — complete a quest to appear here."

### B4. Add "What happens next?" post-booking explanation
**Impact:** Medium. Tourists don't know what "Booking sent!" means in practice.  
**Effort:** 1 hour.  
**What to add:** Below the "Booking sent!" success state in BookingWidget:
```
✓ Your booking code: IVERA-20260609-1234
✓ Levani will message you on WhatsApp within 2 hours to confirm.
✓ No payment is needed until you meet on the day.
```

### B5. Add cancellation policy (FAQ) to tour detail pages
**Impact:** Medium. International tourists always want to know the cancellation policy before committing.  
**Effort:** 1 hour (copy + accordion component).  
**Questions to answer:**
- What happens if I need to cancel?
- What if the weather is bad?
- Do I pay in advance?
- Is the group size truly small?
- What language does the guide speak?

### B6. Add tour count / stats counter (with real data)
**Impact:** Medium. "47 tours completed" would instantly build credibility.  
**Effort:** 2 hours (add to homepage near hero, query `bookings` table count).  
**What to show:** "X tours completed · Y happy travellers · Z countries represented"

### B7. Make hero image properly visible
**Impact:** Medium. Design decision — the Kazbegi mountain background is hidden by an overly opaque gradient.  
**Effort:** 30 minutes.  
**Decision needed:** Should the hero be light (current cream theme) or dark (showing the mountain)? If light, remove the background image entirely. If dark, match the quest/profile dark theme and reduce gradient. Currently it's an uncomfortable middle ground.

### B8. Add "Need a Clue?" visibility for users who are stuck
**Impact:** Medium. Current "Need a clue?" is 10px grey text that most users miss.  
**Consideration:** The brief explicitly specifies this should stay secondary. However, if beta shows users abandoning quests because they're stuck, upgrade visibility slightly (e.g., from grey to subtle purple).  
**Action:** Monitor beta feedback before deciding.

---

## C. Add After Real Users
*These require user data to validate, or depend on having a real user base.*

### C1. Real-time leaderboard with push notifications
**Impact:** High (once real users exist). Zero impact with 0 users.  
**Effort:** High (Supabase Realtime + notification system).  
**Prerequisite:** 10+ real users with XP.

### C2. Email capture / CRM integration
**Impact:** High (for repeat purchase). Currently 100% WhatsApp dependent.  
**Effort:** Medium (add email field to Explorer Pass, integrate SendGrid or similar).  
**Consideration:** Many tourists prefer WhatsApp. Don't add friction for a channel that may convert worse. Test with beta users.

### C3. Instagram / social media integration
**Impact:** Medium. Georgia is highly photogenic — social sharing has real viral potential.  
**Effort:** Medium (Web Share API + Instagram deep link handling).  
**Prerequisite:** Need at least 10 sharable chronicle posts to validate engagement.

### C4. Public profile pages
**Impact:** Low until users care about their profile.  
**Effort:** Medium (add unique URL per explorer, privacy controls).  
**Prerequisite:** Users must first value their profile enough to want to share it.

### C5. QR code scanner (real, not demo)
**Impact:** High for actual in-field use.  
**Effort:** High (camera API, QR decode library, location verification).  
**Prerequisite:** Run at least 5 real tours with the "Demo Scan" mechanic first to validate flow.

### C6. Tighten Supabase RLS policies
**Impact:** High for security.  
**Effort:** Low (SQL changes only).  
**Prerequisite:** Must implement Supabase Auth first.  
**Action:** After auth is in place, replace `USING (true)` with proper `auth.uid()` checks.

### C7. Payment integration
**Impact:** High for scaling.  
**Effort:** Very high (Stripe/Georgian payment processor, refund logic, tax handling).  
**Prerequisite:** Validate WhatsApp booking works reliably at scale first. Don't add payment until manual booking has 50+ completed transactions.

---

## D. Do Not Build Yet
*These are premature, will create complexity without near-term return, or require larger dependencies.*

### D1. Mobile app (iOS / Android)
**Reason:** The PWA (web app) is fast and installable on mobile. A native app adds store approval friction, two codebases, and update complexity. Only worth it if the web conversion rate is already strong.

### D2. Real-time availability system
**Reason:** Tour availability is managed by Levani manually via WhatsApp. A real-time system would require syncing with his calendar, adding significant complexity. WhatsApp is the right tool for this phase.

### D3. Multi-language support (Georgian, Russian, etc.)
**Reason:** All current copy is English. Adding languages before validating the English product works is premature. Add only if Levani's customer base shows significant non-English speakers.

### D4. Video guide integration
**Reason:** High storage and bandwidth cost, complex delivery. No clear need validated by users.

### D5. Automated confirmation emails / SMS
**Reason:** WhatsApp is the channel users are already using. Adding email/SMS before WhatsApp is fully optimized creates complexity without clear benefit.

### D6. Complex admin workflow (availability calendar, tour scheduling)
**Reason:** Levani manages this manually. The admin dashboard is adequate for tracking bookings. A full scheduling system is a product in itself — build it only once the booking volume justifies it.

### D7. "Memory Poster" / graphic export of Hero Chronicle
**Reason:** The Hero Chronicle is already differentiated. A graphic poster format is a nice-to-have. Build social sharing (B2) first and validate that users actually share the chronicle before investing in visual design.

---

## Quick Reference: Impact × Effort Matrix

```
                   LOW EFFORT          HIGH EFFORT
                 ┌──────────────────┬──────────────────┐
    HIGH         │ A1. Link free     │ A3. Levani photo  │
    IMPACT       │ A2. Pass value    │ B3. Real leaderbd │
                 │ A4. Run migration │ B2. Chronicle shr │
                 │ A5. Gemini key   │ B5. FAQ section   │
                 │ A6. Fix Vercel   │ C5. QR scanner    │
                 │ A7. Admin token  │ C7. Payments      │
                 ├──────────────────┼──────────────────┤
    LOW          │ B1. Hero image   │ C1. Realtime LB   │
    IMPACT       │ B4. Post-booking │ C2. Email CRM     │
                 │ B6. Stats count  │ C6. RLS tighten   │
                 │                  │ D1. Mobile app    │
                 └──────────────────┴──────────────────┘
```

---

## Special Focus Areas (From Brief)

### Homepage Conversion
- **Do now:** A1 (free quest link), A2 (pass value), A3 (Levani photo), A8 (testimonials)
- **After beta:** B6 (stats counter), B7 (hero image decision)
- **Direction:** Primary CTA should reveal the product (tours), not capture data (Explorer Pass). Consider making "Explore Tours" the primary button and "Start Your Journey" secondary for new visitors.

### Free Tbilisi Quest Visibility
- **Urgent:** A1 — this is the #1 fix. The free quest is invisible.
- **Where to add entry points:** Homepage banner (new users), tours listing page top card, a "Free" tab in the category filter on /tours
- **Do not:** Add to bottom nav as a permanent tab — it would compete with the paid tours call to action

### Explorer Pass Explanation
- **Do now:** A2 — one sentence above the form
- **After beta:** Consider showing a preview of the dashboard (screenshot or animation) before the modal opens — "Here's what your Explorer Pass looks like"
- **Keep:** The modal itself is well-designed (low friction, dismissable)

### Trust Signals
- **Do now:** A3 (Levani photo + bio), A8 (testimonials)
- **After beta:** B6 (real stats: tours completed, travellers served)
- **Important:** Even one real testimonial from a beta tester is 10x more powerful than a polished design without one

### WhatsApp Booking Clarity
- **Do now:** B4 (post-booking explanation of what happens next)
- **Keep:** The pre-filled booking message is excellent — professional, specific, includes booking code
- **Do not change:** The WhatsApp-first booking flow is the product's key differentiator

### Hero Chronicle / Memory Poster Direction
- **Current state:** Chronicle generates correctly (with Gemini key) or falls back to template. WhatsApp-only sharing.
- **Next step (B2):** Add clipboard copy and Web Share API for mobile
- **Memory Poster:** Do not build yet (D7). Validate sharing behavior first.
- **Direction:** The chronicle is Ivera's best emotional hook. Keep the prompt quality high. Add sharing channels before adding visual design.

### Need a Hint — Keep Secondary
- **Current implementation:** Correct — "Need a clue?" as subtle 10px grey text link
- **Do not:** Make the hint button prominent or automatic
- **Watch:** If beta shows users abandoning quests due to confusion, reconsider visibility
- **The AI hint itself:** When Gemini key is set (A5), hints will be genuinely useful. Fallback text is adequate.

---

## Launch Checklist (Beta-Ready)

Before inviting first real users:

- [ ] A1: Free quest linked from homepage
- [ ] A2: Explorer Pass value text added
- [ ] A3: Levani photo + bio visible somewhere
- [ ] A4: Migration 001 run in Supabase
- [ ] A5: GEMINI_API_KEY set in Vercel
- [ ] A6: ivera.info returns 200 (Deployment Protection off)
- [ ] A7: Admin token overridden from default
- [ ] A8: At least 2 real testimonials added
- [ ] Verify WhatsApp number is correct: 995555443787
- [ ] Test end-to-end booking flow from iPhone (select date → WhatsApp message arrives → admin sees booking)
- [ ] Test free quest completion → Kakheti WhatsApp CTA works
- [ ] Test Hero Chronicle on a completed quest (with real Gemini key)
