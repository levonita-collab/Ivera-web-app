export interface Badge {
  id: string;
  tourSlug: string;
  name: string;
  description: string;
  icon: string; // emoji fallback
}

export interface Level {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export const badges: Badge[] = [
  {
    id: "badge-key-tbilisi",
    tourSlug: "key-of-tbilisi",
    name: "Key of Tbilisi",
    description: "Completed the free Tbilisi starter quest — you've unlocked the door to Georgia's adventures.",
    icon: "🗝️",
  },
  {
    id: "badge-tbilisi",
    tourSlug: "tbilisi-city-quest",
    name: "Tbilisi Explorer",
    description: "Completed the full Tbilisi City Quest — you've walked in the footsteps of 1,500 years of Georgian history.",
    icon: "🏙️",
  },
  {
    id: "badge-mtskheta",
    tourSlug: "mtskheta-sacred-route",
    name: "Sacred Pilgrim",
    description: "Completed the Mtskheta Sacred Route — you stood where Georgia's soul was forged.",
    icon: "⛪",
  },
  {
    id: "badge-gori",
    tourSlug: "gori-uplistsikhe-quest",
    name: "Cave Adventurer",
    description: "Completed the Gori + Uplistsikhe Quest — you walked a 3,000-year-old urban grid carved into rock.",
    icon: "🪨",
  },
  {
    id: "badge-kakheti",
    tourSlug: "kakheti-wine-legends",
    name: "Wine Connoisseur",
    description: "Completed the Kakheti Wine & Legends Quest — you drank from qvevri older than most nations.",
    icon: "🍷",
  },
  {
    id: "badge-kazbegi",
    tourSlug: "kazbegi-mountain-quest",
    name: "Mountain Conqueror",
    description: "Completed the Kazbegi Mountain Quest — you reached Gergeti Trinity Church above the clouds.",
    icon: "⛰️",
  },
  {
    id: "badge-vardzia",
    tourSlug: "vardzia-cave-kingdom",
    name: "Cave Kingdom Knight",
    description: "Completed the Vardzia Cave Kingdom Quest — Queen Tamar's hidden city revealed its secrets to you.",
    icon: "🏰",
  },
  {
    id: "badge-kutaisi",
    tourSlug: "kutaisi-martvili-canyons",
    name: "Canyon Runner",
    description: "Completed the Kutaisi + Martvili Quest — you drifted through Georgia's emerald canyons.",
    icon: "🌊",
  },
  {
    id: "badge-batumi",
    tourSlug: "batumi-black-sea-quest",
    name: "Black Sea Voyager",
    description: "Completed the Batumi Black Sea Quest — from the Caucasus peaks to the sea in three days.",
    icon: "⚓",
  },
];

export const levels: Level[] = [
  { level: 1, title: "Traveller", minXp: 0, maxXp: 299 },
  { level: 2, title: "Explorer", minXp: 300, maxXp: 749 },
  { level: 3, title: "Adventurer", minXp: 750, maxXp: 1499 },
  { level: 4, title: "Quest Master", minXp: 1500, maxXp: 2999 },
  { level: 5, title: "Georgian Legend", minXp: 3000, maxXp: Infinity },
];

export function getLevelForXP(xp: number): Level {
  return levels.find((l) => xp >= l.minXp && xp <= l.maxXp) ?? levels[0];
}

export function getBadgeForTour(tourSlug: string): Badge | undefined {
  return badges.find((b) => b.tourSlug === tourSlug);
}
