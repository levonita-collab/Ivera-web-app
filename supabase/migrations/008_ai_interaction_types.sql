-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 008: Add quest_chat and mission_answer_check to ai_interactions
--
-- The AI Quest Guide chat and the free-text answer-verification feature
-- (an alternative to scanning a QR code that isn't readable on-site) log
-- through the same ai_interactions table as the existing hint/chronicle
-- features, but need two new interaction_type values that the original
-- CHECK constraint (migration 002) doesn't allow yet.
--
-- Idempotent: safe to re-run (drops and recreates the constraint by name).
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.ai_interactions
  drop constraint if exists ai_interactions_interaction_type_check;

alter table public.ai_interactions
  add constraint ai_interactions_interaction_type_check
  check (
    interaction_type in (
      'quest_hint',
      'hero_chronicle',
      'recommendation',
      'quest_chat',
      'mission_answer_check'
    )
  );
