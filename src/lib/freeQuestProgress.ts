// Thin convenience layer for the free "Key of Tbilisi" quest.
// Delegates to the shared questProgress module so XP / localStorage / Supabase
// sync and badge logic stay in one place — this only scopes them to the free
// quest and adds the sequential unlock rule.

import {
  getQuestProgress,
  completeMission,
  type MissionProgress,
} from "@/lib/questProgress";
import { FREE_QUEST_SLUG, FREE_MISSIONS } from "@/data/freeTbilisiQuest";

export function getFreeQuestProgress(): MissionProgress {
  return getQuestProgress(FREE_QUEST_SLUG);
}

export function completeFreeQuestMission(missionId: string, points: number): MissionProgress {
  return completeMission(FREE_QUEST_SLUG, missionId, points);
}

export function getFreeQuestTotalXP(): number {
  return getFreeQuestProgress().xp;
}

export type MissionStatus = "completed" | "available" | "locked";

/** Sequential unlock: mission N opens once mission N-1 is complete. */
export function getMissionStatus(progress: MissionProgress, index: number): MissionStatus {
  const mission = FREE_MISSIONS[index];
  if (!mission) return "locked";
  if (progress.completedMissions.includes(mission.id)) return "completed";
  const prev = FREE_MISSIONS[index - 1];
  if (index === 0 || (prev && progress.completedMissions.includes(prev.id))) {
    return "available";
  }
  return "locked";
}

export function isFreeQuestComplete(progress: MissionProgress): boolean {
  return FREE_MISSIONS.every((m) => progress.completedMissions.includes(m.id));
}
