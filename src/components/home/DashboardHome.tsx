"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, ChevronRight, MapPin, Compass } from "lucide-react";
import { Profile, getAllQuestProgress } from "@/lib/questProgress";
import { getLevelForXP, badges } from "@/data/rewards";
import { tours } from "@/data/tours";
import { regions } from "@/data/regions";
import { formatPrice } from "@/lib/pricing";
import { getMissionsForTour } from "@/data/missions";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation, formatXpToNextLevel } from "@/lib/i18n/dictionary";
import type { DictionaryKey } from "@/lib/i18n/dictionary";
import { getLocalizedTour, getLocalizedBadge, getLocalizedLevel } from "@/lib/i18n/localize";
import RegionCardCompact from "./RegionCardCompact";

const DEMO_PLAYERS = [
  { name: "Nino G.", xp: 4580 },
  { name: "Luka T.", xp: 3920 },
  { name: "Mariam K.", xp: 3250 },
];

const CATEGORIES: { labelKey: DictionaryKey; emoji: string; value: string }[] = [
  { labelKey: "tourCard.categoryCulture", emoji: "🏛️", value: "culture" },
  { labelKey: "tourCard.categoryWine", emoji: "🍷", value: "wine" },
  { labelKey: "tourCard.categoryAdventure", emoji: "⛰️", value: "adventure" },
  { labelKey: "tourCard.categoryHeritage", emoji: "🏰", value: "heritage" },
];

interface Props {
  profile: Profile;
  xp: number;
  onEditPass: () => void;
}

