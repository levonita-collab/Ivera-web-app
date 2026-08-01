import { NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/ai/gemini";
import { checkMissionAnswerPrompt, type MissionAnswerVerdict } from "@/lib/ai/prompts";
import { logAiInteraction } from "@/lib/ai/logging";

export const runtime = "nodejs";

const FEEDBACK: Record<"en" | "ru", { correct: string; incorrect: string; empty: string }> = {
  en: {
    correct: "That matches — nice work! Marking this mission complete.",
    incorrect: "Not quite — take another look around and try again.",
    empty: "Type an answer describing what you found, or use the QR scanner instead.",
  },
  ru: {
    correct: "Верно! Отмечаем задание выполненным.",
    incorrect: "Пока не то — осмотритесь внимательнее и попробуйте снова.",
    empty: "Опишите словами, что вы нашли, или воспользуйтесь сканером QR.",
  },
};

// STOPWORDS are short/common words that don't carry identifying meaning —
// excluded so the fallback heuristic below doesn't match on filler words.
const STOPWORDS = new Set([
  "the", "and", "for", "with", "this", "that", "your", "you", "are", "was",
  "и", "в", "на", "с", "это", "как", "что", "где", "или",
]);

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

// Used only when Gemini is unavailable — a rough overlap check between the
// answer and the mission's title/location words. Deliberately permissive
// (this is a fallback path, not the primary grading mechanism).
function checkAnswerLocally(
  missionTitle: string,
  location: string,
  answer: string
): boolean {
  const targetWords = new Set([...normalizeWords(missionTitle), ...normalizeWords(location)]);
  const answerWords = normalizeWords(answer);
  return answerWords.some((w) => targetWords.has(w) || [...targetWords].some((t) => t.includes(w) || w.includes(t)));
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      tourSlug?: string;
      missionId?: string;
      missionTitle?: string;
      missionDescription?: string;
      location?: string;
      answer?: string;
      language?: "en" | "ru";
      explorerId?: string;
    };

    const {
      tourSlug,
      missionId,
      missionTitle,
      missionDescription,
      location,
      answer,
      language = "en",
      explorerId,
    } = body;

    const copy = FEEDBACK[language] ?? FEEDBACK.en;

    if (!missionTitle || !location) {
      return NextResponse.json({ isCorrect: false, feedback: copy.empty, fallback: true });
    }
    if (!answer || !answer.trim()) {
      return NextResponse.json({ isCorrect: false, feedback: copy.empty, fallback: true });
    }

    const localFallback: MissionAnswerVerdict = checkAnswerLocally(missionTitle, location, answer)
      ? { isCorrect: true, feedback: copy.correct }
      : { isCorrect: false, feedback: copy.incorrect };

    const prompt = checkMissionAnswerPrompt({
      missionTitle,
      missionDescription: missionDescription ?? "",
      location,
      answer,
      language,
    });

    const result = await callGeminiJson<MissionAnswerVerdict>(prompt, localFallback, 120);

    // Guard against a malformed (but parseable) Gemini response missing fields.
    const verdict: MissionAnswerVerdict =
      typeof result.data?.isCorrect === "boolean" && typeof result.data?.feedback === "string"
        ? result.data
        : localFallback;

    logAiInteraction({
      explorerId: explorerId ?? null,
      interactionType: "mission_answer_check",
      tourSlug: tourSlug ?? null,
      missionId: missionId ?? null,
      inputSummary: answer.slice(0, 120),
      outputSummary: `${verdict.isCorrect ? "correct" : "incorrect"}: ${verdict.feedback.slice(0, 100)}`,
    }).catch(() => {});

    return NextResponse.json({
      isCorrect: verdict.isCorrect,
      feedback: verdict.feedback,
      fallback: result.fallback,
    });
  } catch {
    return NextResponse.json({ isCorrect: false, feedback: FEEDBACK.en.incorrect, fallback: true });
  }
}
