export interface Review {
  id: string;
  name: string;
  country: string;      // e.g. "Germany", "Russia", "UAE"
  countryFlag: string;  // emoji flag
  tourId: string;       // matches Tour.id
  tourTitle: string;
  rating: number;       // 1–5
  text: string;
  textRu?: string;      // Russian version (optional)
  date: string;         // "Month Year", e.g. "June 2025"
  language: "en" | "ru" | "ar";  // original review language
}

// Add real reviews here as you collect them via WhatsApp.
// Each review should be a genuine response from a guest.
export const reviews: Review[] = [
  // Example structure — replace with real reviews:
  // {
  //   id: "r1",
  //   name: "Anna S.",
  //   country: "Germany",
  //   countryFlag: "🇩🇪",
  //   tourId: "kazbegi",
  //   tourTitle: "Kazbegi Mountain Quest",
  //   rating: 5,
  //   text: "Incredible day! Levani knew every story behind every stone. The Gergeti Trinity Church at sunset was unforgettable.",
  //   date: "June 2025",
  //   language: "en",
  // },
];
