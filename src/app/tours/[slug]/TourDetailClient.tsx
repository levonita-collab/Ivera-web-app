"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Users,
  Zap,
  Check,
  X,
  MessageCircle,
  Lock,
} from "lucide-react";
import { Tour } from "@/data/tours";
import { Mission } from "@/data/missions";
import { formatPrice, formatApproxEur } from "@/lib/pricing";
import { buildGeneralLink } from "@/lib/whatsapp";
import BookingWidget from "@/components/tours/BookingWidget";
import DailyQuestChallenge from "@/components/marketing/DailyQuestChallenge";
import ComboPassCTA from "@/components/marketing/ComboPassCTA";
import { useTranslation } from "@/lib/i18n/dictionary";
import type { DictionaryKey } from "@/lib/i18n/dictionary";
import { getLocalizedTour, getLocalizedMission } from "@/lib/i18n/localize";
import { useAuthGate } from "@/hooks/useAuthGate";
import { useRouter } from "next/navigation";

interface Props {
  tour: Tour;
  missions: Mission[];
}

const CATEGORY_LABEL_KEYS: Record<Tour["category"], DictionaryKey> = {
  culture: "tourCard.categoryCulture",
  adventure: "tourCard.categoryAdventure",
  wine: "tourCard.categoryWine",
  heritage: "tourCard.categoryHeritage",
};

const TYPE_LABEL_KEYS: Record<Mission["type"], DictionaryKey> = {
  qr: "tourDetail.typeQr",
  photo: "tourDetail.typePhoto",
  observation: "tourDetail.typeObservation",
  quiz: "tourDetail.typeQuiz",
  taste: "tourDetail.typeTaste",
};

const TYPE_ICONS: Record<Mission["type"], string> = {
  qr: "📡",
  photo: "📷",
  observation: "👁️",
  quiz: "💬",
  taste: "🍷",
};

