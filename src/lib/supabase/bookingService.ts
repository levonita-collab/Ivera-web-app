import { supabase } from "./client";
import type {
  BookingRecord,
  BookingResult,
  BookingStatus,
  CreateBookingInput,
} from "@/lib/bookingTypes";

// ─── Booking code generation ───────────────────────────────────────────────

export function generateBookingCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `IVERA-${yyyy}${mm}${dd}-${rand}`;
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

  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
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
        whatsapp_opened: false,
        whatsapp_message: input.whatsappMessage,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[createBooking] Supabase error:", error.message);
      return { success: false, bookingId: null, bookingCode: null, error: error.message };
    }

    return {
      success: true,
      bookingId: data?.id ?? null,
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
    return data.map(mapRow);
  } catch {
    return [];
  }
}

export async function getAdminBookings(
  statusFilter?: BookingStatus
): Promise<BookingRecord[]> {
  if (!supabase) return [];
  try {
    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(mapRow);
  } catch {
    return [];
  }
}

// ─── Update status ─────────────────────────────────────────────────────────

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId);

    return !error;
  } catch {
    return false;
  }
}

// ─── Row mapper ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): BookingRecord {
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
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
}
