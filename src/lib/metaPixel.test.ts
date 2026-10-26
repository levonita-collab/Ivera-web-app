import { describe, it, expect, afterEach, vi } from "vitest";
import { needsConsentByDefault, trackMetaEvent, META_PIXEL_ID } from "./metaPixel";

afterEach(() => vi.unstubAllGlobals());

describe("Meta Pixel", () => {
  it("uses the IVERA pixel", () => {
    expect(META_PIXEL_ID).toBe("351072119520561");
  });

  it("maps the site's key actions to Meta standard events", () => {
    const fbq = vi.fn();
    vi.stubGlobal("window", { fbq });
    trackMetaEvent("generate_lead", { lead_type: "private_tour" });
    trackMetaEvent("whatsapp_click", { context: "booking" });
    trackMetaEvent("purchase", { value: 78, currency: "GEL", tour_slug: "kazbegi-mountain-quest" });
    trackMetaEvent("scroll", {});
    expect(fbq.mock.calls).toEqual([
      ["track", "Lead", { content_category: "private_tour" }],
      ["track", "Contact", { content_category: "booking" }],
      ["track", "Purchase", { value: 78, currency: "GEL", content_name: "kazbegi-mountain-quest" }],
    ]);
  });

  it("waits for consent on European device clocks, but not in Tbilisi", () => {
    expect(needsConsentByDefault("Europe/Berlin")).toBe(true);
    expect(needsConsentByDefault("Europe/London")).toBe(true);
    expect(needsConsentByDefault("Asia/Tbilisi")).toBe(false);
    expect(needsConsentByDefault("Europe/Tbilisi")).toBe(false);
    expect(needsConsentByDefault("Asia/Almaty")).toBe(false);
    expect(needsConsentByDefault(undefined)).toBe(false);
  });
});
