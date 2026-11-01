import { supabase } from "./client";
import { mapBookingRow } from "./bookingRowMapper";
import type {
  BookingRecord,
  BookingResult,
  CreateBookingInput,
} from "@/lib/bookingTypes";

// NOTE: admin listing/status-transition, PayPal order linking, and marking a
// booking paid all moved to src/lib/supabase/bookingServiceServer.ts (the
// service-role client) as part of the Security Hardening PR. The anon-key
// client used here can no longer write those columns — see
// supabase/migrations/007_security_hardening.sql.

// ─── Booking code generation ───────────────────────────────────────────────

export function generateBookingCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `IVERA-${yyyy}${mm}${dd}-${rand}`;
}

// ─── Booking id generation ─────────────────────────────────────────────────

/**
 * The booking's primary key, generated on the client.
 *
 * Anonymous visitors may INSERT a booking but RLS gives them no SELECT on it
 * ("Read own bookings" needs a signed-in owner), so `insert().select()` —
 * i.e. INSERT … RETURNING — is rejected with "new row violates row-level
 * security policy" and the booking is lost. Choosing the id up front lets us
 * insert without reading the row back. Migration 009 grants INSERT on `id`.
 */
export function generateBookingId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC 4122 v4 fallback for browsers without crypto.randomUUID.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ─── Create booking ────────────────────────────────────────────────────────

export async function createBooking(input: CreateBookingInput): Promise<BookingResult> {
  if (!supabase) {
    return {
      success: false,
      bookingId: null,
      bookingCode: null,
      error: "Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const bookingId = generateBookingId();

  try {
    // No .select() after .insert(): see generateBookingId — reading the row
    // back is what RLS refuses for anonymous visitors.
    const { error } = await supabase
      .from("bookings")
      .insert({
        id: bookingId,
        booking_code: input.bookingCode,
        explorer_id: input.explorerId ?? null,
        customer_name: input.customerName ?? null,
        tour_slug: input.tourSlug,
        tour_title: input.tourTitle,
        tour_category: input.tourCategory,
        selected_date: input.selectedDate,
        people_count: input.peopleCount,
        // Legacy columns (same as final values — kept for existing queries)
        price_per_person: input.finalPricePerPerson,
        total_price: input.finalTotal,
        // Detailed breakdown
        base_price_per_person: input.basePricePerPerson,
        base_total: input.baseTotal,
        discount_applied: input.discountApplied,
        discount_reason: input.discountReason ?? null,
        savings: input.savings,
        final_price_per_person: input.finalPricePerPerson,
        final_total: input.finalTotal,
        currency: "GEL",
        seats_left_at_booking: input.seatsLeftAtBooking,
        xp_reward: input.xpReward,
        whatsapp_message: input.whatsappMessage,
        payment_method: input.paymentMethod ?? "whatsapp",
        // status, payment_status, whatsapp_opened, paypal_order_id,
        // paid_amount/currency/at are intentionally NOT set here — the
        // Security Hardening migration (007) restricts anon/authenticated
        // INSERT to a column allowlist that excludes them, so a new
        // booking can only ever be created via the table's own defaults
        // ('pending' / 'unpaid' / false / null). Only the service role
        // (PayPal capture, admin API) can set these, after the fact.
      });

    if (error) {
      console.error("[createBooking] Supabase error:", error.message);
      return { success: false, bookingId: null, bookingCode: null, error: error.message };
    }

    return {
      success: true,
      bookingId,
      bookingCode: input.bookingCode,
      error: null,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return { success: false, bookingId: null, bookingCode: null, error: msg };
  }
}

// ─── Mark WhatsApp opened ──────────────────────────────────────────────────

export async function markWhatsAppOpened(bookingId: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase
      .from("bookings")
      .update({ whatsapp_opened: true, updated_at: new Date().toISOString() })
      .eq("id", bookingId);
  } catch {}
}

// ─── Read bookings ─────────────────────────────────────────────────────────

export async function getUserBookings(explorerId: string): Promise<BookingRecord[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("explorer_id", explorerId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map(mapBookingRow);
  } catch {
    return [];
  }
}
