"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import type { MissionStatus } from "@/lib/freeQuestProgress";

interface Props {
  count: number;
  statuses: MissionStatus[];
  activeIndex: number;
  completedCount: number;
  totalXp: number;
  earnedXp: number;
  onSelect: (index: number) => void;
}

export default function QuestProgressPath({
  count,
  statuses,
  activeIndex,
  completedCount,
  totalXp,
  earnedXp,
  onSelect,
}: Props) {
  const reduced = useReducedMotion();
  // Fill the glowing route up to the last completed dot.
  const fillPct = count > 1 ? (completedCount / (count - 1)) * 100 : 0;

  return (
    <div className="px-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: "#8A7A60" }}>
          Mission {Math.min(activeIndex + 1, count)} / {count}
        </span>
        <span className="text-[11px] font-semibold" style={{ color: "#C89B3C" }}>
          {earnedXp} / {totalXp} XP
        </span>
      </div>

      <div className="relative flex items-center justify-between" style={{ height: 36 }}>
        {/* Base route line */}
        <div
          className="absolute left-3 right-3 top-1/2 -translate-y-1/2 rounded-full"
          style={{ height: 2, backgroundColor: "rgba(255,255,255,0.12)" }}
        />
        {/* Glowing progress fill */}
        <motion.div
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
          style={{
            height: 2,
            maxWidth: "calc(100% - 24px)",
            background: "linear-gradient(90deg, #C89B3C, #E0B85A)",
            boxShadow: "0 0 8px rgba(224,184,90,0.6)",
          }}
          initial={{ width: reduced ? `${fillPct}%` : "0%" }}
          animate={{ width: `${fillPct}%` }}
          transition={{ duration: reduced ? 0 : 0.7, ease: "easeOut" }}
        />

        {statuses.map((status, i) => {
          const isActive = i === activeIndex;
          const completed = status === "completed";
          const locked = status === "locked";
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Go to mission ${i + 1}${locked ? " (locked)" : completed ? " (completed)" : ""}`}
              className="relative z-10 flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{
                width: isActive ? 30 : 24,
                height: isActive ? 30 : 24,
                backgroundColor: completed ? "#C89B3C" : locked ? "rgba(255,255,255,0.08)" : "#1A1408",
                border: `2px solid ${
                  completed ? "#E0B85A" : isActive ? "#C89B3C" : "rgba(255,255,255,0.18)"
                }`,
                boxShadow: isActive && !locked ? "0 0 12px rgba(200,155,60,0.5)" : "none",
                color: completed ? "#0F0C07" : locked ? "rgba(255,255,255,0.4)" : "#C89B3C",
              }}
            >
              {completed ? (
                <Check size={14} strokeWidth={3} />
              ) : locked ? (
                <Lock size={11} />
              ) : (
                <span className="text-[11px] font-bold">{i + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
