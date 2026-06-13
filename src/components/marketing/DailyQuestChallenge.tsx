"use client";

import Link from "next/link";
import { Trophy, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n/dictionary";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

interface Props {
  variant?: "dark" | "light";
  compact?: boolean;
}

const REWARDS: { rankKey: DictionaryKey; rewardKey: DictionaryKey; icon: string }[] = [
  { rankKey: "dailyQuest.rank1", rewardKey: "dailyQuest.rank1Reward", icon: "🥇" },
  { rankKey: "dailyQuest.rank2", rewardKey: "dailyQuest.rank2Reward", icon: "🥈" },
  { rankKey: "dailyQuest.rank3", rewardKey: "dailyQuest.rank3Reward", icon: "🥉" },
];

export default function DailyQuestChallenge({ variant = "dark", compact = false }: Props) {
  const { t } = useTranslation();
  const isDark = variant === "dark";

  if (compact) {
    return (
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1A1208 0%, #2A1A0A 100%)"
            : "linear-gradient(135deg, #FFF8EC 0%, #FFF3DC 100%)",
          border: `1px solid ${isDark ? "rgba(200,155,60,0.18)" : "rgba(200,155,60,0.35)"}`,
        }}
      >
        <Trophy size={15} style={{ color: "#C4923A", flexShrink: 0 }} />
        <p className="text-xs flex-1" style={{ color: isDark ? "#8A7A60" : "#6A5A40" }}>
          <span className="font-semibold" style={{ color: isDark ? "#C4923A" : "#8A5A10" }}>
            {t("dailyQuest.top3Today")}
          </span>{" "}
          {t("dailyQuest.earnBonusSeat")}
        </p>
        <Link
          href="/leaderboard"
          className="text-[11px] font-semibold flex-shrink-0"
          style={{ color: "#C4923A" }}
        >
          {t("dailyQuest.rankingsArrow")}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1A1208 0%, #251A0C 100%)"
          : "linear-gradient(135deg, #FFF8EC 0%, #FFF0D4 100%)",
        border: `1px solid ${isDark ? "rgba(200,155,60,0.2)" : "rgba(200,155,60,0.4)"}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(200,155,60,0.15)" }}
        >
          <Trophy size={16} style={{ color: "#C4923A" }} />
        </div>
        <div>
          <p
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{ color: "#C4923A" }}
          >
            {t("dailyQuest.title")}
          </p>
          <p
            className="text-xs font-medium"
            style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#7B6F63" }}
          >
            {t("dailyQuest.refreshesDaily")}
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: isDark ? "#7A6A52" : "#5A4A38" }}>
        {t("dailyQuest.descPrefix")}{" "}
        <span className="font-semibold" style={{ color: "#C4923A" }}>
          {t("dailyQuest.top3Explorers")}
        </span>{" "}
        {t("dailyQuest.descSuffix")}
      </p>

      {/* Rewards table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(200,155,60,0.06)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(200,155,60,0.15)"}`,
        }}
      >
        {REWARDS.map((r, i) => (
          <div
            key={r.rankKey}
            className="flex items-center justify-between px-4 py-2.5 text-xs"
            style={{
              borderBottom: i < REWARDS.length - 1
                ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(200,155,60,0.1)"}`
                : "none",
            }}
          >
            <span style={{ color: isDark ? "#7A6A52" : "#6A5A40" }}>
              {r.icon} {t(r.rankKey)} {t("dailyQuest.place")}
            </span>
            <span className="font-semibold" style={{ color: isDark ? "#C4923A" : "#8A5A10" }}>
              {t(r.rewardKey)}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/leaderboard"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold transition-opacity active:opacity-80"
        style={{
          backgroundColor: "rgba(200,155,60,0.12)",
          color: "#C4923A",
          border: "1px solid rgba(200,155,60,0.25)",
        }}
      >
        <Zap size={13} /> {t("dailyQuest.seeTodaysRankings")}
      </Link>
    </div>
  );
}
