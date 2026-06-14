"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Compass, Check } from "lucide-react";
import RewardBadge from "@/components/quest/RewardBadge";
import type { Badge } from "@/data/rewards";
import { buildFreeQuestUpsellLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  badge?: Badge;
  totalXp: number;
  completedCount: number;
  hasPass: boolean;
  onCreatePass: () => void;
}

export default function FreeQuestCompletion({
  badge,
  totalXp,
  completedCount,
  hasPass,
  onCreatePass,
}: Props) {
  const { t, language } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="px-4"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="rounded-[26px] border p-6 text-center space-y-5"
        style={{
          background: "linear-gradient(165deg, rgba(42,28,11,0.9) 0%, rgba(26,20,8,0.95) 100%)",
          borderColor: "rgba(200,155,60,0.35)",
        }}
      >
        <p className="text-[11px] tracking-[0.3em] uppercase font-semibold" style={{ color: "#C89B3C" }}>
          {t("freeQuest.questCompleteLabel")}
        </p>
        <h2 className="font-serif font-bold text-white leading-tight" style={{ fontSize: "clamp(1.9rem, 8vw, 2.4rem)" }}>
          {t("freeQuest.unlockedKeyTitle")}
        </h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          {t("freeQuest.firstQuestComplete").replace("{xp}", String(totalXp))}
        </p>

        {badge && (
          <div className="max-w-[240px] mx-auto">
            <RewardBadge badge={badge} earned />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="flex-1 rounded-2xl py-3"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-xl font-bold" style={{ color: "#E0B85A" }}>{totalXp}</p>
            <p className="text-[10px] tracking-wide uppercase mt-0.5" style={{ color: "#8A7A60" }}>{t("freeQuest.xpEarnedLabel")}</p>
          </div>
          <div
            className="flex-1 rounded-2xl py-3"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-xl font-bold flex items-center justify-center gap-1" style={{ color: "#E0B85A" }}>
              {completedCount} <Check size={16} strokeWidth={3} />
            </p>
            <p className="text-[10px] tracking-wide uppercase mt-0.5" style={{ color: "#8A7A60" }}>{t("freeQuest.missionsLabel")}</p>
          </div>
        </div>

        {/* Explorer Pass nudge */}
        {!hasPass && (
          <button
            onClick={onCreatePass}
            className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left"
            style={{ backgroundColor: "rgba(200,155,60,0.1)", border: "1px solid rgba(200,155,60,0.28)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(200,155,60,0.2)" }}
            >
              <Compass size={16} style={{ color: "#E0B85A" }} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-white">{t("freeQuest.createExplorerPassTitle")}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#8A7A60" }}>
                {t("freeQuest.saveXpBadgesRewards")}
              </p>
            </div>
          </button>
        )}

        {/* Conversion */}
        <div className="pt-1 space-y-2.5">
          <p className="text-sm font-semibold text-white">{t("freeQuest.readyForNextChapter")}</p>

          <a
            href={buildFreeQuestUpsellLink(t("freeQuest.kakhetiTourTitle"), language)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={15} /> {t("freeQuest.bookKakheti")}
          </a>
          <a
            href={buildFreeQuestUpsellLink(t("freeQuest.kazbegiTourTitle"), language)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={15} /> {t("freeQuest.bookKazbegi")}
          </a>
          <Link
            href="/tours"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold"
            style={{ color: "#0F0C07", backgroundColor: "#C89B3C" }}
          >
            {t("freeQuest.exploreAllQuestTours")}
          </Link>
          <Link
            href="/profile"
            className="inline-block text-[12px] font-medium pt-1"
            style={{ color: "#8A7A60" }}
          >
            {t("freeQuest.viewYourProfile")}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
