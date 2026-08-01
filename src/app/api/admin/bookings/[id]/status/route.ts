import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/adminAuth";
import { updateBookingStatusServer } from "@/lib/supabase/bookingServiceServer";
import type { BookingStatus } from "@/lib/supabase/types";

export const runtime = "nodejs";

const VALID_STATUSES: BookingStatus[] = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status as BookingStatus)) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }

  const result = await updateBookingStatusServer(id, body.status as BookingStatus);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true });
}
