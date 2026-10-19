"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gift, Download, Loader2, CheckCircle2, Lock, MessageCircle, Sparkles } from "lucide-react";
import { getAllQuestProgress, getProfile, getTotalXP } from "@/lib/questProgress";
import {
  rewardDateKey,
  getDailyXp,
  getDailyTierStatuses,
  getMilestoneStatuses,
  getCompletedQuestSlugs,
  getCompletedPaidQuestSlugs,
  hasAllBonusTasksToday,
  getTopTierQuestSlugs,
  buildRewardCode,
  type AllProgress,
} from "@/lib/rewards";
import { DAILY_TIERS, BONUS_TASKS } from "@/data/rewardRules";
import { PRIVATE_TOUR_LOYALTY } from "@/data/privateTours";
import { getLevelForXP, badges } from "@/data/rewards";
import { buildDiplomaData, downloadDiploma, getQuestDisplay } from "@/lib/diploma";
import { buildRewardClaimLink, buildSongRequestLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";
import { getLocalizedLevel } from "@/lib/i18n/localize";

const CLAIMS_KEY = "ivera_reward_claims";
const GOLD = "#C4923A";
const AMBER = "#F0A54A";
const CARD_BORDER = "1.5px solid rgba(196,146,82,0.5)";
const amberGlow = { color: AMBER, textShadow: "0 0 14px rgba(240,165,74,0.45)" };

type Glow = "bronze" | "silver" | "gold" | "warm";
const GLOWS: Record<Glow, string> = {
  bronze: "rgba(170,95,40,0.38)",
  silver: "rgba(150,150,150,0.30)",
  gold: "rgba(200,150,50,0.38)",
  warm: "rgba(160,100,45,0.32)",
};
const TIER_ICONS: Record<string, string> = {
  bronze: "/images/reward-icons/medal-bronze.webp",
  silver: "/images/reward-icons/medal-silver.webp",
  gold: "/images/reward-icons/medal-gold.webp",
};
const MILESTONE_ICONS: Record<string, string> = {
  "key-plus-quest": "/images/reward-icons/key.webp",
  "two-quests": "/images/reward-icons/gift.webp",
};
const subscribeNoop = () => () => {};

function readClaims(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CLAIMS_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export default function RewardsPage() {
  const { t, language } = useTranslation();
  const isRu = language === "ru";
  // Progress lives in localStorage — render it only after hydration.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  return (
    <div
      style={{
        background: "radial-gradient(120% 40% at 70% 0%, rgba(110,55,20,0.45) 0%, rgba(110,55,20,0) 70%), #120E09",
        minHeight: "100%",
      }}
    >
      <div className="px-4 pt-7 pb-8 space-y-7">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Gift size={24} strokeWidth={1.6} style={{ color: "#D9A55A" }} />
            <h1
              className="font-serif text-[30px] leading-none font-bold"
              style={{ color: "#F5E6C8", textShadow: "0 0 18px rgba(240,190,110,0.35)" }}
            >
              {isRu ? "Награды" : "Rewards"}
            </h1>
          </div>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "#CDB794" }}>
            {isRu
              ? "Набирайте очки на каждом квесте. Здесь нет соревнования — приз получает каждый, кто выполнил задания."
              : "Earn points on every quest. There's no competition — every explorer who completes the tasks wins."}
          </p>
        </div>
        {mounted ? (
          <RewardsContent isRu={isRu} language={language} fallbackName={t("profile.explorerFallback")} />
        ) : (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin" style={{ color: GOLD }} />
          </div>
        )}
      </div>
    </div>
  );
}

