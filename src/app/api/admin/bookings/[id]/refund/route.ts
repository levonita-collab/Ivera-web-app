import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/adminAuth";
import { markBookingRefundedServer } from "@/lib/supabase/bookingServiceServer";

export const runtime = "nodejs";

// Marks a booking's payment as refunded. The actual refund is processed
// manually via the PayPal dashboard (or cash, for WhatsApp bookings) —
// this endpoint only updates our own record so the admin view stays
// accurate. It is intentionally NOT wired to PayPal's refund API in this
// PR; see docs/security-hardening-checklist.md for the manual process.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const result = await markBookingRefundedServer(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true });
}
