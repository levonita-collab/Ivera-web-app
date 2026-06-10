"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  FREE_MISSIONS,
  FREE_QUEST_TOTAL_XP,
  FREE_QUEST_SLUG,
  FREE_QUEST_HINTS,
} from "@/data/freeTbilisiQuest";
import {
  getFreeQuestProgress,
  completeFreeQuestMission,
  getMissionStatus,
  isFreeQuestComplete,
} from "@/lib/freeQuestProgress";
import type { MissionProgress } from "@/lib/questProgress";
import type { Badge } from "@/data/rewards";
import TbilisiMissionScene from "./TbilisiMissionScene";
import QuestProgressPath from "./QuestProgressPath";
import FreeQuestCompletion from "./FreeQuestCompletion";

interface Props {
  badge?: Badge;
  hasPass: boolean;
  onCreatePass: () => void;
}

export default function TbilisiSwipeJourney({ badge, hasPass, onCreatePass }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState<MissionProgress>(() => {
    if (typeof window === "undefined") return { completedMissions: [], xp: 0 };
    return getFreeQuestProgress();
  });
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [hints, setHints] = useState<Record<string, string>>({});
  const [hintLoading, setHintLoading] = useState<string | null>(null);

  const statuses = FREE_MISSIONS.map((_, i) => getMissionStatus(progress, i));
  const allDone = isFreeQuestComplete(progress);

  const goTo = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, FREE_MISSIONS.length - 1));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: clamped * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
  }, []);

  // Track active scene from scroll position (works with native swipe + scroll-snap)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActive((prev) => (prev === idx ? prev : idx));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function handleComplete(missionId: string, index: number) {
    if (completingId) return;
    const mission = FREE_MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;
    setCompletingId(missionId);
    const updated = completeFreeQuestMission(missionId, mission.points);
    setProgress(updated);
    setCompletingId(null);
    // Reveal the freshly unlocked next mission
    if (index < FREE_MISSIONS.length - 1) {
      setTimeout(() => goTo(index + 1), 480);
    }
  }

  async function requestHint(missionId: string) {
    if (hints[missionId] || hintLoading === missionId) return;
    const mission = FREE_MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;
    setHintLoading(missionId);
    try {
      const res = await fetch("/api/ai/quest-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug: FREE_QUEST_SLUG,
          missionId,
          missionTitle: mission.title,
          missionDescription: mission.description,
          location: mission.location,
        }),
      });
      const data = (await res.json()) as { hint?: string };
      setHints((p) => ({ ...p, [missionId]: data.hint ?? FREE_QUEST_HINTS[missionId] }));
    } catch {
      setHints((p) => ({ ...p, [missionId]: FREE_QUEST_HINTS[missionId] }));
    } finally {
      setHintLoading(null);
    }
  }

  if (allDone) {
    return (
      <div id="journey" className="scroll-mt-4">
        <FreeQuestCompletion
          badge={badge}
          totalXp={FREE_QUEST_TOTAL_XP}
          completedCount={FREE_MISSIONS.length}
          hasPass={hasPass}
          onCreatePass={onCreatePass}
        />
      </div>
    );
  }

  return (
    <div id="journey" className="scroll-mt-4 space-y-4">
      {/* Progress path doubles as dot navigation */}
      <div className="px-4">
        <QuestProgressPath
          count={FREE_MISSIONS.length}
          statuses={statuses}
          activeIndex={active}
          completedCount={progress.completedMissions.length}
          totalXp={FREE_QUEST_TOTAL_XP}
          earnedXp={progress.xp}
          onSelect={goTo}
        />
      </div>

      {/* Swipeable scene track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {FREE_MISSIONS.map((mission, i) => (
          <TbilisiMissionScene
            key={mission.id}
            mission={mission}
            status={statuses[i]}
            isActive={active === i}
            completing={completingId === mission.id}
            hint={hints[mission.id]}
            hintLoading={hintLoading === mission.id}
            onComplete={() => handleComplete(mission.id, i)}
            onRequestHint={() => requestHint(mission.id)}
          />
        ))}
      </div>

      {/* Prev / next controls (accessible alternative to swipe) */}
      <div className="flex items-center justify-between px-5">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Previous mission"
          className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30 active:scale-95"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff" }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Mission scenes">
          {FREE_MISSIONS.map((m, i) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Mission ${i + 1}`}
              onClick={() => goTo(i)}
              className="rounded-full transition-all"
              style={{
                width: active === i ? 22 : 8,
                height: 8,
                backgroundColor: active === i ? "#C89B3C" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === FREE_MISSIONS.length - 1}
          aria-label="Next mission"
          className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30 active:scale-95"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
