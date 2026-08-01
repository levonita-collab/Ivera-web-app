import { getServiceClient } from "./serviceClient";
import { mapBookingRow } from "./bookingRowMapper";
import { canTransition } from "@/lib/bookingTransitions";
import type { BookingRecord } from "@/lib/bookingTypes";
import type { BookingStatus, PaymentStatus } from "@/lib/supabase/types";

// Service-role variants of the booking read/write functions in
// bookingService.ts. These bypass RLS entirely — call ONLY from trusted
// server contexts: the admin API routes (after requireAdmin() succeeds) and
// the PayPal API routes (which independently verify the order against
// PayPal's own API before writing). Never call from a route that doesn't
// first authenticate/authorize its caller.

// ─── Admin: list bookings ───────────────────────────────────────────────────

export async function getAdminBookingsServer(
  statusFilter?: BookingStatus
): Promise<BookingRecord[]> {
  const service = getServiceClient();
  if (!service) return [];
  try {
    let query = service.from("bookings").select("*").order("created_at", { ascending: false });
    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(mapBookingRow);
  } catch {
    return [];
  }
}

// ─── Admin: change booking status (validated transition) ───────────────────

export type StatusChangeResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function updateBookingStatusServer(
  bookingId: string,
  nextStatus: BookingStatus
): Promise<StatusChangeResult> {
  const service = getServiceClient();
  if (!service) return { ok: false, status: 503, error: "Admin API is not configured." };

  const { data: current, error: readError } = await service
    .from("bookings")
    .select("status")
    .eq("id", bookingId)
    .single();

  if (readError || !current) {
    return { ok: false, status: 404, error: "Booking not found." };
  }

  if (!canTransition(current.status, nextStatus)) {
    return {
      ok: false,
      status: 409,
      error: `Cannot change status from "${current.status}" to "${nextStatus}".`,
    };
  }

  const { data: updated, error } = await service
    .from("bookings")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("status", current.status) // guards against a concurrent status change in between
    .select("id");

  if (error) return { ok: false, status: 500, error: error.message };
  if (!updated || updated.length === 0) {
    return { ok: false, status: 409, error: "Booking status changed concurrently — reload and try again." };
  }
  return { ok: true };
}

// ─── Admin: mark a booking refunded (manual refund processed outside the app) ──

export async function markBookingRefundedServer(bookingId: string): Promise<StatusChangeResult> {
  const service = getServiceClient();
  if (!service) return { ok: false, status: 503, error: "Admin API is not configured." };

  const { data: current, error: readError } = await service
    .from("bookings")
    .select("payment_status")
    .eq("id", bookingId)
    .single();

  if (readError || !current) {
    return { ok: false, status: 404, error: "Booking not found." };
  }
  if (current.payment_status !== "paid") {
    return { ok: false, status: 409, error: "Only a paid booking can be marked refunded." };
  }

  const { data: updated, error } = await service
    .from("bookings")
    .update({ payment_status: "refunded", updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("payment_status", "paid") // atomic guard against a double-refund race
    .select("id");

  if (error) return { ok: false, status: 500, error: error.message };
  if (!updated || updated.length === 0) {
    return { ok: false, status: 409, error: "Payment status changed concurrently — reload and try again." };
  }
  return { ok: true };
}

// ─── PayPal webhook: resolve a booking from its linked order id ─────────────

export async function findBookingIdByPaypalOrderServer(orderId: string): Promise<string | null> {
  const service = getServiceClient();
  if (!service) return null;
  try {
    const { data, error } = await service
      .from("bookings")
      .select("id")
      .eq("paypal_order_id", orderId)
      .single();
    if (error || !data) return null;
    return data.id;
  } catch {
    return null;
  }
}

// ─── PayPal: link an order to a booking before capture ──────────────────────

export async function linkPaypalOrderServer(bookingId: string, orderId: string): Promise<boolean> {
  const service = getServiceClient();
  if (!service) return false;
  try {
    const { error } = await service
      .from("bookings")
      .update({ paypal_order_id: orderId, updated_at: new Date().toISOString() })
      .eq("id", bookingId);
    return !error;
  } catch {
    return false;
  }
}

// ─── PayPal: read payment info for a booking ────────────────────────────────

export async function getBookingPaymentInfoServer(
  bookingId: string
): Promise<{ paypalOrderId: string | null; paymentStatus: PaymentStatus } | null> {
  const service = getServiceClient();
  if (!service) return null;
  try {
    const { data, error } = await service
      .from("bookings")
      .select("paypal_order_id, payment_status")
      .eq("id", bookingId)
      .single();

    if (error || !data) return null;
    return {
      paypalOrderId: data.paypal_order_id ?? null,
      paymentStatus: data.payment_status ?? "unpaid",
    };
  } catch {
    return null;
  }
}

// ─── PayPal: mark booking paid — atomic, idempotent ─────────────────────────
//
// The `.eq("payment_status", "unpaid")` guard makes this safe against two
// concurrent capture requests for the same booking: only the first write
// actually changes a row (Postgres/PostgREST report 0 rows affected for the
// second), instead of a read-then-write race where both could "succeed".
// Callers should treat "0 rows affected" as success too (already paid),
// which is exactly what the capture-order route's own pre-check does.

export async function markBookingPaidServer(
  bookingId: string,
  payment: { paypalOrderId: string; amount: number; currency: string }
): Promise<boolean> {
  const service = getServiceClient();
  if (!service) return false;
  try {
    const { error } = await service
      .from("bookings")
      .update({
        payment_status: "paid",
        payment_method: "paypal",
        paypal_order_id: payment.paypalOrderId,
        paid_amount: payment.amount,
        paid_currency: payment.currency,
        paid_at: new Date().toISOString(),
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("payment_status", "unpaid");

    return !error;
  } catch {
    return false;
  }
}
