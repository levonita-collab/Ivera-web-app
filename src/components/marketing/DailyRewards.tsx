"use client";

import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";
import { DAILY_TIERS, MILESTONES } from "@/data/rewardRules";
import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  variant?: "dark" | "light";
  compact?: boolean;
}

export default function DailyRewards({ variant = "dark", compact = false }: Props) {
  const { language } = useTranslation();
  const isRu = language === "ru";
  const isDark = variant === "dark";
  const accent = isDark ? "#C4923A" : "#8A5A10";
  const muted = isDark ? "#7A6A52" : "#6A5A40";
  const first = DAILY_TIERS[0];
  const top = DAILY_TIERS[DAILY_TIERS.length - 1];

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
        <Gift size={15} style={{ color: "#C4923A", flexShrink: 0 }} />
        <p className="text-xs flex-1" style={{ color: muted }}>
          <span className="font-semibold" style={{ color: accent }}>
            {isRu ? `${first.minXp} XP за день` : `${first.minXp} XP in a day`}
          </span>{" "}
          {isRu ? "— подарок от гида. Больше очков — скидки и бесплатный тур." : "— a gift from your guide. More points unlock discounts and a free seat."}
        </p>
        <Link href="/rewards" className="text-[11px] font-semibold flex-shrink-0" style={{ color: "#C4923A" }}>
          {isRu ? "Награды →" : "Rewards →"}
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
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(200,155,60,0.15)" }}
        >
          <Gift size={16} style={{ color: "#C4923A" }} />
        </div>
        <div>
          <p className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: "#C4923A" }}>
            {isRu ? "Награды за очки" : "Points rewards"}
          </p>
          <p className="text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#7B6F63" }}>
            {isRu ? "Приз получает каждый — без соревнования" : "Every explorer can win — no competition"}
          </p>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(200,155,60,0.06)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(200,155,60,0.15)"}`,
        }}
      >
        {DAILY_TIERS.map((tier, i) => (
          <div
            key={tier.id}
            className="flex items-start justify-between gap-3 px-4 py-2.5 text-xs"
            style={{
              borderBottom: i < DAILY_TIERS.length - 1
                ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(200,155,60,0.1)"}`
                : "none",
            }}
          >
            <span className="flex-shrink-0" style={{ color: muted }}>
              {tier.icon} {tier.minXp} XP{tier.requiresAllBonusTasks ? (isRu ? " + бонусы" : " + bonus tasks") : ""}
            </span>
            <span className="font-semibold text-right" style={{ color: accent }}>
              {isRu ? tier.rewardRu : tier.reward}
            </span>
          </div>
        ))}
      </div>

      <ul className="space-y-1 text-xs" style={{ color: muted }}>
        {MILESTONES.map((m) => (
          <li key={m.id}>
            {m.icon} {isRu ? m.conditionRu : m.condition} →{" "}
            <span className="font-semibold" style={{ color: accent }}>{isRu ? m.rewardRu : m.reward}</span>
          </li>
        ))}
        <li>
          📜 {isRu ? "За каждый пройденный квест — именной диплом" : "A personal diploma for every completed quest"}
        </li>
      </ul>

      <Link
        href="/rewards"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold transition-opacity active:opacity-80"
        style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A", border: "1px solid rgba(200,155,60,0.25)" }}
      >
        {isRu ? `Мои награды` : "See my rewards"} <ArrowRight size={13} />
      </Link>
      <p className="text-[10px] text-center" style={{ color: muted }}>
        {isRu
          ? `Очки за день считаются по тбилисскому времени. Золото: ${top.minXp} XP + все бонусные задания.`
          : `Daily points reset at midnight Tbilisi time. Gold needs ${top.minXp} XP + all bonus tasks.`}
      </p>
    </div>
  );
}
