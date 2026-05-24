const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "995555443787";

interface BookingParams {
  tourTitle: string;
  date: string;
  people: number;
  pricePerPerson: number | null;
  total: number | null;
}

export function buildBookingLink(params: BookingParams): string {
  const { tourTitle, date, people, pricePerPerson, total } = params;

  let message: string;

  if (pricePerPerson === null) {
    message = [
      `Hello Levani, I would like to request details for the ${tourTitle}.`,
      ``,
      `Date: ${date}`,
      `People: ${people}`,
      ``,
      `Please send me the package price and availability.`,
    ].join("\n");
  } else {
    message = [
      `Hello Levani, I would like to book a tour.`,
      ``,
      `Tour: ${tourTitle}`,
      `Date: ${date}`,
      `People: ${people}`,
      `Price per person: ${pricePerPerson} GEL`,
      `Total price: ${total} GEL`,
      ``,
      `Please confirm availability.`,
    ].join("\n");
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralLink(): string {
  const message = `Hello Levani! I'd like to learn more about Ivera tours in Georgia.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
