"use client";

import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";
import { DAILY_TIERS, MILESTONES } from "@/data/rewardRules";
import { useTranslation } from "@/lib/i18n/dictionary";
import { tours } from "@/data/tours";
import { getTopTierQuestSlugs } from "@/lib/rewards";
import { getLocalizedTour } from "@/lib/i18n/localize";

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
  const topTierTours = getTopTierQuestSlugs()
    .map((slug) => tours.find((t) => t.slug === slug))
    .filter((t) => t !== undefined)
    .map((t) => getLocalizedTour(t, language).title)
    .join(", ");

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

  const medals: Record<string, { face: string; ring: string }> = {
    bronze: { face: "radial-gradient(circle at 35% 30%, #F2B582 0%, #C46A2E 55%, #8A4019 100%)", ring: "#7A3A14" },
    silver: { face: "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #BCC3CC 55%, #7D8692 100%)", ring: "#6B737D" },
    gold: { face: "radial-gradient(circle at 35% 30%, #FFF1A8 0%, #E9B730 55%, #A87612 100%)", ring: "#8E620C" },
  };
  const milestoneIcons: Record<string, string> = { "key-plus-quest": "🗝️", "two-quests": "🎁" };

  return (
    // Gold frame: outer gradient border + inner hairline, per the owner's mockup.
    <div
      className="rounded-[30px] p-[3px]"
      style={{
        background: "linear-gradient(135deg, #F6DA8C 0%, #B98A35 35%, #F3D27E 60%, #A7782A 100%)",
        boxShadow: "0 16px 36px rgba(90,60,20,0.28)",
      }}
    >
      <div
        className="relative rounded-[27px] overflow-hidden px-4 pt-6 pb-5"
        style={{
          background: "linear-gradient(165deg, #9C7A43 0%, #C7A365 45%, #A98449 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,236,190,0.55)",
        }}
      >
        <Sparkle className="absolute left-3 top-3" size={14} />
        <Sparkle className="absolute left-7 top-9" size={8} />
        <Sparkle className="absolute right-3 top-[5.6rem]" size={10} />

        <div className="relative flex items-center justify-center gap-2">
          <h3
            className="font-black uppercase tracking-tight text-center leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(1.3rem, 6.4vw, 2.2rem)",
              background: "linear-gradient(180deg, #FFF3C4 0%, #F2CE6A 45%, #C99230 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 2px 2px rgba(70,40,10,0.55))",
            }}
          >
            {isRu ? "Награды за очки" : "Points rewards"}
          </h3>
          <TreasureChest />
        </div>
        <p
          className="relative text-center italic font-semibold text-[15px] mt-2"
          style={{ color: "#FFF6E2", textShadow: "0 1px 3px rgba(60,35,10,0.6)" }}
        >
          {isRu ? "Приз получает каждый — " : "Every explorer can win — "}
          <span style={{ color: "#FFD86B" }}>{isRu ? "без соревнования" : "no competition"}</span>
        </p>

        <div className="relative mt-5 space-y-3">
          {DAILY_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="flex items-stretch rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#FCF3DF", border: "2px solid #EBCB80", boxShadow: "0 3px 8px rgba(80,50,15,0.18)" }}
            >
              <div className="flex items-center gap-2 pl-2.5 pr-2.5 py-3 flex-shrink-0" style={{ backgroundColor: "#F2E2BF" }}>
                <Medal face={medals[tier.id].face} ring={medals[tier.id].ring} />
                <div className="leading-tight">
                  <p className="text-[17px] font-extrabold whitespace-nowrap" style={{ color: "#3B2510" }}>{tier.minXp} XP</p>
                  {tier.requiresAllBonusTasks && (
                    <p className="text-[10px] font-bold leading-tight max-w-[5.5rem]" style={{ color: "#5A3A18" }}>
                      {isRu ? "+ бонусные задания" : "+ bonus tasks"}
                    </p>
                  )}
                </div>
              </div>
              <p className="flex-1 flex items-center justify-end text-right pl-2 pr-3 py-2.5 text-[12.5px] font-bold leading-snug" style={{ color: "#2A1A0E" }}>
                <span>
                  <Highlighted
                    text={isRu ? tier.rewardRu : tier.reward}
                    phrase={isRu ? tier.highlightRu : tier.highlight}
                  />
                </span>
              </p>
            </div>
          ))}

          {MILESTONES.map((m) => (
            <div
              key={m.id}
              className="flex items-start gap-2.5 rounded-2xl px-3 py-2.5"
              style={{ backgroundColor: "rgba(253,245,226,0.82)" }}
            >
              <span className="text-xl leading-none mt-0.5">{milestoneIcons[m.id] ?? m.icon}</span>
              <p className="text-[13px] leading-snug" style={{ color: "#2A1A0E" }}>
                {isRu ? m.conditionRu : m.condition} →{" "}
                <Highlighted text={isRu ? m.rewardRu : m.reward} phrase={isRu ? m.highlightRu : m.highlight} pill />
              </p>
            </div>
          ))}
          <div className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5" style={{ backgroundColor: "rgba(253,245,226,0.82)" }}>
            <span className="text-xl leading-none">📜</span>
            <p className="text-[13px] leading-snug" style={{ color: "#2A1A0E" }}>
              {isRu ? "Именной диплом за каждый пройденный квест" : "A personal diploma for every completed quest"}
            </p>
          </div>
        </div>

        <Link
          href="/rewards"
          className="relative mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-[17px] font-extrabold transition-transform active:scale-[0.98]"
          style={{
            background: "linear-gradient(180deg, #FCE7A2 0%, #EDC25B 50%, #D9A73E 100%)",
            color: "#2A1A0E",
            boxShadow: "0 6px 14px rgba(70,40,10,0.35), inset 0 1px 0 rgba(255,255,255,0.7)",
            border: "1px solid #F7DE95",
          }}
        >
          {isRu ? "Мои награды" : "See my rewards"} <ArrowRight size={18} />
        </Link>
        <p className="relative text-[11px] text-center mt-3 leading-snug" style={{ color: "#3B2510" }}>
          {isRu
            ? `Очки за день считаются по тбилисскому времени. Золото (${top.minXp} XP + все бонусные задания) достижимо в турах: ${topTierTours}.`
            : `Daily points reset at midnight Tbilisi time. Gold (${top.minXp} XP + all bonus tasks) is reachable on: ${topTierTours}.`}
        </p>
      </div>
    </div>
  );
}

