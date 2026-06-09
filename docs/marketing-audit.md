# Ivera Marketing Audit
**Date:** 2026-06-09  
**Framework:** AIDA (Awareness → Interest → Desire → Action)

---

## Funnel Overview

```
Awareness     → Tourist lands on ivera.info
Interest      → Browses tours, reads descriptions
Desire        → Creates Explorer Pass (identity commitment)
Action        → Books via WhatsApp / Completes mini-quest
Retention     → XP system, leaderboard, badge collection
Advocacy      → Hero Chronicle shared on WhatsApp
```

The funnel is architecturally sound. The implementation has specific gaps that kill conversion before the tourist reaches the "Action" stage.

---

## 1. Unique Value Proposition — Is It Clear?

**Current headline:** "Your journey begins in Georgia."  
**Current sub:** "Taste 8,000-year-old wine. Walk fortified mountain cities. Complete missions and earn XP on real guided tours."

**Assessment: 7/10**

The headline is evocative but generic — could belong to any Georgia travel site. The sub-headline is better: "Complete missions and earn XP on real guided tours" distinguishes Ivera. However, it buries the differentiator at the end of the third sentence.

**What's missing from the UVP:**
- The human element (guided by a local Georgian, Levani — one person you message, not a booking platform)
- The "no hassle" angle (one WhatsApp message, confirmed in 2 hours, no payment now)
- The gamification payoff (what earning XP actually gives you)

**Stronger UVP option (suggestion only):**  
"Guided quests across Georgia — WhatsApp Levani, show up, earn XP."

---

## 2. Is "Georgia Travel Quest" Understandable?

**Score: 5/10 for first-time visitors**

The word "quest" is used extensively throughout but is never defined for newcomers. A tourist who has never played a video game may not understand that quests = missions at real locations during a real guided tour.

The concept only becomes clear after:
1. Reading a tour detail page (mission preview section)
2. Trying the free quest page
3. Reading "How it works" (step 3: "Scan QR codes, taste, observe, and discover at each stop")

The "How it works" section on the homepage (4 steps) is the best explanation — but it's below the fold and only visible to new users who scroll.

---

## 3. Is the Free Mini-Quest Visible Enough?

**Score: 0/10 — CRITICAL FAILURE**

The free Tbilisi mini-quest (`/free-tbilisi-quest`) is **not linked from anywhere** in the app:
- Not on the homepage
- Not in the bottom navigation  
- Not on the tours listing page
- Not in the header
- Not in the notification panel
- Not in the Dashboard for returning users

A tourist who doesn't know the URL cannot find this feature. This is the single highest-impact marketing asset in the product (it's a try-before-you-buy lead magnet that ends with WhatsApp booking CTAs for paid tours) and it is effectively invisible.

**Lost opportunity:** Every new user who tries the free quest and reaches the completion screen sees:
- Kakheti Wine Legends WhatsApp CTA
- Kazbegi Mountain Quest WhatsApp CTA
- "View Kakheti Tour" and "View Kazbegi Tour" links

That's a perfect conversion moment — but zero users reach it through normal navigation.

---

## 4. Does the Site Explain Why to Create Explorer Pass?

**Score: 3/10**

The "Start Your Journey" button opens the Explorer Pass modal with no preamble. The modal asks for name, country, and interests — but never tells the user what they get.

A user who dismisses the modal has lost nothing they can see. The value exchange is invisible:
- "You give us your name → you get XP tracking, level progression, personalized recommendations, and a badge collection"

This is never communicated. The modal assumes motivation that doesn't yet exist.

**What's needed:** A single sentence above the form: "Track your XP, unlock badges, and get personalised tour recommendations across all your Georgia adventures."

---

## 5. Does the Site Explain Why to Book a Paid Tour?

**Score: 7/10**

Tour detail pages do this well:
- Long description of the experience
- Included items listed
- Route stops with numbered timeline
- Quest missions preview (builds anticipation)
- Urgency badges ("2 spots left")
- XP booking bonus ("Book today: +100 XP")
- "No payment now" trust badge

What's missing from the "why book" argument:
- Testimonials (zero social proof)
- Guide introduction (who is Levani?)
- Past group photos (are these real tours?)
- Number of tours completed (credibility counter)

---

## 6. Is the WhatsApp CTA Strong Enough?

**Score: 6/10**

WhatsApp CTAs are present throughout:
- Hero section: "Build Custom Trip on WhatsApp" (ghost button, secondary)
- Bottom of homepage: "Chat on WhatsApp" (green button, WhatsApp color)
- Tour detail bottom: "Book via WhatsApp" (green button, prominent)
- Booking Widget: "Book via WhatsApp" (the main action button)
- Header notification panel: "Chat with Levani on WhatsApp"

The messaging is consistent. The friction is low. However:
- The booking widget CTA says "Book via WhatsApp" but what opens is WhatsApp with a pre-filled message — users may not know they still need to wait for Levani to reply
- The hero-section WhatsApp CTA is a ghost button (secondary style) when it could be equally primary for users who just want to talk to someone

---

## 7. Are Trust Signals Sufficient?

**Score: 3/10 — Significant gap**

**Present:**
- "No payment now" badge (prominent on tour pages, booking widget)
- "English-speaking guide" (tour detail meta strip)
- "Small private group" (tour detail meta strip)  
- "Levani confirms within 2 hours" (tour page)
- Real WhatsApp number visible in every link (995555443787)

**Missing:**
- **No photo of Levani.** Tourists are being asked to WhatsApp a stranger named "Levani" and potentially transfer money. A face builds trust faster than any copy.
- **No testimonials.** Not one quote from a past traveller.
- **No "tours completed" counter.** "47 tours completed in 2025" would immediately signal legitimacy.
- **No social proof.** No Instagram link, no TripAdvisor badge, no Google Reviews.
- **No about page.** Who runs Ivera? When did it start?

