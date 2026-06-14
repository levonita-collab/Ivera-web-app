import { NextResponse } from "next/server";
import { tours } from "@/data/tours";
import { calculateTourPrice } from "@/lib/discounts";
import { gelToEur, getServerGelEurRate } from "@/lib/paypal/currency";
import { getPayPalAccessToken, isPayPalConfigured, PAYPAL_API_BASE } from "@/lib/paypal/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured on this server." },
      { status: 503 }
    );
  }

  let body: { tourSlug?: string; peopleCount?: number; bookingCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { tourSlug, peopleCount, bookingCode } = body;
  const people = Number(peopleCount);

  if (!tourSlug || !Number.isInteger(people) || people < 1 || people > 12) {
    return NextResponse.json({ error: "Invalid tourSlug or peopleCount." }, { status: 400 });
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
    return NextResponse.json({ id: order.id, eurAmount });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    console.error("[paypal/create-order]", msg);
    return NextResponse.json({ error: "Could not create PayPal order." }, { status: 500 });
  }
}
