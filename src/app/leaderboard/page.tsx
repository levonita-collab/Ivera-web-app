"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Crown, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MotionPage, AnimatedCounter } from "@/components/motion";
import { containerVariants, itemVariants } from "@/lib/motion";
import { getTotalXP, getProfile } from "@/lib/questProgress";
import { getLevelForXP } from "@/data/rewards";
import DailyQuestChallenge from "@/components/marketing/DailyQuestChallenge";
import { useTranslation } from "@/lib/i18n/dictionary";
import { getLocalizedLevel } from "@/lib/i18n/localize";

interface Player {
  name: string;
  xp: number;
  isYou?: boolean;
}

const DEMO_PLAYERS: Player[] = [
  { name: "Nino G.", xp: 4580 },
  { name: "Luka T.", xp: 3920 },
  { name: "Mariam K.", xp: 3250 },
  { name: "Giorgi P.", xp: 2910 },
  { name: "Ana B.", xp: 2120 },
  { name: "David R.", xp: 1980 },
  { name: "Elene S.", xp: 1760 },
];

function readUserXP(): number {
  if (typeof window === "undefined") return 0;
  return getTotalXP();
}
function readUserName(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return getProfile()?.name ?? fallback;
}

export default function LeaderboardPage() {
  const { t, language } = useTranslation();
  const [userXP] = useState(readUserXP);
  const [userName] = useState(() => readUserName(t("leaderboard.youFallback")));

  const players = useMemo<Player[]>(() => {
    if (userXP > 0) {
      return [...DEMO_PLAYERS, { name: userName, xp: userXP, isYou: true }].sort(
        (a, b) => b.xp - a.xp
      );
    }
    return DEMO_PLAYERS;
  }, [userXP, userName]);

  const reduced = useReducedMotion();
  const top3 = players.slice(0, 3);
  const rest = players.slice(3);
  const maxXp = Math.max(...players.map((p) => p.xp), 1);

  return (
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
    <MotionPage className="px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} style={{ color: "#C4923A" }} />
          <h1 className="font-serif text-2xl text-white font-bold">{t("leaderboard.title")}</h1>
        </div>
        <p className="text-[11px]" style={{ color: "#5A4A38" }}>
          {t("leaderboard.demoNote")}
        </p>
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-3 pt-2">
        {/* 2nd place */}
        {top3[1] && (
          <motion.div
            className="flex flex-col items-center gap-2 flex-1"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/25 flex items-center justify-center text-lg font-bold text-white"
              style={{ background: "linear-gradient(135deg, #2A2218, #1A1510)" }}>
              {top3[1].name.charAt(0)}
            </div>
            <p className="text-xs text-brand-cream/80 font-medium text-center leading-tight">
              {top3[1].name}
            </p>
            <p className="text-xs text-brand-muted">
              <AnimatedCounter to={top3[1].xp} duration={1.1} /> XP
            </p>
            <div className="w-full h-14 rounded-t-xl bg-brand-dark border border-white/8 flex items-center justify-center text-base font-bold text-white/50">
              2
            </div>
          </motion.div>
        )}

        {/* 1st place */}
        {top3[0] && (
          <motion.div
            className="flex flex-col items-center gap-2 flex-1"
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          >
            <Crown size={16} style={{ color: "#C4923A" }} />
            <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold text-brand-black"
              style={{ backgroundColor: "#C4923A", borderColor: "#E0B85A" }}>
              {top3[0].name.charAt(0)}
            </div>
            <p className="text-xs text-brand-cream font-semibold text-center leading-tight">
              {top3[0].name}
            </p>
            <p className="text-xs text-brand-gold font-bold">
              <AnimatedCounter to={top3[0].xp} duration={1.3} /> XP
            </p>
            <div className="w-full h-16 rounded-t-lg flex items-center justify-center text-xl font-bold border border-brand-gold/30"
              style={{ background: "linear-gradient(180deg, #C4923A22 0%, #C4923A11 100%)" }}>
              <span className="text-brand-gold">1</span>
            </div>
          </motion.div>
        )}

        {/* 3rd place */}
        {top3[2] && (
          <motion.div
            className="flex flex-col items-center gap-2 flex-1"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/12 flex items-center justify-center text-lg font-bold text-white/60"
              style={{ background: "linear-gradient(135deg, #221A10, #181410)" }}>
              {top3[2].name.charAt(0)}
            </div>
            <p className="text-xs text-brand-cream/60 font-medium text-center leading-tight">
              {top3[2].name}
            </p>
            <p className="text-xs text-brand-muted">
              <AnimatedCounter to={top3[2].xp} duration={1.0} /> XP
            </p>
            <div className="w-full h-8 rounded-t-xl bg-brand-dark border border-white/5 flex items-center justify-center text-sm font-bold text-white/30">
              3
            </div>
          </motion.div>
        )}
      </div>

      {/* Rest of rankings */}
      <motion.div
        className="space-y-2"
        variants={containerVariants}
        initial={reduced ? false : "hidden"}
        animate="show"
      >
        {rest.map((player, i) => {
          const rank = i + 4;
          const level = getLocalizedLevel(getLevelForXP(player.xp), language);
          return (
            <motion.div
              key={player.name}
              variants={itemVariants}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 border ${
                player.isYou
                  ? "bg-brand-gold/10 border-brand-gold/30"
                  : "bg-brand-dark border-white/5"
              }`}
            >
              <span className="w-6 text-xs text-brand-muted font-medium text-center">
                {rank}
              </span>
              <div className="w-9 h-9 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                {player.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${player.isYou ? "text-brand-gold" : "text-white"}`}>
                  {player.name}{player.isYou && t("leaderboard.youSuffix")}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(player.xp / maxXp) * 100}%`,
                        background: player.isYou
                          ? "linear-gradient(90deg, #C4923A, #E0B85A)"
                          : "rgba(255,255,255,0.15)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-brand-muted flex-shrink-0">{level.title}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-brand-gold flex-shrink-0">
                {player.xp} XP
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {userXP === 0 && (
        <div className="rounded-xl bg-brand-dark border border-brand-gold/20 p-4 text-center">
          <p className="text-sm text-brand-muted">
            {t("leaderboard.completeToAppear")}
          </p>
          <Link
            href="/tours"
            className="mt-2 inline-block text-xs text-brand-gold font-medium hover:underline"
          >
            {t("profile.browseTours")}
          </Link>
        </div>
      )}

      {/* Daily Quest Challenge */}
      <DailyQuestChallenge variant="dark" />
    </MotionPage>
    </div>
  );
}
