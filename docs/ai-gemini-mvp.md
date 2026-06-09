# Ivera AI Layer — Gemini MVP

## What was added

Four AI-powered features using Google Gemini, all server-side only:

| Feature | Where | Route |
|---|---|---|
| AI Quest Hints | Mission cards (all quests) | `POST /api/ai/quest-hint` |
| Hero Chronicle | Quest completion screen | `POST /api/ai/hero-chronicle` |
| Free Mini Quest | `/free-tbilisi-quest` | standalone page |
| Tour Recommendations | Profile page | `POST /api/ai/tour-recommendation` |

---

## Required Environment Variable

Add to `.env.local` (never commit this file):

```
GEMINI_API_KEY=your_google_ai_studio_key_here
```

- Get a key at [Google AI Studio](https://aistudio.google.com)
- The app builds and runs without this key — all AI features fall back gracefully
- **Never use `NEXT_PUBLIC_GEMINI_API_KEY`** — that would expose the key to the browser

---

## File Structure

```
src/lib/ai/
  gemini.ts      — core Gemini REST client (server-only)
  prompts.ts     — prompt template functions
  logging.ts     — optional Supabase logging (fails silently)

src/app/api/ai/
  quest-hint/route.ts          — POST, returns hint text
  hero-chronicle/route.ts      — POST, returns cinematic story
  tour-recommendation/route.ts — POST, returns [{slug, reason}]
```

All routes use `export const runtime = "nodejs"`.

---

## AI Fallback Behavior

| Scenario | Behavior |
|---|---|
| `GEMINI_API_KEY` missing | Returns static fallback immediately |
| Gemini API error or timeout | Returns static fallback |
| Gemini returns empty text | Returns static fallback |
| Supabase `ai_interactions` table missing | Logging silently skipped |

Fallback texts:
- **Quest hint**: `"Look carefully around the location. The answer is hidden in the story of this place."`
- **Hero chronicle**: Template text using explorer name, tour, XP, badge
- **Recommendation**: Deterministic rules based on completed tours

---

## Deterministic Recommendation Rules (no Gemini needed)

| Completed | Recommended |
|---|---|
| Kakheti | Kazbegi + Mtskheta |
| Tbilisi quest (free or paid) | Kakheti + Kazbegi |
| Kazbegi | Kakheti + Vardzia |
| Nothing yet | Key of Tbilisi (free) + Kakheti |

---

## Safety Rules

- Gemini key is **server-side only** — never in `NEXT_PUBLIC_*` vars
- All AI calls have a 12-second timeout
- Quest hints are instructed never to give direct answers
- Hero chronicles only reference missions the user actually completed
- Recommendations never mention prices or invent tours

---

## Free Mini Quest: Key of Tbilisi

Route: `/free-tbilisi-quest`

- 3 missions, 200 XP total, "Key of Tbilisi" badge
- No payment, no sign-up required
- Uses existing `completeMission()` / `getQuestProgress()` system
- Quest slug: `key-of-tbilisi`
- Completion screen shows Kakheti + Kazbegi booking CTAs

---

## Optional AI Logging

Run `supabase/migrations/002_ai_interactions.sql` in the Supabase SQL editor to enable logging.

Table: `ai_interactions`
- `interaction_type`: `quest_hint` | `hero_chronicle` | `recommendation`
- `explorer_id`, `tour_slug`, `mission_id`, `input_summary`, `output_summary`

Logging is fire-and-forget — never blocks AI response.

---

## What NOT to implement yet

- Photo proof validator (needs vision model + storage)
- Push notification rivalry
- Team matchmaker
- Dynamic pricing
- Full AI itinerary marketplace
- Streaming responses (current implementation waits for full response)

---

## How to Test Each Feature

### Quest Hint
1. Open any quest (`/quest/kakheti-wine-legends`)
2. On an incomplete mission card, tap **"Need a hint?"**
3. A purple hint box should appear within ~3 seconds
4. To test fallback: remove `GEMINI_API_KEY` from `.env.local`, restart dev server, repeat

### Hero Chronicle
1. Complete all missions on any quest
2. On the completion screen, tap **"Generate My Hero Chronicle"**
3. A cinematic story should appear
4. Tap **"Send Chronicle via WhatsApp"** to share

### Free Mini Quest
1. Navigate to `/free-tbilisi-quest`
2. Complete all 3 missions using "Demo Complete ✦"
3. Verify 200 XP total
4. Verify "Key of Tbilisi" badge appears
5. Verify Kakheti/Kazbegi WhatsApp CTAs are visible and functional

### Tour Recommendations
1. Open `/profile`
2. The "Your Next Adventure" section should appear after the booking summary
3. Recommendations change based on your completed tour history
4. Each recommendation links to the tour page

---

*AI layer added: June 2026. Model: gemini-1.5-flash.*
