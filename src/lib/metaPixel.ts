// Meta (Facebook / Instagram) Pixel. Mirrors the Google Analytics setup:
// it runs only on the live site, follows the cookie-consent choice, and
// reports the same three key actions as GA4 under Meta's standard names.

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "351072119520561";

type FbqParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** GA4 event name → Meta standard event. */
const META_EVENTS: Record<string, string> = {
  generate_lead: "Lead",
  whatsapp_click: "Contact",
  purchase: "Purchase",
};

/**
 * Without a stored choice, visitors whose device clock is set to a European
 * time zone (except Tbilisi) are treated like EEA/UK visitors: the pixel
 * waits for consent. Others start with consent granted and can opt out.
 */
export function needsConsentByDefault(timeZone: string | undefined): boolean {
  return !!timeZone && timeZone.startsWith("Europe/") && timeZone !== "Europe/Tbilisi";
}

export function trackMetaEvent(gaName: string, params: Record<string, unknown> = {}): void {
  const metaName = META_EVENTS[gaName];
  if (!metaName || typeof window === "undefined" || typeof window.fbq !== "function") return;
  const out: FbqParams = {};
  if (typeof params.value === "number") out.value = params.value;
  if (typeof params.currency === "string") out.currency = params.currency;
  if (typeof params.lead_type === "string") out.content_category = params.lead_type;
  if (typeof params.context === "string") out.content_category = params.context;
  if (typeof params.tour_slug === "string") out.content_name = params.tour_slug;
  window.fbq("track", metaName, out);
}
