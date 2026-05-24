"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Crown, Trophy } from "lucide-react";
import { getTotalXP, getProfile } from "@/lib/questProgress";
import { getLevelForXP } from "@/data/rewards";

interface Player {
  name: string;
  xp: number;
  isYou?: boolean;
}

const DEMO_PLAYERS: Player[] = [
  { name: "Nino G.", xp: 4580 },
  { name: "Luka T.", xp: 3920 },
  { name: "Mariam K.", xp: 3250 },
  { name: "Giorgi P.", xp: 2910 },
  { name: "Ana B.", xp: 2120 },
  { name: "David R.", xp: 1980 },
  { name: "Elene S.", xp: 1760 },
];

function readUserXP(): number {
  if (typeof window === "undefined") return 0;
  return getTotalXP();
}
function readUserName(): string {
  if (typeof window === "undefined") return "You";
  return getProfile()?.name ?? "You";
}

export default function LeaderboardPage() {
  const [userXP] = useState(readUserXP);
  const [userName] = useState(readUserName);

  const players = useMemo<Player[]>(() => {
    if (userXP > 0) {
      return [...DEMO_PLAYERS, { name: userName, xp: userXP, isYou: true }].sort(
        (a, b) => b.xp - a.xp
      );
    }
    return DEMO_PLAYERS;
  }, [userXP, userName]);

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Trophy size={20} style={{ color: "#C4923A" }} />
        <h1 className="font-serif text-2xl text-white font-bold">Leaderboard</h1>
      </div>

      {/* Tab strip (static for MVP) */}
      <div className="flex gap-2">
        {["Global", "Friends", "Regional"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              i === 0
                ? "bg-brand-gold text-brand-black border-brand-gold"
                : "bg-transparent text-brand-muted border-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-3 pt-2">
        {/* 2nd place */}
        {top3[1] && (
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-brand-dark border-2 border-white/20 flex items-center justify-center text-lg font-bold text-white">
              {top3[1].name.charAt(0)}
            </div>
            <p className="text-xs text-brand-cream/80 font-medium text-center leading-tight">
              {top3[1].name}
            </p>
            <p className="text-xs text-brand-muted">{top3[1].xp} XP</p>
            <div className="w-full h-12 rounded-t-lg bg-brand-dark border border-white/5 flex items-center justify-center text-xl font-bold text-white/40">
              2
            </div>
          </div>
        )}

        {/* 1st place */}
        {top3[0] && (
          <div className="flex flex-col items-center gap-2 flex-1">
            <Crown size={16} style={{ color: "#C4923A" }} />
            <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold text-brand-black"
              style={{ backgroundColor: "#C4923A", borderColor: "#E0B85A" }}>
              {top3[0].name.charAt(0)}
            </div>
            <p className="text-xs text-brand-cream font-semibold text-center leading-tight">
              {top3[0].name}
            </p>
            <p className="text-xs text-brand-gold font-bold">{top3[0].xp} XP</p>
            <div className="w-full h-16 rounded-t-lg flex items-center justify-center text-xl font-bold border border-brand-gold/30"
              style={{ background: "linear-gradient(180deg, #C4923A22 0%, #C4923A11 100%)" }}>
              <span className="text-brand-gold">1</span>
            </div>
          </div>
        )}

        {/* 3rd place */}
        {top3[2] && (
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-brand-dark border-2 border-white/10 flex items-center justify-center text-lg font-bold text-white/60">
              {top3[2].name.charAt(0)}
            </div>
            <p className="text-xs text-brand-cream/60 font-medium text-center leading-tight">
              {top3[2].name}
            </p>
            <p className="text-xs text-brand-muted">{top3[2].xp} XP</p>
            <div className="w-full h-8 rounded-t-lg bg-brand-dark border border-white/5 flex items-center justify-center text-xl font-bold text-white/30">
              3
            </div>
          </div>
        )}
      </div>

      {/* Rest of rankings */}
      <div className="space-y-2">
        {rest.map((player, i) => {
          const rank = i + 4;
          const level = getLevelForXP(player.xp);
          return (
            <div
              key={player.name}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 border transition-all ${
                player.isYou
                  ? "bg-brand-gold/10 border-brand-gold/30"
                  : "bg-brand-dark border-white/5"
              }`}
            >
              <span className="w-6 text-xs text-brand-muted font-medium text-center">
                {rank}
              </span>
              <div className="w-9 h-9 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                {player.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${player.isYou ? "text-brand-gold" : "text-white"}`}>
                  {player.name}{player.isYou && " (You)"}
                </p>
                <p className="text-[10px] text-brand-muted">{level.title}</p>
              </div>
              <span className="text-sm font-semibold text-brand-gold">
                {player.xp} XP
              </span>
            </div>
          );
        })}
      </div>

      {userXP === 0 && (
        <div className="rounded-xl bg-brand-dark border border-brand-gold/20 p-4 text-center">
          <p className="text-sm text-brand-muted">
            Complete quests to appear on the leaderboard!
          </p>
          <Link
            href="/tours"
            className="mt-2 inline-block text-xs text-brand-gold font-medium hover:underline"
          >
            Browse tours →
          </Link>
        </div>
      )}
    </div>
  );
}
