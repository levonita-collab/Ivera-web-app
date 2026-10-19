import { describe, it, expect, afterEach, vi } from "vitest";
import { isWhatsAppUrl, isAnalyticsEnabled, trackEvent, GA_MEASUREMENT_ID } from "./analytics";

function fakeWindow(hostname: string, debug = false) {
  const gtag = vi.fn();
  vi.stubGlobal("window", { location: { hostname, pathname: "/" }, gtag });
  vi.stubGlobal("localStorage", { getItem: (k: string) => (debug && k === "ivera_analytics_debug" ? "1" : null) });
  return gtag;
}

afterEach(() => vi.unstubAllGlobals());

describe("analytics", () => {
  it("uses the IVERA GA4 property", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-E0Q63398YH");
  });

  it("recognises WhatsApp deep links only", () => {
    expect(isWhatsAppUrl("https://wa.me/995555443787?text=hi")).toBe(true);
    expect(isWhatsAppUrl("https://api.whatsapp.com/send?phone=1")).toBe(true);
    expect(isWhatsAppUrl("https://www.ivera.info/tours")).toBe(false);
    expect(isWhatsAppUrl("https://evil.example/wa.me/1")).toBe(false);
  });

  it("reports only from the live domain unless debug is switched on", () => {
    fakeWindow("www.ivera.info");
    expect(isAnalyticsEnabled()).toBe(true);
    fakeWindow("ivera-web-app-git-preview.vercel.app");
    expect(isAnalyticsEnabled()).toBe(false);
    fakeWindow("localhost", true);
    expect(isAnalyticsEnabled()).toBe(true);
  });

  it("sends events through gtag on the live site and stays silent elsewhere", () => {
    const live = fakeWindow("ivera.info");
    trackEvent("generate_lead", { lead_type: "booking" });
    expect(live).toHaveBeenCalledWith("event", "generate_lead", { lead_type: "booking" });

    const preview = fakeWindow("localhost");
    trackEvent("generate_lead");
    expect(preview).not.toHaveBeenCalled();
  });
});
