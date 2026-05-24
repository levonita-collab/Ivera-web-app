"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, MapPin, Trophy } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import { tours } from "@/data/tours";
import { getTotalXP, getProfile, Profile } from "@/lib/questProgress";
import { getLevelForXP } from "@/data/rewards";
import { buildGeneralLink } from "@/lib/whatsapp";

const categories = [
  { label: "Culture", emoji: "🏛️", value: "culture" },
  { label: "Wine", emoji: "🍷", value: "wine" },
  { label: "Adventure", emoji: "⛰️", value: "adventure" },
  { label: "Heritage", emoji: "🏰", value: "heritage" },
];

const stats = [
  { label: "Active Explorers", value: "2,400+" },
  { label: "Tours Available", value: "8" },
  { label: "Georgia Regions", value: "6" },
];

function readXP(): number {
  if (typeof window === "undefined") return 0;
  return getTotalXP();
}
function readProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  return getProfile();
}

export default function HomePage() {
  const [xp] = useState(readXP);
  const [profile] = useState(readProfile);

  const level = getLevelForXP(xp);
  const featured = tours.slice(0, 3);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section
        className="relative min-h-[52vh] flex flex-col justify-end px-4 pb-8 pt-16"
        style={{
          background:
            "linear-gradient(180deg, #0F0C07 0%, #1A0A00 40%, #3B1A0A 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-black/80" />

        <motion.div
          className="relative z-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {xp > 0 && profile ? (
            <>
              <p className="text-brand-muted text-sm tracking-wide">
                Welcome back, {profile.name}
              </p>
              <h1 className="font-serif text-3xl text-white font-bold leading-tight">
                Your adventure<br />continues.
              </h1>
              <div className="flex gap-4">
                <div className="bg-brand-dark/80 border border-brand-gold/20 rounded-xl px-4 py-2.5">
                  <p className="text-[10px] tracking-widest text-brand-muted uppercase">
                    Ivera Points
                  </p>
                  <p className="text-brand-gold font-bold text-xl">{xp} XP</p>
                  <p className="text-[10px] text-brand-muted">{level.title}</p>
                </div>
                <div className="bg-brand-dark/80 border border-white/5 rounded-xl px-4 py-2.5">
                  <p className="text-[10px] tracking-widest text-brand-muted uppercase">
                    Level
                  </p>
                  <p className="text-white font-bold text-xl">{level.level}</p>
                  <p className="text-[10px] text-brand-muted">{level.title}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium">
                ✦ Explore Georgia ✦
              </p>
              <h1 className="font-serif text-4xl text-white font-bold leading-tight">
                Your journey<br />begins in<br />Georgia.
              </h1>
              <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
                Discover timeless culture, epic landscapes, and rich heritage
                through quests and rewards.
              </p>
              <div className="flex gap-3 pt-1">
                <Link
                  href="/tours"
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-brand-black"
                  style={{ backgroundColor: "#C4923A" }}
                >
                  Start Your Journey <ArrowRight size={15} />
                </Link>
                <Link
                  href="/profile"
                  className="px-5 py-3 rounded-full font-semibold text-sm text-white border border-white/20 hover:border-brand-gold transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </section>

      {/* Stats strip */}
      <section className="bg-brand-dark border-y border-white/5 py-4 px-4">
        <div className="flex justify-around">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-brand-gold font-bold text-lg">{s.value}</p>
              <p className="text-[10px] text-brand-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore categories */}
      <section className="px-4 pt-6 pb-2">
        <h2 className="text-xs font-semibold tracking-widest text-brand-muted uppercase mb-3">
          Explore Categories
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/tours?category=${cat.value}`}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-brand-dark border border-white/5 hover:border-brand-gold/30 transition-all"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-[10px] text-brand-muted font-medium">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured tours */}
      <section className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-white font-semibold">
            Featured Quests
          </h2>
          <Link
            href="/tours"
            className="text-xs text-brand-gold hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {featured.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      {/* Leaderboard teaser */}
      <section className="mx-4 mb-4 rounded-2xl bg-brand-dark border border-brand-gold/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} style={{ color: "#C4923A" }} />
          <h2 className="text-white font-semibold text-sm">Top Explorers</h2>
        </div>
        <div className="space-y-2">
          {[
            { name: "Nino G.", xp: 4580 },
            { name: "Luka T.", xp: 3920 },
            { name: "Mariam K.", xp: 3250 },
          ].map((p, i) => (
            <div key={p.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0
                      ? "bg-brand-gold text-brand-black"
                      : "bg-white/8 text-brand-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-brand-cream/80">{p.name}</span>
              </div>
              <span className="text-xs text-brand-gold font-semibold">{p.xp} XP</span>
            </div>
          ))}
        </div>
        <Link
          href="/leaderboard"
          className="mt-4 block text-center text-xs text-brand-gold font-medium hover:underline"
        >
          See full leaderboard →
        </Link>
      </section>

      {/* WhatsApp CTA */}
      <section className="mx-4 mb-6 rounded-2xl p-5 text-center border border-white/5 bg-brand-dark">
        <Star size={20} className="mx-auto mb-2" style={{ color: "#C4923A" }} />
        <h2 className="font-serif text-xl text-white font-semibold">
          Need a custom itinerary?
        </h2>
        <p className="mt-2 text-sm text-brand-muted leading-relaxed">
          Message Levani directly on WhatsApp — he builds personalised Georgian
          experiences for every traveller.
        </p>
        <a
          href={buildGeneralLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white"
          style={{ backgroundColor: "#25D366" }}
        >
          <MapPin size={15} /> Chat on WhatsApp
        </a>
      </section>
    </div>
  );
}
