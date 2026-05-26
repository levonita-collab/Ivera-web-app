import { supabase } from "./client";

interface BookingPayload {
  explorerId?: string | null;
  tourSlug: string;
  tourTitle: string;
  selectedDate: string;
  peopleCount: number;
  pricePerPerson: number | null;
  total: number | null;
  whatsappMessage: string;
}

export async function saveBookingToSupabase(
  payload: BookingPayload
): Promise<string | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        explorer_id: payload.explorerId ?? null,
        tour_slug: payload.tourSlug,
        tour_title: payload.tourTitle,
        selected_date: payload.selectedDate,
        people_count: payload.peopleCount,
        price_per_person: payload.pricePerPerson,
        total_price: payload.total,
        whatsapp_message: payload.whatsappMessage,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) return null;
    return data?.id ?? null;
  } catch {
    return null;
  }
}
