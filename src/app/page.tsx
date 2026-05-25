"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Zap, ArrowRight, MessageCircle } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import IveraHero from "@/components/home/IveraHero";
import ExplorerPass from "@/components/home/ExplorerPass";
import { tours } from "@/data/tours";
import { getTotalXP, getProfile, Profile } from "@/lib/questProgress";
import { getLevelForXP } from "@/data/rewards";
import { buildGeneralLink } from "@/lib/whatsapp";

function readXP(): number {
  if (typeof window === "undefined") return 0;
  return getTotalXP();
}
function readProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  return getProfile();
}

const LEADERBOARD_PREVIEW = [
  { name: "Nino G.", xp: 4580 },
  { name: "Luka T.", xp: 3920 },
  { name: "Mariam K.", xp: 3250 },
];

export default function HomePage() {
  const [xp] = useState(readXP);
  const [profile, setProfile] = useState(readProfile);
  const [showPass, setShowPass] = useState(false);

  const level = getLevelForXP(xp);
  const featured = tours.slice(0, 3);
  const hasProfile = !!profile;

  function handlePassSaved() {
    setProfile(getProfile());
    setShowPass(false);
  }

  return (
    <div style={{ backgroundColor: "#F7F0E4" }}>
      {/* Hero */}
      {hasProfile ? (
        <ReturnHero
          profile={profile!}
          xp={xp}
          level={level}
          onStartQuest={() => setShowPass(true)}
        />
      ) : (
        <IveraHero onStartQuest={() => setShowPass(true)} />
      )}

      {/* Below-fold */}
      <div className="space-y-0">
        {/* Featured Quests */}
        <section className="px-4 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold" style={{ color: "#1F1A17" }}>
              Featured Quests
            </h2>
            <Link
              href="/tours"
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: "#C89B3C" }}
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            {featured.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </section>

        {/* Leaderboard teaser */}
        <section
          className="mx-4 mb-5 rounded-2xl p-5 border"
          style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} style={{ color: "#C89B3C" }} />
            <h2 className="font-semibold text-sm" style={{ color: "#1F1A17" }}>
              Top Explorers
            </h2>
          </div>
          <div className="space-y-3">
            {LEADERBOARD_PREVIEW.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: i === 0 ? "#C89B3C" : "rgba(31,26,23,0.08)",
                      color: i === 0 ? "#FFFFFF" : "#7B6F63",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "#1F1A17" }}>
                    {p.name}
                  </span>
                </div>
                <span className="text-xs font-semibold" style={{ color: "#C89B3C" }}>
                  {p.xp} XP
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/leaderboard"
            className="mt-4 block text-center text-xs font-semibold"
            style={{ color: "#C89B3C" }}
          >
            See full leaderboard →
          </Link>
        </section>

        {/* WhatsApp CTA */}
        <section
          className="mx-4 mb-8 rounded-2xl p-5 text-center"
          style={{ background: "linear-gradient(135deg, #1F1A17 0%, #2A1F14 100%)" }}
        >
          <MessageCircle size={22} className="mx-auto mb-2" style={{ color: "#C89B3C" }} />
          <h2 className="font-serif text-lg font-semibold text-white">
            Need a custom itinerary?
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#8A7A60" }}>
            Message Levani directly on WhatsApp — personalised Georgian experiences for every traveller.
          </p>
          <a
            href={buildGeneralLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={15} /> Chat on WhatsApp
          </a>
        </section>
      </div>

      {/* Explorer Pass modal */}
      {showPass && (
        <ExplorerPass onClose={() => setShowPass(false)} onSaved={handlePassSaved} />
      )}
    </div>
  );
}

function ReturnHero({
  profile,
  xp,
  level,
  onStartQuest,
}: {
  profile: Profile;
  xp: number;
  level: ReturnType<typeof getLevelForXP>;
  onStartQuest: () => void;
}) {
  return (
    <section
      className="relative px-4 pt-8 pb-8 flex flex-col justify-end"
      style={{
        background: "linear-gradient(160deg, #1F1A17 0%, #2A1A0A 55%, #3B1A0A 100%)",
        minHeight: "52vh",
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 60% 40%, rgba(200,155,60,0.2) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className="relative z-10 space-y-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm" style={{ color: "#8A7A60" }}>
          Welcome back,{" "}
          <span className="text-white font-medium">{profile.name}</span>
        </p>
        <h1 className="font-serif text-3xl font-bold text-white leading-tight">
          Your adventure<br />continues.
        </h1>
        <div className="flex gap-3">
          <div
            className="rounded-xl px-4 py-2.5 border"
            style={{
              backgroundColor: "rgba(200,155,60,0.12)",
              borderColor: "rgba(200,155,60,0.25)",
            }}
          >
            <p className="text-[10px] tracking-widest uppercase" style={{ color: "#8A7A60" }}>
              Ivera XP
            </p>
            <p className="font-bold text-xl" style={{ color: "#C89B3C" }}>
              {xp}
            </p>
            <p className="text-[10px]" style={{ color: "#8A7A60" }}>
              {level.title}
            </p>
          </div>
          <div
            className="rounded-xl px-4 py-2.5 border"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-[10px] tracking-widest uppercase" style={{ color: "#8A7A60" }}>
              Level
            </p>
            <p className="font-bold text-xl text-white">{level.level}</p>
            <p className="text-[10px]" style={{ color: "#8A7A60" }}>
              {level.title}
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <Link
            href="/tours"
            className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-white"
            style={{ backgroundColor: "#C89B3C" }}
          >
            Continue Quest <Zap size={14} />
          </Link>
          <button
            onClick={onStartQuest}
            className="px-4 py-3 rounded-full font-semibold text-sm border"
            style={{
              color: "rgba(255,255,255,0.7)",
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            Edit Pass
          </button>
        </div>
      </motion.div>
    </section>
  );
}
