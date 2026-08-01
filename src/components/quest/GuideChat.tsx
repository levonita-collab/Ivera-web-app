"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/dictionary";

interface DisplayMessage {
  role: "user" | "model";
  content: string;
}

interface Props {
  tourSlug: string;
  missionId: string;
  tourTitle: string;
  missionTitle: string;
  missionDescription: string;
  location: string;
  explorerId?: string;
  onClose: () => void;
}

export default function GuideChat({
  tourSlug,
  missionId,
  tourTitle,
  missionTitle,
  missionDescription,
  location,
  explorerId,
  onClose,
}: Props) {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: "model", content: t("quest.chatWelcome") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: DisplayMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/quest-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug,
          missionId,
          tourTitle,
          missionTitle,
          missionDescription,
          location,
          language,
          explorerId,
          // Only real turns go to the model — the local-only welcome line
          // isn't sent, keeping the prompt lean.
          messages: nextMessages
            .filter((m) => !(m.role === "model" && m.content === t("quest.chatWelcome")))
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [...prev, { role: "model", content: data.reply ?? t("quest.chatError") }]);
    } catch {
      setMessages((prev) => [...prev, { role: "model", content: t("quest.chatError") }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "rgba(8,6,3,0.97)" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 flex-shrink-0 border-b border-white/5">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest flex items-center gap-1.5" style={{ color: "#C4923A" }}>
            <Sparkles size={11} /> {t("quest.chatModalTitle")}
          </p>
          <h2 className="text-white font-semibold text-sm truncate">{missionTitle}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
              style={
                m.role === "user"
                  ? { backgroundColor: "#C4923A", color: "#0F0C07" }
                  : { backgroundColor: "#1A1408", color: "#E8D9C5", border: "1px solid rgba(255,255,255,0.06)" }
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-3.5 py-2.5 flex items-center gap-2"
              style={{ backgroundColor: "#1A1408", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Loader2 size={12} className="animate-spin" style={{ color: "#C4923A" }} />
              <span className="text-xs" style={{ color: "#8A7A60" }}>{t("quest.chatThinking")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 pt-2 border-t border-white/5 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t("quest.chatPlaceholder")}
          className="flex-1 px-4 py-3 rounded-full bg-white/10 text-white text-sm border border-white/15 focus:outline-none"
          style={{ borderColor: "rgba(196,146,58,0.4)" }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-brand-black transition-opacity"
          style={{ backgroundColor: "#C4923A", opacity: loading || !input.trim() ? 0.5 : 1 }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
