"use client";

import { useState, useRef, useMemo, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Zap, Map as MapIcon, Award, PenLine, Calendar, Users, ChevronRight, Sparkles, ExternalLink, Lock } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MotionPage, AnimatedCounter } from "@/components/motion";
import { containerVariants, itemVariants } from "@/lib/motion";
import {
  getTotalXP,
  getProfile,
  saveProfile,
  getAllQuestProgress,
  Profile,
} from "@/lib/questProgress";
import { getLevelForXP, badges } from "@/data/rewards";
import { tours } from "@/data/tours";
import { saveExplorerToSupabase } from "@/lib/supabase/explorerService";
import { getLocalBookings } from "@/lib/localBookings";
import { getUserBookings } from "@/lib/supabase/bookingService";
import type { LocalBookingSummary, BookingStatus } from "@/lib/bookingTypes";
import {
  useTranslation,
  INTEREST_LABEL_KEYS,
  formatXpToNextLevel,
  formatBadgesEarned,
  formatDate,
} from "@/lib/i18n/dictionary";
import type { DictionaryKey } from "@/lib/i18n/dictionary";
import { getLocalizedTour, getLocalizedBadge, getLocalizedLevel } from "@/lib/i18n/localize";
import { getCompletedQuestSlugs, getCompletedPaidQuestSlugs } from "@/lib/rewards";

const STATUS_LABEL_KEYS: Record<BookingStatus, DictionaryKey> = {
  pending: "myTrip.statusPending",
  contacted: "myTrip.statusContacted",
  confirmed: "myTrip.statusConfirmed",
  completed: "myTrip.statusCompleted",
  cancelled: "myTrip.statusCancelled",
};

function readInitialXP(): number {
  if (typeof window === "undefined") return 0;
  return getTotalXP();
}
function readInitialProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  return getProfile();
}

const subscribeNoop = () => () => {};

