"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { Zap, Map, Award, Edit3, Calendar, Users, ChevronRight } from "lucide-react";
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
import RewardBadge from "@/components/quest/RewardBadge";
import { saveExplorerToSupabase } from "@/lib/supabase/explorerService";
import { getLocalBookings } from "@/lib/localBookings";
import { getUserBookings } from "@/lib/supabase/bookingService";
import type { LocalBookingSummary } from "@/lib/bookingTypes";

function readInitialXP(): number {
  if (typeof window === "undefined") return 0;
  return getTotalXP();
}
function readInitialProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  return getProfile();
}

export default function ProfilePage() {
  const [xp] = useState(readInitialXP);
  const [profile, setProfile] = useState(readInitialProfile);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bookings, setBookings] = useState<LocalBookingSummary[]>([]);

  useEffect(() => {
    const local = getLocalBookings();
    setBookings(local);
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
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);

  const { completedTourSlugs, earnedBadgeSlugs } = useMemo(() => {
    if (typeof window === "undefined") return { completedTourSlugs: [], earnedBadgeSlugs: [] };
    const allProgress = getAllQuestProgress();
    const completed: string[] = [];
    const earned: string[] = [];
    for (const tour of tours) {
      if (allProgress[tour.slug]) {
        completed.push(tour.slug);
        earned.push(tour.slug);
      }
    }
    return { completedTourSlugs: completed, earnedBadgeSlugs: earned };
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
  const level = getLevelForXP(xp);
  const nextLevel = xp < level.maxXp ? level.maxXp : null;
  const progressPct =
    nextLevel !== null
      ? Math.round(((xp - level.minXp) / (level.maxXp - level.minXp)) * 100)
      : 100;

  const hasNoProgress = xp === 0 && !profile;

  return (
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
    <MotionPage className="px-4 py-6 space-y-5">

      {/* ── Explorer Passport Card ── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(200,155,60,0.22)", background: "linear-gradient(135deg, #1A1408 0%, #231B0C 100%)" }}
      >
        {/* Passport header strip */}
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(200,155,60,0.12)", background: "rgba(200,155,60,0.06)" }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: "#C4923A" }}>
            ✦ Explorer Passport
          </span>
          <span className="text-[10px]" style={{ color: "#5A4A38" }}>
            IVERA · GEORGIA
          </span>
        </div>

        {/* Passport body */}
        <div className="px-4 py-4 flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{
              backgroundColor: "#C4923A",
              color: "#1A0E04",
              boxShadow: "0 0 0 2px rgba(200,155,60,0.3)",
            }}
          >
            {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>

          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  placeholder="Your name"
                  className="flex-1 bg-brand-black border border-brand-gold/40 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                  maxLength={30}
                />
                <button
                  onClick={saveName}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-brand-black"
                  style={{ backgroundColor: "#C4923A" }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-xl text-white font-semibold truncate">
                  {profile?.name ?? "Explorer"}
                </h1>
                <button onClick={startEditing} className="text-brand-muted hover:text-white transition-colors">
                  <Edit3 size={13} />
                </button>
              </div>
            )}
            <p className="text-xs font-semibold mt-0.5" style={{ color: "#C4923A" }}>
              Level {level.level} · {level.title}
            </p>
            {profile?.country && (
              <p className="text-[11px] mt-0.5" style={{ color: "#5A4A38" }}>
                {profile.country}
              </p>
            )}
          </div>
        </div>

        {/* XP progress section */}
        <div className="px-4 pb-4 space-y-2">
          <div className="flex justify-between text-[11px]">
            <span style={{ color: "#5A4A38" }}>Quest XP</span>
            <span className="font-semibold" style={{ color: "#C4923A" }}>
              <AnimatedCounter to={xp} duration={1.2} /> XP
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #C4923A, #E0B85A)",
              }}
            />
          </div>
          {nextLevel !== null && (
            <p className="text-[10px]" style={{ color: "#5A4A38" }}>
              {nextLevel - xp} XP to reach Level {level.level + 1}
            </p>
          )}
        </div>

        {/* Interests chips */}
        {profile?.interests && profile.interests.length > 0 && (
          <div
            className="px-4 py-3 flex flex-wrap gap-1.5"
            style={{ borderTop: "1px solid rgba(200,155,60,0.1)" }}
          >
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{
                  backgroundColor: "rgba(196,146,58,0.1)",
                  color: "#C4923A",
                  border: "1px solid rgba(196,146,58,0.2)",
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-3"
        variants={containerVariants}
        initial={reduced ? false : "hidden"}
        animate="show"
      >
        {[
          { icon: <Zap size={16} />, label: "Total XP", value: xp },
          { icon: <Map size={16} />, label: "Tours", value: completedTourSlugs.length },
          { icon: <Award size={16} />, label: "Badges", value: earnedBadgeSlugs.length },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={itemVariants}
            className="bg-brand-dark rounded-xl border border-white/5 p-3 text-center"
          >
            <div className="flex justify-center mb-1" style={{ color: "#C4923A" }}>
              {s.icon}
            </div>
            <p className="text-lg font-bold text-white">
              <AnimatedCounter to={s.value} duration={1.0} />
            </p>
            <p className="text-[10px] text-brand-muted">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Booking Summary */}
      {bookings.length > 0 && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#1A1408", borderColor: "rgba(200,155,60,0.15)" }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C4923A" }}>
              My Bookings
            </span>
            <Link
              href="/my-trip"
              className="flex items-center gap-1 text-[11px] font-semibold"
              style={{ color: "#C4923A" }}
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 divide-x divide-white/5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { label: "Booked", value: bookings.length, color: "#C4923A" },
              { label: "Pending", value: bookings.filter(b => b.status === "pending" || b.status === "contacted").length, color: "#C4923A" },
              { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "#4CAF50" },
              { label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "#2F5D50" },
            ].map((s) => (
              <div key={s.label} className="py-3 text-center" style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-base font-bold" style={{ color: s.value > 0 ? s.color : "#5A4A38" }}>
                  {s.value}
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: "#5A4A38" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* XP from bookings */}
          {bookings.reduce((s, b) => s + b.xpReward, 0) > 0 && (
            <div
              className="px-4 py-2.5 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-xs" style={{ color: "#7A6A52" }}>XP from bookings</span>
              <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#C4923A" }}>
                <Zap size={11} /> +{bookings.reduce((s, b) => s + b.xpReward, 0)} XP
              </span>
            </div>
          )}

          {/* Latest 2 bookings */}
          <div className="p-3 space-y-2">
            {bookings.slice(0, 2).map((b) => (
              <div
                key={b.id}
                className="rounded-xl px-3 py-2.5 flex items-start justify-between gap-2"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{b.tourTitle}</p>
                  <div className="flex items-center gap-3 mt-0.5" style={{ color: "#5A4A38" }}>
                    <span className="flex items-center gap-1 text-[10px]">
                      <Calendar size={9} /> {b.selectedDate}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]">
                      <Users size={9} /> {b.peopleCount}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {b.finalTotal != null && (
                    <p className="text-xs font-bold" style={{ color: "#C4923A" }}>{b.finalTotal} GEL</p>
                  )}
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: b.status === "confirmed" ? "rgba(76,175,80,0.12)" : "rgba(200,155,60,0.1)",
                      color: b.status === "confirmed" ? "#4CAF50" : "#C4923A",
                    }}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 pb-3">
            <Link
              href="/my-trip"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(200,155,60,0.1)", color: "#C4923A" }}
            >
              View My Trip
            </Link>
          </div>
        </div>
      )}

      {/* Badges — Passport Stamps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold tracking-widest text-brand-muted uppercase">
            Passport Stamps
          </h2>
          <span className="text-[11px]" style={{ color: "#5A4A38" }}>
            {earnedBadgeSlugs.length} / {badges.length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <RewardBadge
              key={badge.id}
              badge={badge}
              earned={earnedBadgeSlugs.includes(badge.tourSlug)}
            />
          ))}
        </div>
      </div>

      {/* No progress onboarding */}
      {hasNoProgress && (
        <div className="rounded-2xl bg-brand-dark border border-brand-gold/20 p-5 text-center space-y-3">
          <p className="text-2xl">🗺️</p>
          <h2 className="font-serif text-lg text-white font-semibold">
            Start Your Journey
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            Complete quests across Georgia to earn XP, collect badges, and climb
            the leaderboard.
          </p>
          <div className="flex flex-col gap-2">
            <input
              placeholder="Enter your name to begin"
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
              Begin Adventure
            </button>
          </div>
          <Link href="/tours" className="text-xs text-brand-gold hover:underline">
            Browse tours →
          </Link>
        </div>
      )}
    </MotionPage>
    </div>
  );
}
