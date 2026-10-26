import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

function fakeBrowser() {
  const store = new Map<string, string>();
  const gtag = vi.fn();
  vi.stubGlobal("window", { gtag });
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  });
  return { gtag, store };
}

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe("cookie consent", () => {
  it("shows the banner until the visitor chooses", async () => {
    fakeBrowser();
    const c = await import("./consent");
    expect(c.getConsent()).toBeNull();
    expect(c.isBannerOpen()).toBe(true);
  });

  it("stores the choice, updates Google consent and hides the banner", async () => {
    const { gtag, store } = fakeBrowser();
    const c = await import("./consent");
    c.setConsent("granted");
    expect(store.get(c.CONSENT_KEY)).toBe("granted");
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    expect(c.isBannerOpen()).toBe(false);
  });

  it("can be reopened from the privacy page", async () => {
    fakeBrowser();
    const c = await import("./consent");
    c.setConsent("denied");
    c.reopenConsentBanner();
    expect(c.isBannerOpen()).toBe(true);
    expect(c.getConsent()).toBe("denied");
  });

  it("keeps statistics off by default across the EEA, UK and Switzerland", async () => {
    const c = await import("./consent");
    for (const code of ["DE", "FR", "PL", "GB", "CH", "NO"]) {
      expect(c.CONSENT_REQUIRED_REGIONS).toContain(code);
    }
    expect(c.CONSENT_REQUIRED_REGIONS).not.toContain("GE");
  });
});
