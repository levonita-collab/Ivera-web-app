"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import IveraIcon from "@/components/layout/IveraIcon";
import ExplorerPass from "@/components/home/ExplorerPass";
import TbilisiSwipeJourney from "@/components/free-quest/TbilisiSwipeJourney";
import { getBadgeForTour } from "@/data/rewards";
import { getProfile } from "@/lib/questProgress";
import { FREE_QUEST_SLUG } from "@/data/freeTbilisiQuest";
import { useTranslation } from "@/lib/i18n/dictionary";
import { getLocalizedBadge } from "@/lib/i18n/localize";

export default function FreeTbilisiQuestPage() {
  const { t, language } = useTranslation();
  const reduced = useReducedMotion();
  const rawBadge = getBadgeForTour(FREE_QUEST_SLUG);
  const badge = rawBadge ? getLocalizedBadge(rawBadge, language) : undefined;

  const [showPass, setShowPass] = useState(false);
  const [hasPass, setHasPass] = useState(() =>
    typeof window === "undefined" ? false : getProfile() !== null
  );

  return (
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>

      {/* ── Immersive hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/tours/tbilisi-city-quest.jpg"
            alt={t("freeQuest.tbilisiAtDuskAlt")}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 672px) 100vw, 672px"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, rgba(15,12,7,0.5) 0%, rgba(18,13,7,0.8) 55%, #0F0C07 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 80% 10%, rgba(200,155,60,0.32) 0%, transparent 56%)",
            }}
          />
        </div>

        <div className="relative z-10 px-5 pt-5 pb-8">
          {/* Top bar: back + logo */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}
              aria-label={t("freeQuest.backHomeAriaLabel")}
            >
              <ChevronLeft size={18} />
            </Link>
            <IveraIcon size={24} darkBg ariaLabel={t("header.logoAriaLabel")} />
            <span className="w-9" aria-hidden />
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span
              className="inline-flex items-center text-[10px] font-bold tracking-[0.22em] uppercase px-3 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(76,175,80,0.16)",
                color: "#7BD389",
                border: "1px solid rgba(76,175,80,0.32)",
              }}
            >
              {t("freeQuest.starterQuestBadge")}
            </span>

            <h1
              className="font-serif font-bold text-white leading-[1.02] mt-4"
              style={{ fontSize: "clamp(2.6rem, 12vw, 3.6rem)" }}
            >
              {t("freeQuest.title")}
            </h1>

            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.85)", maxWidth: "320px" }}>
              {t("freeQuest.unlockSpirit")}
            </p>

            <p className="mt-3 text-[12px] font-semibold tracking-wide" style={{ color: "#E0B85A" }}>
              {t("freeQuest.missionsTimeXp")}
            </p>

            <div className="mt-6 space-y-2.5">
              <a
                href="#journey"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-base text-center transition-transform active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #E0B85A 0%, #C89B3C 100%)",
                  color: "#0F0C07",
                  boxShadow: "0 8px 26px rgba(200,155,60,0.4)",
                }}
              >
                {t("freeQuest.beginJourney")} <ArrowRight size={16} />
              </a>
              <Link
                href="/tours"
                className="flex items-center justify-center w-full py-3.5 rounded-full font-semibold text-sm"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              >
                {t("hero.exploreQuestTours")}
              </Link>
            </div>

            {!hasPass && (
              <p className="mt-4 text-[11px] text-center" style={{ color: "rgba(255,255,255,0.55)" }}>
                {t("freeQuest.playAsGuestPrefix")}
                <button onClick={() => setShowPass(true)} className="font-semibold underline" style={{ color: "#E0B85A" }}>
                  {t("freeQuest.createExplorerPassLink")}
                </button>
                {t("freeQuest.toSaveXpBadges")}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Cinematic swipe journey ── */}
      <section className="pt-2 pb-6">
        <div className="px-5 mb-3">
          <p className="text-[11px] tracking-[0.28em] uppercase font-semibold" style={{ color: "#8A7A60" }}>
            {t("freeQuest.cityOpensClue")}
          </p>
        </div>
        <TbilisiSwipeJourney
          badge={badge}
          hasPass={hasPass}
          onCreatePass={() => setShowPass(true)}
        />
      </section>

      {/* Bottom note */}
      <div className="mx-4 mb-8 rounded-xl border p-3" style={{ backgroundColor: "#1A1408", borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-[11px] leading-relaxed text-center" style={{ color: "#8A7A60" }}>
          {t("freeQuest.walkDiscoverUnlock")}
        </p>
      </div>

      {/* Explorer Pass modal */}
      {showPass && (
        <ExplorerPass
          onClose={() => setShowPass(false)}
          onSaved={() => {
            setHasPass(true);
            setShowPass(false);
          }}
        />
      )}
    </div>
  );
}
