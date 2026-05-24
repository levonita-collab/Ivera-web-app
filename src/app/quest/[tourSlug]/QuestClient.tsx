"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";
import { Tour } from "@/data/tours";
import { getMissionsForTour } from "@/data/missions";
import { getBadgeForTour } from "@/data/rewards";
import {
  getQuestProgress,
  completeMission,
  MissionProgress,
} from "@/lib/questProgress";
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

  const [progress, setProgress] = useState<MissionProgress>(() => {
    if (typeof window === "undefined") return { completedMissions: [], xp: 0 };
    return getQuestProgress(tour.slug);
  });

  function handleComplete(missionId: string) {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;
    const updated = completeMission(tour.slug, missionId, mission.points);
    setProgress(updated);
  }

  const allDone = progress.completedMissions.length === missions.length;

  return (
    <div className="px-4 py-5 space-y-5">
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

      {/* All complete — badge */}
      {allDone && badge && (
        <div className="rounded-2xl bg-brand-gold/10 border border-brand-gold/30 p-5 text-center space-y-3">
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
        </div>
      )}

      {/* Mission cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-widest text-brand-muted uppercase">
          Active Missions
        </h2>
        {missions.map((mission, i) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            completed={progress.completedMissions.includes(mission.id)}
            onComplete={handleComplete}
            index={i}
          />
        ))}
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
    </div>
  );
}
