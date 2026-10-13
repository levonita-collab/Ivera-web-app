"use client";

import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { BONUS_TASKS } from "@/data/rewardRules";

interface Props {
  completed: string[];
  onComplete: (taskId: string, points: number) => void;
  isRu: boolean;
}

export default function BonusTasks({ completed, onComplete, isRu }: Props) {
  const doneCount = BONUS_TASKS.filter((t) => completed.includes(t.id)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-widest text-brand-muted uppercase flex items-center gap-1.5">
          <Sparkles size={12} style={{ color: "#C4923A" }} />
          {isRu ? "Бонусные задания" : "Bonus tasks"}
        </h2>
        <span className="text-[11px] font-semibold" style={{ color: "#C4923A" }}>
          {doneCount}/{BONUS_TASKS.length}
        </span>
      </div>
      <div className="space-y-2">
        {BONUS_TASKS.map((task) => {
          const done = completed.includes(task.id);
          return (
            <button
              key={task.id}
              onClick={() => !done && onComplete(task.id, task.points)}
              disabled={done}
              aria-pressed={done}
              className="w-full text-left flex items-start gap-3 rounded-xl px-3.5 py-3 border transition-colors"
              style={{
                backgroundColor: done ? "rgba(200,155,60,0.10)" : "#181410",
                borderColor: done ? "rgba(200,155,60,0.35)" : "rgba(255,255,255,0.06)",
              }}
            >
              {done ? (
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#C4923A" }} />
              ) : (
                <Circle size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#5A4A38" }} />
              )}
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">{isRu ? task.titleRu : task.title}</span>
                  <span className="text-[11px] font-semibold flex-shrink-0" style={{ color: "#C4923A" }}>
                    +{task.points} XP
                  </span>
                </span>
                <span className="block text-[11px] mt-0.5 leading-snug" style={{ color: "#7A6A52" }}>
                  {isRu ? task.descriptionRu : task.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[10px] leading-relaxed" style={{ color: "#5A4A38" }}>
        {isRu
          ? "Отмечайте сами — гид подтвердит их, когда будете получать приз. Все 3 задания открывают путь к золотой награде дня."
          : "Mark them yourself — your guide confirms them when you claim a prize. All 3 unlock the path to today's Gold reward."}
      </p>
    </div>
  );
}
