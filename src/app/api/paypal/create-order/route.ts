import { NextResponse } from "next/server";
import { tours } from "@/data/tours";
import { calculateTourPrice } from "@/lib/discounts";
import { gelToEur, getServerGelEurRate } from "@/lib/paypal/currency";
import { getPayPalAccessToken, isPayPalConfigured, PAYPAL_API_BASE } from "@/lib/paypal/server";
import { linkPaypalOrderServer } from "@/lib/supabase/bookingServiceServer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured on this server." },
      { status: 503 }
    );
  }

  let body: { tourSlug?: string; peopleCount?: number; bookingCode?: string; bookingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { tourSlug, peopleCount, bookingCode, bookingId } = body;
  const people = Number(peopleCount);

  if (!tourSlug || !bookingId || !Number.isInteger(people) || people < 1 || people > 12) {
    return NextResponse.json({ error: "Invalid tourSlug, bookingId or peopleCount." }, { status: 400 });
  }

  const tour = tours.find((t) => t.slug === tourSlug);
  if (!tour) {
    return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  }

  const breakdown = calculateTourPrice({
    basePricePerPerson: tour.pricePerPersonGel,
    people,
    lastSeatsDiscountPct: tour.lastSeatsDiscountPct,
    bookingBonusXp: tour.bookingBonusXp,
  });

  if (!breakdown || breakdown.needsQuote || tour.pricePerPersonGel === null) {
    return NextResponse.json(
      { error: "This tour requires a custom quote and cannot be paid online." },
      { status: 400 }
    );
  }

  const eurAmount = gelToEur(breakdown.finalTotal, getServerGelEurRate());

  try {
    const accessToken = await getPayPalAccessToken();

    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Idempotency: if the client retries this request (network blip,
        // double submit), PayPal returns the SAME order instead of creating
        // a second one for the same booking. Scoped to bookingId so a
        // genuinely new booking always gets a fresh order.
        "PayPal-Request-Id": `ivera-order-${bookingId}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: bookingCode ?? undefined,
            description: `${tour.title} — ${people} ${people === 1 ? "person" : "people"}`,
            amount: {
              currency_code: "EUR",
              value: eurAmount.toFixed(2),
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[paypal/create-order] PayPal API error:", detail);
      return NextResponse.json({ error: "Could not create PayPal order." }, { status: 502 });
    }

    const order = (await res.json()) as { id: string };

    // Link this PayPal order to the booking so capture-order can verify it
    // belongs to this booking before marking it paid.
    const linked = await linkPaypalOrderServer(bookingId, order.id);
    if (!linked) {
      console.error("[paypal/create-order] Could not link PayPal order to booking", bookingId);
      return NextResponse.json({ error: "Could not create PayPal order." }, { status: 500 });
    }

    return NextResponse.json({ id: order.id, eurAmount });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    console.error("[paypal/create-order]", msg);
    return NextResponse.json({ error: "Could not create PayPal order." }, { status: 500 });
  }
}
