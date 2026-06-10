-- ─────────────────────────────────────────────────────────────────────────────
-- Explorer Pass: language preference
-- Adds an optional `language` column for support language preference
-- (English / Russian). The `whatsapp_optional` column already exists from
-- the base schema and now stores the Explorer Pass WhatsApp number.
-- Idempotent + backward compatible: old profiles simply have NULL here.
-- ─────────────────────────────────────────────────────────────────────────────

alter table explorer_profiles
  add column if not exists language text;
