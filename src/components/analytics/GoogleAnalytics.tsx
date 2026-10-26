"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID, isAnalyticsEnabled, isWhatsAppUrl, trackWhatsAppClick } from "@/lib/analytics";
import { CONSENT_KEY, CONSENT_REQUIRED_REGIONS, consentFields } from "@/lib/consent";
import ConsentBanner from "@/components/analytics/ConsentBanner";

const subscribeNoop = () => () => {};

/**
 * Loads gtag.js on the live site with Consent Mode v2 (statistics off by
 * default for EEA/UK/CH until the visitor agrees), shows the consent banner,
 * and records every click on a WhatsApp link.
 * Page views on client-side navigation are sent by GA4's enhanced
 * measurement (browser history events), so no router hook is needed.
 */
export default function GoogleAnalytics() {
  // The host check needs `window`, so decide after hydration.
  const enabled = useSyncExternalStore(subscribeNoop, isAnalyticsEnabled, () => false);

  useEffect(() => {
    if (!enabled) return;
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (link && isWhatsAppUrl(link.href)) trackWhatsAppClick(link.dataset.waContext ?? "link");
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var denied = ${JSON.stringify(consentFields("denied"))};
gtag('consent', 'default', Object.assign({ region: ${JSON.stringify(CONSENT_REQUIRED_REGIONS)}, wait_for_update: 500 }, denied));
gtag('consent', 'default', ${JSON.stringify(consentFields("granted"))});
try {
  var saved = localStorage.getItem('${CONSENT_KEY}');
  if (saved === 'granted' || saved === 'denied') {
    gtag('consent', 'update', saved === 'granted' ? ${JSON.stringify(consentFields("granted"))} : denied);
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
      <ConsentBanner />
    </>
  );
}
