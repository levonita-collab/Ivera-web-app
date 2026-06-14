// Server-side only — never import from client components.
// Requires PAYPAL_CLIENT_SECRET (PayPal REST app secret, server-only) and a
// client ID. The client ID is not sensitive (it's already sent to the
// browser to load the PayPal SDK), so PAYPAL_CLIENT_ID is optional here and
// falls back to NEXT_PUBLIC_PAYPAL_CLIENT_ID if unset.
// Set PAYPAL_MODE=live to use the production API; defaults to sandbox.

const PAYPAL_MODE = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";

export const PAYPAL_API_BASE =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

function getPayPalClientId(): string | undefined {
  return process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
}

export function isPayPalConfigured(): boolean {
  return Boolean(getPayPalClientId() && process.env.PAYPAL_CLIENT_SECRET);
}

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = getPayPalClientId();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured: set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET");
  }

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}
