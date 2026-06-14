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
import { useTranslation, formatMissionsProgress, formatMissionsRemaining } from "@/lib/i18n/dictionary";
import { getLocalizedTour, getLocalizedMission, getLocalizedBadge } from "@/lib/i18n/localize";

interface Props {
  tour: Tour;
}

export default function QuestClient({ tour: rawTour }: Props) {
  const { t, language } = useTranslation();
  const tour = getLocalizedTour(rawTour, language);
  const missions = getMissionsForTour(tour.slug).map((m) => getLocalizedMission(m, language));
  const totalXP = missions.reduce((s, m) => s + m.points, 0);
  const rawBadge = getBadgeForTour(rawTour.slug);
  const badge = rawBadge ? getLocalizedBadge(rawBadge, language) : undefined;

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
          explorerName: profile?.name ?? t("profile.explorerFallback"),
          tourSlug: tour.slug,
          tourTitle: tour.title,
          missions: missions.map((m) => ({ title: m.title, location: m.location })),
          totalXP: progress.xp,
          badgeName: badge?.name ?? "Quest Badge",
          explorerId: profile?.supabaseId ?? null,
        }),
      });
      const data = await res.json() as { chronicle?: string };
      setChronicle(data.chronicle ?? t("quest.chronicleFallback"));
    } catch {
      setChronicle(t("quest.chronicleFallback"));
    } finally {
      setChronicleLoading(false);
    }
  }

  function shareChronicle() {
    if (!chronicle) return;
    const profile = typeof window !== "undefined" ? getProfile() : null;
    const title = t("quest.chronicleShareTitle").replace("{tour}", tour.title);
    const text = encodeURIComponent(
      `🏺 ${title}\n\n${chronicle}\n\n${t("quest.chronicleShareFooter")}`
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
            {t("quest.activeQuest")}
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
            {formatMissionsProgress(progress.completedMissions.length, missions.length, language)}
          </span>
          <span className="text-brand-gold font-semibold">
            {tour.questTheme}
          </span>
        </div>
        <XPProgress earned={progress.xp} total={totalXP} label={t("quest.questXp")} />
      </div>

      {/* All complete — badge + feedback */}
      {allDone && badge && (() => {
        const profile = typeof window !== "undefined" ? getProfile() : null;
        const feedbackLink = buildFeedbackLink(
          tour.title,
          profile?.name ?? t("profile.explorerFallback"),
          progress.xp,
          language
        );
        return (
          <motion.div
            className="rounded-2xl bg-brand-gold/10 border border-brand-gold/30 p-5 text-center space-y-3"
            variants={scaleUp}
            initial={reduced ? false : "hidden"}
            animate="show"
          >
            <Trophy size={28} className="mx-auto" style={{ color: "#C4923A" }} />
            <p className="text-brand-gold font-semibold">{t("quest.questComplete")}</p>
            <RewardBadge badge={badge} earned />
            <p className="text-xs text-brand-muted">
              {t("quest.youEarned")}{" "}
              <span className="text-brand-gold font-bold">{progress.xp} XP</span>{" "}
              {t("quest.unlockedThe")}{" "}
              <span className="text-white font-medium">{badge.name}</span>{t("quest.badgeSuffix")}
            </p>
            <Link
              href="/profile"
              className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-brand-black"
              style={{ backgroundColor: "#C4923A" }}
            >
              {t("quest.viewProfile")}
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
                    <><Loader2 size={12} className="animate-spin" /> {t("quest.writingChronicle")}</>
                  ) : (
                    <><Scroll size={12} /> {t("quest.generateChronicle")}</>
                  )}
                </button>
              ) : (
                <div
                  className="rounded-xl px-4 py-3 space-y-2 text-left"
                  style={{ backgroundColor: "rgba(110,75,138,0.1)", border: "1px solid rgba(110,75,138,0.2)" }}
                >
                  <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#9B7DC8" }}>
                    {t("quest.yourHeroChronicle")}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#C4B8D8" }}>
                    {chronicle}
                  </p>
                  <button
                    onClick={shareChronicle}
                    className="flex items-center gap-1.5 text-[11px] font-semibold"
                    style={{ color: "#25D366" }}
                  >
                    <Share2 size={11} /> {t("quest.sendChronicleWhatsapp")}
                  </button>
                </div>
              )}

              <p className="text-[11px] text-brand-muted">
                {t("quest.howWasExperience")}
              </p>
              <a
                href={feedbackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={13} /> {t("quest.sendFeedbackWhatsapp")}
              </a>
            </div>
          </motion.div>
        );
      })()}

      {/* Mission cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-widest text-brand-muted uppercase">
          {t("quest.activeMissions")}
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
          {t("quest.demoNotePrefix")} <span className="text-brand-gold font-medium">{t("quest.demoScan")}</span>{" "}
          {t("quest.demoNoteSuffix")}
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
            <p className="text-white font-semibold text-sm">{t("quest.continueQuest")}</p>
            <p className="text-white/60 text-xs">
              {formatMissionsRemaining(missions.length - progress.completedMissions.length, language)}
            </p>
          </div>
          <span className="text-2xl">🗺️</span>
        </div>
      )}
    </MotionPage>
    </div>
  );
}
