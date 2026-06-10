// Free "Key of Tbilisi" starter quest — content & scene definitions.
// Progress/XP/badge logic lives in the shared questProgress + rewards modules;
// this file only describes the 3 missions and their cinematic scene styling.

export const FREE_QUEST_SLUG = "key-of-tbilisi";

export interface FreeMissionScene {
  /** Distinct atmospheric gradient for this location moment */
  background: string;
  /** Radial accent glow layered over the scene */
  glow: string;
  /** Accent colour used for the scene's chrome */
  accent: string;
}

export interface FreeMission {
  id: string;
  /** 1-based mission number shown to the user */
  n: number;
  title: string;
  location: string;
  /** Short, evocative teaser line */
  teaser: string;
  /** Longer prompt — also used as context for the Gemini hint */
  description: string;
  /** Static fallback hint when AI is unavailable */
  hint: string;
  points: number;
  mapsUrl: string;
  scene: FreeMissionScene;
}

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const FREE_MISSIONS: FreeMission[] = [
  {
    id: "ktb-1",
    n: 1,
    title: "Freedom Square Signal",
    location: "Freedom Square",
    teaser: "Begin where the city gathers. Find the signal of Tbilisi's first clue.",
    description:
      "Stand at Freedom Square and look up at the Saint George statue atop the golden column. This square has witnessed Georgia's independence celebrations and peaceful revolutions. What colour is the flag flying above the City Hall?",
    hint: "The flag is simpler than you expect. Look for the five-cross symbol — it has been Georgia's symbol for over a thousand years.",
    points: 50,
    mapsUrl: mapsLink("Freedom Square Tbilisi"),
    scene: {
      background:
        "linear-gradient(165deg, #2A1C0B 0%, #43290E 46%, #1A1207 100%)",
      glow: "radial-gradient(ellipse at 76% 14%, rgba(224,184,90,0.42) 0%, transparent 58%)",
      accent: "#E0B85A",
    },
  },
  {
    id: "ktb-2",
    n: 2,
    title: "Old City Whisper",
    location: "Old Tbilisi",
    teaser: "Follow the old streets, balconies and warm stone. The city speaks quietly here.",
    description:
      "Walk into the old city around Abanotubani and below Narikala Fortress. Find the famous carved balconies — wooden lattice structures hanging over the narrow streets. Count how many buildings on one block have these traditional balconies.",
    hint: "The balconies face the street so residents could watch daily life below. Look for the dark carved wood — it's still the original style used for 300 years.",
    points: 75,
    mapsUrl: mapsLink("Old Tbilisi Abanotubani"),
    scene: {
      background:
        "linear-gradient(165deg, #2A0F16 0%, #4A1A24 44%, #1C0B10 100%)",
      glow: "radial-gradient(ellipse at 24% 18%, rgba(176,74,96,0.4) 0%, transparent 58%)",
      accent: "#D98A9C",
    },
  },
  {
    id: "ktb-3",
    n: 3,
    title: "Bridge of Tomorrow",
    location: "Bridge of Peace",
    teaser: "Cross from old stories into the modern glow of Tbilisi.",
    description:
      "Cross the Bridge of Peace — a glass-and-steel structure built in 2010. From the midpoint, look north: you can see both Narikala Fortress and Metekhi Church from the same spot. What river flows beneath you?",
    hint: "The Georgians call it Mtkvari. You may know it by another name — look for clues in the old city's history or the name of a nearby museum.",
    points: 75,
    mapsUrl: mapsLink("Bridge of Peace Tbilisi"),
    scene: {
      background:
        "linear-gradient(165deg, #0B1F26 0%, #123642 46%, #0A1318 100%)",
      glow: "radial-gradient(ellipse at 70% 16%, rgba(96,196,210,0.34) 0%, transparent 58%)",
      accent: "#7FD3DF",
    },
  },
];

export const FREE_QUEST_TOTAL_XP = FREE_MISSIONS.reduce((s, m) => s + m.points, 0);

export const FREE_QUEST_HINTS: Record<string, string> = Object.fromEntries(
  FREE_MISSIONS.map((m) => [m.id, m.hint])
);
