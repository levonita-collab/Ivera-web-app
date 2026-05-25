"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Zap, Map, Award, Edit3 } from "lucide-react";
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
      joinedAt: profile?.joinedAt ?? new Date().toISOString(),
    };
    saveProfile(updated);
    setProfile(updated);
    setEditingName(false);
  }

  const level = getLevelForXP(xp);
  const nextLevel = xp < level.maxXp ? level.maxXp : null;
  const progressPct =
    nextLevel !== null
      ? Math.round(((xp - level.minXp) / (level.maxXp - level.minXp)) * 100)
      : 100;

  const hasNoProgress = xp === 0 && !profile;

  return (
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
    <div className="px-4 py-6 space-y-5">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-brand-black flex-shrink-0"
          style={{ backgroundColor: "#C4923A" }}
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
                className="flex-1 bg-brand-dark border border-brand-gold/40 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
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
              <button onClick={startEditing} className="text-brand-muted hover:text-white">
                <Edit3 size={14} />
              </button>
            </div>
          )}
          <p className="text-xs text-brand-gold font-medium">
            Level {level.level} {level.title}
          </p>
        </div>
      </div>

      {/* XP bar */}
      <div className="bg-brand-dark rounded-2xl border border-white/5 p-4 space-y-2">
        <div className="flex justify-between text-xs text-brand-muted">
          <span>Total XP</span>
          <span className="text-brand-gold font-semibold">{xp} XP</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #C4923A, #E0B85A)",
            }}
          />
        </div>
        {nextLevel !== null && (
          <p className="text-[10px] text-brand-muted">
            {nextLevel - xp} XP to Level {level.level + 1}
          </p>
        )}
      </div>

      {/* Explorer Pass details */}
      {profile && (profile.country || (profile.interests && profile.interests.length > 0)) && (
        <div className="bg-brand-dark rounded-2xl border border-white/5 p-4 space-y-2">
          {profile.country && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-brand-muted">From</span>
              <span className="text-white font-medium">{profile.country}</span>
            </div>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {profile.interests.map((i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{
                    backgroundColor: "rgba(196,146,58,0.12)",
                    color: "#C4923A",
                    border: "1px solid rgba(196,146,58,0.25)",
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Zap size={16} />, label: "Total XP", value: xp },
          { icon: <Map size={16} />, label: "Tours", value: completedTourSlugs.length },
          { icon: <Award size={16} />, label: "Badges", value: earnedBadgeSlugs.length },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-brand-dark rounded-xl border border-white/5 p-3 text-center"
          >
            <div className="flex justify-center mb-1" style={{ color: "#C4923A" }}>
              {s.icon}
            </div>
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[10px] text-brand-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest text-brand-muted uppercase mb-3">
          Badges
        </h2>
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
    </div>
    </div>
  );
}