---

## 8. Are Rewards and Leaderboard Motivating?

**Score: 4/10**

The gamification architecture is correct (XP → levels → badges → leaderboard) but the motivational loop is broken:

- **Leaderboard shows fake data** (Nino G., Luka T., etc. are hardcoded). Real users see themselves ranked against fictional players — this feels dishonest once noticed.
- **"Top 3 earn a free bonus seat"** — this reward is promised but has no redemption mechanism. Users can't claim it.
- **Badges are not shareable.** The hero badge ("Key of Tbilisi") is only visible on the profile page. It cannot be exported or shared.
- **XP has no visible utility beyond the leaderboard.** Users don't know what 500 XP buys them, if anything.

Once real users are in the system, the leaderboard will become motivating. Until then it creates a cognitive dissonance.

---

## 9. Path From Free User to Paid Customer

**Current path (if mini-quest is discoverable):**
1. User finds free mini-quest URL
2. Completes 3 missions in Tbilisi
3. Reaches completion screen with Kakheti/Kazbegi CTAs
4. Clicks WhatsApp booking link
5. Books paid tour

**This path works IF the user finds the free quest.** Right now it's the primary acquisition gap.

**Current path (no mini-quest):**
1. User lands on homepage
2. Creates Explorer Pass (why? unclear)
3. Sees dashboard with 0 XP, 0 tours, 0 badges
4. Needs motivation to browse tours
5. Reads a tour detail
6. Books via WhatsApp

This path relies on the user being already motivated to travel to Georgia — it doesn't create motivation.

---

## 10. Path From One Tour to the Next Tour

**Score: 6/10 — good mechanics, weak triggering**

After completing a quest:
1. Completion screen: "View Profile" button
2. Profile page shows: "Your Next Adventure" section with 2 AI-recommended tours
3. Dashboard (returning user): "Your Next Quest" card shows first uncompleted tour

**Missing:**
- No congratulations email/message to Levani with an upsell
- The recommendation section only appears if `profile.supabaseId` exists (many users won't have Supabase sync)
- No post-tour WhatsApp message from Levani with next tour suggestion
- No "Book your next quest" CTA on the Hero Chronicle share screen

---

## Strengths

1. **Premium visual design** — The dark/gold aesthetic communicates luxury travel, not budget tourism
2. **WhatsApp-native** — Perfect for the target audience (international tourists who already use WhatsApp)
3. **"No payment now"** — Eliminates the biggest objection for cold traffic
4. **Price transparency** — Full breakdown shown before booking (base, discount, total)
5. **Gamification foundation** — XP, badges, leaderboard are structurally correct
6. **Free lead magnet exists** — Just needs to be surfaced
7. **AI Hero Chronicle** — Unique feature that creates sharable moments
8. **Multi-tour discounts** — Smart incentive for repeat bookings
9. **WhatsApp pre-fill** — The booking message is professional and specific

## Weak Points

1. **Free mini-quest is invisible** — Top acquisition asset has no entry point
2. **No human face** — Levani is a name, not a person
3. **Zero social proof** — No testimonials, no review count
4. **Explorer Pass value not explained** — Form before value proposition
5. **Leaderboard uses fake data** — Breaks trust when discovered
6. **"Free bonus seat" promise without redemption** — Creates expectation mismatch
7. **UVP buries the differentiator** — "quests on real tours" should be headline, not line 3

## Conversion Gaps

| Stage | Gap | Impact |
|-------|-----|--------|
| Awareness | Hero image invisible (heavy gradient) | Medium |
| Interest | Free quest not linked anywhere | **Critical** |
| Interest | No social proof on tour pages | High |
| Desire | Explorer Pass value prop missing | High |
| Desire | No Levani introduction | High |
| Action | Booking widget unclear "confirmed" state | Medium |
| Retention | Fake leaderboard breaks trust | Medium |
| Advocacy | Chronicle not shareable beyond WhatsApp | Low |

## Suggested CTA Improvements

### Homepage hero (new users)
- **Primary button:** "Explore Tours" (→ /tours) — show the product first
- **Secondary button:** "Try Free Tbilisi Quest" (→ /free-tbilisi-quest) — the real hook
- **Tertiary link:** "Book a custom trip on WhatsApp" — for ready buyers

### Tours listing page
- Add a banner/card at the top: "New to Ivera? Try our **Free Tbilisi Quest** first →"

### Explorer Pass modal
- Add above the form: "Create your Explorer Pass to track XP, unlock badges, and get personal recommendations across all your Georgia adventures."

### Tour detail pages
- Add below the price: "500+ guests have completed this tour" (when real data exists)
- Add Levani photo + one-liner bio near the WhatsApp CTA

### Post-quest completion
- Add to Hero Chronicle screen: "Copy to clipboard" + "Share as image" + "Post to Instagram story"

## Suggested Trust-Building Blocks

1. **Levani card** (add to homepage and tour pages):
   - Photo of Levani at a iconic Georgian location
   - "Hi, I'm Levani. Born in Tbilisi. Running tours since 2019."
   - One quote from a tourist
   - WhatsApp button: "Ask me anything"

2. **Social proof strip** (below hero or on tour cards):
   - "★★★★★ 4.9 on Google" (if real rating exists)
   - "Trusted by travellers from 40+ countries"
   - Instagram embed or link

3. **Tour counter** (in hero or below fold):
   - "47 tours completed · 200+ happy travellers · 2,400+ XP earned collectively"
   - Even one real stat is powerful

4. **FAQ section** (below booking widget):
   - "What happens after I send the WhatsApp message?"
   - "Do I pay now?"
   - "What if I need to cancel?"
   - "Is the guide local?"
