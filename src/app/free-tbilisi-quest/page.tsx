"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Zap, Trophy, MessageCircle, ChevronLeft, Lightbulb, Loader2 } from "lucide-react";
import { MotionPage } from "@/components/motion";
import { completeMission, getQuestProgress } from "@/lib/questProgress";
import { getBadgeForTour } from "@/data/rewards";
import RewardBadge from "@/components/quest/RewardBadge";
import XPProgress from "@/components/quest/XPProgress";

const TOUR_SLUG = "key-of-tbilisi";

const FREE_MISSIONS = [
  {
    id: "ktb-1",
    title: "Freedom Square Signal",
    location: "Freedom Square, Tbilisi",
    description:
      "Stand at Freedom Square and look up at the Saint George statue atop the golden column. This square has witnessed Georgia's independence celebrations and peaceful revolutions. What colour is the flag flying above the City Hall?",
    points: 50,
    type: "observation",
    hint: "The flag is simpler than you expect. Look for the five-cross symbol — it has been Georgia's symbol for over a thousand years.",
  },
  {
    id: "ktb-2",
    title: "Old City Whisper",
    location: "Narikala District, Old Tbilisi",
    description:
      "Walk into the old city below Narikala Fortress. Find the famous carved balconies — wooden lattice structures hanging over the narrow streets. Count how many buildings on one block have these traditional balconies.",
    points: 75,
    type: "observation",
    hint: "The balconies face the street so residents could watch daily life below. Look for the dark carved wood — it's still the original style used for 300 years.",
  },
  {
    id: "ktb-3",
    title: "Bridge of Tomorrow",
    location: "Peace Bridge, Tbilisi",
    description:
      "Cross the Peace Bridge — a glass-and-steel structure built in 2010. From the midpoint, look north: you can see both Narikala Fortress and Metekhi Church from the same spot. What river flows beneath you?",
    points: 75,
    type: "observation",
    hint: "The Georgians call it Mtkvari. You may know it by another name — look for clues in the old city's history or the name of a nearby museum.",
  },
] as const;

const TOTAL_XP = FREE_MISSIONS.reduce((s, m) => s + m.points, 0);

const STATIC_HINTS: Record<string, string> = {
  "ktb-1": FREE_MISSIONS[0].hint,
  "ktb-2": FREE_MISSIONS[1].hint,
  "ktb-3": FREE_MISSIONS[2].hint,
};

