import { supabase } from "@/lib/supabase/client";

interface AiLogEntry {
  explorerId: string | null;
  interactionType: "quest_hint" | "hero_chronicle" | "recommendation";
  tourSlug: string | null;
  missionId: string | null;
  inputSummary: string;
  outputSummary: string;
}

export async function logAiInteraction(entry: AiLogEntry): Promise<void> {
  try {
    if (!supabase) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("ai_interactions").insert({
      explorer_id: entry.explorerId,
      interaction_type: entry.interactionType,
      tour_slug: entry.tourSlug,
      mission_id: entry.missionId,
      input_summary: entry.inputSummary,
      output_summary: entry.outputSummary,
    });
  } catch {
    // Table may not exist yet — fail silently
  }
}
