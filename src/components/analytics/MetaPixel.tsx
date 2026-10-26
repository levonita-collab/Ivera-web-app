"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID } from "@/lib/metaPixel";
import { CONSENT_KEY } from "@/lib/consent";

/**
 * Meta Pixel for Facebook / Instagram ads. Rendered only where analytics is
 * enabled (see GoogleAnalytics.tsx). Consent: a stored "denied" or a
 * European device time zone without a choice starts it revoked; the banner
 * grants or revokes it later.
 */
// Module-level so React's development double-mount doesn't count a page twice.
let lastTrackedPath: string | null = null;

export default function MetaPixel() {
  const pathname = usePathname();

  // The init script tracks the first PageView; later client-side navigations are tracked here.
  useEffect(() => {
    if (lastTrackedPath === null) {
      lastTrackedPath = pathname;
      return;
    }
    if (pathname === lastTrackedPath) return;
    lastTrackedPath = pathname;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
try {
  var saved = localStorage.getItem('${CONSENT_KEY}');
  var tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  var european = tz.indexOf('Europe/') === 0 && tz !== 'Europe/Tbilisi';
  if (saved === 'denied' || (saved !== 'granted' && european)) fbq('consent', 'revoke');
} catch (e) {}
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
    </Script>
  );
}
