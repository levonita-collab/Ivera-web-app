"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Trophy, MessageCircle, Scroll, Loader2, Share2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MotionPage } from "@/components/motion";
import { containerVariants, itemVariants, scaleUp } from "@/lib/motion";
import { Tour } from "@/data/tours";
import { getMissionsForTour } from "@/data/missions";
import { getBadgeForTour } from "@/data/rewards";
import {
  getQuestProgress,
  completeMission,
  getProfile,
  getTotalXP,
  getCompletedTourSlugs,
  MissionProgress,
} from "@/lib/questProgress";
import { syncMissionCompletion } from "@/lib/supabase/questService";
import { buildFeedbackLink } from "@/lib/whatsapp";
import MissionCard from "@/components/quest/MissionCard";
import XPProgress from "@/components/quest/XPProgress";
import RewardBadge from "@/components/quest/RewardBadge";

interface Props {
  tour: Tour;
}

export default function QuestClient({ tour }: Props) {
  const missions = getMissionsForTour(tour.slug);
  const totalXP = missions.reduce((s, m) => s + m.points, 0);
  const badge = getBadgeForTour(tour.slug);

  const reduced = useReducedMotion();
  const [progress, setProgress] = useState<MissionProgress>(() => {
    if (typeof window === "undefined") return { completedMissions: [], xp: 0 };
    return getQuestProgress(tour.slug);
  });
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [chronicle, setChronicle] = useState<string | null>(null);
  const [chronicleLoading, setChronicleLoading] = useState(false);

  async function generateChronicle() {
    if (chronicleLoading || chronicle) return;
    setChronicleLoading(true);
    const profile = typeof window !== "undefined" ? getProfile() : null;
    try {
      const res = await fetch("/api/ai/hero-chronicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          explorerName: profile?.name ?? "Explorer",
          tourSlug: tour.slug,
          tourTitle: tour.title,
          missions: missions.map((m) => ({ title: m.title, location: m.location })),
          totalXP: progress.xp,
          badgeName: badge?.name ?? "Quest Badge",
          explorerId: profile?.supabaseId ?? null,
        }),
      });
      const data = await res.json() as { chronicle?: string };
      setChronicle(data.chronicle ?? "Your adventure has been recorded in the Ivera chronicles.");
    } catch {
      setChronicle("Your adventure has been recorded in the Ivera chronicles.");
    } finally {
      setChronicleLoading(false);
    }
  }

  function shareChronicle() {
    if (!chronicle) return;
    const profile = typeof window !== "undefined" ? getProfile() : null;
    const text = encodeURIComponent(
      `🏺 My ${tour.title} chronicle:\n\n${chronicle}\n\n— via Ivera Travel Quests`
    );
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "995555443787";
    window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank", "noopener,noreferrer");
    void profile;
  }

  function handleComplete(missionId: string) {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || completingId) return;
    setCompletingId(missionId);
    const updated = completeMission(tour.slug, missionId, mission.points);
    setProgress(updated);
    setCompletingId(null);
    // Background sync — does not block UI
    const profile = typeof window !== "undefined" ? getProfile() : null;
    if (profile?.supabaseId) {
      syncMissionCompletion({
        explorerId: profile.supabaseId,
        explorerName: profile.name,
        tourSlug: tour.slug,
        missionId,
        pointsEarned: mission.points,
        totalXp: getTotalXP(),
        completedQuests: getCompletedTourSlugs().length,
      }).catch(() => {});
    }
  }

  const allDone = progress.completedMissions.length === missions.length;

  return (
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
    <MotionPage className="px-4 py-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/tours/${tour.slug}`}
          className="w-8 h-8 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-white"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <p className="text-[10px] tracking-widest text-brand-muted uppercase">
            Active Quest
          </p>
          <h1 className="font-serif text-lg text-white font-semibold leading-snug">
            {tour.title}
          </h1>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-brand-dark rounded-2xl border border-white/5 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-brand-muted">
          <span>
            {progress.completedMissions.length} / {missions.length} missions
          </span>
          <span className="text-brand-gold font-semibold">
            {tour.questTheme}
          </span>
        </div>
        <XPProgress earned={progress.xp} total={totalXP} label="Quest XP" />
      </div>

      {/* All complete — badge + feedback */}
      {allDone && badge && (() => {
        const profile = typeof window !== "undefined" ? getProfile() : null;
        const feedbackLink = buildFeedbackLink(
          tour.title,
          profile?.name ?? "Explorer",
          progress.xp
        );
        return (
          <motion.div
            className="rounded-2xl bg-brand-gold/10 border border-brand-gold/30 p-5 text-center space-y-3"
            variants={scaleUp}
            initial={reduced ? false : "hidden"}
            animate="show"
          >
            <Trophy size={28} className="mx-auto" style={{ color: "#C4923A" }} />
            <p className="text-brand-gold font-semibold">Quest Complete!</p>
            <RewardBadge badge={badge} earned />
            <p className="text-xs text-brand-muted">
              You earned{" "}
              <span className="text-brand-gold font-bold">{progress.xp} XP</span>{" "}
              and unlocked the{" "}
              <span className="text-white font-medium">{badge.name}</span> badge.
            </p>
            <Link
              href="/profile"
              className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-brand-black"
              style={{ backgroundColor: "#C4923A" }}
            >
              View Profile
            </Link>
            {/* Hero Chronicle */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              {!chronicle ? (
                <button
                  onClick={generateChronicle}
                  disabled={chronicleLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "rgba(110,75,138,0.15)", color: "#C4B8D8" }}
                >
                  {chronicleLoading ? (
                    <><Loader2 size={12} className="animate-spin" /> Writing your chronicle…</>
                  ) : (
                    <><Scroll size={12} /> Generate My Hero Chronicle</>
                  )}
                </button>
              ) : (
                <div
                  className="rounded-xl px-4 py-3 space-y-2 text-left"
                  style={{ backgroundColor: "rgba(110,75,138,0.1)", border: "1px solid rgba(110,75,138,0.2)" }}
                >
                  <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#9B7DC8" }}>
                    ✦ Your Hero Chronicle
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#C4B8D8" }}>
                    {chronicle}
                  </p>
                  <button
                    onClick={shareChronicle}
                    className="flex items-center gap-1.5 text-[11px] font-semibold"
                    style={{ color: "#25D366" }}
                  >
                    <Share2 size={11} /> Send Chronicle via WhatsApp
                  </button>
                </div>
              )}

              <p className="text-[11px] text-brand-muted">
                How was your experience? Share feedback with Levani.
              </p>
              <a
                href={feedbackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={13} /> Send Feedback via WhatsApp
              </a>
            </div>
          </motion.div>
        );
      })()}

      {/* Mission cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-widest text-brand-muted uppercase">
          Active Missions
        </h2>
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial={reduced ? false : "hidden"}
          animate="show"
        >
          {missions.map((mission, i) => {
            const profile = typeof window !== "undefined" ? getProfile() : null;
            return (
              <motion.div key={mission.id} variants={itemVariants}>
                <MissionCard
                  mission={mission}
                  completed={progress.completedMissions.includes(mission.id)}
                  onComplete={handleComplete}
                  index={i}
                  completing={completingId === mission.id}
                  tourSlug={tour.slug}
                  explorerId={profile?.supabaseId}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Demo note */}
      <div className="rounded-xl bg-brand-dark border border-white/5 p-3">
        <p className="text-[11px] text-brand-muted leading-relaxed text-center">
          ✦ Tap <span className="text-brand-gold font-medium">Demo Scan</span> to simulate completing a mission.
          In the field, you scan the real QR codes posted at each location.
        </p>
      </div>

      {/* Continue CTA */}
      {!allDone && (
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${tour.gradientFrom}, ${tour.gradientTo})`,
          }}
        >
          <div>
            <p className="text-white font-semibold text-sm">Continue Quest ✦</p>
            <p className="text-white/60 text-xs">
              {missions.length - progress.completedMissions.length} missions remaining
            </p>
          </div>
          <span className="text-2xl">🗺️</span>
        </div>
      )}
    </MotionPage>
    </div>
  );
}