export default function ProfilePage() {
  const { t, language } = useTranslation();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [xp] = useState(readInitialXP);
  const [profile, setProfile] = useState(readInitialProfile);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bookings, setBookings] = useState<LocalBookingSummary[]>(() =>
    typeof window !== "undefined" ? getLocalBookings() : []
  );
  const [recommendations, setRecommendations] = useState<{ slug: string; reason: string }[]>([]);

  useEffect(() => {
    const p = getProfile();
    if (!p?.supabaseId) return;
    getUserBookings(p.supabaseId).then((records) => {
      if (records.length > 0) {
        setBookings(records.map((r) => ({
          id: r.id,
          bookingCode: r.bookingCode,
          tourSlug: r.tourSlug,
          tourTitle: r.tourTitle,
          tourCategory: r.tourCategory,
          selectedDate: r.selectedDate,
          peopleCount: r.peopleCount,
          finalTotal: r.finalTotal,
          discountApplied: r.discountApplied,
          savings: r.savings,
          xpReward: r.xpReward,
          status: r.status,
          createdAt: r.createdAt,
        })));
      }
    }).catch(() => {});

    // Fetch recommendations — non-blocking
    const allProgress = getAllQuestProgress();
    const completedSlugs = tours
      .filter((t) => allProgress[t.slug])
      .map((t) => t.slug);
    // Also count free quest
    const freeQuestProgress = typeof window !== "undefined"
      ? (localStorage.getItem("ivera_quest_key-of-tbilisi") ? ["key-of-tbilisi"] : [])
      : [];
    const allCompleted = [...completedSlugs, ...freeQuestProgress];

    fetch("/api/ai/tour-recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completedSlugs: allCompleted,
        available: tours.map((t) => ({ slug: t.slug, title: t.title, shortDescription: t.shortDescription })),
        explorerName: p?.name,
        explorerId: p?.supabaseId,
      }),
    })
      .then((r) => r.json())
      .then((data: { recommendations?: { slug: string; reason: string }[] }) => {
        if (data.recommendations?.length) setRecommendations(data.recommendations.slice(0, 2));
      })
      .catch(() => {});
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only fully completed quests count — a quest with one mission done is
  // started, not completed. Includes the free Key of Tbilisi badge.
  const { completedTourSlugs, earnedBadgeSlugs } = useMemo(() => {
    if (typeof window === "undefined") return { completedTourSlugs: [], earnedBadgeSlugs: [] };
    const allProgress = getAllQuestProgress();
    return {
      completedTourSlugs: getCompletedPaidQuestSlugs(allProgress),
      earnedBadgeSlugs: getCompletedQuestSlugs(allProgress),
    };
  }, []);

  function startEditing() {
    setNameInput(profile?.name ?? "");
    setEditingName(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function saveName() {
    if (!nameInput.trim()) return;
    const updated: Profile = {
      name: nameInput.trim(),
      country: profile?.country,
      interests: profile?.interests,
      joinedAt: profile?.joinedAt ?? new Date().toISOString(),
      supabaseId: profile?.supabaseId,
    };
    saveProfile(updated);
    setProfile(updated);
    setEditingName(false);
    saveExplorerToSupabase(updated, updated.supabaseId)
      .then((id) => {
        if (id && id !== updated.supabaseId) {
          saveProfile({ ...updated, supabaseId: id });
        }
      })
      .catch(() => {});
  }

  const reduced = useReducedMotion();
  const level = getLocalizedLevel(getLevelForXP(xp), language);
  const nextLevel = xp < level.maxXp ? level.maxXp : null;
  const progressPct =
    nextLevel !== null
      ? Math.round(((xp - level.minXp) / (level.maxXp - level.minXp)) * 100)
      : 100;

  const hasNoProgress = xp === 0 && !profile;

  const bookingXp = bookings.reduce((sum, b) => sum + b.xpReward, 0);
  const bookingStats = [
    { labelKey: "myTrip.statBooked" as DictionaryKey, value: bookings.length, always: true },
    {
      labelKey: "myTrip.statPending" as DictionaryKey,
      value: bookings.filter((b) => b.status === "pending" || b.status === "contacted").length,
      always: true,
    },
    { labelKey: "myTrip.statConfirmed" as DictionaryKey, value: bookings.filter((b) => b.status === "confirmed").length, always: false },
    { labelKey: "myTrip.statCompleted" as DictionaryKey, value: bookings.filter((b) => b.status === "completed").length, always: false },
  ].filter((s) => s.always || s.value > 0);

  // Profile, XP and bookings live in localStorage — render them only after
  // hydration so the server HTML matches the first client render.
  if (!mounted) return <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }} />;

  return (
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
    <MotionPage className="px-4 py-6 space-y-4">

      {/* ── Explorer Passport Card ── */}
      <div
        className="relative rounded-[22px] overflow-hidden px-4 pt-4 pb-5"
        style={{
          background:
            "radial-gradient(120% 90% at 0% 40%, rgba(150,70,25,0.35) 0%, rgba(150,70,25,0) 60%), linear-gradient(135deg, #3A2513 0%, #251809 45%, #1A1209 100%)",
          border: "1.5px solid rgba(214,168,82,0.45)",
          boxShadow: "inset 0 1px 0 rgba(255,230,170,0.12), 0 10px 26px rgba(0,0,0,0.45)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] tracking-[0.16em] uppercase font-bold" style={{ color: "#D9AE5C" }}>
            {t("profile.explorerPassport")}
          </span>
          <span className="text-[11px] tracking-wide whitespace-nowrap" style={{ color: "#8C7A60" }}>
            IVERA · GEORGIA
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <CompassMedallion />

          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  placeholder={t("profile.yourNamePlaceholder")}
                  className="flex-1 min-w-0 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                  style={{ backgroundColor: "rgba(0,0,0,0.35)", border: "1px solid rgba(214,168,82,0.45)" }}
                  maxLength={30}
                />
                <button
                  onClick={saveName}
                  className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: "#D9AE5C", color: "#1A0E04" }}
                >
                  {t("profile.save")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold truncate" style={{ color: "#F5ECDB" }}>
                  {profile?.name ?? t("profile.explorerFallback")}
                </h1>
                <button
                  onClick={startEditing}
                  aria-label={t("profile.yourNamePlaceholder")}
                  className="flex-shrink-0 transition-opacity hover:opacity-80"
                  style={{ color: "#B8A27E" }}
                >
                  <PenLine size={16} />
                </button>
              </div>
            )}
            <p className="text-[15px] mt-0.5" style={{ color: "#E9A443" }}>
              {t("profile.level")} {level.level} · {level.title}
            </p>
            {profile?.country && (
              <p className="text-[11px] mt-0.5" style={{ color: "#8C7A60" }}>
                {profile.country}
              </p>
            )}

            <div className="mt-3">
              <div className="flex justify-between items-baseline text-[13px]">
                <span style={{ color: "#E8DCC6" }}>{t("quest.questXp")}</span>
                <span className="font-bold text-[15px]" style={{ color: "#E8B95A" }}>
                  <AnimatedCounter to={xp} duration={1.2} /> XP
                </span>
              </div>
              <div className="mt-1.5 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg, #B8862E 0%, #E9C163 70%, #FBE7A6 100%)",
                    boxShadow: "0 0 10px rgba(240,200,110,0.55)",
                  }}
                />
              </div>
              {nextLevel !== null && (
                <p className="text-[12px] mt-1.5" style={{ color: "#8C7A60" }}>
                  {formatXpToNextLevel(nextLevel - xp, level.level + 1, language)}
                </p>
              )}
            </div>
          </div>
        </div>

        {profile?.interests && profile.interests.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: "rgba(217,174,92,0.1)", color: "#D9AE5C", border: "1px solid rgba(217,174,92,0.25)" }}
              >
                {INTEREST_LABEL_KEYS[interest] ? t(INTEREST_LABEL_KEYS[interest]) : interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-2.5"
        variants={containerVariants}
        initial={reduced ? false : "hidden"}
        animate="show"
      >
        {[
          { icon: <Zap size={26} strokeWidth={1.6} />, labelKey: "dashboard.totalXp" as DictionaryKey, value: xp },
          { icon: <MapIcon size={26} strokeWidth={1.6} />, labelKey: "profile.tours" as DictionaryKey, value: completedTourSlugs.length },
          { icon: <Award size={26} strokeWidth={1.6} />, labelKey: "dashboard.badges" as DictionaryKey, value: earnedBadgeSlugs.length },
        ].map((s) => (
          <motion.div
            key={s.labelKey}
            variants={itemVariants}
            className="relative rounded-2xl overflow-hidden px-2 pt-4 pb-3 text-center"
            style={{
              background: "linear-gradient(160deg, #2E271E 0%, #1C1712 55%, #15110C 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 14px rgba(0,0,0,0.35)",
            }}
          >
            {/* soft gold tab behind the icon */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-[58%] h-[58%] rounded-b-xl"
              style={{ background: "linear-gradient(180deg, rgba(150,110,45,0.35) 0%, rgba(150,110,45,0.08) 100%)" }}
            />
            <div className="relative flex justify-center" style={{ color: "#D9AE5C" }}>
              {s.icon}
            </div>
            <p className="relative text-[30px] font-bold leading-tight mt-1.5" style={{ color: "#F3E7C9" }}>
              <AnimatedCounter to={s.value} duration={1.0} />
            </p>
            <p className="relative text-[13px]" style={{ color: "#B5A68C" }}>{t(s.labelKey)}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Booking Summary */}
      {bookings.length > 0 && (
        <div
          className="rounded-[22px] px-4 pt-4 pb-4"
          style={{
            background: "linear-gradient(165deg, #2A1D10 0%, #1C140B 60%, #17110A 100%)",
            border: "1.5px solid rgba(214,168,82,0.35)",
            boxShadow: "inset 0 1px 0 rgba(255,230,170,0.08)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold tracking-[0.12em] uppercase" style={{ color: "#D9AE5C" }}>
              {t("profile.myBookings")}
            </span>
            <Link href="/my-trip" className="flex items-center gap-1 text-[13px]" style={{ color: "#D9C7A6" }}>
              {t("profile.viewAll")} <ChevronRight size={14} />
            </Link>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              {bookingStats.map((s) => (
                <p key={s.labelKey} className="text-[20px] leading-tight" style={{ color: "#D9C7A6" }}>
                  <span className="font-bold text-[26px]" style={{ color: "#E9A443" }}>{s.value}</span> {t(s.labelKey)}
                </p>
              ))}
            </div>
            {bookingXp > 0 && (
              <span
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[13px] font-bold flex-shrink-0"
                title={t("myTrip.xpFromBookings")}
                style={{
                  background: "linear-gradient(180deg, #F1D07A 0%, #D3A443 100%)",
                  color: "#2A1A0E",
                  boxShadow: "0 0 14px rgba(240,200,110,0.35)",
                }}
              >
                <Zap size={13} /> +{bookingXp} XP
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2.5">
            {bookings.slice(0, 2).map((b) => {
              const confirmed = b.status === "confirmed" || b.status === "completed";
              const accent = confirmed ? "rgba(96,170,110,0.65)" : "rgba(212,118,72,0.65)";
              return (
                <div
                  key={b.id}
                  className="rounded-2xl px-3.5 py-3"
                  style={{ backgroundColor: "rgba(0,0,0,0.22)", border: `1.5px solid ${accent}` }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[15px] font-semibold truncate" style={{ color: "#F5ECDB" }}>{b.tourTitle}</p>
                    {b.finalTotal != null && (
                      <p className="text-[15px] font-bold flex-shrink-0" style={{ color: "#E8B95A" }}>{b.finalTotal} GEL</p>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5" style={{ color: "#8C7A60" }}>
                    <span className="flex items-center gap-1.5 text-[13px] whitespace-nowrap">
                      <Calendar size={13} /> {formatDate(b.selectedDate, language)}
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px]">
                      <Users size={13} /> {b.peopleCount}
                    </span>
                    <span
                      className="ml-auto text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{
                        border: `1px solid ${accent}`,
                        backgroundColor: confirmed ? "rgba(96,170,110,0.12)" : "rgba(212,118,72,0.12)",
                        color: confirmed ? "#7FCB8C" : "#F2A15C",
                      }}
                    >
                      {t(STATUS_LABEL_KEYS[b.status])}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/my-trip"
            className="mt-4 flex items-center justify-center w-full py-3 rounded-full text-[15px] font-semibold"
            style={{
              color: "#E8B95A",
              border: "1.5px solid rgba(214,168,82,0.7)",
              background: "linear-gradient(180deg, rgba(120,90,40,0.35) 0%, rgba(80,58,25,0.25) 100%)",
            }}
          >
            {t("profile.viewMyTrip")}
          </Link>
        </div>
      )}

      {/* Tour Recommendations */}
      {recommendations.length > 0 && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#1A1408", borderColor: "rgba(110,75,138,0.2)" }}
        >
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Sparkles size={13} style={{ color: "#9B7DC8" }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#9B7DC8" }}>
              {t("profile.yourNextAdventure")}
            </span>
          </div>
          <div className="p-3 space-y-2">
            {recommendations.map((rec) => {
              const rawTour = tours.find((tour) => tour.slug === rec.slug);
              if (!rawTour) return null;
              const tour = getLocalizedTour(rawTour, language);
              return (
                <div
                  key={rec.slug}
                  className="rounded-xl p-3 flex items-start justify-between gap-3"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{tour.title}</p>
                    <p className="text-[10px] mt-0.5 leading-snug" style={{ color: "#7A6A52" }}>{rec.reason}</p>
                  </div>
                  <Link
                    href={`/tours/${rec.slug}`}
                    className="flex items-center gap-1 text-[10px] font-semibold flex-shrink-0"
                    style={{ color: "#C4923A" }}
                  >
                    {t("profile.view")} <ExternalLink size={9} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges — Passport Stamps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-bold tracking-[0.12em] uppercase" style={{ color: "#D9AE5C" }}>
            {t("profile.passportStamps")}
          </h2>
          <span className="text-[13px]" style={{ color: "#B5A68C" }}>
            {formatBadgesEarned(earnedBadgeSlugs.length, badges.length, language)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((raw) => {
            const badge = getLocalizedBadge(raw, language);
            const earned = earnedBadgeSlugs.includes(raw.tourSlug);
            return (
              <div
                key={badge.id}
                className="rounded-2xl px-3 py-5 text-center"
                title={earned ? badge.description : t("quest.completeToUnlock")}
                style={{
                  background: earned
                    ? "linear-gradient(160deg, #3A2B16 0%, #221A0F 100%)"
                    : "linear-gradient(160deg, #2B2620 0%, #191612 100%)",
                  border: earned ? "1.5px solid rgba(214,168,82,0.55)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: earned ? "0 0 16px rgba(217,174,92,0.15)" : undefined,
                }}
              >
                <div className="h-12 flex items-center justify-center">
                  {earned ? (
                    <span className="text-[40px] leading-none">{badge.icon}</span>
                  ) : (
                    <Lock size={36} strokeWidth={1.8} style={{ color: "#6E6A64" }} />
                  )}
                </div>
                <p className="mt-2 text-[14px] font-semibold" style={{ color: earned ? "#E8B95A" : "#8A8378" }}>
                  {badge.name}
                </p>
                {!earned && (
                  <p className="text-[11px] mt-0.5" style={{ color: "#5F5A52" }}>{t("quest.completeToUnlock")}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* No progress onboarding */}
      {hasNoProgress && (
        <div className="rounded-2xl bg-brand-dark border border-brand-gold/20 p-5 text-center space-y-3">
          <p className="text-2xl">🗺️</p>
          <h2 className="font-serif text-lg text-white font-semibold">
            {t("profile.startYourJourney")}
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            {t("profile.journeyDesc")}
          </p>
          <div className="flex flex-col gap-2">
            <input
              placeholder={t("profile.enterNameToBegin")}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              className="w-full bg-brand-black border border-brand-gold/30 rounded-xl px-3 py-2.5 text-sm text-white text-center focus:outline-none focus:border-brand-gold"
            />
            <button
              onClick={saveName}
              className="py-3 rounded-full text-sm font-semibold text-brand-black"
              style={{ backgroundColor: "#C4923A" }}
            >
              {t("profile.beginAdventure")}
            </button>
          </div>
          <Link href="/tours" className="text-xs text-brand-gold hover:underline">
            {t("profile.browseTours")}
          </Link>
        </div>
      )}
    </MotionPage>
    </div>
  );
}

function CompassMedallion() {
  return (
    <svg width="96" height="96" viewBox="0 0 120 120" aria-hidden="true" className="flex-shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
      <defs>
        <radialGradient id="cm-ring" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#F6D58E" />
          <stop offset="0.55" stopColor="#B9803A" />
          <stop offset="1" stopColor="#6A3F17" />
        </radialGradient>
        <radialGradient id="cm-face" cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#5A3A22" />
          <stop offset="1" stopColor="#2A190C" />
        </radialGradient>
        <linearGradient id="cm-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FCE7B0" />
          <stop offset="1" stopColor="#C58A3A" />
        </linearGradient>
        <linearGradient id="cm-needle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#8E949C" />
        </linearGradient>
      </defs>
      {/* outer 8-point rose behind the ring */}
      <g fill="url(#cm-star)" opacity="0.9">
        <polygon points="60,2 66,54 60,60 54,54" />
        <polygon points="118,60 66,66 60,60 66,54" />
        <polygon points="60,118 54,66 60,60 66,66" />
        <polygon points="2,60 54,54 60,60 54,66" />
      </g>
      <circle cx="60" cy="60" r="40" fill="url(#cm-ring)" stroke="#4A2A10" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="31" fill="url(#cm-face)" stroke="#D9A85A" strokeWidth="1.5" />
      {/* inner rose */}
      <g fill="url(#cm-star)">
        <polygon points="60,32 64,56 60,60 56,56" />
        <polygon points="88,60 64,64 60,60 64,56" />
        <polygon points="60,88 56,64 60,60 64,64" />
        <polygon points="32,60 56,56 60,60 56,64" />
      </g>
      <g fill="#E3B567" opacity="0.75">
        <polygon points="80,40 63,58 60,60 62,57" />
        <polygon points="80,80 62,63 60,60 63,62" />
        <polygon points="40,80 57,62 60,60 58,63" />
        <polygon points="40,40 58,57 60,60 57,58" />
      </g>
      {/* needle */}
      <polygon points="74,44 63,62 57,56" fill="url(#cm-needle)" />
      <polygon points="46,76 57,58 63,64" fill="#6B6F75" />
      <circle cx="60" cy="60" r="4" fill="#F6D58E" stroke="#6A3F17" strokeWidth="1" />
    </svg>
  );
}
