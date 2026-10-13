// Pure reward logic: takes saved quest progress, returns what's earned.
// No storage access here, so every rule is unit-testable (rewards.test.ts).

import type { MissionProgress } from "@/lib/questProgress";
import { getMissionsForTour } from "@/data/missions";
import { FREE_QUEST_SLUG, FREE_MISSIONS } from "@/data/freeTbilisiQuest";
import {
  REWARD_TIMEZONE,
  DAILY_TIERS,
  MILESTONES,
  BONUS_TASKS,
  EXPEDITION_BONUS_XP,
  type DailyTier,
  type Milestone,
} from "@/data/rewardRules";
import { tours } from "@/data/tours";

export type AllProgress = Record<string, MissionProgress>;

/** Calendar date (YYYY-MM-DD) of `date` in Georgia. */
export function rewardDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: REWARD_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isOnDay(iso: string, dayKey: string): boolean {
  const d = new Date(iso);
  return !Number.isNaN(d.getTime()) && rewardDateKey(d) === dayKey;
}

export function getMissionCount(slug: string): number {
  return slug === FREE_QUEST_SLUG ? FREE_MISSIONS.length : getMissionsForTour(slug).length;
}

/** Most XP one paid tour can give in a day: missions + expedition bonus + every bonus task. */
export function getMaxPaidQuestXp(slug: string): number {
  const missions = getMissionsForTour(slug).reduce((s, m) => s + m.points, 0);
  const bonusTasks = BONUS_TASKS.reduce((s, t) => s + t.points, 0);
  return missions + (EXPEDITION_BONUS_XP[slug] ?? 0) + bonusTasks;
}

/** Paid tours on which a single day can reach the top daily tier. */
export function getTopTierQuestSlugs(): string[] {
  const top = DAILY_TIERS[DAILY_TIERS.length - 1];
  return tours
    .filter((t) => getMissionsForTour(t.slug).length > 0 && getMaxPaidQuestXp(t.slug) >= top.minXp)
    .map((t) => t.slug);
}

export function isQuestComplete(slug: string, progress: MissionProgress | undefined): boolean {
  const count = getMissionCount(slug);
  return count > 0 && !!progress && progress.completedMissions.length >= count;
}

export function getCompletedQuestSlugs(all: AllProgress): string[] {
  return Object.keys(all).filter((slug) => isQuestComplete(slug, all[slug]));
}

export function getCompletedPaidQuestSlugs(all: AllProgress): string[] {
  return getCompletedQuestSlugs(all).filter((slug) => slug !== FREE_QUEST_SLUG);
}

export function getDailyXp(all: AllProgress, now: Date): number {
  const today = rewardDateKey(now);
  let total = 0;
  for (const p of Object.values(all)) {
    for (const e of p.events ?? []) {
      if (isOnDay(e.at, today)) total += e.points;
    }
  }
  return total;
}

/** True if, on some paid tour, every bonus task was completed today. */
export function hasAllBonusTasksToday(all: AllProgress, now: Date): boolean {
  const today = rewardDateKey(now);
  return Object.entries(all).some(([slug, p]) => {
    if (slug === FREE_QUEST_SLUG) return false;
    return BONUS_TASKS.every((task) =>
      (p.events ?? []).some((e) => e.id === `bonus:${task.id}` && isOnDay(e.at, today))
    );
  });
}

export interface TierStatus {
  tier: DailyTier;
  earned: boolean;
  xpMissing: number;
  bonusMissing: boolean;
}

export function getDailyTierStatuses(all: AllProgress, now: Date): TierStatus[] {
  const xp = getDailyXp(all, now);
  const bonusDone = hasAllBonusTasksToday(all, now);
  return DAILY_TIERS.map((tier) => {
    const xpMissing = Math.max(0, tier.minXp - xp);
    const bonusMissing = tier.requiresAllBonusTasks && !bonusDone;
    return { tier, earned: xpMissing === 0 && !bonusMissing, xpMissing, bonusMissing };
  });
}

export interface MilestoneStatus {
  milestone: Milestone;
  earned: boolean;
  freeQuestDone: boolean;
  paidQuestsDone: number;
}

export function getMilestoneStatuses(all: AllProgress): MilestoneStatus[] {
  const freeQuestDone = isQuestComplete(FREE_QUEST_SLUG, all[FREE_QUEST_SLUG]);
  const paidQuestsDone = getCompletedPaidQuestSlugs(all).length;
  return MILESTONES.map((milestone) => ({
    milestone,
    freeQuestDone,
    paidQuestsDone,
    earned:
      (!milestone.requiresFreeQuest || freeQuestDone) &&
      paidQuestsDone >= milestone.paidQuestsRequired,
  }));
}

/** When the last mission of a quest was completed (for the diploma). */
export function getQuestCompletedAt(progress: MissionProgress | undefined): Date | null {
  const times = (progress?.events ?? [])
    .filter((e) => !e.id.startsWith("bonus:"))
    .map((e) => new Date(e.at).getTime())
    .filter((t) => !Number.isNaN(t));
  return times.length ? new Date(Math.max(...times)) : null;
}

/**
 * Short, deterministic code for a reward claim or diploma. The same inputs
 * always give the same code, so a reward claimed twice shows up as a
 * repeated code in WhatsApp instead of looking like a new claim.
 */
export function buildRewardCode(seed: string): string {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `IV-${(hash >>> 0).toString(36).toUpperCase().padStart(7, "0")}`;
}
