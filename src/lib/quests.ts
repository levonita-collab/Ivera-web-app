export interface Quest {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  groupSize: string;
  price: string;
  region: string;
  highlights: string[];
  imageAlt: string;
  imagePlaceholderColor: string; // swap for real image path later
}

export const quests: Quest[] = [
  {
    slug: "tbilisi-old-town",
    title: "Tbilisi Old Town Explorer",
    tagline: "Cobblestones, sulphur baths & rooftop sunsets.",
    description:
      "Walk the winding lanes of Abanotubani, cross the Peace Bridge, and end the day in a Narikala fortress ruin with a panoramic view of the Mtkvari river. Your guide shares stories you won't find in any guidebook.",
    duration: "1 day",
    groupSize: "2–10 people",
    price: "From $49 per person",
    region: "Tbilisi",
    highlights: [
      "Sulphur bath experience in Abanotubani",
      "Narikala fortress sunset walk",
      "Traditional Georgian dinner in a hidden courtyard",
      "Metekhi Church and cliff viewpoint",
    ],
    imageAlt: "Tbilisi Old Town rooftops at sunset",
    imagePlaceholderColor: "#b5651d",
  },
  {
    slug: "kazbegi-adventure",
    title: "Kazbegi Mountain Quest",
    tagline: "Gergeti Trinity Church & the Caucasus High Road.",
    description:
      "Drive the Georgian Military Highway through the Greater Caucasus, hike to the legendary Gergeti Trinity Church at 2,170 m, and breathe air that feels like it was made for you. Small groups only.",
    duration: "2 days",
    groupSize: "2–8 people",
    price: "From $129 per person",
    region: "Mtskheta-Mtianeti",
    highlights: [
      "Gergeti Trinity Church hike",
      "Gudauri scenic viewpoint",
      "Jvari Monastery in Mtskheta",
      "Overnight in a family guesthouse",
    ],
    imageAlt: "Gergeti Trinity Church above the clouds",
    imagePlaceholderColor: "#4a6fa5",
  },
  {
    slug: "kakheti-wine-tour",
    title: "Kakheti Wine & Culture Tour",
    tagline: "Qvevri wines, vineyards & ancient monasteries.",
    description:
      "Georgia is the cradle of wine. Spend a day in the Alazani Valley tasting amber wine poured from clay qvevri, touring the Alaverdi Monastery, and sharing a supra feast with a local family.",
    duration: "1 day",
    groupSize: "2–12 people",
    price: "From $65 per person",
    region: "Kakheti",
    highlights: [
      "Qvevri wine cellar tasting",
      "Alaverdi Monastery visit",
      "Traditional supra feast",
      "Sighnaghi 'City of Love' stroll",
    ],
    imageAlt: "Kakheti vineyards in autumn",
    imagePlaceholderColor: "#7d5a3c",
  },
  {
    slug: "svaneti-trekking",
    title: "Svaneti High Altitude Trek",
    tagline: "Medieval towers & glaciers under Ushba.",
    description:
      "Upper Svaneti is one of Europe's last true wildernesses. Multi-day trek through alpine meadows past thousand-year-old defensive towers to the base of Ushba, one of the most dramatic peaks in the Caucasus.",
    duration: "4 days",
    groupSize: "2–6 people",
    price: "From $299 per person",
    region: "Svaneti",
    highlights: [
      "Mestia medieval tower village",
      "Ushba glacier viewpoint",
      "Koruldi Lakes ridge hike",
      "Svan cultural evening with local family",
    ],
    imageAlt: "Svaneti towers against snow-capped peaks",
    imagePlaceholderColor: "#3d6b50",
  },
  {
    slug: "borjomi-spa-nature",
    title: "Borjomi Spa & Nature Escape",
    tagline: "Mineral springs, forest air & total reset.",
    description:
      "Borjomi is synonymous with Georgia's famous mineral water. Soak in natural sulphur springs, walk the protected national park, and stay in a restored spa-era villa. Perfect for relaxation between adventures.",
    duration: "2 days",
    groupSize: "2–10 people",
    price: "From $99 per person",
    region: "Samtskhe-Javakheti",
    highlights: [
      "Borjomi Mineral Water Park walk",
      "Natural open-air mineral pool",
      "Borjomi-Kharagauli National Park hike",
      "Rabati Castle day trip",
    ],
    imageAlt: "Borjomi forested valley and mineral spring",
    imagePlaceholderColor: "#2d6a4f",
  },
  {
    slug: "david-gareja-desert",
    title: "David Gareja Desert Monastery",
    tagline: "Rock-cut cells, frescoes & semi-desert silence.",
    description:
      "On the edge of a semi-arid plateau bordering Azerbaijan, the David Gareja cave monastery complex is one of Georgia's most otherworldly sites. Ancient frescoes, sweeping steppe views, and profound quiet.",
    duration: "1 day",
    groupSize: "2–12 people",
    price: "From $55 per person",
    region: "Kvemo Kartli",
    highlights: [
      "Lavra monastery cave cells",
      "Udabno ridge panoramic walk",
      "Medieval fresco gallery",
      "Semi-desert steppe landscape",
    ],
    imageAlt: "David Gareja cave monastery carved into rock",
    imagePlaceholderColor: "#c2956c",
  },
];

export function getQuestBySlug(slug: string): Quest | undefined {
  return quests.find((q) => q.slug === slug);
}

const WHATSAPP_NUMBER = "995555443787";

export function buildWhatsAppLink(questTitle?: string): string {
  const message = questTitle
    ? `Hi Ivera! I'm interested in booking the "${questTitle}" tour. Please share more details.`
    : "Hi Ivera! I'd like to learn more about your tours.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
