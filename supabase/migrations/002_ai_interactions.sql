-- Migration 002: AI interactions logging table
-- Run in Supabase Dashboard → SQL Editor → New query
-- App works fine without this table — logging fails silently if table doesn't exist.

CREATE TABLE IF NOT EXISTS ai_interactions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  explorer_id     uuid REFERENCES explorer_profiles(id) ON DELETE SET NULL,
  interaction_type text NOT NULL CHECK (
    interaction_type IN ('quest_hint', 'hero_chronicle', 'recommendation')
  ),
  tour_slug       text,
  mission_id      text,
  input_summary   text,
  output_summary  text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_explorer ON ai_interactions(explorer_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type     ON ai_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created  ON ai_interactions(created_at DESC);

ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- Allow the service role (used by API routes via anon key + RLS) to insert
CREATE POLICY "insert_ai_interactions"
  ON ai_interactions FOR INSERT
  WITH CHECK (true);

-- Allow admin reads (adjust for real admin auth when ready)
CREATE POLICY "read_ai_interactions"
  ON ai_interactions FOR SELECT
  USING (true);