function SectionLabel({ children, className = "mb-3" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold tracking-widest uppercase ${className}`} style={{ color: "#C89B3C" }}>
      {children}
    </p>
  );
}

export default function DashboardHome({ profile, xp, onEditPass }: Props) {
  const reduced = useReducedMotion();
  const { t, language } = useTranslation();

  const level = getLocalizedLevel(getLevelForXP(xp), language);
  const progressPct =
    level.maxXp === Infinity
      ? 100
      : Math.min(100, Math.round(((xp - level.minXp) / (level.maxXp - level.minXp)) * 100));

  // Safe to read localStorage directly: DashboardHome only mounts client-side,
  // once the parent has resolved a profile after the initial render.
  const completedSlugs = useMemo(() => Object.keys(getAllQuestProgress()), []);

  const nextTour = useMemo(() => {
    const notStarted = tours.filter((t) => !completedSlugs.includes(t.slug));
    return getLocalizedTour(notStarted[0] ?? tours[0], language);
  }, [completedSlugs, language]);

  const nextTourXP = useMemo(() => {
    return getMissionsForTour(nextTour.slug).reduce((s, m) => s + m.points, 0);
  }, [nextTour]);

  const earnedBadges = useMemo(
    () => badges.filter((b) => completedSlugs.includes(b.tourSlug)).map((b) => getLocalizedBadge(b, language)),
    [completedSlugs, language]
  );

  return (
    <div style={{ backgroundColor: "#F7F0E4" }}>
      {/* ── Dark greeting header ── */}
      <section
        className="relative px-4 pt-6 pb-7"
        style={{ background: "linear-gradient(160deg, #1C1710 0%, #2A1A0A 55%, #3B1E0C 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 65% 30%, rgba(200,155,60,0.16) 0%, transparent 60%)",
          }}
        />

        <motion.div
          className="relative z-10 space-y-4"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Greeting */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm" style={{ color: "#7A6A52" }}>
                {t("dashboard.welcomeBack")}{" "}
                <span className="text-white font-semibold">{profile.name}</span>
              </p>
              <span
                className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: "rgba(200,155,60,0.18)",
                  color: "#C89B3C",
                  border: "1px solid rgba(200,155,60,0.28)",
                }}
              >
                <Compass size={10} /> {t("dashboard.levelAbbrev")}{level.level} · {level.title}
              </span>
            </div>
            <button onClick={onEditPass} className="text-[11px] mt-1" style={{ color: "#5A4A38" }}>
              {t("dashboard.editPass")}
            </button>
          </div>

          {/* XP bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span style={{ color: "#6A5A48" }}>{t("quest.questXp")}</span>
              <span className="font-semibold" style={{ color: "#C89B3C" }}>{xp} XP</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: reduced ? `${progressPct}%` : "0%" }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : 0.3, ease: "easeOut" }}
                style={{ background: "linear-gradient(90deg, #C89B3C, #E0B85A)" }}
              />
            </div>
            {level.maxXp !== Infinity && xp < level.maxXp && (
              <p className="text-[10px]" style={{ color: "#5A4A38" }}>
                {formatXpToNextLevel(level.maxXp - xp, level.level + 1, language)}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {[
              { labelKey: "dashboard.questsDone" as DictionaryKey, value: completedSlugs.length },
              { labelKey: "dashboard.badges" as DictionaryKey, value: earnedBadges.length },
              { labelKey: "dashboard.totalXp" as DictionaryKey, value: xp },
            ].map((stat) => (
              <div key={stat.labelKey}>
                <p className="text-lg font-bold text-white leading-none">{stat.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#5A4A38" }}>{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Main content ── */}
      <div className="px-4 py-5 space-y-7">

        {/* Next Quest */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <SectionLabel>{t("dashboard.yourNextQuest")}</SectionLabel>
          <Link href={`/tours/${nextTour.slug}`} className="block group">
            <div
              className="rounded-2xl overflow-hidden border transition-shadow group-hover:shadow-md"
              style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
            >
              <div className="h-44 relative">
                <Image
                  src={nextTour.image}
                  alt={nextTour.title}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 672px) 100vw, 672px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: "rgba(200,155,60,0.85)" }}
                  >
                    <Zap size={10} /> {nextTourXP} XP
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif text-white font-semibold text-lg leading-tight drop-shadow-sm">
                    {nextTour.title}
                  </h3>
                  <p className="flex items-center gap-1 mt-0.5 text-[12px]" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <MapPin size={10} /> {nextTour.region} · {nextTour.duration}
                  </p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: "#C89B3C" }}>
                  {formatPrice(nextTour.pricePerPersonGel, nextTour.priceLabel)}
                  {nextTour.pricePerPersonGel && (
                    <span className="text-[11px] font-normal ml-1" style={{ color: "#7B6F63" }}>{t("tourCard.perPerson")}</span>
                  )}
                </span>
                <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#1F1A17" }}>
                  {t("dashboard.startQuest")} <ChevronRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* Explore by Interest */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <SectionLabel>{t("dashboard.exploreByInterest")}</SectionLabel>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/tours?category=${cat.value}`}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-colors"
                style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-[10px] font-medium" style={{ color: "#7B6F63" }}>{t(cat.labelKey)}</span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Badges (only if earned) */}
        {earnedBadges.length > 0 && (
          <motion.section
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <div className="flex items-center justify-between mb-3">
              <SectionLabel className="mb-0">{t("dashboard.yourBadges")}</SectionLabel>
              <Link href="/profile" className="text-[11px] font-medium" style={{ color: "#7B6F63" }}>{t("dashboard.viewAllArrow")}</Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex-shrink-0 w-20 rounded-xl border p-2.5 text-center"
                  style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
                >
                  <p className="text-2xl mb-1">{badge.icon}</p>
                  <p className="text-[9px] font-semibold leading-tight" style={{ color: "#1F1A17" }}>{badge.name}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Mini leaderboard */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.33 }}
        >
          <div className="flex items-center justify-between mb-3">
            <SectionLabel className="mb-0">{t("dashboard.topExplorers")}</SectionLabel>
            <Link href="/leaderboard" className="text-[11px] font-medium" style={{ color: "#7B6F63" }}>{t("dashboard.seeAllArrow")}</Link>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}>
            {DEMO_PLAYERS.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? "1px solid #F0E8DA" : undefined }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    backgroundColor: i === 0 ? "#C89B3C" : "rgba(31,26,23,0.07)",
                    color: i === 0 ? "#FFFFFF" : "#7B6F63",
                  }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium" style={{ color: "#1F1A17" }}>{p.name}</span>
                <span className="text-xs font-semibold" style={{ color: "#C89B3C" }}>{p.xp} XP</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Compact tour list */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <SectionLabel className="mb-0">{t("dashboard.allRoutes")}</SectionLabel>
            <Link href="/tours" className="text-[11px] font-medium" style={{ color: "#7B6F63" }}>{t("dashboard.viewAll8Arrow")}</Link>
          </div>
          <div className="space-y-2">
            {tours.slice(0, 4).map((rawTour) => {
              const tour = getLocalizedTour(rawTour, language);
              const done = completedSlugs.includes(tour.slug);
              return (
                <Link key={tour.id} href={`/tours/${tour.slug}`} className="flex items-center gap-3 group py-1">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="56px"
                    />
                    {done && (
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#1F1A17" }}>{tour.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#7B6F63" }}>
                      {tour.duration} · {formatPrice(tour.pricePerPersonGel, tour.priceLabel)}
                    </p>
                  </div>
                  <ChevronRight size={14} style={{ color: "#C89B3C" }} className="flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Discover More Regions */}
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.43 }}
        >
          <SectionLabel>{t("home.discoverMoreRegions")}</SectionLabel>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {regions.map((region) => (
              <RegionCardCompact key={region.slug} region={region} />
            ))}
          </div>
        </motion.section>

        {/* WhatsApp CTA */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.49 }}
        >
          <a
            href={buildGeneralLink(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
            style={{ background: "linear-gradient(135deg, #1C1710 0%, #2A1F14 100%)" }}
          >
            <div>
              <p className="text-sm font-semibold text-white">{t("home.needCustomItinerary")}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#7A6A52" }}>{t("dashboard.chatWithLevaniWhatsapp")}</p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.528 5.855L0 24l6.335-1.502A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.518-5.178-1.42l-.371-.22-3.761.891.954-3.67-.241-.378A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </div>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
