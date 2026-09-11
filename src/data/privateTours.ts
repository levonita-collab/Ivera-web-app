// Pricing and catalogue data for the /private-tours itinerary builder.
// Classic private excursions (own guide and/or driver, tourist picks the
// route) — deliberately kept separate from the gamified quest tours in
// tours.ts, which have their own XP/urgency mechanics that don't apply here.

export const GUIDE_DAY_RATE = 250;
/** Added once per overnight stay, to the guide's and/or driver's day rate. */
export const NIGHT_SURCHARGE = 50;

export type CarTierId = "standard" | "comfort" | "business" | "vip";

export interface CarTier {
  id: CarTierId;
  label: string;
  labelRu: string;
  tagline: string;
  taglineRu: string;
  /** Both null = price is arranged individually over WhatsApp. */
  dayPriceMin: number | null;
  dayPriceMax: number | null;
}

export const CAR_TIERS: CarTier[] = [
  {
    id: "standard",
    label: "Standard",
    labelRu: "Стандарт",
    tagline: "A comfortable sedan or minivan for everyday travel.",
    taglineRu: "Комфортный седан или минивэн для повседневных поездок.",
    dayPriceMin: 200,
    dayPriceMax: 250,
  },
  {
    id: "comfort",
    label: "Comfort",
    labelRu: "Комфорт",
    tagline: "Newer and more spacious — one step up from standard.",
    taglineRu: "Новее и просторнее — на ступень выше стандарта.",
    dayPriceMin: 300,
    dayPriceMax: 350,
  },
  {
    id: "business",
    label: "Business",
    labelRu: "Бизнес",
    tagline: "A premium vehicle for a noticeably more comfortable ride.",
    taglineRu: "Премиальный автомобиль для заметно более комфортной поездки.",
    dayPriceMin: 500,
    dayPriceMax: 500,
  },
  {
    id: "vip",
    label: "VIP",
    labelRu: "VIP",
    tagline: "Top-tier fleet — we'll choose the exact car together on WhatsApp.",
    taglineRu: "Автопарк высшего класса — точную машину подберём вместе в WhatsApp.",
    dayPriceMin: null,
    dayPriceMax: null,
  },
];

export interface PrivateTourRegion {
  id: string;
  name: string;
  nameRu: string;
  blurb: string;
  blurbRu: string;
  /** Omitted where the site has no real photo of the region yet. */
  image?: string;
}

export const PRIVATE_TOUR_REGIONS: PrivateTourRegion[] = [
  {
    id: "tbilisi-mtskheta",
    name: "Tbilisi & Mtskheta",
    nameRu: "Тбилиси и Мцхета",
    blurb: "Old Town streets, sulfur baths, and Georgia's ancient spiritual capital.",
    blurbRu: "Улочки Старого города, серные бани и древняя духовная столица Грузии.",
    image: "/images/tours/tbilisi-city-quest.jpg",
  },
  {
    id: "kazbegi",
    name: "Kazbegi & Gudauri",
    nameRu: "Казбеги и Гудаури",
    blurb: "The Georgian Military Road, Gergeti Trinity Church, and the high Caucasus.",
    blurbRu: "Военно-Грузинская дорога, храм Гергети и высокий Кавказ.",
    image: "/images/tours/kazbegi-mountain-quest.jpg",
  },
  {
    id: "kakheti",
    name: "Kakheti",
    nameRu: "Кахетия",
    blurb: "Vineyards, Sighnaghi's hilltop streets, and 8,000 years of winemaking.",
    blurbRu: "Виноградники, улицы Сигнахи на холме и 8000 лет виноделия.",
    image: "/images/tours/kakheti-wine-legends.jpg",
  },
  {
    id: "gori-uplistsikhe",
    name: "Gori & Uplistsikhe",
    nameRu: "Гори и Уплисцихе",
    blurb: "A cave city carved into rock, on the way through inner Kartli.",
    blurbRu: "Пещерный город, высеченный в скале, во внутренней Картли.",
    image: "/images/tours/gori-uplistsikhe.jpg",
  },
  {
    id: "samtskhe-javakheti",
    name: "Vardzia, Borjomi & Bakuriani",
    nameRu: "Вардзия, Боржоми и Бакуриани",
    blurb: "A cave monastery, mineral-water forests, and a mountain resort town.",
    blurbRu: "Пещерный монастырь, лес с минеральными источниками и горный курорт.",
    image: "/images/tours/vardzia-cave-kingdom.jpg",
  },
  {
    id: "imereti-samegrelo",
    name: "Kutaisi, Martvili & Okatse",
    nameRu: "Кутаиси, Мартвили и Окаце",
    blurb: "Turquoise canyons, waterfalls, and the Prometheus Cave.",
    blurbRu: "Бирюзовые каньоны, водопады и пещера Прометея.",
    image: "/images/tours/kutaisi-martvili-canyons.jpg",
  },
  {
    id: "svaneti",
    name: "Svaneti",
    nameRu: "Сванетия",
    blurb: "Medieval stone towers in Mestia and Ushguli, Europe's highest villages.",
    blurbRu: "Средневековые каменные башни Местии и Ушгули — самых высоких сёл Европы.",
  },
  {
    id: "racha",
    name: "Racha",
    nameRu: "Рача",
    blurb: "Quiet mountain valleys, Shaori Lake, and the home of Khvanchkara wine.",
    blurbRu: "Тихие горные долины, озеро Шаори и родина вина Хванчкара.",
  },
  {
    id: "adjara",
    name: "Batumi & the Black Sea coast",
    nameRu: "Батуми и черноморское побережье",
    blurb: "Beach promenade, botanical gardens, and Adjara's mountain villages.",
    blurbRu: "Набережная, ботанический сад и горные сёла Аджарии.",
    image: "/images/tours/batumi-black-sea.jpg",
  },
  {
    id: "tusheti",
    name: "Tusheti",
    nameRu: "Тушетия",
    blurb: "A remote highland region reachable only in summer — for the adventurous.",
    blurbRu: "Труднодоступный высокогорный регион, открытый только летом — для смелых.",
  },
];

export interface PrivateTourInterest {
  id: string;
  label: string;
  labelRu: string;
  icon: string;
}

export const PRIVATE_TOUR_INTERESTS: PrivateTourInterest[] = [
  { id: "wine-food", label: "Wine & Georgian cuisine", labelRu: "Вино и грузинская кухня", icon: "Wine" },
  { id: "history", label: "History & architecture", labelRu: "История и архитектура", icon: "Landmark" },
  { id: "nature", label: "Nature & hiking", labelRu: "Природа и походы", icon: "Mountain" },
  { id: "adventure", label: "Adventure activities", labelRu: "Активности и приключения", icon: "Compass" },
  { id: "local-life", label: "Local life & markets", labelRu: "Местная жизнь и рынки", icon: "Store" },
  { id: "photography", label: "Photography spots", labelRu: "Фотолокации", icon: "Camera" },
  { id: "relaxation", label: "Relaxation & spa", labelRu: "Отдых и спа", icon: "Waves" },
  { id: "family", label: "Family-friendly pace", labelRu: "Семейный темп", icon: "Users" },
];
