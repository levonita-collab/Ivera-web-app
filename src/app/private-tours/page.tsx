"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  MessageCircle,
  UserRound,
  Car,
  Plus,
  Minus,
  Moon,
  MapPin,
  Wine,
  Landmark,
  Mountain,
  Compass,
  Store,
  Camera,
  Waves,
  Users,
} from "lucide-react";
import {
  CAR_TIERS,
  GUIDE_DAY_RATE,
  NIGHT_SURCHARGE,
  PRIVATE_TOUR_REGIONS,
  PRIVATE_TOUR_INTERESTS,
  type CarTierId,
} from "@/data/privateTours";
import { buildPrivateTourLink } from "@/lib/whatsapp";
import { useTranslation } from "@/lib/i18n/dictionary";

const INTEREST_ICONS: Record<string, typeof Wine> = {
  Wine,
  Landmark,
  Mountain,
  Compass,
  Store,
  Camera,
  Waves,
  Users,
};

function formatGel(n: number, isRu: boolean): string {
  return `${n.toLocaleString(isRu ? "ru-RU" : "en-US")} ₾`;
}

function formatRange(min: number, max: number, isRu: boolean): string {
  return min === max ? formatGel(min, isRu) : `${formatGel(min, isRu)}–${formatGel(max, isRu)}`;
}

