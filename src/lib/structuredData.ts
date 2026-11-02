// schema.org structured data (JSON-LD) that tells search engines and AI
// assistants what IVERA is, what each tour costs and what the FAQ says.

import type { Tour } from "@/data/tours";
import type { FaqItem } from "@/data/faq";
import { getActiveSeasonalOffer, getSeasonalPrice } from "@/lib/discounts";

export const SITE_URL = "https://www.ivera.info";
const ORG_ID = `${SITE_URL}/#organization`;

type JsonLd = Record<string, unknown>;

/** JSON for a <script type="application/ld+json">; `<` is escaped so text can't close the tag. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: "IVERA",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-dark.png`,
    image: `${SITE_URL}/images/hero-gergeti.jpg`,
    description:
      "Georgian tour operator in Tbilisi since 2016: group quest day tours (Kazbegi, Kakheti, Mtskheta, Vardzia, Martvili and more) and private tours with a guide and driver. Guides speak English and Russian. Booking on WhatsApp, free cancellation up to 24 hours.",
    foundingDate: "2016",
    telephone: "+995555443787",
    email: "LevanLevanski@ivera.info",
    address: {
      "@type": "PostalAddress",
      streetAddress: "King Vakhtang Gorgasali Square, Metekhi",
      addressLocality: "Tbilisi",
      addressCountry: "GE",
    },
    areaServed: { "@type": "Country", name: "Georgia" },
    knowsLanguage: ["en", "ru", "ka"],
    sameAs: ["https://www.instagram.com/ivera_travel/"],
  };
}

export function tourJsonLd(tour: Tour, date: Date = new Date()): JsonLd {
  const url = `${SITE_URL}/tours/${tour.slug}`;
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.longDescription,
    url,
    image: `${SITE_URL}${tour.image}`,
    touristType: tour.category,
    provider: { "@id": ORG_ID },
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.routeStops.map((stop, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristAttraction", name: stop },
      })),
    },
  };

  if (tour.pricePerPersonGel != null) {
    const { final } = getSeasonalPrice(tour.pricePerPersonGel, date);
    const season = getActiveSeasonalOffer(date);
    data.offers = {
      "@type": "Offer",
      price: final,
      priceCurrency: "GEL",
      availability: "https://schema.org/InStock",
      url,
      ...(season ? { priceValidUntil: season.endsOn } : {}),
    };
  }

  return data;
}

export function faqJsonLd(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
