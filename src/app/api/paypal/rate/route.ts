import { NextResponse } from "next/server";
import { getServerGelEurRate } from "@/lib/paypal/currency";

export const runtime = "nodejs";

// Public, non-sensitive: lets the client display the exact GEL→EUR rate the
// server will actually charge, instead of independently reading
// NEXT_PUBLIC_PAYPAL_GEL_EUR_RATE — two env vars that could otherwise drift
// out of sync and show the customer a different amount than they're charged.
export async function GET() {
  return NextResponse.json({ rate: getServerGelEurRate() });
}
