import type { BookingStatus } from "@/lib/supabase/types";

// Single source of truth for which booking-status transitions are allowed.
// Used by BOTH the admin UI (to only render valid next-status buttons) and
// the server-side admin API route (to independently re-validate — the
// server must never just trust whatever status a client sends).
export const ALLOWED_STATUS_TRANSITIONS: Partial<Record<BookingStatus, BookingStatus[]>> = {
  pending: ["contacted", "confirmed", "cancelled"],
  contacted: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  // completed and cancelled are terminal — no further transitions.
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return (ALLOWED_STATUS_TRANSITIONS[from] ?? []).includes(to);
}
