# Ivera Backend Integration Audit

## 1. Where Explorer Pass is saved locally and synced to Supabase

- **localStorage (instant):** `ExplorerPass.tsx → handleSave()` calls `saveProfile(profile)` from `lib/questProgress.ts`. This writes to `localStorage["ivera_profile"]` synchronously before anything else.
- **Supabase (background):** Same `handleSave()` calls `saveExplorerToSupabase(profile, existingSupabaseId)` from `lib/supabase/explorerService.ts` with `.catch(() => {})`. The returned UUID is saved back to localStorage as `profile.supabaseId`.
- **Auto-migration:** `app/page.tsx` has a `useEffect` that runs once on mount: if a profile exists in localStorage but has no `supabaseId`, it fires `saveExplorerToSupabase()` to backfill pre-Supabase profiles.
- **Profile page edit:** `app/profile/page.tsx → saveName()` also calls `saveExplorerToSupabase()` after localStorage update, preserving the supabaseId link.

## 2. Where bookings are inserted before WhatsApp opens

- `BookingWidget.tsx → handleBook()` calls `saveBookingToSupabase(payload).catch(() => {})` immediately before `window.open(whatsappLink)`.
- Both run without `await` — the WhatsApp tab opens even if Supabase is slow or down.
- Payload includes: `explorer_id` (from `profile.supabaseId`, may be null), `tour_slug`, `tour_title`, `selected_date`, `people_count`, `price_per_person`, `total_price`, `whatsapp_message`, `status: "pending"`.

## 3. Where quest_progress is inserted

- `QuestClient.tsx → handleComplete(missionId)` calls `completeMission()` (localStorage), then calls `syncMissionCompletion()` from `lib/supabase/questService.ts` if `profile.supabaseId` is set.
- `syncMissionCompletion()` does a Supabase `.upsert()` on `quest_progress` with `onConflict: "explorer_id,tour_slug,mission_id"` — idempotent by design.

## 4. Where leaderboard_entries are updated

- `questService.ts → syncMissionCompletion()` calls `upsertLeaderboardEntry(explorerId, displayName, totalXp, completedQuests)` from `explorerService.ts`.
- That function queries for an existing row by `explorer_id`; updates if found, inserts if not.
- `totalXp` and `completedQuests` are read from localStorage at the moment of completion so they reflect the full local state.

## 5. How existing local profiles are migrated

- On every home page mount (`app/page.tsx`), a `useEffect` runs once:
  1. Reads profile from localStorage.
  2. If no profile, or profile already has `supabaseId` → exits immediately (no duplicate insert).
  3. Otherwise calls `saveExplorerToSupabase(profile)` → receives UUID → writes `supabaseId` back to localStorage.
- This means any user who created a profile before Supabase was connected will be migrated on their next visit.

## 6. Fallback behavior if Supabase fails

- `lib/supabase/client.ts` returns `null` if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing.
- Every service function (`explorerService`, `bookingService`, `questService`) checks `if (!supabase) return null` at the top — no error is thrown, no user-visible failure.
- All Supabase calls use `.catch(() => {})` or `try/catch` that returns null — failures are swallowed silently.
- localStorage is always written first and is the source of truth. The app is fully functional with no Supabase connection.

## 7. Duplicate prevention logic

| Entity | Prevention mechanism |
|---|---|
| `explorer_profiles` | `supabaseId` written to localStorage after first insert. Auto-sync checks `if (p.supabaseId) return` before inserting. |
| `quest_progress` | `completeMission()` in localStorage checks `completedMissions.includes(missionId)` — returns early if already done. Supabase uses `upsert` with unique constraint `(explorer_id, tour_slug, mission_id)`. |
| `leaderboard_entries` | `upsertLeaderboardEntry()` queries for existing row by `explorer_id` before insert vs update. |
| Local XP | `completeMission()` only adds XP if mission not already in `completedMissions` array. |

## 8. What is still risky

| Risk | Severity | Notes |
|---|---|---|
| Two browser tabs open simultaneously | Low | Both could call `saveExplorerToSupabase()` before `supabaseId` is written back, creating a duplicate `explorer_profiles` row. Acceptable for MVP. |
| `explorer_profiles` has no unique constraint on any field | Low | No username/email field exists. Duplicate names are allowed. Owner can identify duplicates via `created_at`. |
| `quest_progress` with null `explorer_id` | Low | Supabase sync is only called when `profile.supabaseId` is set, so null-id rows are never inserted in practice. |
| Silent Supabase failures | Low | User gets no feedback if Supabase write fails. Data is safe in localStorage. Acceptable until a toast system is added. |
| Booking `whatsapp_message` stores full URL | Low | Contains the encoded message — useful for debugging but verbose. No PII beyond name/date/people count. |
| No server-side validation | Medium | All writes use anon key with permissive RLS. Malicious clients could insert arbitrary rows. Acceptable for invite-only beta. |
| No rate limiting | Medium | A user could spam booking inserts. Supabase has project-level rate limits. No app-level protection. |
