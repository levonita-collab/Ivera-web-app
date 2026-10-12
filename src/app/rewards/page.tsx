"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Gift, Download, Music, Loader2, CheckCircle2, Lock, MessageCircle, Sparkles } from "lucide-react";
import { getAllQuestProgress, getProfile, getTotalXP } from "@/lib/questProgress";
import {
  rewardDateKey,
  getDailyXp,
  getDailyTierStatuses,
  getMilestoneStatuses,
  getCompletedQuestSlugs,
  getCompletedPaidQuestSlugs,
  hasAllBonusTasksToday,
  buildRewardCode,
  type AllProgress,
} from "@/lib/rewards";
import { DAILY_TIERS, BONUS_TASKS } from "@/data/rewardRules";
import { getLevelForXP } from "@/data/rewards";
import { buildDiplomaData, downloadDiploma, getQuestDisplay } from "@/lib/diploma";
import { buildRewardClaimLink, buildSongRequestLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";
import { getLocalizedLevel } from "@/lib/i18n/localize";

const CLAIMS_KEY = "ivera_reward_claims";
const GOLD = "#C4923A";
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
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
      <div className="px-4 py-6 space-y-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift size={20} style={{ color: GOLD }} />
            <h1 className="font-serif text-2xl text-white font-bold">{isRu ? "Награды" : "Rewards"}</h1>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
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
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.min(100, (dailyXp / goldXp) * 100)}%`, backgroundColor: GOLD }}
            />
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: "#5A4A38" }}>
            {isRu
              ? `Сбрасывается в полночь по тбилисскому времени · ${todayKey}`
              : `Resets at midnight Tbilisi time · ${todayKey}`}
          </p>
        </div>
        {tiers.map(({ tier, earned, xpMissing, bonusMissing }) => {
          const code = buildRewardCode(`daily|${tier.id}|${explorerKey}|${todayKey}`);
          const title = `${tier.icon} ${isRu ? tier.titleRu : tier.title}`;
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
              title={title}
              requirement={requirement}
              reward={reward}
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

      {/* Milestones */}
      <section className="space-y-3">
        <SectionTitle>{isRu ? "Награды за пройденные квесты" : "Quest rewards"}</SectionTitle>
        {milestones.map(({ milestone, earned, freeQuestDone, paidQuestsDone }) => {
          const code = buildRewardCode(`milestone|${milestone.id}|${explorerKey}`);
          const title = `${milestone.icon} ${isRu ? milestone.titleRu : milestone.title}`;
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
              title={title}
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

      {/* Diplomas */}
      <section className="space-y-3">
        <SectionTitle>{isRu ? "Дипломы" : "Diplomas"}</SectionTitle>
        {completed.length === 0 ? (
          <EmptyNote>
            {isRu
              ? "Выполните все задания квеста — и получите именной диплом, который можно скачать и распечатать."
              : "Complete every mission of a quest to unlock a personal diploma you can download and print."}{" "}
            <Link href="/free-tbilisi-quest" className="font-semibold" style={{ color: GOLD }}>
              {isRu ? "Начать с бесплатного квеста →" : "Start with the free quest →"}
            </Link>
          </EmptyNote>
        ) : (
          completed.map((slug) => (
            <div
              key={slug}
              className="flex items-center gap-3 rounded-xl px-4 py-3 border"
              style={{ backgroundColor: "#181410", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <CheckCircle2 size={18} style={{ color: GOLD, flexShrink: 0 }} />
              <span className="flex-1 min-w-0 text-sm font-medium text-white truncate">{titleOf(slug)}</span>
              <button
                onClick={() => handleDiploma(slug)}
                disabled={diplomaBusy !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-brand-black flex-shrink-0"
                style={{ backgroundColor: GOLD }}
              >
                {diplomaBusy === slug ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                {isRu ? "Диплом" : "Diploma"}
              </button>
            </div>
          ))
        )}
      </section>

      {/* Personal song */}
      <section
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "linear-gradient(135deg, #1A1208 0%, #251A0C 100%)", border: "1px solid rgba(200,155,60,0.2)" }}
      >
        <div className="flex items-center gap-2">
          <Music size={16} style={{ color: GOLD }} />
          <p className="text-sm font-semibold text-white">{isRu ? "Личная песня для вашей группы" : "A personal song for your group"}</p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#8A7A60" }}>
          {isRu
            ? "Пройдите любой платный квест-тур — и Левани напишет песню специально для вашей группы. Приходит в WhatsApp, в подарок."
            : "Complete any paid quest tour and Levani will write a song just for your group — delivered on WhatsApp, as a gift."}
        </p>
        {completedPaid.length > 0 ? (
          <a
            href={buildSongRequestLink({ explorerName, tourTitles: completedPaid.map(titleOf) }, language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={13} /> {isRu ? "Запросить песню" : "Request your song"}
          </a>
        ) : (
          <p className="text-[11px] flex items-center gap-1.5" style={{ color: "#5A4A38" }}>
            <Lock size={11} /> {isRu ? "Откроется после первого платного квеста" : "Unlocks after your first paid quest"}
          </p>
        )}
      </section>

      <p className="text-[11px] leading-relaxed flex gap-2" style={{ color: "#5A4A38" }}>
        <Sparkles size={12} className="flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
        {isRu
          ? "Каждый приз Левани подтверждает лично вместе с вашим гидом через WhatsApp. Скидки и бесплатные места действуют на следующее бронирование, одно место — на одного человека."
          : "Every prize is confirmed personally by Levani with your guide over WhatsApp. Discounts and free seats apply to your next booking; a free seat is for one person."}
      </p>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl px-4 py-3 border" style={{ backgroundColor: "#181410", borderColor: "rgba(255,255,255,0.06)" }}>
      <p className="text-[10px] uppercase tracking-widest" style={{ color: "#7A6A52" }}>{label}</p>
      <p className="text-xl font-bold mt-0.5" style={{ color: GOLD }}>{value}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#7A6A52" }}>{children}</h2>;
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs leading-relaxed rounded-xl px-4 py-3 border" style={{ color: "#8A7A60", backgroundColor: "#181410", borderColor: "rgba(255,255,255,0.06)" }}>
      {children}
    </p>
  );
}

function RewardCard({
  title,
  requirement,
  reward,
  earned,
  missing,
  claimed,
  isRu,
  onClaim,
}: {
  title: string;
  requirement: string;
  reward: string;
  earned: boolean;
  missing: string;
  claimed: boolean;
  isRu: boolean;
  onClaim: () => void;
}) {
  return (
    <div
      className="rounded-2xl px-4 py-3.5 border space-y-2"
      style={{
        backgroundColor: earned ? "rgba(200,155,60,0.10)" : "#181410",
        borderColor: earned ? "rgba(200,155,60,0.35)" : "rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[11px] mt-0.5" style={{ color: "#7A6A52" }}>{requirement}</p>
        </div>
        {earned ? (
          <CheckCircle2 size={18} style={{ color: GOLD, flexShrink: 0 }} />
        ) : (
          <Lock size={15} style={{ color: "#5A4A38", flexShrink: 0 }} />
        )}
      </div>
      <p className="text-xs font-medium" style={{ color: earned ? "#E0B85A" : "#9A8A70" }}>{reward}</p>
      {earned ? (
        <button
          onClick={onClaim}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: claimed ? "rgba(255,255,255,0.08)" : "#25D366" }}
        >
          <MessageCircle size={12} />
          {claimed
            ? isRu ? "Заявка отправлена — отправить снова" : "Claim sent — send again"
            : isRu ? "Получить через WhatsApp" : "Claim on WhatsApp"}
        </button>
      ) : (
        missing && <p className="text-[11px]" style={{ color: "#5A4A38" }}>{isRu ? "Осталось" : "Still needed"}: {missing}</p>
      )}
    </div>
  );
}
