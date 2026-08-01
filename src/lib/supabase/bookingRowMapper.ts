import type { BookingRecord } from "@/lib/bookingTypes";

// Shared row → BookingRecord mapper, used by both the anon-key booking
// service (bookingService.ts) and the service-role variant
// (bookingServiceServer.ts) so the two never drift out of sync.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapBookingRow(row: any): BookingRecord {
  const basePerPerson = row.base_price_per_person ?? row.price_per_person;
  const baseTot =
    row.base_total ?? (basePerPerson != null ? basePerPerson * row.people_count : null);

  return {
    id: row.id,
    bookingCode:
      row.booking_code ?? `IVERA-${row.created_at?.slice(0, 10).replace(/-/g, "")}-????`,
    explorerId: row.explorer_id,
    customerName: row.customer_name ?? null,
    tourSlug: row.tour_slug,
    tourTitle: row.tour_title,
    tourCategory: row.tour_category ?? null,
    selectedDate: row.selected_date,
    peopleCount: row.people_count,
    basePricePerPerson: basePerPerson,
    baseTotal: baseTot,
    discountApplied: row.discount_applied ?? 0,
    discountReason: row.discount_reason ?? null,
    savings: row.savings ?? 0,
    finalPricePerPerson: row.final_price_per_person ?? row.price_per_person,
    finalTotal: row.final_total ?? row.total_price,
    currency: row.currency ?? "GEL",
    xpReward: row.xp_reward ?? 0,
    seatsLeftAtBooking: row.seats_left_at_booking ?? null,
    status: row.status,
    whatsappOpened: row.whatsapp_opened ?? false,
    whatsappMessage: row.whatsapp_message ?? null,
    notes: row.notes ?? null,
    paymentMethod: row.payment_method ?? "whatsapp",
    paymentStatus: row.payment_status ?? "unpaid",
    paypalOrderId: row.paypal_order_id ?? null,
    paidAmount: row.paid_amount ?? null,
    paidCurrency: row.paid_currency ?? null,
    paidAt: row.paid_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
}
