"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Users, MessageCircle, Zap, ChevronLeft, MapPin } from "lucide-react";
import { tours } from "@/data/tours";
import { buildCustomComboLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";
import { getLocalizedTour } from "@/lib/i18n/localize";

// Discount tiers
function discountPct(count: number): number {
  if (count >= 4) return 15;
  if (count === 3) return 10;
  if (count === 2) return 5;
  return 0;
}

const CATEGORY_EMOJI: Record<string, string> = {
  culture: "🏛️",
  adventure: "⛰️",
  wine: "🍷",
  heritage: "🏰",
};

export default function PackagesPage() {
  const { language } = useTranslation();
  const localizedTours = tours.map((t) => getLocalizedTour(t, language));

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [guests, setGuests] = useState(2);

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const selectedTours = localizedTours.filter((t) => selected.has(t.slug));
  const count = selectedTours.length;
  const pct = discountPct(count);

  const pricing = useMemo(() => {
    const priced = selectedTours.filter((t) => t.pricePerPersonGel !== null);
    const hasUnpriced = selectedTours.some((t) => t.pricePerPersonGel === null);
    if (priced.length === 0) return null;

    const subtotal = priced.reduce((s, t) => s + (t.pricePerPersonGel ?? 0), 0) * guests;
    const discountAmount = Math.round(subtotal * pct / 100);
    const finalTotal = subtotal - discountAmount;
    const depositAmount = Math.round(finalTotal * 0.2);
    return { subtotal, discountAmount, finalTotal, depositAmount, hasUnpriced };
  }, [selectedTours, guests, pct]);

  function openWhatsApp() {
    const url = buildCustomComboLink({
      tourTitles: selectedTours.map((t) => t.title),
      guestCount: guests,
      subtotal: pricing?.subtotal ?? null,
      discountPct: pct,
      discountAmount: pricing?.discountAmount ?? null,
      finalTotal: pricing?.finalTotal ?? null,
      depositAmount: pricing?.depositAmount ?? null,
      language,
    });
    window.open(url, "_blank");
  }

  const isRu = language === "ru";

  return (
    <div style={{ backgroundColor: "#F7F0E4", minHeight: "100%", paddingBottom: count >= 2 ? "180px" : "80px" }}>
      <div className="px-4 pt-5 pb-4 space-y-5">

        {/* Back */}
        <Link
          href="/tours"
          className="inline-flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: "#7B6F63" }}
        >
          <ChevronLeft size={14} />
          {isRu ? "Все туры" : "All tours"}
        </Link>

        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: "#1F1A17" }}>
            {isRu ? "Собери свой маршрут" : "Build Your Trip"}
          </h1>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: "#7B6F63" }}>
            {isRu
              ? "Выбери 2 или больше туров — чем больше, тем выше скидка."
              : "Select 2 or more tours — the more you add, the bigger your discount."}
          </p>
        </div>

        {/* Discount tier chips */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: isRu ? "2 тура → −5%" : "2 tours → −5%", active: count >= 2 },
            { label: isRu ? "3 тура → −10%" : "3 tours → −10%", active: count >= 3 },
            { label: isRu ? "4+ тура → −15%" : "4+ tours → −15%", active: count >= 4 },
          ].map(({ label, active }) => (
            <span
              key={label}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{
                backgroundColor: active ? "rgba(200,155,60,0.18)" : "rgba(200,155,60,0.07)",
                color: active ? "#C89B3C" : "#B0A08A",
                border: `1px solid ${active ? "rgba(200,155,60,0.4)" : "rgba(200,155,60,0.15)"}`,
                transition: "all 0.15s",
              }}
            >
              {active ? "✓ " : ""}{label}
            </span>
          ))}
        </div>

        {/* Tour cards */}
        <div className="space-y-3">
          {localizedTours.map((tour) => {
            const isSelected = selected.has(tour.slug);
            return (
              <button
                key={tour.slug}
                onClick={() => toggle(tour.slug)}
                className="w-full text-left rounded-2xl overflow-hidden border-2 transition-all"
                style={{
                  borderColor: isSelected ? "#C89B3C" : "transparent",
                  backgroundColor: "#FFFDF8",
                  boxShadow: isSelected
                    ? "0 0 0 3px rgba(200,155,60,0.15)"
                    : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex items-stretch gap-0">
                  {/* Image */}
                  <div className="relative w-24 flex-shrink-0">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    {/* Selected overlay */}
                    {isSelected && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(200,155,60,0.45)" }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#C89B3C" }}
                        >
                          <Check size={14} color="white" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-3 py-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug" style={{ color: "#1F1A17" }}>
                        {tour.title}
                      </h3>
                      <span
                        className="flex-shrink-0 text-[11px] font-bold"
                        style={{ color: tour.pricePerPersonGel ? "#C89B3C" : "#7B6F63" }}
                      >
                        {tour.pricePerPersonGel
                          ? `${tour.pricePerPersonGel} ₾`
                          : (isRu ? "По запросу" : "On request")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]" style={{ color: "#9A8A78" }}>
                      <span>{CATEGORY_EMOJI[tour.category]} {tour.duration}</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={9} /> {tour.region}
                      </span>
                    </div>

                    {tour.pricePerPersonGel && (
                      <p className="text-[10px]" style={{ color: "#B0A08A" }}>
                        {isRu ? "за чел." : "per person"}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* No tours selected hint */}
        {count === 0 && (
          <p className="text-center text-sm py-4" style={{ color: "#B0A08A" }}>
            {isRu ? "👆 Выбери туры выше, чтобы начать" : "👆 Tap tours above to add them"}
          </p>
        )}
        {count === 1 && (
          <p className="text-center text-sm py-2" style={{ color: "#C89B3C" }}>
            {isRu ? "Добавь ещё 1 тур, чтобы получить скидку 5%" : "Add 1 more tour to unlock 5% discount"}
          </p>
        )}
      </div>

      {/* ── Sticky bottom summary (appears when ≥2 tours selected) ── */}
      {count >= 2 && (
        <div
          className="fixed bottom-16 left-0 right-0 z-30"
          style={{ backgroundColor: "#FFFDF8", borderTop: "1px solid #E8DDD0", boxShadow: "0 -4px 20px rgba(0,0,0,0.10)" }}
        >
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">

            {/* Guest count */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "#7B6F63" }}>
                <Users size={13} style={{ color: "#C89B3C" }} />
                {isRu ? "Количество гостей" : "Guests"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
                >
                  −
                </button>
                <span className="text-sm font-bold w-4 text-center" style={{ color: "#1F1A17" }}>{guests}</span>
                <button
                  onClick={() => setGuests((g) => Math.min(12, g + 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            {pricing ? (
              <div
                className="rounded-xl p-3 space-y-1.5"
                style={{ backgroundColor: "rgba(200,155,60,0.06)", border: "1px solid rgba(200,155,60,0.15)" }}
              >
                <div className="flex justify-between text-xs" style={{ color: "#7B6F63" }}>
                  <span>
                    {count} {isRu ? "тура" : "tours"} × {guests} {isRu ? "чел." : "ppl"}
                  </span>
                  <span>{pricing.subtotal} ₾</span>
                </div>
                <div className="flex justify-between text-xs font-semibold" style={{ color: "#2F7D4F" }}>
                  <span>
                    {isRu ? `Комбо-скидка` : `Combo discount`} {pct}%
                  </span>
                  <span>−{pricing.discountAmount} ₾</span>
                </div>
                <div
                  className="flex justify-between text-sm font-bold pt-1 border-t"
                  style={{ color: "#1F1A17", borderColor: "rgba(200,155,60,0.2)" }}
                >
                  <span>{isRu ? "Итого" : "Total"}</span>
                  <span style={{ color: "#C89B3C" }}>{pricing.finalTotal} ₾</span>
                </div>
                <div className="flex justify-between text-[11px]" style={{ color: "#7B6F63" }}>
                  <span>{isRu ? "Депозит 20%" : "20% deposit"}</span>
                  <span className="font-semibold">{pricing.depositAmount} ₾</span>
                </div>
                {pricing.hasUnpriced && (
                  <p className="text-[10px] pt-1" style={{ color: "#9A8A78" }}>
                    {isRu
                      ? "* Один тур — по запросу. Левани уточнит цену в WhatsApp."
                      : "* One tour is priced on request — Levani will confirm via WhatsApp."}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-center py-1" style={{ color: "#9A8A78" }}>
                {isRu ? "Цены уточняются в WhatsApp." : "Pricing to be confirmed in WhatsApp."}
              </p>
            )}

            {/* CTA */}
            <button
              onClick={openWhatsApp}
              className="w-full py-3.5 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={16} />
              {isRu
                ? `Написать Левани — ${count} тура${pct > 0 ? `, −${pct}%` : ""}`
                : `Chat with Levani — ${count} tours${pct > 0 ? `, −${pct}%` : ""}`}
            </button>

            <p className="text-[10px] text-center" style={{ color: "#B0A08A" }}>
              {isRu
                ? "Левани согласует даты и подтвердит доступность"
                : "Levani will coordinate dates and confirm availability"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