function RewardsContent({
  isRu,
  language,
  fallbackName,
}: {
  isRu: boolean;
  language: "en" | "ru";
  fallbackName: string;
}) {
  const [now] = useState(() => new Date());
  const [all] = useState<AllProgress>(getAllQuestProgress);
  const [profile] = useState(getProfile);
  const [claims, setClaims] = useState(readClaims);
  const [diplomaBusy, setDiplomaBusy] = useState<string | null>(null);

  const explorerName = profile?.name ?? fallbackName;
  const explorerKey = profile?.supabaseId ?? profile?.name ?? "guest";
  const todayKey = rewardDateKey(now);
  const totalXp = getTotalXP();
  const level = getLocalizedLevel(getLevelForXP(totalXp), language);

  const dailyXp = getDailyXp(all, now);
  const tiers = getDailyTierStatuses(all, now);
  const milestones = getMilestoneStatuses(all);
  const completed = getCompletedQuestSlugs(all);
  const completedPaid = getCompletedPaidQuestSlugs(all);
  const bonusDoneToday = hasAllBonusTasksToday(all, now);
  const goldXp = DAILY_TIERS[DAILY_TIERS.length - 1].minXp;

  const titleOf = (slug: string) => getQuestDisplay(slug, language)?.title ?? slug;
  const todaysQuests = useMemo(
    () =>
      Object.entries(all)
        .filter(([, p]) => (p.events ?? []).some((e) => rewardDateKey(new Date(e.at)) === todayKey))
        .map(([slug]) => slug),
    [all, todayKey]
  );

  function claim(code: string, title: string, description: string, details: string[]) {
    window.open(
      buildRewardClaimLink({ rewardTitle: title, rewardDescription: description, claimCode: code, explorerName, details }, language),
      "_blank",
      "noopener,noreferrer"
    );
    const next = { ...claims, [code]: new Date().toISOString() };
    setClaims(next);
    try {
      localStorage.setItem(CLAIMS_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — the WhatsApp claim still went out
    }
  }

  async function handleDiploma(slug: string) {
    const data = buildDiplomaData(slug, all[slug], profile, language, fallbackName);
    if (!data || diplomaBusy) return;
    setDiplomaBusy(slug);
    try {
      await downloadDiploma(data);
    } finally {
      setDiplomaBusy(null);
    }
  }

  return (
    <>
      {/* Totals */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label={isRu ? "Очки сегодня" : "Points today"} value={`${dailyXp} XP`} />
        <Stat label={level.title} value={`${totalXp} XP`} />
      </div>

      {/* Daily tiers */}
      <section className="space-y-3">
        <SectionTitle>{isRu ? "Награды дня" : "Today's rewards"}</SectionTitle>
        <div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (dailyXp / goldXp) * 100)}%`,
                background: "linear-gradient(90deg, #B8862E 0%, #E9C163 70%, #FBE7A6 100%)",
                boxShadow: "0 0 10px rgba(240,200,110,0.5)",
              }}
            />
          </div>
          <p className="text-[12px] mt-2" style={{ color: "#8C7A60" }}>
            {isRu
              ? `Сбрасывается в полночь по тбилисскому времени · ${todayKey}`
              : `Resets at midnight Tbilisi time · ${todayKey}`}
          </p>
        </div>
        {tiers.map(({ tier, earned, xpMissing, bonusMissing }) => {
          const code = buildRewardCode(`daily|${tier.id}|${explorerKey}|${todayKey}`);
          const name = isRu ? tier.titleRu : tier.title;
          const title = `${tier.icon} ${name}`;
          const reward = isRu ? tier.rewardRu : tier.reward;
          const requirement = [
            `${tier.minXp} XP ${isRu ? "за день" : "in one day"}`,
            tier.requiresAllBonusTasks ? (isRu ? `+ все ${BONUS_TASKS.length} бонусных задания` : `+ all ${BONUS_TASKS.length} bonus tasks`) : null,
          ]
            .filter(Boolean)
            .join(" ");
          const missing = [
            xpMissing > 0 ? (isRu ? `ещё ${xpMissing} XP` : `${xpMissing} XP to go`) : null,
            bonusMissing ? (isRu ? "бонусные задания" : "bonus tasks") : null,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <RewardCard
              key={tier.id}
              variant="tier"
              icon={TIER_ICONS[tier.id]}
              glow={tier.id}
              title={name}
              requirement={requirement}
              reward={reward}
              highlight={tier.kind === "gift" ? (isRu ? tier.highlightRu : tier.highlight) : undefined}
              earned={earned}
              missing={missing}
              claimed={!!claims[code]}
              isRu={isRu}
              onClaim={() =>
                claim(code, title, reward, [
                  `${isRu ? "Дата" : "Date"}: ${todayKey}`,
                  `${isRu ? "Очки за день" : "Points today"}: ${dailyXp} XP`,
                  `${isRu ? "Квесты сегодня" : "Today's quests"}: ${todaysQuests.map(titleOf).join(", ") || "—"}`,
                  ...(tier.requiresAllBonusTasks && bonusDoneToday
                    ? [isRu ? "Все бонусные задания выполнены" : "All bonus tasks completed"]
                    : []),
                ])
              }
            />
          );
        })}
      </section>

      <p className="text-[12.5px] leading-relaxed -mt-3" style={{ color: "#8C7A60" }}>
        {isRu ? "Золото за один день достижимо в турах: " : "Gold in a single day is reachable on: "}
        {getTopTierQuestSlugs().map(titleOf).join(", ")}
      </p>

      {/* Milestones */}
      <section className="space-y-3">
        <SectionTitle>{isRu ? "Награды за пройденные квесты" : "Quest rewards"}</SectionTitle>
        {milestones.map(({ milestone, earned, freeQuestDone, paidQuestsDone }) => {
          const code = buildRewardCode(`milestone|${milestone.id}|${explorerKey}`);
          const name = isRu ? milestone.titleRu : milestone.title;
          const title = `${milestone.icon} ${name}`;
          const reward = isRu ? milestone.rewardRu : milestone.reward;
          const missing = [
            milestone.requiresFreeQuest && !freeQuestDone ? (isRu ? "бесплатный квест" : "free quest") : null,
            paidQuestsDone < milestone.paidQuestsRequired
              ? `${paidQuestsDone}/${milestone.paidQuestsRequired} ${isRu ? "платных квестов" : "paid quests"}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <RewardCard
              key={milestone.id}
              variant="milestone"
              icon={MILESTONE_ICONS[milestone.id]}
              glow="warm"
              title={name}
              requirement={isRu ? milestone.conditionRu : milestone.condition}
              reward={reward}
              earned={earned}
              missing={missing}
              claimed={!!claims[code]}
              isRu={isRu}
              onClaim={() =>
                claim(code, title, reward, [
                  `${isRu ? "Пройденные квесты" : "Completed quests"}: ${completed.map(titleOf).join(", ")}`,
                ])
              }
            />
          );
        })}
      </section>

      {/* Private tours */}
      <Link href="/private-tours" className="block -mt-3">
        <IconCard icon="/images/reward-icons/medal-silver.webp" glow="silver">
        <p className="text-[19px] font-bold leading-snug" style={{ color: "#F3E7D3" }}>{isRu ? "Приватные туры" : "Private tours"}</p>
        <p className="text-[14px] leading-snug mt-1" style={{ color: "#E2D6C2" }}>
          {isRu
            ? "Диплом, личная песня на каждый день тура, живая грузинская полифония по запросу. "
            : "A diploma, a personal song for every day of the tour, live Georgian polyphony on request. "}
          {PRIVATE_TOUR_LOYALTY.slice()
            .reverse()
            .map((t) =>
              isRu
                ? `${t.minDays}+ дн. — ${t.discountPct}% на следующий тур`
                : `${t.minDays}+ days — ${t.discountPct}% off your next tour`
            )
            .join(" · ")}
        </p>
        <p className="text-[15px] font-bold mt-2.5" style={amberGlow}>
          {isRu ? "Собрать приватный тур →" : "Build a private tour →"}
        </p>
        </IconCard>
      </Link>

      {/* Diplomas */}
      <section className="space-y-3">
        <SectionTitle
          aside={isRu ? `${completed.length} / ${badges.length} получено` : `${completed.length} / ${badges.length} earned`}
        >
          {isRu ? "Дипломы" : "Diplomas"}
        </SectionTitle>
        {completed.length === 0 ? (
          <EmptyNote>
            {isRu
              ? "Выполните все задания квеста — и получите именной диплом, который можно скачать и распечатать."
              : "Complete every mission of a quest to unlock a personal diploma you can download and print."}{" "}
            <Link href="/free-tbilisi-quest" className="font-bold" style={amberGlow}>
              {isRu ? "Начать с бесплатного квеста →" : "Start with the free quest →"}
            </Link>
          </EmptyNote>
        ) : (
          completed.map((slug) => (
            <div
              key={slug}
              className="flex items-center gap-3 rounded-[18px] px-4 py-3.5"
              style={{ background: "linear-gradient(160deg, #2E2820 0%, #1D1914 100%)", border: "1px solid rgba(196,146,82,0.4)" }}
            >
              <CheckCircle2 size={20} style={{ color: "#E9B85E", flexShrink: 0 }} />
              <span className="flex-1 min-w-0 text-[15px] font-medium truncate" style={{ color: "#F3E7D3" }}>{titleOf(slug)}</span>
              <button
                onClick={() => handleDiploma(slug)}
                disabled={diplomaBusy !== null}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold flex-shrink-0"
                style={{ background: "linear-gradient(180deg, #F1D07A 0%, #D3A443 100%)", color: "#2A1A0E" }}
              >
                {diplomaBusy === slug ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                {isRu ? "Диплом" : "Diploma"}
              </button>
            </div>
          ))
        )}
      </section>

      {/* Personal song */}
      <IconCard icon="/images/reward-icons/song.webp" glow="warm" footer={
        completedPaid.length > 0 ? (
          <a
            href={buildSongRequestLink({ explorerName, tourTitles: completedPaid.map(titleOf) }, language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={14} /> {isRu ? "Запросить песню" : "Request your song"}
          </a>
        ) : (
          <p className="text-[14px] flex items-center gap-2" style={{ color: "#D9A860" }}>
            <Lock size={15} strokeWidth={1.8} /> {isRu ? "Откроется после первого платного квеста" : "Unlocks after your first paid quest"}
          </p>
        )
      }>
        <p className="text-[19px] font-bold leading-snug" style={{ color: "#F3E7D3" }}>
          {isRu ? "Личная песня для вашей группы" : "A personal song for your group"}
        </p>
        <p className="text-[14.5px] leading-snug mt-2" style={{ color: "#E2D6C2" }}>
          {isRu
            ? "Пройдите любой платный квест-тур — и Левани напишет песню специально для вашей группы. Приходит в WhatsApp, в подарок."
            : "Complete any paid quest tour and Levani will write a song just for your group — delivered on WhatsApp, as a gift."}
        </p>
      </IconCard>

      <p className="text-[13.5px] leading-relaxed flex gap-2.5" style={{ color: "#B89A70" }}>
        <Sparkles size={16} strokeWidth={1.6} className="flex-shrink-0 mt-0.5" style={{ color: "#D9A55A" }} />
        {isRu
          ? "Каждый приз Левани подтверждает лично вместе с вашим гидом через WhatsApp. Скидки и бесплатные места действуют на следующее бронирование, одно место — на одного человека."
          : "Every prize is confirmed personally by Levani with your guide over WhatsApp. Discounts and free seats apply to your next booking; a free seat is for one person."}
      </p>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-[20px] px-4 py-3.5"
      style={{
        background: "linear-gradient(160deg, #3A332B 0%, #231E18 55%, #1A1612 100%)",
        border: CARD_BORDER,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 16px rgba(0,0,0,0.35)",
      }}
    >
      {/* glass sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.07) 38%, rgba(255,255,255,0) 38.5%)" }}
      />
      <p className="relative text-[11.5px] uppercase tracking-[0.12em] truncate" style={{ color: "#B5A68C" }}>{label}</p>
      <p className="relative text-[24px] font-bold mt-0.5" style={amberGlow}>{value}</p>
    </div>
  );
}

function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-[13px] font-bold tracking-[0.14em] uppercase" style={{ color: "#C9AE84" }}>{children}</h2>
      {aside && <span className="text-[13px] whitespace-nowrap" style={{ color: "#D9B271" }}>{aside}</span>}
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[14.5px] leading-[1.75] rounded-[20px] px-4 py-4"
      style={{
        color: "#E2D6C2",
        background: "linear-gradient(160deg, #2E2924 0%, #1F1B17 100%)",
        border: "1px solid rgba(196,146,82,0.35)",
      }}
    >
      {children}
    </p>
  );
}

/** Rounded bronze-framed card with a large illustrated icon on the left. */
function IconCard({
  icon,
  glow,
  corner,
  footer,
  bright = false,
  children,
}: {
  icon: string;
  glow: Glow;
  corner?: React.ReactNode;
  footer?: React.ReactNode;
  bright?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative rounded-[22px] px-4 py-5"
      style={{
        background: `radial-gradient(85% 70% at 0% 0%, ${GLOWS[glow]} 0%, rgba(0,0,0,0) 70%), linear-gradient(165deg, #2C2116 0%, #1E1710 55%, #18130D 100%)`,
        border: bright ? "1.5px solid rgba(233,184,94,0.85)" : CARD_BORDER,
        boxShadow: bright
          ? "0 0 18px rgba(233,184,94,0.25), inset 0 1px 0 rgba(255,230,170,0.1)"
          : "inset 0 1px 0 rgba(255,230,170,0.08), 0 8px 20px rgba(0,0,0,0.35)",
      }}
    >
      {corner && <div className="absolute top-4 right-4">{corner}</div>}
      <div className="flex gap-3.5">
        <Image src={icon} alt="" width={80} height={80} className="w-[80px] h-[80px] flex-shrink-0 -ml-2 -mt-2 -mr-1"
          style={{ filter: "drop-shadow(0 0 10px rgba(240,170,80,0.28))" }}
        />
        <div className="flex-1 min-w-0 pr-5">{children}</div>
      </div>
      {footer && <div className="mt-3.5 pl-2">{footer}</div>}
    </div>
  );
}

/** Renders `text` with the first occurrence of `phrase` emphasised. */
function Highlighted({ text, phrase }: { text: string; phrase?: string }) {
  const i = phrase ? text.indexOf(phrase) : -1;
  if (!phrase || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color: "#EE8A5E" }}>{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}

function RewardCard({
  variant,
  icon,
  glow,
  title,
  requirement,
  reward,
  highlight,
  earned,
  missing,
  claimed,
  isRu,
  onClaim,
}: {
  variant: "tier" | "milestone";
  icon: string;
  glow: Glow;
  title: string;
  requirement: string;
  reward: string;
  highlight?: string;
  earned: boolean;
  missing: string;
  claimed: boolean;
  isRu: boolean;
  onClaim: () => void;
}) {
  const corner = earned ? (
    <CheckCircle2 size={22} style={{ color: "#E9B85E" }} aria-label={isRu ? "Получено" : "Earned"} />
  ) : (
    <Lock size={20} strokeWidth={1.6} style={{ color: "#B89A70" }} aria-label={isRu ? "Закрыто" : "Locked"} />
  );
  const footer = earned ? (
    <button
      onClick={onClaim}
      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white"
      style={{ backgroundColor: claimed ? "rgba(255,255,255,0.1)" : "#25D366" }}
    >
      <MessageCircle size={14} />
      {claimed
        ? isRu ? "Заявка отправлена — отправить снова" : "Claim sent — send again"
        : isRu ? "Получить через WhatsApp" : "Claim on WhatsApp"}
    </button>
  ) : variant === "tier" && missing ? (
    <p className="text-[14px]" style={{ color: "#E2AE62" }}>{isRu ? "Осталось" : "Still needed"}: {missing}</p>
  ) : null;

  return (
    <IconCard icon={icon} glow={glow} corner={corner} footer={footer} bright={earned}>
      <p className="text-[19px] font-bold leading-snug" style={{ color: "#F3E7D3" }}>{title}</p>
      {variant === "tier" ? (
        <>
          <p className="text-[14.5px] mt-1" style={{ color: "#CDA877" }}>{requirement}</p>
          <p className="text-[15px] leading-snug mt-2.5" style={{ color: "#EDE3D2" }}>
            <Highlighted text={reward} phrase={highlight} />
          </p>
        </>
      ) : (
        <>
          <p className="text-[14px] leading-snug mt-1" style={{ color: "#E2D6C2" }}>{requirement}</p>
          <p className="text-[17px] font-bold leading-snug mt-2.5" style={amberGlow}>{reward}</p>
          {!earned && missing && (
            <p className="text-[13px] mt-2.5" style={{ color: "#C9A877" }}>{isRu ? "Осталось" : "Still needed"}: {missing}</p>
          )}
        </>
      )}
    </IconCard>
  );
}
