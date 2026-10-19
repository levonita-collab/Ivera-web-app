// Google Analytics 4 (gtag.js). GA is linked to Google Ads, so the events
// below become the conversions the ad campaigns optimise for.

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-E0Q63398YH";

/** Only the live site reports, so previews and local testing don't skew the numbers. */
const PRODUCTION_HOSTS = ["ivera.info", "www.ivera.info"];

/** Set localStorage "ivera_analytics_debug" = "1" to report from any host (e.g. a preview). */
const DEBUG_KEY = "ivera_analytics_debug";

type GtagParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (PRODUCTION_HOSTS.includes(window.location.hostname)) return true;
  try {
    return localStorage.getItem(DEBUG_KEY) === "1";
  } catch {
    return false;
  }
}

export function trackEvent(name: string, params: GtagParams = {}): void {
  if (!isAnalyticsEnabled() || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function isWhatsAppUrl(url: string): boolean {
  return /^https:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//.test(url);
}

/** Records a WhatsApp contact. `context` says which button it was (booking, rewards, …). */
export function trackWhatsAppClick(context: string): void {
  trackEvent("whatsapp_click", { context, page_path: window.location.pathname });
}

/** Opens a WhatsApp deep link in a new tab and records it. */
export function openWhatsApp(url: string, context: string): void {
  trackWhatsAppClick(context);
  window.open(url, "_blank", "noopener,noreferrer");
}
