import { NextResponse } from "next/server";
import { callGemini } from "@/lib/ai/gemini";
import { heroChroniclePrompt } from "@/lib/ai/prompts";
import { logAiInteraction } from "@/lib/ai/logging";

export const runtime = "nodejs";

function buildFallbackChronicle(params: {
  explorerName: string;
  tourTitle: string;
  missions: { title: string; location: string }[];
  totalXP: number;
  badgeName: string;
}): string {
  const locations = params.missions.map((m) => m.location).join(", ");
  return `${params.explorerName} walked where few dare to go. Through ${locations}, every step revealed a deeper layer of Georgia's ancient soul. The journey demanded curiosity, presence, and courage — and ${params.explorerName} delivered all three.

${params.totalXP} XP earned. The "${params.badgeName}" badge now marks your passport. Ivera records your name among those who chose the road less travelled.

Georgia has more to offer. The next quest is already waiting.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      explorerName?: string;
      tourSlug?: string;
      tourTitle?: string;
      missions?: { title: string; location: string }[];
      totalXP?: number;
      badgeName?: string;
      explorerId?: string;
    };

    const {
      explorerName = "Explorer",
      tourSlug,
      tourTitle = "Georgia Quest",
      missions = [],
      totalXP = 0,
      badgeName = "Quest Badge",
      explorerId,
    } = body;

    const fallback = buildFallbackChronicle({ explorerName, tourTitle, missions, totalXP, badgeName });

    if (!missions.length) {
      return NextResponse.json({ chronicle: fallback, fallback: true });
    }

    const prompt = heroChroniclePrompt({ explorerName, tourTitle, missions, totalXP, badgeName });
    const result = await callGemini(prompt, fallback, 280);

    logAiInteraction({
      explorerId: explorerId ?? null,
      interactionType: "hero_chronicle",
      tourSlug: tourSlug ?? null,
      missionId: null,
      inputSummary: `${explorerName} — ${tourTitle} — ${totalXP} XP`,
      outputSummary: result.text.slice(0, 120),
    }).catch(() => {});

    return NextResponse.json({ chronicle: result.text, fallback: result.fallback });
  } catch {
    return NextResponse.json({
      chronicle: "Your adventure has been recorded in the Ivera chronicles.",
      fallback: true,
    });
  }
}
