import { NextResponse } from "next/server";
import { callGemini } from "@/lib/ai/gemini";
import { tourRecommendationPrompt } from "@/lib/ai/prompts";
import { logAiInteraction } from "@/lib/ai/logging";

export const runtime = "nodejs";

export interface TourRec {
  slug: string;
  reason: string;
}

// Deterministic fallback rules
function getLocalRecommendations(completedSlugs: string[]): TourRec[] {
  if (completedSlugs.includes("kakheti-wine-legends")) {
    return [
      { slug: "kazbegi-mountain-quest", reason: "After Georgia's wine heartland, challenge yourself with dramatic Caucasus mountain scenery." },
      { slug: "mtskheta-sacred-route", reason: "Explore the ancient capital where Georgian Christianity was born." },
    ];
  }
  if (completedSlugs.includes("key-of-tbilisi") || completedSlugs.includes("tbilisi-city-quest")) {
    return [
      { slug: "kakheti-wine-legends", reason: "Discover 8,000 years of wine tradition in Georgia's most beautiful valley." },
      { slug: "kazbegi-mountain-quest", reason: "Trade city streets for the most dramatic mountain landscape in the Caucasus." },
    ];
  }
  if (completedSlugs.includes("kazbegi-mountain-quest")) {
    return [
      { slug: "kakheti-wine-legends", reason: "After conquering the mountains, relax with world-class amber wine in Kakheti." },
      { slug: "vardzia-cave-kingdom", reason: "Uncover the medieval cave city carved into a cliff 900 years ago." },
    ];
  }
  // No completed quests — funnel into free quest or Kakheti
  return [
    { slug: "key-of-tbilisi", reason: "Start your Georgia adventure with this free 3-mission quest through central Tbilisi." },
    { slug: "kakheti-wine-legends", reason: "Experience Georgia's legendary wine culture and sacred history in one unforgettable day." },
  ];
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      completedSlugs?: string[];
      available?: { slug: string; title: string; shortDescription: string }[];
      explorerName?: string;
      explorerId?: string;
    };

    const {
      completedSlugs = [],
      available = [],
      explorerName,
      explorerId,
    } = body;

    const localRecs = getLocalRecommendations(completedSlugs);

    // Only call AI if key exists and we have tour data
    if (!process.env.GEMINI_API_KEY || !available.length) {
      return NextResponse.json({ recommendations: localRecs, fallback: true });
    }

    const prompt = tourRecommendationPrompt({ completedSlugs, available, explorerName });
    const result = await callGemini(prompt, "", 150);

    if (result.fallback || !result.text) {
      return NextResponse.json({ recommendations: localRecs, fallback: true });
    }

    // Parse the JSON array from Gemini
    const jsonMatch = result.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ recommendations: localRecs, fallback: true });
    }

    const recs: TourRec[] = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(recs) || recs.length === 0) {
      return NextResponse.json({ recommendations: localRecs, fallback: true });
    }

    logAiInteraction({
      explorerId: explorerId ?? null,
      interactionType: "recommendation",
      tourSlug: null,
      missionId: null,
      inputSummary: `completed: ${completedSlugs.join(",")}`,
      outputSummary: recs.map((r) => r.slug).join(","),
    }).catch(() => {});

    return NextResponse.json({ recommendations: recs.slice(0, 2), fallback: false });
  } catch {
    return NextResponse.json({
      recommendations: getLocalRecommendations([]),
      fallback: true,
    });
  }
}