export default function FreeTbilisiQuestPage() {
  const badge = getBadgeForTour(TOUR_SLUG);

  const [progress, setProgress] = useState(() => {
    if (typeof window === "undefined") return { completedMissions: [] as string[], xp: 0 };
    return getQuestProgress(TOUR_SLUG);
  });
  const [hints, setHints] = useState<Record<string, string>>({});
  const [hintLoading, setHintLoading] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const allDone = progress.completedMissions.length === FREE_MISSIONS.length;

  function handleComplete(missionId: string) {
    if (completingId) return;
    const mission = FREE_MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;
    setCompletingId(missionId);
    const updated = completeMission(TOUR_SLUG, missionId, mission.points);
    setProgress(updated);
    setCompletingId(null);
  }

  async function fetchHint(missionId: string, mission: typeof FREE_MISSIONS[number]) {
    if (hints[missionId] || hintLoading === missionId) return;
    setHintLoading(missionId);
    try {
      const res = await fetch("/api/ai/quest-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug: TOUR_SLUG,
          missionId,
          missionTitle: mission.title,
          missionDescription: mission.description,
          location: mission.location,
        }),
      });
      const data = await res.json() as { hint?: string };
      setHints((prev) => ({ ...prev, [missionId]: data.hint ?? STATIC_HINTS[missionId] }));
    } catch {
      setHints((prev) => ({ ...prev, [missionId]: STATIC_HINTS[missionId] }));
    } finally {
      setHintLoading(null);
    }
  }

  const kakhetiWa = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "995555443787"}?text=${encodeURIComponent("Hi Levani! I just completed the free Tbilisi quest and want to book the Kakheti Wine Legends tour. Can you tell me more?")}`;
  const kazbegiWa = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "995555443787"}?text=${encodeURIComponent("Hi Levani! I just completed the free Tbilisi quest and want to book the Kazbegi Mountain Quest. Can you tell me more?")}`;

  return (
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
      <MotionPage className="px-4 py-5 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/tours"
            className="w-8 h-8 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-white"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <div
              className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-0.5"
              style={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }}
            >
              FREE QUEST
            </div>
            <h1 className="font-serif text-lg text-white font-semibold">Key of Tbilisi</h1>
          </div>
        </div>

        {/* Intro card */}
        <div
          className="rounded-2xl border p-4 space-y-2"
          style={{ backgroundColor: "#1A1408", borderColor: "rgba(200,155,60,0.2)" }}
        >
          <p className="text-sm text-white font-medium">Try Ivera for free 🗝️</p>
          <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
            Complete 3 missions around central Tbilisi, earn 200 XP, and unlock the
            <span className="text-brand-gold font-semibold"> Key of Tbilisi</span> starter badge —
            no payment, no sign-up required.
          </p>
        </div>

        {/* XP Progress */}
        <div className="bg-brand-dark rounded-2xl border border-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>{progress.completedMissions.length} / {FREE_MISSIONS.length} missions</span>
            <span className="text-brand-gold font-semibold">{progress.xp} / {TOTAL_XP} XP</span>
          </div>
          <XPProgress earned={progress.xp} total={TOTAL_XP} label="Quest XP" />
        </div>

        {/* Completion — Badge + Cross-sell */}
        {allDone && badge && (
          <div
            className="rounded-2xl border p-5 text-center space-y-4"
            style={{ backgroundColor: "rgba(200,155,60,0.06)", borderColor: "rgba(200,155,60,0.3)" }}
          >
            <Trophy size={28} className="mx-auto" style={{ color: "#C4923A" }} />
            <p className="font-semibold text-brand-gold">Quest Complete!</p>
            <RewardBadge badge={badge} earned />
            <p className="text-xs text-brand-muted">
              You earned <span className="text-brand-gold font-bold">{TOTAL_XP} XP</span> and
              unlocked the <span className="text-white font-medium">{badge.name}</span> badge.
            </p>

            <div
              className="rounded-xl p-4 text-left space-y-3"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm font-semibold text-white text-center">
                Continue your adventure 🗺️
              </p>
              <p className="text-xs text-center" style={{ color: "#7A6A52" }}>
                You&apos;ve seen what Ivera can do. Ready for a full day quest?
              </p>
              <a
                href={kakhetiWa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={14} /> Book Kakheti via WhatsApp
              </a>
              <a
                href={kazbegiWa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: "rgba(200,155,60,0.1)", color: "#C4923A" }}
              >
                <MessageCircle size={13} /> Book Kazbegi via WhatsApp
              </a>
              <div className="flex gap-2 pt-1">
                <Link
                  href="/tours/kakheti-wine-legends"
                  className="flex-1 text-center py-2 rounded-full text-[11px] font-medium"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#7A6A52" }}
                >
                  View Kakheti Tour
                </Link>
                <Link
                  href="/tours/kazbegi-mountain-quest"
                  className="flex-1 text-center py-2 rounded-full text-[11px] font-medium"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#7A6A52" }}
                >
                  View Kazbegi Tour
                </Link>
              </div>
            </div>

            <Link
              href="/profile"
              className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-brand-black"
              style={{ backgroundColor: "#C4923A" }}
            >
              View Profile
            </Link>
          </div>
        )}

        {/* Mission cards */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold tracking-widest text-brand-muted uppercase">
            3 Missions · Central Tbilisi
          </h2>
          {FREE_MISSIONS.map((mission, i) => {
            const done = progress.completedMissions.includes(mission.id);
            const hint = hints[mission.id];
            const loading = hintLoading === mission.id;
            const color = "#6E4B8A";

            return (
              <div
                key={mission.id}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${done ? "border-brand-gold/35" : "border-white/8"}`}
                style={{ backgroundColor: done ? "rgba(200,155,60,0.06)" : "#1A1408" }}
              >
                {done && (
                  <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #C4923A, #E0B85A, transparent)" }} />
                )}
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${done ? "text-brand-black" : "text-brand-muted"}`}
                      style={{ backgroundColor: done ? "#C4923A" : "rgba(255,255,255,0.06)", fontSize: "12px" }}
                    >
                      {done ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`text-sm font-semibold leading-snug ${done ? "text-brand-gold" : "text-white"}`}>
                          {mission.title}
                        </h3>
                        <span
                          className="flex-shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: done ? "rgba(200,155,60,0.2)" : "rgba(200,155,60,0.1)", color: "#C4923A" }}
                        >
                          +{mission.points} XP
                        </span>
                      </div>
                      <p className="text-[11px] mb-2 flex items-center gap-1" style={{ color: "#6A5A48" }}>
                        📍 {mission.location}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: done ? "#8A7A60" : "#7A6A52" }}>
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  {/* Hint area */}
                  {!done && hint && (
                    <div
                      className="rounded-xl px-3 py-2.5 text-xs leading-relaxed"
                      style={{ backgroundColor: "rgba(110,75,138,0.1)", border: "1px solid rgba(110,75,138,0.25)", color: "#C4B8D8" }}
                    >
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold mb-1" style={{ color: "#9B7DC8" }}>
                        <Lightbulb size={10} /> Quest Master Hint
                      </span>
                      {hint}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${color}18`, color }}
                      >
                        <Zap size={9} /> Observe
                      </span>
                      {!done && (
                        <button
                          onClick={() => fetchHint(mission.id, mission)}
                          disabled={loading || !!hint}
                          className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full"
                          style={{ backgroundColor: "rgba(110,75,138,0.12)", color: hint ? "#6A5A78" : "#9B7DC8" }}
                        >
                          {loading ? <Loader2 size={9} className="animate-spin" /> : <Lightbulb size={9} />}
                          {hint ? "Hint shown" : "Need a hint?"}
                        </button>
                      )}
                    </div>

                    {done ? (
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#4CAF50" }}>
                        <CheckCircle size={12} /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleComplete(mission.id)}
                        disabled={completingId === mission.id}
                        className="text-xs px-4 py-2 rounded-full font-semibold text-brand-black transition-all active:scale-95"
                        style={{ backgroundColor: "#C4923A" }}
                      >
                        Demo Complete ✦
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="rounded-xl bg-brand-dark border border-white/5 p-3">
          <p className="text-[11px] text-brand-muted leading-relaxed text-center">
            ✦ Free quest — no payment required. XP and badge saved to your Explorer Pass.
          </p>
        </div>

      </MotionPage>
    </div>
  );
}
