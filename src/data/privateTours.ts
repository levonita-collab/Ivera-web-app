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
  /** Longer paragraph shown when the tourist expands the card for more info. */
  details: string;
  detailsRu: string;
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
    details:
      "Georgia's capital blends Persian-style balconies, Soviet modernism, and glass-and-steel landmarks along the Kura River. A short drive away, Mtskheta was Georgia's ancient capital and remains its spiritual heart — Svetitskhoveli Cathedral and the hilltop Jvari Monastery are both UNESCO World Heritage sites.",
    detailsRu:
      "Столица Грузии сочетает балконы в персидском стиле, советский модернизм и стеклянные высотки вдоль реки Кура. В нескольких минутах езды — Мцхета, древняя столица и духовный центр страны: собор Светицховели и монастырь Джвари на вершине холма входят в список Всемирного наследия ЮНЕСКО.",
    image: "/images/tours/tbilisi-city-quest.jpg",
  },
  {
    id: "kazbegi",
    name: "Kazbegi & Gudauri",
    nameRu: "Казбеги и Гудаури",
    blurb: "The Georgian Military Road, Gergeti Trinity Church, and the high Caucasus.",
    blurbRu: "Военно-Грузинская дорога, храм Гергети и высокий Кавказ.",
    details:
      "The Georgian Military Road climbs through the Dariali Gorge to Stepantsminda, where Gergeti Trinity Church sits on a ridge beneath 5,047m Mount Kazbek. Gudauri, Georgia's main ski resort, lies along the same route and works year-round for mountain views and paragliding.",
    detailsRu:
      "Военно-Грузинская дорога поднимается через Дарьяльское ущелье к Степанцминде, где на хребте под пятитысячником Казбек стоит храм Гергети. Гудаури — главный горнолыжный курорт Грузии на этой же дороге — интересен круглый год: виды на горы и параглайдинг.",
    image: "/images/tours/kazbegi-mountain-quest.jpg",
  },
  {
    id: "kakheti",
    name: "Kakheti",
    nameRu: "Кахетия",
    blurb: "Vineyards, Sighnaghi's hilltop streets, and 8,000 years of winemaking.",
    blurbRu: "Виноградники, улицы Сигнахи на холме и 8000 лет виноделия.",
    details:
      "Georgia's principal wine region, in the Alazani Valley, has made wine in qvevri clay vessels for roughly 8,000 years. Sighnaghi's hilltop streets and city walls overlook the valley, Bodbe Monastery holds the relics of St. Nino, and the David Gareja cave monastery complex sits on the semi-desert border with Azerbaijan.",
    detailsRu:
      "Главный винодельческий регион Грузии в Алазанской долине производит вино в квеври уже около 8000 лет. Улицы и крепостные стены Сигнахи на холме смотрят на долину, монастырь Бодбе хранит мощи святой Нино, а пещерный монастырский комплекс Давид-Гареджи стоит в полупустыне на границе с Азербайджаном.",
    image: "/images/tours/kakheti-wine-legends.jpg",
  },
  {
    id: "gori-uplistsikhe",
    name: "Gori & Uplistsikhe",
    nameRu: "Гори и Уплисцихе",
    blurb: "A cave city carved into rock, on the way through inner Kartli.",
    blurbRu: "Пещерный город, высеченный в скале, во внутренней Картли.",
    details:
      "Uplistsikhe is a rock-hewn city dating back roughly 3,000 years, with chambers cut for wine storage, a pharmacy, and a pagan temple later converted to a church. Gori's hilltop fortress overlooks the town where the Mtkvari and Liakhvi rivers meet, in the heart of inner Kartli.",
    detailsRu:
      "Уплисцихе — высеченный в скале город возрастом около 3000 лет, с помещениями для хранения вина, аптекой и языческим храмом, позже превращённым в церковь. Крепость на холме в Гори смотрит на город у слияния рек Мтквари и Лиахви, в самом сердце внутренней Картли.",
    image: "/images/tours/gori-uplistsikhe.jpg",
  },
  {
    id: "samtskhe-javakheti",
    name: "Vardzia, Borjomi & Bakuriani",
    nameRu: "Вардзия, Боржоми и Бакуриани",
    blurb: "A cave monastery, mineral-water forests, and a mountain resort town.",
    blurbRu: "Пещерный монастырь, лес с минеральными источниками и горный курорт.",
    details:
      "Vardzia is a cave monastery of some 600 rooms carved into a cliff in the 12th–13th centuries under Queen Tamar. Nearby Akhaltsikhe has the restored Rabati Fortress, Borjomi is known for its mineral springs and forested park, and Bakuriani is a mountain resort popular for skiing in winter and hiking in summer.",
    detailsRu:
      "Вардзия — пещерный монастырь примерно из 600 помещений, вырубленный в скале в XII–XIII веках при царице Тамаре. Рядом в Ахалцихе — восстановленная крепость Рабати, Боржоми известен минеральными источниками и лесным парком, а Бакуриани — горный курорт, популярный зимой для катания на лыжах, а летом — для походов.",
    image: "/images/tours/vardzia-cave-kingdom.jpg",
  },
  {
    id: "imereti-samegrelo",
    name: "Kutaisi, Martvili & Okatse",
    nameRu: "Кутаиси, Мартвили и Окаце",
    blurb: "Turquoise canyons, waterfalls, and the Prometheus Cave.",
    blurbRu: "Бирюзовые каньоны, водопады и пещера Прометея.",
    details:
      "Kutaisi's Bagrati Cathedral and the hilltop Gelati Monastery (a UNESCO World Heritage site and former seat of learning) anchor Georgia's third-largest city. Nearby, Martvili and Okatse canyons offer boat rides and a cliffside walkway through turquoise water and forest, and the Prometheus Cave has over a kilometer of lit underground chambers.",
    detailsRu:
      "Собор Баграта и монастырь Гелати на холме (объект Всемирного наследия ЮНЕСКО и в прошлом крупный центр науки) — сердце третьего по величине города Грузии, Кутаиси. Рядом — каньоны Мартвили и Окаце с лодочными прогулками и навесной тропой над бирюзовой водой и лесом, а пещера Прометея — более километра освещённых подземных залов.",
    image: "/images/tours/kutaisi-martvili-canyons.jpg",
  },
  {
    id: "svaneti",
    name: "Svaneti",
    nameRu: "Сванетия",
    blurb: "Medieval stone towers in Mestia and Ushguli, Europe's highest villages.",
    blurbRu: "Средневековые каменные башни Местии и Ушгули — самых высоких сёл Европы.",
    details:
      "A historically isolated highland region in the northwest, Svaneti is known for its medieval stone defensive towers, especially in Mestia and in Ushguli — a cluster of villages often cited as among the highest continuously inhabited in Europe. The region's architecture and mountain culture are part of a UNESCO World Heritage listing.",
    detailsRu:
      "Исторически труднодоступный высокогорный регион на северо-западе, Сванетия славится средневековыми каменными сторожевыми башнями — особенно в Местии и Ушгули, группе сёл, которую часто называют одной из самых высокогорных постоянно населённых точек Европы. Архитектура и горная культура региона включены в список Всемирного наследия ЮНЕСКО.",
  },
  {
    id: "racha",
    name: "Racha",
    nameRu: "Рача",
    blurb: "Quiet mountain valleys, Shaori Lake, and the home of Khvanchkara wine.",
    blurbRu: "Тихие горные долины, озеро Шаори и родина вина Хванчкара.",
    details:
      "One of Georgia's quietest mountain regions, Racha is home to Khvanchkara, the naturally semi-sweet red wine once favored by the Soviet elite. Nikortsminda Cathedral is known for its stone carving, and Shaori Lake and the surrounding forests draw hikers who want the mountains without the crowds.",
    detailsRu:
      "Одна из самых тихих горных областей Грузии, Рача — родина Хванчкары, натурального полусладкого красного вина, которое любила советская элита. Кафедральный собор Никорцминда известен каменной резьбой, а озеро Шаори и окрестные леса привлекают тех, кто хочет гор без толп туристов.",
  },
  {
    id: "adjara",
    name: "Batumi & the Black Sea coast",
    nameRu: "Батуми и черноморское побережье",
    blurb: "Beach promenade, botanical gardens, and Adjara's mountain villages.",
    blurbRu: "Набережная, ботанический сад и горные сёла Аджарии.",
    details:
      "Batumi's palm-lined boulevard, botanical garden, and modern skyline sit on a subtropical stretch of the Black Sea coast. Inland, Adjara's mountain villages like Khulo are reached by winding roads and old Soviet-era cable cars, and the region has its own version of khachapuri — Acharuli, boat-shaped with cheese, butter, and an egg.",
    detailsRu:
      "Пальмовая набережная Батуми, ботанический сад и современный горизонт стоят на субтропическом участке черноморского побережья. В глубине материка горные сёла Аджарии, такие как Хуло, соединены серпантинами и старыми советскими канатными дорогами, а у региона есть своя хачапури — аджарули, в форме лодочки с сыром, маслом и яйцом.",
    image: "/images/tours/batumi-black-sea.jpg",
  },
  {
    id: "tusheti",
    name: "Tusheti",
    nameRu: "Тушетия",
    blurb: "A remote highland region reachable only in summer — for the adventurous.",
    blurbRu: "Труднодоступный высокогорный регион, открытый только летом — для смелых.",
    details:
      "A remote highland region in the northeast, reachable only in summer over the unpaved Abano Pass, one of the highest and most dramatic drives in the Caucasus. Its main village, Omalo, keeps a centuries-old shepherding culture, with stone towers similar in spirit to Svaneti's but built in a distinct local style.",
    detailsRu:
      "Труднодоступный высокогорный регион на северо-востоке, куда можно добраться только летом по грунтовому перевалу Абано — одному из самых высоких и впечатляющих горных проездов Кавказа. Главное село, Омало, хранит многовековую пастушескую культуру и каменные башни, похожие по духу на сванские, но построенные в собственном местном стиле.",
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
