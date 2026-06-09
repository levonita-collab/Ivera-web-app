import { NextResponse } from "next/server";
import { callGemini } from "@/lib/ai/gemini";
import { questHintPrompt } from "@/lib/ai/prompts";
import { logAiInteraction } from "@/lib/ai/logging";

export const runtime = "nodejs";

const FALLBACK =
  "Look carefully around the location. The answer is hidden in the story of this place.";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      tourSlug?: string;
      missionId?: string;
      missionTitle?: string;
      missionDescription?: string;
      location?: string;
      userQuestion?: string;
      explorerId?: string;
    };

    const { tourSlug, missionId, missionTitle, missionDescription, location, userQuestion, explorerId } = body;

    if (!missionTitle || !location) {
      return NextResponse.json({ hint: FALLBACK, fallback: true });
    }

    const prompt = questHintPrompt({
      missionTitle,
      missionDescription: missionDescription ?? "",
      location,
      userQuestion,
    });

    const result = await callGemini(prompt, FALLBACK, 120);

    logAiInteraction({
      explorerId: explorerId ?? null,
      interactionType: "quest_hint",
      tourSlug: tourSlug ?? null,
      missionId: missionId ?? null,
      inputSummary: `${missionTitle} @ ${location}`,
      outputSummary: result.text.slice(0, 120),
    }).catch(() => {});

    return NextResponse.json({ hint: result.text, fallback: result.fallback });
  } catch {
    return NextResponse.json({ hint: FALLBACK, fallback: true });
  }
}
