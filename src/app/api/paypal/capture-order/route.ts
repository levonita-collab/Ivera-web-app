import { NextResponse } from "next/server";
import { markBookingPaid } from "@/lib/supabase/bookingService";
import { getPayPalAccessToken, isPayPalConfigured, PAYPAL_API_BASE } from "@/lib/paypal/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured on this server." },
      { status: 503 }
    );
  }

  let body: { orderId?: string; bookingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { orderId, bookingId } = body;
  if (!orderId || !bookingId) {
    return NextResponse.json({ error: "Missing orderId or bookingId." }, { status: 400 });
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[paypal/capture-order] PayPal API error:", detail);
      return NextResponse.json({ error: "Could not capture PayPal payment." }, { status: 502 });
    }

    const capture = (await res.json()) as {
      status: string;
      purchase_units?: Array<{
        payments?: { captures?: Array<{ amount?: { value: string; currency_code: string } }> };
      }>;
    };

    if (capture.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment was not completed." }, { status: 402 });
    }

    const captured = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
    const amount = captured ? Number(captured.value) : 0;
    const currency = captured?.currency_code ?? "EUR";

    await markBookingPaid(bookingId, { paypalOrderId: orderId, amount, currency });

    return NextResponse.json({ success: true, status: capture.status });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    console.error("[paypal/capture-order]", msg);
    return NextResponse.json({ error: "Could not capture PayPal payment." }, { status: 500 });
  }
}
