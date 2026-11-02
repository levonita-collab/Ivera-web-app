"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, MessageCircle } from "lucide-react";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";
import { FAQ_EN, FAQ_RU } from "@/data/faq";

export default function FaqPage() {
  const { language } = useTranslation();
  const isRu = language === "ru";
  const items = isRu ? FAQ_RU : FAQ_EN;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: "#0A0805", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium"
          style={{ color: "#5A4A38" }}
        >
          <ArrowLeft size={14} />
          {isRu ? "На главную" : "Home"}
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#C89B3C" }}>
            FAQ
          </p>
          <h1 className="font-serif text-2xl font-bold text-white">
            {isRu ? "Часто задаваемые вопросы" : "Frequently Asked Questions"}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Не нашли ответа? Напишите Левани — он ответит в течение часа."
              : "Can't find an answer? Message Levani — he replies within an hour."}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "#1A1408",
                borderColor: open === i ? "rgba(200,155,60,0.25)" : "rgba(255,255,255,0.05)",
              }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-white leading-snug">
                  {item.q}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    color: "#C89B3C",
                    flexShrink: 0,
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {open === i && (
                <div
                  className="px-4 pb-4 text-sm leading-relaxed"
                  style={{ color: "#7A6A52" }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div
          className="rounded-2xl border p-5 text-center space-y-3"
          style={{ backgroundColor: "rgba(37,211,102,0.04)", borderColor: "rgba(37,211,102,0.18)" }}
        >
          <p className="text-sm font-semibold text-white">
            {isRu ? "Остались вопросы?" : "Still have questions?"}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
            {isRu
              ? "Левани отвечает в WhatsApp в течение часа."
              : "Levani answers on WhatsApp within an hour."}
          </p>
          <a
            href={buildGeneralLink(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={16} />
            {isRu ? "Написать в WhatsApp" : "Chat on WhatsApp"}
          </a>
        </div>

      </div>
    </div>
  );
}
