import { NextResponse } from "next/server";
import { isPayPalWebhookConfigured, verifyPayPalWebhookSignature } from "@/lib/paypal/server";
import {
  findBookingIdByPaypalOrderServer,
  getBookingPaymentInfoServer,
  markBookingPaidServer,
  markBookingRefundedServer,
} from "@/lib/supabase/bookingServiceServer";

export const runtime = "nodejs";

// Defense-in-depth for the PayPal flow: the client-driven capture-order
// route is the primary path, but a customer can approve payment in the
// PayPal popup and then close the tab before capture-order runs — PayPal
// still completed the charge, our DB just never heard about it. This
// webhook lets PayPal tell us directly, independent of the browser.
//
// Register this URL (https://<your-domain>/api/paypal/webhook) in the
// PayPal developer dashboard for PAYMENT.CAPTURE.COMPLETED and
// PAYMENT.CAPTURE.REFUNDED, then set PAYPAL_WEBHOOK_ID from the same page.
// See docs/security-hardening-checklist.md.

interface CaptureResource {
  id?: string;
  status?: string;
  amount?: { value: string; currency_code: string };
  supplementary_data?: { related_ids?: { order_id?: string } };
}

export async function POST(req: Request) {
  if (!isPayPalWebhookConfigured()) {
    // Not configured — accept but no-op, so PayPal doesn't retry forever if
    // this deployment hasn't set PAYPAL_WEBHOOK_ID yet. The client-driven
    // capture-order flow still works without the webhook.
    return NextResponse.json({ received: true, verified: false });
  }

  const rawBody = await req.text();

  const verified = await verifyPayPalWebhookSignature(
    {
      transmissionId: req.headers.get("paypal-transmission-id") ?? "",
      transmissionTime: req.headers.get("paypal-transmission-time") ?? "",
      certUrl: req.headers.get("paypal-cert-url") ?? "",
      authAlgo: req.headers.get("paypal-auth-algo") ?? "",
      transmissionSig: req.headers.get("paypal-transmission-sig") ?? "",
    },
    rawBody
  ).catch(() => false);

  if (!verified) {
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 401 });
  }

  let event: { event_type?: string; resource?: CaptureResource };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const orderId = event.resource?.supplementary_data?.related_ids?.order_id;

  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED": {
      if (!orderId) break;
      const bookingId = await findBookingIdByPaypalOrderServer(orderId);
      if (!bookingId) break;

      const info = await getBookingPaymentInfoServer(bookingId);
      if (info?.paymentStatus === "unpaid") {
        const amount = event.resource?.amount;
        await markBookingPaidServer(bookingId, {
          paypalOrderId: orderId,
          amount: amount ? Number(amount.value) : 0,
          currency: amount?.currency_code ?? "EUR",
        });
      }
      break;
    }
    case "PAYMENT.CAPTURE.REFUNDED": {
      if (!orderId) break;
      const bookingId = await findBookingIdByPaypalOrderServer(orderId);
      if (bookingId) await markBookingRefundedServer(bookingId);
      break;
    }
    default:
      // Ignore other event types — we only act on capture completion/refund.
      break;
  }

  return NextResponse.json({ received: true, verified: true });
}