export default function TourDetailClient({ tour: rawTour, missions: rawMissions }: Props) {
  const { t, language } = useTranslation();
  const tour = getLocalizedTour(rawTour, language);
  const missions = rawMissions.map((m) => getLocalizedMission(m, language));
  const totalQuestXP = missions.reduce((s, m) => s + m.points, 0);
  const whatsappLink = buildGeneralLink(language);
  const { gateAction, isAuthed } = useAuthGate();
  const router = useRouter();

  return (
    <div style={{ backgroundColor: "#F7F0E4", minHeight: "100%" }}>

      {/* ── Cinematic hero ── */}
      <div className="relative" style={{ height: "72vw", maxHeight: "320px", minHeight: "240px" }}>
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 672px) 100vw, 672px"
        />
        {/* Layered gradient for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,12,7,0.35) 0%, transparent 35%, rgba(15,12,7,0.8) 100%)",
          }}
        />

        {/* Back button */}
        <Link
          href="/tours"
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: "rgba(15,12,7,0.55)", backdropFilter: "blur(4px)" }}
        >
          <ChevronLeft size={14} /> {t("tourDetail.tours")}
        </Link>

        {/* Category + XP badges */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: "rgba(200,155,60,0.82)", backdropFilter: "blur(4px)" }}
          >
            {t(CATEGORY_LABEL_KEYS[tour.category])}
          </span>
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: "rgba(15,12,7,0.65)", backdropFilter: "blur(4px)" }}
          >
            <Zap size={10} style={{ color: "#C89B3C" }} />
            {totalQuestXP} XP
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h1 className="font-serif text-2xl font-bold text-white leading-tight drop-shadow-lg">
            {tour.title}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 py-5 space-y-7">

        {/* Meta strip */}
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#7B6F63" }}>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} style={{ color: "#C89B3C" }} />
            {tour.region}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} style={{ color: "#C89B3C" }} />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} style={{ color: "#C89B3C" }} />
            {t("tourDetail.smallPrivateGroup")}
          </span>
        </div>

        {/* Price + no-payment badge */}
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl font-bold" style={{ color: "#C89B3C" }}>
                {formatPrice(tour.pricePerPersonGel, tour.priceLabel)}
              </span>
              {tour.pricePerPersonGel && (
                <span className="text-sm" style={{ color: "#7B6F63" }}>
                  {t("tourCard.perPerson")}
                </span>
              )}
              {tour.pricePerPersonGel && (
                <span className="text-sm" style={{ color: "#9A8A7A" }}>
                  {formatApproxEur(tour.pricePerPersonGel)}
                </span>
              )}
            </div>
          </div>
          <span
            className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{
              backgroundColor: "rgba(47,93,80,0.1)",
              color: "#2F5D50",
              border: "1px solid rgba(47,93,80,0.25)",
            }}
          >
            <Check size={10} /> {t("tourDetail.noPaymentNow")}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: "#3D2B1A" }}>
          {tour.longDescription}
        </p>

        {/* ── Booking ── */}
        <div>
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#C89B3C" }}
          >
            {t("tourDetail.bookThisAdventure")}
          </p>

          {/* Urgency strip */}
          {tour.showUrgency && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
              style={{
                backgroundColor: tour.seatsLeft <= 2
                  ? "rgba(180,30,30,0.08)"
                  : "rgba(200,155,60,0.08)",
                border: `1px solid ${
                  tour.seatsLeft <= 2
                    ? "rgba(180,30,30,0.2)"
                    : "rgba(200,155,60,0.2)"
                }`,
              }}
            >
              <span
                className={`text-[12px] font-bold flex-1 ${tour.seatsLeft <= 2 ? "animate-pulse-soft" : ""}`}
                style={{ color: tour.seatsLeft <= 2 ? "#B41E1E" : "#C89B3C" }}
              >
                {tour.seatsLeft <= 2 ? "🔴 " : "⚡ "}
                {tour.urgencyLabel ?? `${tour.seatsLeft} ${t("tourCard.spotsLeft")}`}
              </span>
              {tour.lastSeatsDiscountPct > 0 && (
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "rgba(76,175,80,0.12)", color: "#2E7D32" }}
                >
                  −{tour.lastSeatsDiscountPct}{t("discount.offSuffix")}
                </span>
              )}
            </div>
          )}

          {/* XP booking bonus */}
          {tour.bookingBonusXp > 0 && (
            <p
              className="flex items-center gap-1.5 text-[12px] font-semibold mb-3"
              style={{ color: "#C89B3C" }}
            >
              <Zap size={12} /> {t("tourDetail.bookTodayPrefix")}{tour.bookingBonusXp} {t("tourDetail.bookTodaySuffix")}
            </p>
          )}

          <BookingWidget tour={tour} />

          {!isAuthed && (
            <p className="text-center text-[12px] mt-2" style={{ color: "#9A8A78" }}>
              <button
                onClick={() => gateAction(() => {})}
                className="underline font-medium"
                style={{ color: "#C89B3C" }}
              >
                {t("auth.gateBookingHint")}
              </button>
            </p>
          )}
        </div>

        {/* ── Route timeline ── */}
        <div>
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#C89B3C" }}
          >
            {t("tourDetail.route")}
          </p>
          <ol className="space-y-0">
            {tour.routeStops.map((stop, i) => (
              <li key={i} className="flex items-start gap-3 relative pb-4">
                {/* Connecting line */}
                {i < tour.routeStops.length - 1 && (
                  <div
                    className="absolute left-[9px] top-5 bottom-0 w-px"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(200,155,60,0.35) 0%, rgba(200,155,60,0.08) 100%)",
                    }}
                  />
                )}
                {/* Dot */}
                <div
                  className="w-[19px] h-[19px] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{
                    border: "1.5px solid rgba(200,155,60,0.45)",
                    backgroundColor: "rgba(200,155,60,0.1)",
                  }}
                >
                  <span className="text-[8px] font-bold" style={{ color: "#C89B3C" }}>
                    {i + 1}
                  </span>
                </div>
                <span className="text-sm pt-0.5 leading-snug" style={{ color: "#3D2B1A" }}>
                  {stop}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Included / Excluded ── */}
        <div className="grid grid-cols-1 gap-3">
          <div
            className="rounded-2xl p-4 border"
            style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
          >
            <h3
              className="text-[10px] font-semibold tracking-widest uppercase mb-2.5"
              style={{ color: "#2F5D50" }}
            >
              ✓ {t("tourDetail.included")}
            </h3>
            <ul className="space-y-1.5">
              {tour.included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: "#3D2B1A" }}
                >
                  <Check size={12} style={{ color: "#2F5D50" }} className="flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl p-4 border"
            style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
          >
            <h3
              className="text-[10px] font-semibold tracking-widest uppercase mb-2.5"
              style={{ color: "#6E1F2F" }}
            >
              ✗ {t("tourDetail.notIncluded")}
            </h3>
            <ul className="space-y-1.5">
              {tour.excluded.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: "#7B6F63" }}
                >
                  <X size={12} style={{ color: "#6E1F2F" }} className="flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Daily Quest Challenge ── */}
        <DailyQuestChallenge variant="light" compact />

        {/* ── Quest missions preview ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: "#C89B3C" }}
            >
              {t("tourDetail.questMissions")}
            </p>
            <span
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(200,155,60,0.1)", color: "#C89B3C" }}
            >
              <Zap size={10} /> {totalQuestXP} {t("tourDetail.xpTotal")}
            </span>
          </div>

          <div className="space-y-3">
            {missions.map((m, i) => (
              <div
                key={m.id}
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: "#FFFDF8", borderColor: "#E8DDD0" }}
              >
                <div className="p-4 space-y-2">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{
                          backgroundColor: "rgba(200,155,60,0.12)",
                          color: "#C89B3C",
                        }}
                      >
                        {i + 1}
                      </span>
                      <h3 className="text-sm font-semibold" style={{ color: "#1F1A17" }}>
                        {m.title}
                      </h3>
                    </div>
                    <span
                      className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(200,155,60,0.1)",
                        color: "#C89B3C",
                      }}
                    >
                      +{m.points} XP
                    </span>
                  </div>

                  {/* Location */}
                  <p className="flex items-center gap-1.5 text-xs" style={{ color: "#7B6F63" }}>
                    <MapPin size={10} style={{ color: "#C89B3C" }} />
                    {m.location}
                  </p>

                  {/* Description */}
                  <p className="text-xs leading-relaxed" style={{ color: "#7B6F63" }}>
                    {m.description}
                  </p>
                </div>

                {/* Type footer */}
                <div
                  className="px-4 py-2 border-t flex items-center justify-between"
                  style={{ borderColor: "#F0E8DA", backgroundColor: "rgba(200,155,60,0.03)" }}
                >
                  <span className="text-[11px]" style={{ color: "#C89B3C" }}>
                    {TYPE_ICONS[m.type]} {t(TYPE_LABEL_KEYS[m.type])}
                  </span>
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: "#B0A08A" }}>
                    <Lock size={9} /> {t("tourDetail.unlocksOnTour")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => gateAction(() => router.push(`/quest/${tour.slug}`))}
            className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold text-white transition-opacity active:opacity-80"
            style={{ backgroundColor: "#C89B3C" }}
          >
            <Zap size={15} />
            {t("tourDetail.startQuest")}
          </button>
        </div>

        {/* ── Combo Pass CTA ── */}
        <ComboPassCTA currentTourTitle={tour.title} />

        {/* ── Bottom WhatsApp CTA ── */}
        <div
          className="rounded-2xl p-5 text-center space-y-3"
          style={{ background: "linear-gradient(135deg, #1A1208 0%, #2A1A0A 100%)" }}
        >
          <p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: "#5A4A38" }}>
            {t("tourDetail.readyToGo")}
          </p>
          <h2 className="font-serif text-white text-lg font-semibold leading-snug">
            {tour.title}
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: "#7A6A52" }}>
            {t("tourDetail.messageLevani")}
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium" style={{ color: "#5A4A38" }}>
            <span className="flex items-center gap-1">
              <Check size={10} style={{ color: "#2F5D50" }} /> {t("tourDetail.noPaymentNow")}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Check size={10} style={{ color: "#2F5D50" }} /> {t("tourDetail.englishGuide")}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Check size={10} style={{ color: "#2F5D50" }} /> {t("tourDetail.smallGroup")}
            </span>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-opacity active:opacity-80"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={15} />
            {t("tourDetail.bookViaWhatsapp")}
          </a>
        </div>

        {/* Bottom padding */}
        <div className="h-2" />
      </div>
    </div>
  );
}