function Highlighted({ text, phrase, pill = false }: { text: string; phrase: string; pill?: boolean }) {
  const i = text.indexOf(phrase);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span
        className={pill ? "inline-block rounded-md px-1.5 font-bold text-white" : "font-black text-[1.25em]"}
        style={pill ? { backgroundColor: "#7A1F1F" } : { color: "#7A1F1F" }}
      >
        {phrase}
      </span>
      {text.slice(i + phrase.length)}
    </>
  );
}

function Medal({ face, ring }: { face: string; ring: string }) {
  return (
    <span className="relative inline-block w-10 h-11 flex-shrink-0" aria-hidden="true">
      {/* ribbon */}
      <span
        className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-4"
        style={{
          background: "linear-gradient(90deg, #B8312F 0 33%, #FFFFFF 33% 66%, #2E4A9A 66% 100%)",
          clipPath: "polygon(0 0, 100% 0, 70% 100%, 30% 100%)",
        }}
      />
      <span
        className="absolute left-0 bottom-0 w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-black"
        style={{ background: face, boxShadow: `0 0 0 2px ${ring}, 0 2px 4px rgba(0,0,0,0.3)`, color: "rgba(255,255,255,0.92)", textShadow: "0 1px 1px rgba(0,0,0,0.35)" }}
      >
        XP
      </span>
    </span>
  );
}

function Sparkle({ className, size }: { className: string; size: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#FFF0BF" opacity="0.85" />
    </svg>
  );
}

function TreasureChest() {
  return (
    <svg width="44" height="40" viewBox="0 0 64 56" aria-hidden="true" className="flex-shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id="dr-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9A5426" />
          <stop offset="1" stopColor="#5E2F12" />
        </linearGradient>
        <linearGradient id="dr-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE38A" />
          <stop offset="1" stopColor="#D49A2A" />
        </linearGradient>
      </defs>
      {/* coins spilling out */}
      <circle cx="22" cy="22" r="6" fill="url(#dr-gold)" stroke="#A8761A" strokeWidth="1" />
      <circle cx="32" cy="19" r="6" fill="url(#dr-gold)" stroke="#A8761A" strokeWidth="1" />
      <circle cx="42" cy="22" r="6" fill="url(#dr-gold)" stroke="#A8761A" strokeWidth="1" />
      {/* open lid */}
      <path d="M10 22 Q12 6 32 4 Q52 6 54 22 Z" fill="url(#dr-wood)" stroke="#3E1E0A" strokeWidth="1.5" transform="rotate(-14 10 22)" />
      {/* body */}
      <rect x="8" y="26" width="48" height="26" rx="3" fill="url(#dr-wood)" stroke="#3E1E0A" strokeWidth="1.5" />
      <rect x="8" y="26" width="48" height="5" fill="url(#dr-gold)" />
      <rect x="14" y="26" width="5" height="26" fill="url(#dr-gold)" />
      <rect x="45" y="26" width="5" height="26" fill="url(#dr-gold)" />
      {/* lock */}
      <rect x="28" y="32" width="8" height="10" rx="1.5" fill="url(#dr-gold)" stroke="#8A5A10" strokeWidth="1" />
      <circle cx="32" cy="36" r="1.4" fill="#5E2F12" />
      {/* shine */}
      <path d="M57 8 l3 -3 M59 14 h4 M52 4 l1 -4" stroke="#FFF0BF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
