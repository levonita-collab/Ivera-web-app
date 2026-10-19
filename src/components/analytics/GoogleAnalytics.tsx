"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID, isAnalyticsEnabled, isWhatsAppUrl, trackWhatsAppClick } from "@/lib/analytics";

const subscribeNoop = () => () => {};

/**
 * Loads gtag.js on the live site and records every click on a WhatsApp link.
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
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
