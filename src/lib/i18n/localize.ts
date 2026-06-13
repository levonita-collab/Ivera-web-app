import type { Language } from "./LanguageContext";
import type { Region } from "@/data/regions";
import type { Tour } from "@/data/tours";
import type { Mission } from "@/data/missions";
import type { Badge, Level } from "@/data/rewards";
import { regionsRu } from "@/data/regions.ru";
import { toursRu } from "@/data/tours.ru";
import { missionsRu } from "@/data/missions.ru";
import { badgesRu, levelsRu } from "@/data/rewards.ru";

export function getLocalizedRegion(region: Region, language: Language): Region {
  if (language === "en") return region;
  const overrides = regionsRu[region.slug];
  return overrides ? { ...region, ...overrides } : region;
}

export function getLocalizedTour(tour: Tour, language: Language): Tour {
  if (language === "en") return tour;
  const overrides = toursRu[tour.id];
  return overrides ? { ...tour, ...overrides } : tour;
}

export function getLocalizedMission(mission: Mission, language: Language): Mission {
  if (language === "en") return mission;
  const overrides = missionsRu[mission.id];
  return overrides ? { ...mission, ...overrides } : mission;
}

export function getLocalizedBadge(badge: Badge, language: Language): Badge {
  if (language === "en") return badge;
  const overrides = badgesRu[badge.id];
  return overrides ? { ...badge, ...overrides } : badge;
}

export function getLocalizedLevel(level: Level, language: Language): Level {
  if (language === "en") return level;
  const overrides = levelsRu[level.level];
  return overrides ? { ...level, ...overrides } : level;
}
