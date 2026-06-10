import { supabase } from "./client";
import type { Profile } from "@/lib/questProgress";

export async function saveExplorerToSupabase(
  profile: Profile,
  existingSupabaseId?: string
): Promise<string | null> {
  if (!supabase) return null;

  try {
    const row = {
      name: profile.name,
      country: profile.country ?? null,
      interest: profile.interests?.join(",") ?? null,
      whatsapp_optional: profile.whatsappNumber ?? null,
      language: profile.language ?? null,
    };

    if (existingSupabaseId) {
      await supabase
        .from("explorer_profiles")
        .update(row)
        .eq("id", existingSupabaseId);
      return existingSupabaseId;
    }

    const { data, error } = await supabase
      .from("explorer_profiles")
      .insert(row)
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
