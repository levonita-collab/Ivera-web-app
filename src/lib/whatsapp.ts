const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "995555443787";

interface BookingParams {
  tourTitle: string;
  date: string;
  people: number;
  pricePerPerson: number | null;
  total: number | null;
  discountLabel?: string;
  savingsTotal?: number;
}

export function buildBookingLink(params: BookingParams): string {
  const { tourTitle, date, people, pricePerPerson, total, discountLabel, savingsTotal } = params;

  let message: string;

  if (pricePerPerson === null) {
    message = [
      `Hello Levani, I'd like to request a price for the ${tourTitle}.`,
      ``,
      `Date: ${date}`,
      `People: ${people}`,
      ``,
      `Please send me the package price and availability.`,
    ].join("\n");
  } else {
    const lines = [
      `Hello Levani, I'd like to book a tour.`,
      ``,
      `Tour: ${tourTitle}`,
      `Date: ${date}`,
      `People: ${people}`,
      `Base price: ${pricePerPerson} GEL/person`,
    ];

    if (discountLabel && savingsTotal && savingsTotal > 0) {
      lines.push(`Discount: ${discountLabel} (saving ${savingsTotal} GEL)`);
    }

    lines.push(`Total: ${total} GEL`);
    lines.push(``);
    lines.push(`Please confirm availability.`);

    message = lines.join("\n");
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildGroupQuoteLink(params: {
  tourTitle: string;
  date: string;
  people: number;
}): string {
  const { tourTitle, date, people } = params;
  const message = [
    `Hello Levani! I'd like a group quote for the ${tourTitle}.`,
    ``,
    `Date: ${date}`,
    `Group size: ${people} people`,
    ``,
    `Please send me the group rate and availability.`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralLink(): string {
  const message = `Hello Levani! I'd like to learn more about Ivera tours in Georgia.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildMultiTourLink(toursCount: number, currentTourTitle?: string): string {
  const discountPct = toursCount >= 4 ? 15 : toursCount === 3 ? 10 : 5;
  const tourRef = currentTourTitle ? ` starting with the ${currentTourTitle}` : "";
  const message = [
    `Hello Levani! I'd like to book a ${toursCount}-tour combo${tourRef}.`,
    ``,
    `I know there's a ${discountPct}% combo discount for ${toursCount} tours.`,
    ``,
    `Please help me plan the best combination and confirm availability.`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildFeedbackLink(tourTitle: string, explorerName: string, xp: number): string {
  const message = [
    `Hello Levani! I just completed the ${tourTitle} 🎉`,
    ``,
    `Here is my feedback:`,
    ``,
    `1. Was the quest easy to understand?`,
    `2. Which mission did you enjoy most?`,
    `3. Did QR scanning work smoothly?`,
    `4. Would you recommend this experience?`,
    `5. What should we improve?`,
    ``,
    `Explorer: ${explorerName}`,
    `XP earned: ${xp} XP`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
