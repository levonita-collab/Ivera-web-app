import { supabase } from "./client";
import { upsertLeaderboardEntry } from "./explorerService";

interface MissionCompletionPayload {
  explorerId: string;
  explorerName: string;
  tourSlug: string;
  missionId: string;
  pointsEarned: number;
  totalXp: number;
  completedQuests: number;
}

export async function syncMissionCompletion(
  payload: MissionCompletionPayload
): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.from("quest_progress").upsert(
      {
        explorer_id: payload.explorerId,
        tour_slug: payload.tourSlug,
        mission_id: payload.missionId,
        completed: true,
        points_earned: payload.pointsEarned,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "explorer_id,tour_slug,mission_id" }
    );

    await upsertLeaderboardEntry(
      payload.explorerId,
      payload.explorerName,
      payload.totalXp,
      payload.completedQuests
    );
  } catch {
    // fire-and-forget — silently ignore
  }
}
