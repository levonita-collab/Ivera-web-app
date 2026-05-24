"use client";

import { CheckCircle, Camera, Eye, MessageSquare, Utensils, QrCode } from "lucide-react";
import { Mission } from "@/data/missions";

interface Props {
  mission: Mission;
  completed: boolean;
  onComplete: (missionId: string) => void;
  index: number;
}

const typeIcons: Record<Mission["type"], React.ReactNode> = {
  qr: <QrCode size={14} />,
  photo: <Camera size={14} />,
  observation: <Eye size={14} />,
  quiz: <MessageSquare size={14} />,
  taste: <Utensils size={14} />,
};

const typeLabels: Record<Mission["type"], string> = {
  qr: "QR Scan",
  photo: "Photo",
  observation: "Observe",
  quiz: "Quiz",
  taste: "Taste",
};

export default function MissionCard({ mission, completed, onComplete, index }: Props) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 ${
        completed
          ? "bg-brand-gold/8 border-brand-gold/30"
          : "bg-brand-dark border-white/8"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Step number */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
            completed
              ? "bg-brand-gold text-brand-black"
              : "bg-white/8 text-brand-muted"
          }`}
        >
          {completed ? <CheckCircle size={14} /> : index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-sm font-semibold ${completed ? "text-brand-gold" : "text-white"}`}>
              {mission.title}
            </h3>
            <span className="text-xs font-semibold text-brand-gold shrink-0">
              +{mission.points} XP
            </span>
          </div>

          <p className="text-xs text-brand-muted mt-0.5">{mission.location}</p>

          <p className="text-xs text-brand-cream/70 mt-2 leading-relaxed">
            {mission.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-brand-muted">
              {typeIcons[mission.type]}
              {typeLabels[mission.type]}
            </span>

            {!completed && (
              <button
                onClick={() => onComplete(mission.id)}
                className="text-xs px-3 py-1.5 rounded-full font-semibold text-brand-black transition-all active:scale-95"
                style={{ backgroundColor: "#C4923A" }}
              >
                Demo Scan ✦
              </button>
            )}

            {completed && (
              <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                <CheckCircle size={12} /> Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
