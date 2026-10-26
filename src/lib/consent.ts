// Cookie consent for Google Analytics / Google Ads (Consent Mode v2) and the Meta Pixel.
// The choice lives in localStorage; GoogleAnalytics.tsx applies it on load
// and setConsent() pushes later changes to gtag straight away.

export type ConsentChoice = "granted" | "denied";

export const CONSENT_KEY = "ivera_consent";

/** EEA + UK + Switzerland: statistics stay off until the visitor agrees. */
export const CONSENT_REQUIRED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO",
  "GB", "CH",
];

const listeners = new Set<() => void>();
let bannerForcedOpen = false;

export function subscribeConsent(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  listeners.forEach((l) => l());
}

export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

/** gtag consent fields for a choice. */
export function consentFields(choice: ConsentChoice) {
  return {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  };
}

export function setConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // storage blocked — the choice still applies for this page view
  }
  window.gtag?.("consent", "update", consentFields(choice));
  window.fbq?.("consent", choice === "granted" ? "grant" : "revoke");
  bannerForcedOpen = false;
  notify();
}

export function isBannerOpen(): boolean {
  return bannerForcedOpen || getConsent() === null;
}

/** Lets visitors change their mind from the privacy page. */
export function reopenConsentBanner(): void {
  bannerForcedOpen = true;
  notify();
}
