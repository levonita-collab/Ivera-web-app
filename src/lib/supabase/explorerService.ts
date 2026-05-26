import { supabase } from "./client";
import type { Profile } from "@/lib/questProgress";

export async function saveExplorerToSupabase(
  profile: Profile,
  existingSupabaseId?: string
): Promise<string | null> {
  if (!supabase) return null;

  try {
    if (existingSupabaseId) {
      await supabase
        .from("explorer_profiles")
        .update({
          name: profile.name,
          country: profile.country ?? null,
          interest: profile.interests?.join(",") ?? null,
        })
        .eq("id", existingSupabaseId);
      return existingSupabaseId;
    }

    const { data, error } = await supabase
      .from("explorer_profiles")
      .insert({
        name: profile.name,
        country: profile.country ?? null,
        interest: profile.interests?.join(",") ?? null,
      })
      .select("id")
      .single();

    if (error) return null;
    return data?.id ?? null;
  } catch {
    return null;
  }
}

export async function upsertLeaderboardEntry(
  explorerId: string,
  displayName: string,
  totalXp: number,
  completedQuests: number
): Promise<void> {
  if (!supabase) return;

  try {
    const { data: existing } = await supabase
      .from("leaderboard_entries")
      .select("id")
      .eq("explorer_id", explorerId)
      .single();

    if (existing?.id) {
      await supabase
        .from("leaderboard_entries")
        .update({ display_name: displayName, total_xp: totalXp, completed_quests: completedQuests, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("leaderboard_entries")
        .insert({ explorer_id: explorerId, display_name: displayName, total_xp: totalXp, completed_quests: completedQuests });
    }
  } catch {
    // fire-and-forget — silently ignore
  }
}
