// /llms.txt: a plain-text summary of IVERA for AI assistants (ChatGPT, Claude,
// Perplexity…), built from the same tour data and seasonal offer as the site.

import { tours } from "@/data/tours";
import { getActiveSeasonalOffer, getSeasonalPrice } from "@/lib/discounts";
import { SITE_URL } from "@/lib/structuredData";

export function buildLlmsTxt(date: Date = new Date()): string {
  const season = getActiveSeasonalOffer(date);

  const tourLines = tours.map((tour) => {
    let price = tour.priceLabel ?? "price on request";
    if (tour.pricePerPersonGel != null) {
      const { base, final } = getSeasonalPrice(tour.pricePerPersonGel, date);
      price = final < base ? `${final} GEL per person (usually ${base} GEL)` : `${base} GEL per person`;
    }
    return `- [${tour.title}](${SITE_URL}/tours/${tour.slug}): ${tour.region}, ${tour.duration}, ${price}. ${tour.shortDescription}`;
  });

  const offerLine = season
    ? `\nCurrent offer: ${season.pct}% off all group tours until ${season.endsOn} (${season.title.toLowerCase()}).\n`
    : "";

  return `# IVERA

> IVERA (ivera.info) is a Georgian tour operator based in Tbilisi, running since 2016. It offers group "quest" day tours from Tbilisi across Georgia and private tours with your own guide and driver. Guides speak English and Russian. Booking is on WhatsApp (+995 555 44 37 87) with no prepayment required, and cancellation is free up to 24 hours before the tour.
${offerLine}
## Group day tours from Tbilisi

${tourLines.join("\n")}

Day trips include transport and a professional guide; the Tbilisi City Quest is a walking tour with a guide. Food, drinks and entrance tickets are not included and are paid on the spot. Tours meet at King Vakhtang Gorgasali Square (Metekhi), Tbilisi, at 08:45 and leave at 09:00. Groups are 2–50 people. On the way, travellers complete quest tasks (QR codes, quizzes, photos) and earn points and rewards.

## Private tours and transfers

- [Private tours](${SITE_URL}/private-tours): your own guide and/or driver, comfort, business or VIP car, any dates and regions of Georgia, with the price shown instantly on the site. This also covers car-with-driver hire and transfers (for example Tbilisi–Batumi, Tbilisi–Gudauri, Tbilisi–Bakuriani).

## Useful pages

- [All tours](${SITE_URL}/tours)
- [Combo packages](${SITE_URL}/packages)
- [Free Tbilisi quest](${SITE_URL}/free-tbilisi-quest)
- [FAQ](${SITE_URL}/faq)
- [Payment and cancellation policy](${SITE_URL}/payment-policy)
- [Contact on WhatsApp](https://wa.me/995555443787)
`;
}
