import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Safe diagnostic endpoint — returns only boolean presence of env vars, never values.
export async function GET() {
  return NextResponse.json({
    hasPaypalClientId: Boolean(process.env.PAYPAL_CLIENT_ID),
    hasNextPublicPaypalClientId: Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID),
    hasPaypalClientSecret: Boolean(process.env.PAYPAL_CLIENT_SECRET),
    paypalMode: process.env.PAYPAL_MODE ?? "(not set)",
    hasGelEurRate: Boolean(process.env.PAYPAL_GEL_EUR_RATE),
  });
}
