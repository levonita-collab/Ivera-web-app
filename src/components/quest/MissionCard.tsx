"use client";

import { useState } from "react";
import { CheckCircle, Camera, Eye, MessageSquare, Utensils, QrCode, MapPin, Lightbulb, Loader2 } from "lucide-react";
import { Mission } from "@/data/missions";

interface Props {
  mission: Mission;
  completed: boolean;
  onComplete: (missionId: string) => void;
  index: number;
  completing?: boolean;
  tourSlug?: string;
  explorerId?: string;
}

const typeIcons: Record<Mission["type"], React.ReactNode> = {
  qr: <QrCode size={12} />,
  photo: <Camera size={12} />,
  observation: <Eye size={12} />,
  quiz: <MessageSquare size={12} />,
  taste: <Utensils size={12} />,
};

const typeLabels: Record<Mission["type"], string> = {
  qr: "QR Scan",
  photo: "Photo",
  observation: "Observe",
  quiz: "Quiz",
  taste: "Taste",
};

const typeColors: Record<Mission["type"], string> = {
  qr: "#C89B3C",
  photo: "#2F5D50",
  observation: "#6E4B8A",
  quiz: "#1A5275",
  taste: "#6E1F2F",
};

const STATIC_FALLBACK =
  "Look carefully around the location. The answer is hidden in the story of this place.";

export default function MissionCard({
  mission,
  completed,
  onComplete,
  index,
  completing,
  tourSlug,
  explorerId,
}: Props) {
  const color = typeColors[mission.type];
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);

  async function fetchHint() {
    if (hintLoading || hint) return;
    setHintLoading(true);
    try {
      const res = await fetch("/api/ai/quest-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug,
          missionId: mission.id,
          missionTitle: mission.title,
          missionDescription: mission.description,
          location: mission.location,
          explorerId,
        }),
      });
      const data = await res.json() as { hint?: string };
      setHint(data.hint ?? STATIC_FALLBACK);
    } catch {
      setHint(STATIC_FALLBACK);
    } finally {
      setHintLoading(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        completed ? "border-brand-gold/35" : "border-white/8"
      }`}
      style={{
        backgroundColor: completed ? "rgba(200,155,60,0.06)" : "#1A1408",
      }}
    >
      {/* Top accent bar when completed */}
      {completed && (
        <div
          className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, #C4923A, #E0B85A, transparent)" }}
        />
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Step indicator */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold transition-all duration-300 ${
              completed ? "text-brand-black" : "text-brand-muted"
            }`}
            style={{
              backgroundColor: completed ? "#C4923A" : "rgba(255,255,255,0.06)",
              fontSize: completed ? undefined : "12px",
            }}
          >
            {completed ? <CheckCircle size={16} /> : index + 1}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className={`text-sm font-semibold leading-snug ${
                  completed ? "text-brand-gold" : "text-white"
                }`}
              >
                {mission.title}
              </h3>
              <span
                className="flex-shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: completed
                    ? "rgba(200,155,60,0.2)"
                    : "rgba(200,155,60,0.1)",
                  color: "#C4923A",
                }}
              >
                +{mission.points} XP
              </span>
            </div>

            <p className="flex items-center gap-1 text-[11px] mb-2" style={{ color: "#6A5A48" }}>
              <MapPin size={9} style={{ color: "#C4923A" }} />
              {mission.location}
            </p>

            <p className="text-xs leading-relaxed" style={{ color: completed ? "#8A7A60" : "#7A6A52" }}>
              {mission.description}
            </p>
          </div>
        </div>

        {/* Hint area */}
        {!completed && hint && (
          <div
            className="mt-3 rounded-xl px-3 py-2.5 text-xs leading-relaxed"
            style={{
              backgroundColor: "rgba(110,75,138,0.1)",
              border: "1px solid rgba(110,75,138,0.25)",
              color: "#C4B8D8",
            }}
          >
            <span className="flex items-center gap-1.5 text-[10px] font-semibold mb-1" style={{ color: "#9B7DC8" }}>
              <Lightbulb size={10} /> Quest Master Hint
            </span>
            {hint}
          </div>
        )}

        {/* Footer row */}
        <div
          className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Type badge + hint button */}
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${color}18`,
                color: color,
              }}
            >
              {typeIcons[mission.type]}
              {typeLabels[mission.type]}
            </span>
            {!completed && (
              <button
                onClick={fetchHint}
                disabled={hintLoading || !!hint}
                className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-opacity"
                style={{
                  backgroundColor: "rgba(110,75,138,0.12)",
                  color: hint ? "#6A5A78" : "#9B7DC8",
                  opacity: hintLoading ? 0.6 : 1,
                }}
              >
                {hintLoading ? (
                  <Loader2 size={9} className="animate-spin" />
                ) : (
                  <Lightbulb size={9} />
                )}
                {hint ? "Hint shown" : "Need a hint?"}
              </button>
            )}
          </div>

          {/* Action */}
          {completed ? (
            <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#4CAF50" }}>
              <CheckCircle size={12} /> Completed
            </span>
          ) : (
            <button
              onClick={() => onComplete(mission.id)}
              disabled={completing}
              className="text-xs px-4 py-2 rounded-full font-semibold text-brand-black transition-all active:scale-95"
              style={{
                backgroundColor: completing ? "#8A7A60" : "#C4923A",
                opacity: completing ? 0.7 : 1,
              }}
            >
              {completing ? "Scanning…" : "Demo Scan ✦"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
