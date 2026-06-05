import Link from "next/link";
import { Trophy, Zap } from "lucide-react";

interface Props {
  variant?: "dark" | "light";
  compact?: boolean;
}

const REWARDS = [
  { rank: "1st", reward: "Free bonus seat + 500 XP", icon: "🥇" },
  { rank: "2nd", reward: "Free bonus seat + 250 XP", icon: "🥈" },
  { rank: "3rd", reward: "Free bonus seat + 100 XP", icon: "🥉" },
];

export default function DailyQuestChallenge({ variant = "dark", compact = false }: Props) {
  const isDark = variant === "dark";

  if (compact) {
    return (
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1A1208 0%, #2A1A0A 100%)"
            : "linear-gradient(135deg, #FFF8EC 0%, #FFF3DC 100%)",
          border: `1px solid ${isDark ? "rgba(200,155,60,0.18)" : "rgba(200,155,60,0.35)"}`,
        }}
      >
        <Trophy size={15} style={{ color: "#C4923A", flexShrink: 0 }} />
        <p className="text-xs flex-1" style={{ color: isDark ? "#8A7A60" : "#6A5A40" }}>
          <span className="font-semibold" style={{ color: isDark ? "#C4923A" : "#8A5A10" }}>
            Top 3 today
          </span>{" "}
          earn a free bonus seat on any tour.
        </p>
        <Link
          href="/leaderboard"
          className="text-[11px] font-semibold flex-shrink-0"
          style={{ color: "#C4923A" }}
        >
          Rankings →
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1A1208 0%, #251A0C 100%)"
          : "linear-gradient(135deg, #FFF8EC 0%, #FFF0D4 100%)",
        border: `1px solid ${isDark ? "rgba(200,155,60,0.2)" : "rgba(200,155,60,0.4)"}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(200,155,60,0.15)" }}
        >
          <Trophy size={16} style={{ color: "#C4923A" }} />
        </div>
        <div>
          <p
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{ color: "#C4923A" }}
          >
            Daily Quest Challenge
          </p>
          <p
            className="text-xs font-medium"
            style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#7B6F63" }}
          >
            Refreshes every day at midnight
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: isDark ? "#7A6A52" : "#5A4A38" }}>
        The{" "}
        <span className="font-semibold" style={{ color: "#C4923A" }}>
          3 highest-scoring explorers
        </span>{" "}
        each day earn a free bonus seat on any Ivera tour. Complete missions, earn XP, and claim yours.
      </p>

      {/* Rewards table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(200,155,60,0.06)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(200,155,60,0.15)"}`,
        }}
      >
        {REWARDS.map((r, i) => (
          <div
            key={r.rank}
            className="flex items-center justify-between px-4 py-2.5 text-xs"
            style={{
              borderBottom: i < REWARDS.length - 1
                ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(200,155,60,0.1)"}`
                : "none",
            }}
          >
            <span style={{ color: isDark ? "#7A6A52" : "#6A5A40" }}>
              {r.icon} {r.rank} place
            </span>
            <span className="font-semibold" style={{ color: isDark ? "#C4923A" : "#8A5A10" }}>
              {r.reward}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/leaderboard"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold transition-opacity active:opacity-80"
        style={{
          backgroundColor: "rgba(200,155,60,0.12)",
          color: "#C4923A",
          border: "1px solid rgba(200,155,60,0.25)",
        }}
      >
        <Zap size={13} /> See Today&apos;s Rankings
      </Link>
    </div>
  );
}
