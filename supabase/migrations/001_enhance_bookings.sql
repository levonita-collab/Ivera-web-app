-- Migration 001: Enhance bookings table with booking code, discount details, and tracking fields
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS booking_code       text,
  ADD COLUMN IF NOT EXISTS customer_name      text,
  ADD COLUMN IF NOT EXISTS customer_phone     text,
  ADD COLUMN IF NOT EXISTS customer_email     text,
  ADD COLUMN IF NOT EXISTS tour_category      text,
  ADD COLUMN IF NOT EXISTS base_price_per_person numeric(10,2),
  ADD COLUMN IF NOT EXISTS base_total            numeric(10,2),
  ADD COLUMN IF NOT EXISTS discount_applied      numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_reason       text,
  ADD COLUMN IF NOT EXISTS savings               numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_price_per_person numeric(10,2),
  ADD COLUMN IF NOT EXISTS final_total            numeric(10,2),
  ADD COLUMN IF NOT EXISTS currency              text NOT NULL DEFAULT 'GEL',
  ADD COLUMN IF NOT EXISTS seats_left_at_booking integer,
  ADD COLUMN IF NOT EXISTS xp_reward             integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS whatsapp_opened       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes                 text,
  ADD COLUMN IF NOT EXISTS updated_at            timestamptz DEFAULT now();

-- Partial unique index on booking_code (NULL values excluded from uniqueness check)
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_booking_code
  ON bookings(booking_code) WHERE booking_code IS NOT NULL;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status     ON bookings(status);

-- Backfill booking_code for any existing rows that lack one
UPDATE bookings
SET booking_code =
  'IVERA-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' ||
  LPAD((floor(random() * 9000 + 1000))::int::text, 4, '0')
WHERE booking_code IS NULL;
