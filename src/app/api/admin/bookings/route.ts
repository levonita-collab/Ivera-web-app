import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/adminAuth";
import { getAdminBookingsServer } from "@/lib/supabase/bookingServiceServer";
import type { BookingStatus } from "@/lib/supabase/types";

export const runtime = "nodejs";

const VALID_STATUSES: BookingStatus[] = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
];

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const statusFilter =
    statusParam && VALID_STATUSES.includes(statusParam as BookingStatus)
      ? (statusParam as BookingStatus)
      : undefined;

  const bookings = await getAdminBookingsServer(statusFilter);
  return NextResponse.json({ bookings });
}
