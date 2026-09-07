"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, KeyRound } from "lucide-react";
import { useTranslation } from "@/lib/i18n/dictionary";

interface Props {
  tourSlug: string;
  missionId: string;
  missionTitle: string;
  missionDescription: string;
  location: string;
  explorerId?: string;
  disabled?: boolean;
  onVerified: () => void;
}

export default function AnswerVerifier({
  tourSlug,
  missionId,
  missionTitle,
  missionDescription,
  location,
  explorerId,
  disabled,
  onVerified,
}: Props) {
  const { t, language } = useTranslation();
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  async function handleSubmit() {
    const trimmed = answer.trim();
    if (!trimmed || checking) return;
    setChecking(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai/check-mission-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug,
          missionId,
          missionTitle,
          missionDescription,
          location,
          answer: trimmed,
          language,
          explorerId,
        }),
      });
      const data = (await res.json()) as { isCorrect?: boolean; feedback?: string };
      const isCorrect = Boolean(data.isCorrect);
      setFeedback({ isCorrect, text: data.feedback ?? "" });

      if (isCorrect) {
        setTimeout(() => onVerified(), 900);
      }
    } catch {
      setFeedback({ isCorrect: false, text: t("quest.chatError") });
    } finally {
      setChecking(false);
    }
  }

  if (disabled) return null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-[10px] mt-1.5 transition-opacity"
        style={{ color: "#6A5A48" }}
      >
        <KeyRound size={9} /> {t("quest.orTypeAnswer")}
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-1.5">
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={t("quest.answerPlaceholder")}
          className="flex-1 px-3 py-2 rounded-xl bg-white/5 text-white text-xs border border-white/10 focus:outline-none"
          style={{ borderColor: "rgba(196,146,58,0.3)" }}
        />
        <button
          onClick={handleSubmit}
          disabled={checking || !answer.trim()}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-brand-black transition-opacity"
          style={{ backgroundColor: "#C4923A", opacity: checking || !answer.trim() ? 0.5 : 1 }}
        >
          {checking ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
        </button>
      </div>
      {feedback && (
        <p
          className="text-[10px] leading-relaxed flex items-start gap-1"
          style={{ color: feedback.isCorrect ? "#4CAF50" : "#C4923A" }}
        >
          {feedback.isCorrect && <CheckCircle2 size={10} className="flex-shrink-0 mt-0.5" />}
          {feedback.text}
        </p>
      )}
    </div>
  );
}
