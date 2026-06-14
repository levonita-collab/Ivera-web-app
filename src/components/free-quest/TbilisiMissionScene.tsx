"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Lock,
  Check,
  Lightbulb,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { FreeMission } from "@/data/freeTbilisiQuest";
import type { MissionStatus } from "@/lib/freeQuestProgress";
import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  mission: FreeMission;
  status: MissionStatus;
  isActive: boolean;
  completing: boolean;
  hint?: string;
  hintLoading: boolean;
  onComplete: () => void;
  onRequestHint: () => void;
}

export default function TbilisiMissionScene({
  mission,
  status,
  isActive,
  completing,
  hint,
  hintLoading,
  onComplete,
  onRequestHint,
}: Props) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const locked = status === "locked";
  const completed = status === "completed";
  const accent = mission.scene.accent;

  return (
    <div className="w-full flex-shrink-0 snap-center px-4">
      <div
        className="relative rounded-[26px] overflow-hidden flex flex-col transition-opacity duration-300"
        style={{
          minHeight: 468,
          border: `1px solid ${completed ? "rgba(200,155,60,0.4)" : "rgba(255,255,255,0.1)"}`,
          opacity: locked ? 0.68 : 1,
        }}
      >
        {/* ── Layered scene background ── */}
        <div className="absolute inset-0" style={{ background: mission.scene.background }} />
        {/* City texture (subtle, single cached image — graceful, no broken paths) */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={
            reduced
              ? { scale: 1 }
              : { scale: isActive ? 1.06 : 1.12, opacity: isActive ? 0.26 : 0.16 }
          }
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <Image
            src="/images/tours/tbilisi-city-quest.jpg"
            alt=""
            fill
            aria-hidden
            className="object-cover object-center mix-blend-luminosity"
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </motion.div>
        {/* Accent glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: mission.scene.glow }}
          initial={false}
          animate={reduced ? { opacity: 1 } : { opacity: isActive ? 1 : 0.6 }}
          transition={{ duration: 0.8 }}
        />
        {/* Bottom legibility veil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(8,6,3,0.78) 100%)" }}
        />

        {/* Completed stamp */}
        {completed && (
          <motion.div
            className="absolute top-4 right-4 z-20 flex flex-col items-center justify-center rounded-full"
            initial={reduced ? false : { scale: 0, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: -12, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            style={{
              width: 76,
              height: 76,
              border: "2px solid rgba(224,184,90,0.8)",
              backgroundColor: "rgba(200,155,60,0.16)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Check size={18} strokeWidth={3} style={{ color: "#E0B85A" }} />
            <span className="text-[9px] font-bold tracking-widest mt-0.5" style={{ color: "#E0B85A" }}>
              {t("freeQuest.doneStamp")}
            </span>
            <span className="text-[10px] font-bold" style={{ color: "#E0B85A" }}>
              +{mission.points}
            </span>
          </motion.div>
        )}

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col flex-1 p-5">
          {/* Top: number + location */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
              style={{
                backgroundColor: locked ? "rgba(255,255,255,0.1)" : accent,
                color: locked ? "rgba(255,255,255,0.55)" : "#0F0C07",
                boxShadow: !locked && !completed ? `0 0 14px ${accent}88` : "none",
              }}
            >
              {locked ? <Lock size={14} /> : completed ? <Check size={16} strokeWidth={3} /> : mission.n}
            </div>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.32)", color: "rgba(255,255,255,0.85)" }}
            >
              <MapPin size={10} /> {mission.location}
            </span>
            <span
              className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.32)", color: accent }}
            >
              +{mission.points} XP
            </span>
          </div>

          {/* Spacer pushes title/actions to lower third for cinematic feel */}
          <div className="flex-1 min-h-[40px]" />

          {/* Title block */}
          <h2
            className="font-serif font-bold text-white leading-[1.05]"
            style={{ fontSize: "clamp(1.9rem, 8vw, 2.4rem)" }}
          >
            {mission.title}
          </h2>
          <p
            className="mt-2 text-[14px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            {mission.teaser}
          </p>

          {/* Active mission: the actual clue */}
          {!locked && !completed && (
            <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>
              {mission.description}
            </p>
          )}

          {/* Locked note */}
          {locked && (
            <p className="mt-3 text-[12px] italic flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              <Lock size={11} /> {t("freeQuest.unlocksAfterMission").replace("{n}", String(mission.n - 1))}
            </p>
          )}

          {/* AI hint (Gemini) */}
          {!locked && !completed && hint && (
            <div
              className="mt-3 rounded-xl px-3 py-2.5 text-[12px] leading-relaxed"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(4px)",
              }}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-semibold mb-1" style={{ color: accent }}>
                <Sparkles size={10} /> {t("freeQuest.questMasterHint")}
              </span>
              {hint}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 space-y-2">
            <a
              href={mission.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full text-[12px] font-semibold"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
              }}
            >
              <MapPin size={12} /> {t("freeQuest.openInGoogleMaps")}
            </a>

            {completed ? (
              <div
                className="flex items-center justify-center gap-1.5 w-full py-3 rounded-full text-sm font-semibold"
                style={{ backgroundColor: "rgba(200,155,60,0.16)", color: "#E0B85A" }}
              >
                <Check size={15} strokeWidth={3} /> {t("freeQuest.missionCompleteLabel")}
              </div>
            ) : locked ? (
              <div
                className="flex items-center justify-center gap-1.5 w-full py-3 rounded-full text-sm font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
              >
                <Lock size={13} /> {t("freeQuest.lockedLabel")}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onRequestHint}
                  disabled={hintLoading || !!hint}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-[12px] font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: hint ? "rgba(255,255,255,0.5)" : "#fff",
                    border: "1px solid rgba(255,255,255,0.16)",
                  }}
                  aria-label={t("freeQuest.getHintAriaLabel")}
                >
                  {hintLoading ? <Loader2 size={13} className="animate-spin" /> : <Lightbulb size={13} />}
                  {t("freeQuest.hintLabel")}
                </button>
                <button
                  type="button"
                  onClick={onComplete}
                  disabled={completing}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full text-sm font-bold transition-transform active:scale-[0.97]"
                  style={{ backgroundColor: accent, color: "#0F0C07", boxShadow: `0 6px 22px ${accent}55` }}
                >
                  {completing ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <>{t("freeQuest.completeMission")} <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
