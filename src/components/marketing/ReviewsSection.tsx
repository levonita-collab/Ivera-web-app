"use client";

import Link from "next/link";
import { MessageCircle, Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import { buildGeneralLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";
import type { Language } from "@/lib/i18n/LanguageContext";

export default function ReviewsSection() {
  const { language } = useTranslation();
  const isRu = language === "ru";

  if (reviews.length === 0) {
    return <ReviewsEmpty isRu={isRu} language={language} />;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between px-1">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#C89B3C" }}>
            {isRu ? "Отзывы гостей" : "Guest reviews"}
          </p>
          <h2 className="font-serif text-xl font-bold text-white mt-0.5">
            {isRu ? "Что говорят туристы" : "What travellers say"}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-sm" style={{ color: "#C89B3C" }}>
          {"★".repeat(5)}
          <span className="text-[11px] ml-1" style={{ color: "#7A6A52" }}>
            {reviews.length} {isRu ? "отзывов" : "reviews"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => {
          const displayText = isRu && r.textRu ? r.textRu : r.text;
          return (
            <div
              key={r.id}
              className="rounded-2xl border p-4 space-y-3"
              style={{ backgroundColor: "#1A1408", borderColor: "rgba(255,255,255,0.06)" }}
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < r.rating ? "#C89B3C" : "none"}
                    style={{ color: i < r.rating ? "#C89B3C" : "#3A2A1A" }}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm leading-relaxed" style={{ color: "#C8B89A" }}>
                "{displayText}"
              </p>

              {/* Author + tour */}
              <div className="flex items-center justify-between text-[11px]">
                <span style={{ color: "#7A6A52" }}>
                  {r.countryFlag} <strong style={{ color: "#9A8A78" }}>{r.name}</strong>
                  {" · "}{r.country}
                </span>
                <span style={{ color: "#5A4A38" }}>
                  {r.date}
                </span>
              </div>

              {/* Tour label */}
              <div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(200,155,60,0.08)", color: "#C89B3C", border: "1px solid rgba(200,155,60,0.15)" }}
                >
                  {r.tourTitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ReviewsEmpty({ isRu, language }: { isRu: boolean; language: Language }) {
  return (
    <section
      className="rounded-2xl border p-5 text-center space-y-3"
      style={{ backgroundColor: "#1A1408", borderColor: "rgba(200,155,60,0.10)" }}
    >
      <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#C89B3C" }}>
        {isRu ? "Отзывы гостей" : "Guest reviews"}
      </p>
      <div className="flex items-center justify-center gap-0.5 text-lg" style={{ color: "#3A2A1A" }}>
        {"★★★★★"}
      </div>
      <p className="text-sm font-semibold text-white">
        {isRu ? "Собираем первые отзывы" : "Collecting our first reviews"}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
        {isRu
          ? "Уже провели туры для сотен гостей. Если вы уже путешествовали с нами — напишите Левани, он будет рад вашему отзыву."
          : "We've already guided hundreds of guests. If you've travelled with us — message Levani, he'd love to hear from you."}
      </p>
      <a
        href={buildGeneralLink(language)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle size={15} />
        {isRu ? "Оставить отзыв" : "Leave a review"}
      </a>
      <p className="text-[10px]" style={{ color: "#4A3A2A" }}>
        {isRu
          ? "Или на Google: поищите «Ivera Tours Tbilisi»"
          : "Or on Google: search «Ivera Tours Tbilisi»"}
      </p>
    </section>
  );
}
