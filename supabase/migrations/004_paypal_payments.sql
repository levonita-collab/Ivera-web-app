-- Migration 004: PayPal payment tracking
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_method  text NOT NULL DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS payment_status  text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS paypal_order_id text,
  ADD COLUMN IF NOT EXISTS paid_amount     numeric(10,2),
  ADD COLUMN IF NOT EXISTS paid_currency   text,
  ADD COLUMN IF NOT EXISTS paid_at         timestamptz;

CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Each PayPal order can only settle one booking
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_paypal_order_id
  ON bookings(paypal_order_id) WHERE paypal_order_id IS NOT NULL;
