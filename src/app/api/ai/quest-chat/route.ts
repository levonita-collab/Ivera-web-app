import { NextResponse } from "next/server";
import { callGeminiChat, type ChatTurn } from "@/lib/ai/gemini";
import { questChatSystemPrompt } from "@/lib/ai/prompts";
import { logAiInteraction } from "@/lib/ai/logging";

export const runtime = "nodejs";

const FALLBACK: Record<"en" | "ru", string> = {
  en: "The guide is resting for a moment — try asking again shortly, or use the hint button on the mission card.",
  ru: "Гид ненадолго отошёл — попробуйте спросить снова через минуту, либо воспользуйтесь подсказкой на карточке задания.",
};

const MAX_HISTORY_TURNS = 12; // caps prompt size / cost per request

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      tourSlug?: string;
      missionId?: string;
      tourTitle?: string;
      missionTitle?: string;
      missionDescription?: string;
      location?: string;
      language?: "en" | "ru";
      messages?: ChatTurn[];
      explorerId?: string;
    };

    const {
      tourSlug,
      missionId,
      tourTitle,
      missionTitle,
      missionDescription,
      location,
      language = "en",
      messages,
      explorerId,
    } = body;

    const fallback = FALLBACK[language] ?? FALLBACK.en;

    if (!missionTitle || !location || !messages || messages.length === 0) {
      return NextResponse.json({ reply: fallback, fallback: true });
    }

    const trimmedHistory = messages.slice(-MAX_HISTORY_TURNS);
    const lastUserMessage = trimmedHistory[trimmedHistory.length - 1]?.content ?? "";

    const systemPrompt = questChatSystemPrompt({
      tourTitle: tourTitle ?? "an Ivera quest",
      missionTitle,
      missionDescription: missionDescription ?? "",
      location,
      language,
    });

    const result = await callGeminiChat(trimmedHistory, systemPrompt, fallback, 150);

    logAiInteraction({
      explorerId: explorerId ?? null,
      interactionType: "quest_chat",
      tourSlug: tourSlug ?? null,
      missionId: missionId ?? null,
      inputSummary: lastUserMessage.slice(0, 120),
      outputSummary: result.text.slice(0, 120),
    }).catch(() => {});

    return NextResponse.json({ reply: result.text, fallback: result.fallback });
  } catch {
    return NextResponse.json({ reply: FALLBACK.en, fallback: true });
  }
}
