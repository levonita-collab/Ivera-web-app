export interface Mission {
  id: string;
  title: string;
  location: string;
  type: "qr" | "quiz" | "photo" | "taste" | "observation";
  description: string;
  points: number;
  qrCode: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  region: string;
  duration: string;
  pricePerPersonGel: number | null;
  priceLabel?: string;
  image: string;
  gradientFrom: string;
  gradientTo: string;
  shortDescription: string;
  longDescription: string;
  included: string[];
  excluded: string[];
  routeStops: string[];
  questTheme: string;
  category: "culture" | "adventure" | "wine" | "heritage";
  // Marketing & conversion fields
  capacity: number;
  seatsLeft: number;
  lastSeatsDiscountPct: number;
  showUrgency: boolean;
  urgencyLabel?: string;
  bookingBonusXp: number;
}

export const tours: Tour[] = [
  {
    id: "tbilisi",
    slug: "tbilisi-city-quest",
    title: "Tbilisi City Quest Tour",
    region: "Tbilisi",
    duration: "3–5 hours",
    pricePerPersonGel: 40,
    image: "/images/tours/tbilisi-city-quest.jpg",
    gradientFrom: "#3B1A0A",
    gradientTo: "#8B4513",
    shortDescription:
      "Walk the winding lanes of Old Tbilisi, soak in history, and uncover the soul of Georgia's capital.",
    longDescription:
      "Start in the labyrinthine streets of Abanotubani — the sulphur bath district — and trace the city's 1,500-year story up to the Narikala fortress ruins. Your guide reveals hidden courtyards, rooftop bars, and stories you won't find in any guidebook. End with sunset views over the Mtkvari river.",
    included: ["Professional guide"],
    excluded: [
      "Food and drinks",
      "Museum entrance tickets",
      "Cable car ticket",
      "Paid attractions",
      "Personal expenses",
    ],
    routeStops: [
      "Old Tbilisi",
      "Metekhi Church",
      "Rike Park",
      "Bridge of Peace",
      "Narikala Fortress",
      "Sulfur Baths (Abanotubani)",
      "Shardeni Street",
    ],
    questTheme: "Urban Explorer",
    category: "culture",
    capacity: 8,
    seatsLeft: 3,
    lastSeatsDiscountPct: 0,
    showUrgency: true,
    urgencyLabel: "3 spots left today",
    bookingBonusXp: 100,
  },
  {
    id: "mtskheta",
    slug: "mtskheta-sacred-route",
    title: "Mtskheta Sacred Route",
    region: "Mtskheta-Mtianeti",
    duration: "Full day",
    pricePerPersonGel: 70,
    image: "/images/tours/mtskheta-sacred-route.jpg",
    gradientFrom: "#1A0A2E",
    gradientTo: "#4B2D8A",
    shortDescription:
      "Georgia's ancient capital and spiritual heart — sacred monasteries, living history, and panoramic river views.",
    longDescription:
      "Mtskheta was the capital of the ancient Kingdom of Iberia and remains the spiritual heart of Georgia. Visit Jvari Monastery — built in the 6th century on a clifftop where two rivers meet — then descend to the UNESCO-listed Svetitskhoveli Cathedral. Walk the old town and feel 2,000 years of continuous habitation.",
    included: ["Transportation", "Professional guide"],
    excluded: [
      "Food and drinks",
      "Church entrance tickets",
      "Personal expenses",
    ],
    routeStops: [
      "Jvari Monastery",
      "Svetitskhoveli Cathedral",
      "Old Mtskheta town",
      "Samtavro Monastery (optional)",
      "Shiomgvime Cave Monastery (optional)",
    ],
    questTheme: "Sacred Pilgrim",
    category: "heritage",
    capacity: 6,
    seatsLeft: 2,
    lastSeatsDiscountPct: 5,
    showUrgency: true,
    urgencyLabel: "2 spots left",
    bookingBonusXp: 75,
  },
  {
    id: "gori",
    slug: "gori-uplistsikhe-quest",
    title: "Gori + Uplistsikhe Historical Quest",
    region: "Shida Kartli",
    duration: "Full day",
    pricePerPersonGel: 110,
    image: "/images/tours/gori-uplistsikhe.jpg",
    gradientFrom: "#2A1A00",
    gradientTo: "#7A5A2A",
    shortDescription:
      "From a medieval cave city to a hillside fortress — two thousand years of Georgian resilience in one day.",
    longDescription:
      "Uplistsikhe is one of the oldest urban settlements in the Caucasus — a rock-carved city dating back 3,000 years, complete with wine cellars, a pharmacy, and a pagan temple. Combine it with Gori Fortress on its commanding hilltop and an optional visit to the city's famous museum. Lunch is included.",
    included: ["Transportation", "Professional guide", "Lunch"],
    excluded: [
      "Museum entrance tickets",
      "Cave city entrance tickets",
      "Personal expenses",
    ],
    routeStops: [
      "Gori",
      "Gori Fortress",
      "Stalin Museum (optional)",
      "Uplistsikhe cave city",
      "Lunch stop",
    ],
    questTheme: "Cave Kingdom Explorer",
    category: "heritage",
    capacity: 8,
    seatsLeft: 5,
    lastSeatsDiscountPct: 0,
    showUrgency: false,
    bookingBonusXp: 100,
  },
  {
    id: "kakheti",
    slug: "kakheti-wine-legends",
    title: "Kakheti Wine & Legends Quest",
    region: "Kakheti",
    duration: "Full day",
    pricePerPersonGel: 100,
    image: "/images/tours/kakheti-wine-legends.jpg",
    gradientFrom: "#3D0010",
    gradientTo: "#8B2020",
    shortDescription:
      "The cradle of wine — amber qvevri wines, ancient monasteries, and a supra feast in Georgia's famous wine valley.",
    longDescription:
      "Georgia invented wine over 8,000 years ago, and Kakheti is where that tradition lives most vividly. Taste amber wine poured from clay qvevri buried underground, visit the magnificent Alaverdi Cathedral rising from the Alazani plain, stroll Sighnaghi's cobblestone streets, and share a traditional supra feast with Georgian folk music.",
    included: ["Transportation", "Professional guide", "Lunch & wine tasting"],
    excluded: [
      "Museum entrance tickets",
      "Premium wine tastings (if separately charged)",
      "Personal expenses",
    ],
    routeStops: [
      "Bodbe Monastery",
      "Sighnaghi — City of Love",
      "Sighnaghi city walls",
      "Telavi",
      "Alaverdi Cathedral",
      "Wine tasting hall",
      "Traditional supra lunch",
    ],
    questTheme: "Wine Connoisseur",
    category: "wine",
    capacity: 8,
    seatsLeft: 4,
    lastSeatsDiscountPct: 0,
    showUrgency: false,
    bookingBonusXp: 100,
  },
  {
    id: "kazbegi",
    slug: "kazbegi-mountain-quest",
    title: "Kazbegi Mountain Quest",
    region: "Mtskheta-Mtianeti",
    duration: "Full day",
    pricePerPersonGel: 130,
    image: "/images/tours/kazbegi-mountain-quest.jpg",
    gradientFrom: "#051A2E",
    gradientTo: "#1A4A7A",
    shortDescription:
      "The Georgian Military Highway to 2,170 m — Gergeti Trinity Church above the clouds and the Caucasus at its most dramatic.",
    longDescription:
      "Drive the legendary Georgian Military Highway through the Great Caucasus range, stopping at Ananuri Fortress, the Soviet-era Friendship Monument, and the Gudauri ski resort viewpoint. The centrepiece is Gergeti Trinity Church — a 14th-century monastery perched above the treeline with Mount Kazbek's glacier as its backdrop. Lunch included.",
    included: ["Transportation", "Professional guide", "Lunch"],
    excluded: [
      "Gergeti 4x4 transfer (if required)",
      "Paid attractions",
      "Personal expenses",
    ],
    routeStops: [
      "Jinvali Reservoir",
      "Ananuri Fortress",
      "Gudauri viewpoint",
      "Friendship Monument",
      "Jvari Pass (Cross Pass)",
      "Stepantsminda village",
      "Gergeti Trinity Church",
    ],
    questTheme: "Mountain Conqueror",
    category: "adventure",
    capacity: 6,
    seatsLeft: 2,
    lastSeatsDiscountPct: 10,
    showUrgency: true,
    urgencyLabel: "2 spots left — 10% off",
    bookingBonusXp: 150,
  },
  {
    id: "vardzia",
    slug: "vardzia-cave-kingdom",
    title: "Vardzia Cave Kingdom Quest",
    region: "Samtskhe-Javakheti",
    duration: "Full day",
    pricePerPersonGel: 150,
    image: "/images/tours/vardzia-cave-kingdom.jpg",
    gradientFrom: "#2A0A00",
    gradientTo: "#7A3010",
    shortDescription:
      "A 12th-century cave monastery carved into volcanic rock — Queen Tamar's hidden kingdom in the mountains.",
    longDescription:
      "Vardzia is one of the most breathtaking sites in the South Caucasus — a 13-story cave monastery complex carved into the Erusheti mountain by order of Queen Tamar in the 12th century. Over 6,000 people once lived here. Explore the cave churches, wine cellars, and ancient frescoes. Stop at Rabati Fortress in Akhaltsikhe on the way. Lunch included.",
    included: ["Transportation", "Professional guide", "Lunch"],
    excluded: [
      "Vardzia entrance tickets",
      "Museum tickets",
      "Personal expenses",
    ],
    routeStops: [
      "Borjomi",
      "Rabati Fortress (Akhaltsikhe)",
      "Vardzia cave monastery",
      "Regional lunch",
    ],
    questTheme: "Cave Kingdom Knight",
    category: "heritage",
    capacity: 6,
    seatsLeft: 1,
    lastSeatsDiscountPct: 15,
    showUrgency: true,
    urgencyLabel: "Last seat!",
    bookingBonusXp: 150,
  },
  {
    id: "kutaisi",
    slug: "kutaisi-martvili-canyons",
    title: "Kutaisi + Martvili Canyons Nature Quest",
    region: "Imereti / Samegrelo",
    duration: "Full day",
    pricePerPersonGel: 150,
    image: "/images/tours/kutaisi-martvili-canyons.jpg",
    gradientFrom: "#003A2A",
    gradientTo: "#1A6A50",
    shortDescription:
      "Emerald canyon waters, ancient stalactite caves, and Georgia's second city — nature at its most spectacular.",
    longDescription:
      "Martvili Canyon's turquoise river, carved through limestone over millennia, is one of Georgia's most photogenic natural wonders. Drift through it by wooden boat. Combine with the magical Prometheus Cave — 22 km of stalactite grottos — and the old city of Kutaisi. Lunch included in a local family home.",
    included: ["Transportation", "Professional guide", "Lunch"],
    excluded: [
      "Canyon boat tickets",
      "Prometheus Cave tickets",
      "Paid attractions",
      "Personal expenses",
    ],
    routeStops: [
      "Kutaisi",
      "Bagrati Cathedral (optional)",
      "Prometheus Cave (optional)",
      "Martvili Canyon",
      "Canyon boat ride",
      "Lunch stop",
    ],
    questTheme: "Canyon Runner",
    category: "adventure",
    capacity: 8,
    seatsLeft: 5,
    lastSeatsDiscountPct: 0,
    showUrgency: false,
    bookingBonusXp: 100,
  },
  {
    id: "batumi",
    slug: "batumi-black-sea-quest",
    title: "Batumi 3-Day Black Sea Quest",
    region: "Adjara",
    duration: "3 days",
    pricePerPersonGel: null,
    priceLabel: "Price on Request",
    image: "/images/tours/batumi-black-sea.jpg",
    gradientFrom: "#030D1A",
    gradientTo: "#0A3A5A",
    shortDescription:
      "Three days on the Black Sea coast — boulevard nights, botanical gardens, waterfalls, and Adjarian culture.",
    longDescription:
      "Batumi sits where the Caucasus mountains meet the Black Sea — a subtropical city of palm trees, Art Nouveau architecture, and extraordinary food. Three days gives you the full picture: the legendary Adjarian khachapuri experience, the Makhuntseti Waterfall and Queen Tamar Bridge, the Botanical Garden, and the city's electrifying boulevard nights.",
    included: ["Transportation", "Professional guide", "Planned activities"],
    excluded: [
      "Hotel (if not selected)",
      "Entrance tickets",
      "Personal expenses",
    ],
    routeStops: [
      "Day 1: Tbilisi → Batumi, Batumi Boulevard",
      "Day 2: Batumi city, Alphabet Tower, Europe Square, Botanical Garden (optional), Makhuntseti Waterfall, Queen Tamar Bridge, Adjarian khachapuri experience",
      "Day 3: Free exploration, final quest, return to Tbilisi",
    ],
    questTheme: "Black Sea Voyager",
    category: "adventure",
    capacity: 6,
    seatsLeft: 3,
    lastSeatsDiscountPct: 0,
    showUrgency: false,
    bookingBonusXp: 200,
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
