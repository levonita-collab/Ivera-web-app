import type { LocalBookingSummary, BookingStatus } from "@/lib/bookingTypes";

const STORAGE_KEY = "ivera_bookings";

export function getLocalBookings(): LocalBookingSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalBookingSummary[];
  } catch {
    return [];
  }
}

export function saveLocalBooking(booking: LocalBookingSummary): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalBookings();
    const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function updateLocalBookingStatus(id: string, status: BookingStatus): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalBookings();
    const updated = existing.map((b) =>
      b.id === id ? { ...b, status } : b
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function getPendingBookingsCount(): number {
  const bookings = getLocalBookings();
  return bookings.filter((b) => b.status === "pending" || b.status === "contacted").length;
}