export default function PrivateToursPage() {
  const { language } = useTranslation();
  const isRu = language === "ru";

  const [wantGuide, setWantGuide] = useState(true);
  const [wantDriver, setWantDriver] = useState(true);
  const [carTier, setCarTier] = useState<CarTierId>("standard");
  const [days, setDays] = useState(1);
  const [nights, setNights] = useState(0);
  const [regionIds, setRegionIds] = useState<Set<string>>(new Set());
  const [interestIds, setInterestIds] = useState<Set<string>>(new Set());

  const tier = CAR_TIERS.find((t) => t.id === carTier)!;
  const vipSelected = wantDriver && tier.dayPriceMin === null;

  function toggleRegion(id: string) {
    setRegionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleInterest(id: string) {
    setInterestIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Guide pricing becomes individual (no fixed number) only when paired with
  // the VIP car tier — otherwise it's always the flat day rate + night surcharge.
  const guideEstimate = useMemo((): number | "custom" | null => {
    if (!wantGuide) return null;
    if (vipSelected) return "custom";
    return GUIDE_DAY_RATE * days + NIGHT_SURCHARGE * nights;
  }, [wantGuide, vipSelected, days, nights]);

  const driverEstimate = useMemo((): { min: number; max: number } | "custom" | null => {
    if (!wantDriver) return null;
    if (tier.dayPriceMin === null || tier.dayPriceMax === null) return "custom";
    return {
      min: tier.dayPriceMin * days + NIGHT_SURCHARGE * nights,
      max: tier.dayPriceMax * days + NIGHT_SURCHARGE * nights,
    };
  }, [wantDriver, tier, days, nights]);

  const totals = useMemo(() => {
    let min = 0;
    let max = 0;
    let hasNumeric = false;
    let hasCustom = false;

    if (guideEstimate === "custom") hasCustom = true;
    else if (typeof guideEstimate === "number") {
      min += guideEstimate;
      max += guideEstimate;
      hasNumeric = true;
    }

    if (driverEstimate === "custom") hasCustom = true;
    else if (driverEstimate) {
      min += driverEstimate.min;
      max += driverEstimate.max;
      hasNumeric = true;
    }

    return { min, max, hasNumeric, hasCustom };
  }, [guideEstimate, driverEstimate]);

  const canSubmit = (wantGuide || wantDriver) && days >= 1;

  function openWhatsApp() {
    const services: string[] = [];
    if (wantGuide) services.push(isRu ? "Гид" : "Private guide");
    if (wantDriver) services.push(isRu ? "Водитель с автомобилем" : "Driver with car");

    const priceLines: string[] = [];
    if (wantGuide) {
      priceLines.push(
        guideEstimate === "custom"
          ? isRu
            ? `Гид: обсуждается индивидуально`
            : `Guide: to be discussed`
          : isRu
            ? `Гид: ${formatGel(guideEstimate as number, isRu)}`
            : `Guide: ${formatGel(guideEstimate as number, isRu)}`
      );
    }
    if (wantDriver) {
      priceLines.push(
        driverEstimate === "custom"
          ? isRu
            ? `Водитель (${tier.labelRu}): обсуждается индивидуально`
            : `Driver (${tier.label}): to be discussed`
          : isRu
            ? `Водитель (${tier.labelRu}): ${formatRange(driverEstimate!.min, driverEstimate!.max, isRu)}`
            : `Driver (${tier.label}): ${formatRange(driverEstimate!.min, driverEstimate!.max, isRu)}`
      );
    }

    let totalLabel: string;
    if (!totals.hasNumeric && totals.hasCustom) {
      totalLabel = isRu ? "Итого: обсуждается в WhatsApp" : "Estimated total: to be discussed on WhatsApp";
    } else if (totals.hasNumeric && totals.hasCustom) {
      totalLabel = isRu
        ? `Итого: от ${formatRange(totals.min, totals.max, isRu)} + индивидуальная часть`
        : `Estimated total: from ${formatRange(totals.min, totals.max, isRu)} + custom portion`;
    } else {
      totalLabel = isRu
        ? `Итого: ${formatRange(totals.min, totals.max, isRu)}`
        : `Estimated total: ${formatRange(totals.min, totals.max, isRu)}`;
    }

    const regions = PRIVATE_TOUR_REGIONS.filter((r) => regionIds.has(r.id)).map((r) => (isRu ? r.nameRu : r.name));
    const interests = PRIVATE_TOUR_INTERESTS.filter((i) => interestIds.has(i.id)).map((i) =>
      isRu ? i.labelRu : i.label
    );

    const url = buildPrivateTourLink(
      {
        services,
        carTierLabel: wantDriver ? (isRu ? tier.labelRu : tier.label) : null,
        days,
        nights,
        regions,
        interests,
        priceLines,
        totalLabel,
      },
      language
    );
    window.open(url, "_blank");
  }

  return (
    <div style={{ backgroundColor: "#F7F0E4", minHeight: "100%", paddingBottom: "220px" }}>
      <div className="px-4 pt-6 pb-4 space-y-6">
        {/* Header */}
        <div>
          <p className="text-[11px] tracking-widest uppercase font-semibold mb-1" style={{ color: "#C89B3C" }}>
            {isRu ? "Приватные туры" : "Private tours"}
          </p>
          <h1 className="font-serif text-2xl font-bold" style={{ color: "#1F1A17" }}>
            {isRu ? "Соберите свой приватный тур" : "Build your private tour"}
          </h1>
          <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#7B6F63" }}>
            {isRu
              ? "Классическая приватная экскурсия — без квестов и XP. Ваш гид и/или водитель, ваш темп, ваш маршрут по всей Грузии."
              : "A classic private excursion — no quests, no XP. Your own guide and/or driver, your pace, your route across Georgia."}
          </p>
        </div>

        {/* Step 1 — services */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9A8A78" }}>
            {isRu ? "1. Что вам нужно" : "1. What you need"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                active: wantGuide,
                onClick: () => setWantGuide((v) => !v),
                icon: UserRound,
                title: isRu ? "Гид" : "Guide",
                desc: isRu ? "Сопровождает вас лично" : "Personally accompanies you",
              },
              {
                active: wantDriver,
                onClick: () => setWantDriver((v) => !v),
                icon: Car,
                title: isRu ? "Водитель + авто" : "Driver + car",
                desc: isRu ? "Ведёт и обслуживает маршрут" : "Drives and runs the route",
              },
            ].map(({ active, onClick, icon: Icon, title, desc }) => (
              <button
                key={title}
                onClick={onClick}
                className="relative rounded-2xl p-4 text-left border-2 transition-all"
                style={{
                  borderColor: active ? "#C89B3C" : "transparent",
                  backgroundColor: "#FFFDF8",
                  boxShadow: active ? "0 0 0 3px rgba(200,155,60,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {active && (
                  <div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#C89B3C" }}
                  >
                    <Check size={11} color="white" strokeWidth={3} />
                  </div>
                )}
                <Icon size={20} style={{ color: "#C89B3C" }} />
                <p className="text-sm font-semibold mt-2" style={{ color: "#1F1A17" }}>
                  {title}
                </p>
                <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "#9A8A78" }}>
                  {desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — car tier */}
        {wantDriver && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9A8A78" }}>
              {isRu ? "2. Категория автомобиля" : "2. Car category"}
            </h2>
            <div className="space-y-2">
              {CAR_TIERS.map((t) => {
                const active = carTier === t.id;
                const priceText =
                  t.dayPriceMin === null
                    ? isRu
                      ? "Индивидуально, в WhatsApp"
                      : "Custom, arranged on WhatsApp"
                    : `${formatRange(t.dayPriceMin, t.dayPriceMax!, isRu)}/${isRu ? "день" : "day"}`;
                return (
                  <button
                    key={t.id}
                    onClick={() => setCarTier(t.id)}
                    className="w-full rounded-2xl p-3.5 text-left border-2 flex items-center gap-3 transition-all"
                    style={{
                      borderColor: active ? "#C89B3C" : "transparent",
                      backgroundColor: "#FFFDF8",
                      boxShadow: active ? "0 0 0 3px rgba(200,155,60,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                      style={{ borderColor: active ? "#C89B3C" : "#E8DDD0", backgroundColor: active ? "#C89B3C" : "transparent" }}
                    >
                      {active && <Check size={11} color="white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold" style={{ color: "#1F1A17" }}>
                          {isRu ? t.labelRu : t.label}
                        </p>
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: "#C89B3C" }}>
                          {priceText}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "#9A8A78" }}>
                        {isRu ? t.taglineRu : t.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — duration */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9A8A78" }}>
            {wantDriver ? (isRu ? "3. Длительность" : "3. Duration") : isRu ? "2. Длительность" : "2. Duration"}
          </h2>
          <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: "#FFFDF8", border: "1px solid #E8DDD0" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: "#1F1A17" }}>
                {isRu ? "Дней" : "Days"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
                >
                  <Minus size={14} />
                </button>
                <span className="text-base font-bold w-6 text-center" style={{ color: "#1F1A17" }}>
                  {days}
                </span>
                <button
                  onClick={() => setDays((d) => Math.min(21, d + 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F0E8DA" }}>
              <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: "#1F1A17" }}>
                <Moon size={13} style={{ color: "#C89B3C" }} />
                {isRu ? "Ночёвок" : "Overnights"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNights((n) => Math.max(0, n - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
                >
                  <Minus size={14} />
                </button>
                <span className="text-base font-bold w-6 text-center" style={{ color: "#1F1A17" }}>
                  {nights}
                </span>
                <button
                  onClick={() => setNights((n) => Math.min(20, n + 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C89B3C" }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed pt-1" style={{ color: "#9A8A78" }}>
              {isRu
                ? `Цены выше — без ночёвок. Каждая ночёвка добавляет ${NIGHT_SURCHARGE}₾ отдельно к тарифу гида и отдельно к тарифу водителя.`
                : `Prices above are without overnights. Each overnight adds ${NIGHT_SURCHARGE}₾ separately to the guide's and to the driver's rate.`}
            </p>
          </div>
        </div>

        {/* Step 4 — regions */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9A8A78" }}>
            {isRu ? "Куда хотите поехать" : "Where you'd like to go"}
          </h2>
          <p className="text-[11px] mb-2.5" style={{ color: "#9A8A78" }}>
            {isRu ? "Выберите один или несколько регионов (необязательно)." : "Pick one or more regions (optional)."}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {PRIVATE_TOUR_REGIONS.map((region) => {
              const active = regionIds.has(region.id);
              return (
                <button
                  key={region.id}
                  onClick={() => toggleRegion(region.id)}
                  className="relative rounded-xl overflow-hidden text-left border-2 transition-all"
                  style={{
                    borderColor: active ? "#C89B3C" : "transparent",
                    backgroundColor: "#FFFDF8",
                    boxShadow: active ? "0 0 0 3px rgba(200,155,60,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
                    {region.image ? (
                      <Image src={region.image} alt={isRu ? region.nameRu : region.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 240px" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #E8DDD0 0%, #D9C9AE 100%)" }}
                      >
                        <MapPin size={20} style={{ color: "#B0A08A" }} />
                      </div>
                    )}
                    {active && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(200,155,60,0.4)" }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#C89B3C" }}>
                          <Check size={14} color="white" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold leading-snug" style={{ color: "#1F1A17" }}>
                      {isRu ? region.nameRu : region.name}
                    </p>
                    <p className="text-[10px] mt-0.5 leading-snug line-clamp-2" style={{ color: "#9A8A78" }}>
                      {isRu ? region.blurbRu : region.blurb}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5 — interests */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9A8A78" }}>
            {isRu ? "Что вам интересно" : "What interests you"}
          </h2>
          <p className="text-[11px] mb-2.5" style={{ color: "#9A8A78" }}>
            {isRu ? "Отметьте всё, что хотите почувствовать в туре (необязательно)." : "Tag anything you'd like the trip to include (optional)."}
          </p>
          <div className="flex flex-wrap gap-2">
            {PRIVATE_TOUR_INTERESTS.map((interest) => {
              const Icon = INTEREST_ICONS[interest.icon] ?? Compass;
              const active = interestIds.has(interest.id);
              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-medium border"
                  style={{
                    backgroundColor: active ? "rgba(200,155,60,0.14)" : "#FFFDF8",
                    borderColor: active ? "rgba(200,155,60,0.5)" : "#E8DDD0",
                    color: active ? "#C89B3C" : "#3D2B1A",
                  }}
                >
                  <Icon size={12} />
                  {isRu ? interest.labelRu : interest.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky bottom summary */}
      <div
        className="fixed bottom-16 left-0 right-0 z-30"
        style={{ backgroundColor: "#FFFDF8", borderTop: "1px solid #E8DDD0", boxShadow: "0 -4px 20px rgba(0,0,0,0.10)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {canSubmit ? (
            <div className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: "rgba(200,155,60,0.06)", border: "1px solid rgba(200,155,60,0.15)" }}>
              {wantGuide && (
                <div className="flex justify-between text-[11px]" style={{ color: "#7B6F63" }}>
                  <span>{isRu ? "Гид" : "Guide"}</span>
                  <span>{guideEstimate === "custom" ? (isRu ? "индивидуально" : "custom") : formatGel(guideEstimate as number, isRu)}</span>
                </div>
              )}
              {wantDriver && (
                <div className="flex justify-between text-[11px]" style={{ color: "#7B6F63" }}>
                  <span>
                    {isRu ? "Водитель" : "Driver"} ({isRu ? tier.labelRu : tier.label})
                  </span>
                  <span>
                    {driverEstimate === "custom"
                      ? isRu
                        ? "индивидуально"
                        : "custom"
                      : formatRange(driverEstimate!.min, driverEstimate!.max, isRu)}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between text-sm font-bold pt-2 mt-1 border-t"
                style={{ color: "#1F1A17", borderColor: "rgba(200,155,60,0.2)" }}
              >
                <span>{isRu ? "Итого" : "Total"}</span>
                <span style={{ color: "#C89B3C" }}>
                  {!totals.hasNumeric
                    ? isRu
                      ? "в WhatsApp"
                      : "on WhatsApp"
                    : totals.hasCustom
                      ? `${isRu ? "от" : "from"} ${formatRange(totals.min, totals.max, isRu)}+`
                      : formatRange(totals.min, totals.max, isRu)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-center py-1" style={{ color: "#9A8A78" }}>
              {isRu ? "Выберите гида и/или водителя, чтобы увидеть цену" : "Select a guide and/or driver to see pricing"}
            </p>
          )}

          <button
            onClick={openWhatsApp}
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={16} />
            {isRu ? "Отправить в WhatsApp" : "Send to WhatsApp"}
          </button>
          <p className="text-[10px] text-center" style={{ color: "#B0A08A" }}>
            {isRu ? "Левани подтвердит цену и детали лично" : "Levani will confirm pricing and details personally"}
          </p>
        </div>
      </div>
    </div>
  );
}
