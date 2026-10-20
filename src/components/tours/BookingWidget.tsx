"use client";

import { useEffect, useState } from "react";
import { openWhatsApp, trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { MessageCircle, Zap, Users, AlertCircle, CheckCircle, ExternalLink, CreditCard } from "lucide-react";
import { Tour } from "@/data/tours";
import { calculateTourPrice, getActiveSeasonalOffer } from "@/lib/discounts";
import {
  buildWhatsAppBookingMessage,
  buildBookingWhatsAppUrl,
  buildGroupQuoteLink,
} from "@/lib/whatsapp";
import {
  createBooking,
  generateBookingCode,
  markWhatsAppOpened,
} from "@/lib/supabase/bookingService";
import { saveLocalBooking } from "@/lib/localBookings";
import { getProfile } from "@/lib/questProgress";
import { useTranslation, ruPlural } from "@/lib/i18n/dictionary";
import { gelToEur, getClientGelEurRate } from "@/lib/paypal/currency";
import PayPalButton from "@/components/payments/PayPalButton";

interface Props {
  tour: Tour;
}

type WidgetState =
  | "idle"
  | "creating"
  | "opening"
  | "error_retry"   // Supabase failed but can retry
  | "error_fallback" // Supabase failed, offering WhatsApp-only fallback
  | "success"
  | "paypal_creating" // saving a pending booking before showing PayPal buttons
  | "paypal_ready"    // booking saved, PayPal buttons rendered
  | "paypal_paid";    // PayPal payment captured

export default function BookingWidget({ tour }: Props) {
  const { t, language } = useTranslation();
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);
  const [state, setState] = useState<WidgetState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedCode, setConfirmedCode] = useState("");
  const [confirmedWhatsappUrl, setConfirmedWhatsappUrl] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  // Starts from the build-time env var so the price shows instantly, then
  // self-corrects to the server's authoritative rate — see
  // src/app/api/paypal/rate/route.ts for why this isn't trusted alone.
  const [gelEurRate, setGelEurRate] = useState(getClientGelEurRate());
  useEffect(() => {
    fetch("/api/paypal/rate")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { rate?: number } | null) => {
        if (data?.rate && Number.isFinite(data.rate) && data.rate > 0) {
          setGelEurRate(data.rate);
        }
      })
      .catch(() => {});
  }, []);
  const [validationError, setValidationError] = useState("");
  const [paypalBookingId, setPaypalBookingId] = useState("");
  const [paypalBookingCode, setPaypalBookingCode] = useState("");
  const [paypalError, setPaypalError] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const breakdown = calculateTourPrice({
    basePricePerPerson: tour.pricePerPersonGel,
    people,
    lastSeatsDiscountPct: tour.lastSeatsDiscountPct,
    bookingBonusXp: tour.bookingBonusXp,
  });

  const today = new Date().toISOString().split("T")[0];

  async function handleBook() {
    if (!date) {
      setValidationError(t("booking.pleaseSelectDate"));
      return;
    }
    if (!policyAccepted) {
      setValidationError(t("booking.pleaseAcceptPolicy"));
      return;
    }
    if (state !== "idle" && state !== "error_retry") return;
    setValidationError("");
    setState("creating");

    const profile = typeof window !== "undefined" ? getProfile() : null;
    const isGroupQuote = breakdown?.needsQuote ?? false;

    if (isGroupQuote) {
      // 6+ people — custom group rate, priced manually over WhatsApp. Still
      // persist a booking record (price fields left null/0 since there's no
      // computed price yet) so Levani sees the lead in /admin/orders instead
      // of it existing only inside a WhatsApp chat.
      const bookingCode = generateBookingCode();
      const url = buildGroupQuoteLink({ tourTitle: tour.title, date, people }, language);
      createBooking({
        bookingCode,
        explorerId: profile?.supabaseId ?? null,
        customerName: profile?.name ?? null,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        tourCategory: tour.category,
        selectedDate: date,
        peopleCount: people,
        basePricePerPerson: tour.pricePerPersonGel,
        baseTotal: tour.pricePerPersonGel != null ? tour.pricePerPersonGel * people : null,
        discountApplied: 0,
        discountReason: "Custom group rate (6+) — pending manual quote",
        savings: 0,
        finalPricePerPerson: null,
        finalTotal: null,
        xpReward: tour.bookingBonusXp,
        seatsLeftAtBooking: tour.seatsLeft,
        whatsappMessage: url,
      }).catch(() => {});
      trackEvent("generate_lead", { tour_slug: tour.slug, people_count: people, lead_type: "group_quote" });
      setState("opening");
      openWhatsApp(url, "group_quote");
      setTimeout(() => setState("idle"), 2000);
      return;
    }

    const bookingCode = generateBookingCode();
    const messageText = buildWhatsAppBookingMessage({
      bookingCode,
      tourTitle: tour.title,
      selectedDate: date,
      peopleCount: people,
      basePricePerPerson: breakdown?.basePerPerson ?? tour.pricePerPersonGel,
      baseTotal:
        breakdown != null
          ? breakdown.basePerPerson * people
          : tour.pricePerPersonGel != null
            ? tour.pricePerPersonGel * people
            : null,
      discountPct: breakdown?.discountPct ?? 0,
      savings: breakdown != null ? breakdown.savingsPerPerson * people : 0,
      finalTotal: breakdown?.finalTotal ?? null,
    }, language);
    const whatsappUrl = buildBookingWhatsAppUrl(messageText);

    const result = await createBooking({
      bookingCode,
      explorerId: profile?.supabaseId ?? null,
      customerName: profile?.name ?? null,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      tourCategory: tour.category,
      selectedDate: date,
      peopleCount: people,
      basePricePerPerson: breakdown?.basePerPerson ?? tour.pricePerPersonGel,
      baseTotal:
        breakdown != null
          ? breakdown.basePerPerson * people
          : tour.pricePerPersonGel != null
            ? tour.pricePerPersonGel * people
            : null,
      discountApplied: breakdown?.discountPct ?? 0,
      discountReason: breakdown?.discountLabel ?? null,
      savings: breakdown != null ? breakdown.savingsPerPerson * people : 0,
      finalPricePerPerson: breakdown?.finalPerPerson ?? tour.pricePerPersonGel,
      finalTotal: breakdown?.finalTotal ?? null,
      xpReward: tour.bookingBonusXp,
      seatsLeftAtBooking: tour.seatsLeft,
      whatsappMessage: messageText,
    });

    if (!result.success) {
      setErrorMsg(result.error ?? t("booking.couldNotSave"));
      setFallbackUrl(whatsappUrl);
      setState("error_fallback");
      return;
    }

    // Success — save to localStorage cache
    saveLocalBooking({
      id: result.bookingId!,
      bookingCode,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      tourCategory: tour.category,
      selectedDate: date,
      peopleCount: people,
      finalTotal: breakdown?.finalTotal ?? null,
      discountApplied: breakdown?.discountPct ?? 0,
      savings: breakdown != null ? breakdown.savingsPerPerson * people : 0,
      xpReward: tour.bookingBonusXp,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    setConfirmedCode(bookingCode);
    setConfirmedWhatsappUrl(whatsappUrl);
    trackEvent("generate_lead", {
      tour_slug: tour.slug,
      people_count: people,
      lead_type: "booking",
      value: breakdown?.finalTotal ?? undefined,
      currency: breakdown?.finalTotal != null ? "GEL" : undefined,
    });
    setState("opening");
    openWhatsApp(whatsappUrl, "booking");

    // Mark WhatsApp opened in background
    if (result.bookingId) {
      markWhatsAppOpened(result.bookingId).catch(() => {});
    }

    // Transition to success state after brief delay
    setTimeout(() => setState("success"), 1500);
  }

  function handleFallbackOpen() {
    openWhatsApp(fallbackUrl, "booking_fallback");
    setState("idle");
  }

  // ─── PayPal flow ─────────────────────────────────────────────────────────
  async function handlePayWithPaypal() {
    if (!date) {
      setValidationError(t("booking.pleaseSelectDate"));
      return;
    }
    if (!policyAccepted) {
      setValidationError(t("booking.pleaseAcceptPolicy"));
      return;
    }
    if (state !== "idle" && state !== "error_retry") return;
    setValidationError("");
    setPaypalError("");
    setState("paypal_creating");

    const profile = typeof window !== "undefined" ? getProfile() : null;
    const bookingCode = generateBookingCode();

    const messageText = buildWhatsAppBookingMessage({
      bookingCode,
      tourTitle: tour.title,
      selectedDate: date,
      peopleCount: people,
      basePricePerPerson: breakdown?.basePerPerson ?? tour.pricePerPersonGel,
      baseTotal:
        breakdown != null
          ? breakdown.basePerPerson * people
          : tour.pricePerPersonGel != null
            ? tour.pricePerPersonGel * people
            : null,
      discountPct: breakdown?.discountPct ?? 0,
      savings: breakdown != null ? breakdown.savingsPerPerson * people : 0,
      finalTotal: breakdown?.finalTotal ?? null,
    }, language);

    const result = await createBooking({
      bookingCode,
      explorerId: profile?.supabaseId ?? null,
      customerName: profile?.name ?? null,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      tourCategory: tour.category,
      selectedDate: date,
      peopleCount: people,
      basePricePerPerson: breakdown?.basePerPerson ?? tour.pricePerPersonGel,
      baseTotal:
        breakdown != null
          ? breakdown.basePerPerson * people
          : tour.pricePerPersonGel != null
            ? tour.pricePerPersonGel * people
            : null,
      discountApplied: breakdown?.discountPct ?? 0,
      discountReason: breakdown?.discountLabel ?? null,
      savings: breakdown != null ? breakdown.savingsPerPerson * people : 0,
      finalPricePerPerson: breakdown?.finalPerPerson ?? tour.pricePerPersonGel,
      finalTotal: breakdown?.finalTotal ?? null,
      xpReward: tour.bookingBonusXp,
      seatsLeftAtBooking: tour.seatsLeft,
      whatsappMessage: messageText,
      paymentMethod: "paypal",
    });

    if (!result.success || !result.bookingId) {
      setPaypalError(result.error ?? t("booking.couldNotSave"));
      setState("idle");
      return;
    }

    saveLocalBooking({
      id: result.bookingId,
      bookingCode,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      tourCategory: tour.category,
      selectedDate: date,
      peopleCount: people,
      finalTotal: breakdown?.finalTotal ?? null,
      discountApplied: breakdown?.discountPct ?? 0,
      savings: breakdown != null ? breakdown.savingsPerPerson * people : 0,
      xpReward: tour.bookingBonusXp,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    setPaypalBookingId(result.bookingId);
    setPaypalBookingCode(bookingCode);
    setState("paypal_ready");
  }

  function handlePaypalSuccess() {
    trackEvent("purchase", {
      transaction_id: paypalBookingCode || undefined,
      value: breakdown?.finalTotal ?? undefined,
      currency: "GEL",
      tour_slug: tour.slug,
      people_count: people,
    });
    setState("paypal_paid");
  }

  function handlePaypalError(message: string) {
    setPaypalError(message);
    setState("idle");
  }

  // ─── Success state ──────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div
        className="rounded-2xl border p-5 space-y-4 text-center"
        style={{ backgroundColor: "rgba(47,93,80,0.08)", borderColor: "rgba(47,93,80,0.25)" }}
      >
        <CheckCircle size={32} className="mx-auto" style={{ color: "#2F5D50" }} />
        <div>
          <p className="text-white font-semibold text-base">{t("booking.successTitle")}</p>
          <p
            className="font-mono text-xs mt-1 px-2 py-1 rounded inline-block"
            style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A" }}
          >
            {confirmedCode}
          </p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
          {t("booking.successDescription")}
        </p>
        <button
          onClick={() => openWhatsApp(confirmedWhatsappUrl, "booking_confirmed")}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={15} />
          {t("booking.openWhatsapp")}
        </button>
        <div className="flex gap-2">
          <Link
            href="/my-trip"
            className="flex-1 py-2.5 rounded-full text-xs font-semibold text-center"
            style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A" }}
          >
            {t("booking.viewMyTrip")}
          </Link>
          <button
            onClick={() => setState("idle")}
            className="flex-1 py-2.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#8A7A60" }}
          >
            {t("booking.bookAnother")}
          </button>
        </div>
      </div>
    );
  }

  // ─── PayPal payment success ─────────────────────────────────────────────
  if (state === "paypal_paid") {
    return (
      <div
        className="rounded-2xl border p-5 space-y-4 text-center"
        style={{ backgroundColor: "rgba(47,93,80,0.08)", borderColor: "rgba(47,93,80,0.25)" }}
      >
        <CheckCircle size={32} className="mx-auto" style={{ color: "#2F5D50" }} />
        <div>
          <p className="text-white font-semibold text-base">{t("booking.paypalSuccessTitle")}</p>
          <p
            className="font-mono text-xs mt-1 px-2 py-1 rounded inline-block"
            style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A" }}
          >
            {paypalBookingCode}
          </p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
          {t("booking.paypalSuccessDescription")}
        </p>
        <div className="flex gap-2">
          <Link
            href="/my-trip"
            className="flex-1 py-2.5 rounded-full text-xs font-semibold text-center"
            style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A" }}
          >
            {t("booking.viewMyTrip")}
          </Link>
          <button
            onClick={() => setState("idle")}
            className="flex-1 py-2.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#8A7A60" }}
          >
            {t("booking.bookAnother")}
          </button>
        </div>
      </div>
    );
  }

  // ─── Error / fallback state ─────────────────────────────────────────────
  if (state === "error_fallback") {
    return (
      <div
        className="rounded-2xl border p-5 space-y-4"
        style={{ backgroundColor: "rgba(110,31,47,0.08)", borderColor: "rgba(110,31,47,0.25)" }}
      >
        <div className="flex items-start gap-2">
          <AlertCircle size={18} style={{ color: "#B41E2E", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-white font-semibold text-sm">{t("booking.errorTitle")}</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#8A6A68" }}>
              {errorMsg}
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
          {t("booking.errorDescription")}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleFallbackOpen}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={15} />
            {t("booking.continueWhatsapp")}
          </button>
          <button
            onClick={() => setState("idle")}
            className="w-full py-2.5 rounded-full text-xs font-medium"
            style={{ color: "#7A6A52" }}
          >
            {t("booking.cancel")}
          </button>
        </div>
      </div>
    );
  }

  // ─── Normal booking form ────────────────────────────────────────────────
  const isCreating =
    state === "creating" ||
    state === "opening" ||
    state === "paypal_creating" ||
    state === "paypal_ready";
  const canPayOnline =
    Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) &&
    tour.pricePerPersonGel !== null &&
    !!breakdown &&
    !breakdown.needsQuote;
  const paypalEurAmount = breakdown ? gelToEur(breakdown.finalTotal, gelEurRate) : 0;
  const groupHint =
    !breakdown?.needsQuote && people >= 2
      ? people === 2
        ? t("discount.5off")
        : people === 3
          ? t("discount.10off")
          : t("discount.20off")
      : null;

  return (
    <div
      className="rounded-[24px] p-5 space-y-4"
      style={{
        background: "radial-gradient(120% 60% at 0% 0%, rgba(150,95,35,0.22) 0%, rgba(0,0,0,0) 60%), linear-gradient(165deg, #2A1D10 0%, #1C140B 55%, #150F08 100%)",
        border: "1.5px solid rgba(200,155,60,0.45)",
        boxShadow: "inset 0 1px 0 rgba(255,230,170,0.08), 0 10px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif font-bold text-[21px]" style={{ color: "#F3E2C0" }}>{t("booking.title")}</h2>
        {tour.bookingBonusXp > 0 && (
          <span
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(180deg, #F1D07A 0%, #D3A443 55%, #B8862E 100%)",
              color: "#2A1A0E",
              boxShadow: "0 0 14px rgba(240,190,90,0.45), inset 0 1px 0 rgba(255,245,210,0.6)",
            }}
          >
            <Zap size={10} /> +{tour.bookingBonusXp} XP
          </span>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs text-brand-muted mb-1.5" htmlFor="booking-date">
          {t("booking.selectDate")} <span className="text-red-400">*</span>
        </label>
        <input
          id="booking-date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setValidationError("");
          }}
          className="w-full rounded-2xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
          style={{ backgroundColor: "rgba(0,0,0,0.25)", border: "1.5px solid rgba(200,155,60,0.45)", colorScheme: "dark" }}
        />
      </div>

      {/* People */}
      <div>
        <label className="block text-xs text-brand-muted mb-1.5">
          {t("booking.numberOfPeople")}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            className="w-11 h-11 rounded-full text-lg flex items-center justify-center transition-colors active:scale-95"
            style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "1.5px solid rgba(200,155,60,0.4)", color: "#E8D5A0" }}
            aria-label={t("booking.decrease")}
          >
            −
          </button>
          <span className="text-white font-bold text-xl w-8 text-center">{people}</span>
          <button
            type="button"
            onClick={() => setPeople((p) => Math.min(12, p + 1))}
            className="w-11 h-11 rounded-full text-lg flex items-center justify-center transition-colors active:scale-95"
            style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "1.5px solid rgba(200,155,60,0.4)", color: "#E8D5A0" }}
            aria-label={t("booking.increase")}
          >
            +
          </button>
          {groupHint && (
            <span className="text-[11px] font-semibold" style={{ color: "#4CAF50" }}>
              {groupHint}
            </span>
          )}
          {breakdown?.needsQuote && (
            <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "#C4923A" }}>
              <Users size={11} /> {t("booking.customRate")}
            </span>
          )}
        </div>
      </div>

      {/* Price summary */}
      <div
        className="rounded-2xl p-4 space-y-1.5"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.15) 100%)",
          border: "1px solid rgba(200,155,60,0.4)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {tour.pricePerPersonGel === null ? (
          <p className="text-sm text-brand-gold text-center font-medium">
            {tour.priceLabel ?? t("booking.priceOnRequest")} {t("booking.customQuoteSuffix")}
          </p>
        ) : breakdown?.needsQuote ? (
          <div className="text-center space-y-1 py-1">
            <p className="text-sm font-semibold text-white">
              {t("booking.groupOf")} {people} {t("booking.peopleAbbrev")}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
              {t("booking.customGroupRatesDesc")}
            </p>
          </div>
        ) : breakdown ? (
          <>
            <div className="flex justify-between text-sm text-brand-muted">
              <span>
                {breakdown.basePerPerson} GEL × {people}{" "}
                {language === "ru"
                  ? ruPlural(people, "человек", "человека", "человек")
                  : people === 1
                    ? t("booking.person")
                    : t("booking.people")}
              </span>
              <span>{breakdown.basePerPerson * people} GEL</span>
            </div>
            {breakdown.discountPct > 0 && (
              <div className="flex justify-between text-xs">
                <span style={{ color: "#F0A54A" }}>
                  {breakdown.discountSource === "season" && language === "ru"
                    ? `${getActiveSeasonalOffer()?.titleRu ?? "Сезонная скидка"} — скидка ${breakdown.discountPct}%`
                    : breakdown.discountLabel}
                </span>
                <span style={{ color: "#5BBF6A" }}>− {breakdown.savingsPerPerson * people} GEL</span>
              </div>
            )}
            <div className="border-t border-white/5 pt-1.5" />
            {breakdown.discountPct > 0 && (
              <div className="flex justify-between text-xs text-brand-muted">
                <span>{t("booking.perPerson")}</span>
                <span>{breakdown.finalPerPerson} GEL</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold">
              <span className="text-white">{t("booking.total")}</span>
              <span className="text-lg font-bold" style={{ color: "#E8B95A" }}>{breakdown.finalTotal} GEL</span>
            </div>
            {breakdown.savingsPerPerson > 0 && (
              <p className="text-[11px] text-center pt-0.5" style={{ color: "#4CAF50" }}>
                ✓ {t("booking.youSave")} {breakdown.savingsPerPerson * people} GEL {t("booking.withBooking")}
              </p>
            )}
          </>
        ) : null}
      </div>

      {/* Policy acknowledgment */}
      <label className="flex items-start gap-2 text-[11px] leading-relaxed cursor-pointer select-none">
        <input
          type="checkbox"
          checked={policyAccepted}
          onChange={(e) => {
            setPolicyAccepted(e.target.checked);
            if (e.target.checked) setValidationError("");
          }}
          className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 accent-[#C4923A]"
        />
        <span style={{ color: "#7A6A52" }}>
          {language === "ru" ? "Я прочитал(а) и согласен(на) с " : "I've read and agree to the "}
          <Link
            href="/payment-policy"
            className="underline"
            style={{ color: "#C4923A" }}
            onClick={(e) => e.stopPropagation()}
          >
            {language === "ru" ? "политикой оплаты и возврата" : "payment & refund policy"}
          </Link>
          {language === "ru"
            ? ", включая правило: при опоздании тур считается пропущенным без возврата средств."
            : ", including the rule that a late arrival forfeits the tour with no refund."}
        </span>
      </label>

      {/* Validation error */}
      {validationError && (
        <p className="text-red-400 text-xs flex items-center gap-1" role="alert">
          <AlertCircle size={12} /> {validationError}
        </p>
      )}

      {/* CTA */}
      <button
        onClick={handleBook}
        disabled={isCreating}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-[15px] text-white transition-all active:scale-95"
        style={{
          background: "linear-gradient(90deg, #22B95A 0%, #3FC56A 45%, #B9A345 80%, #D3A443 100%)",
          boxShadow: "0 0 18px rgba(60,200,110,0.35), 0 0 22px rgba(211,164,67,0.25), inset 0 1px 0 rgba(255,255,255,0.25)",
          textShadow: "0 1px 1px rgba(0,0,0,0.25)",
          opacity: isCreating ? 0.75 : 1,
        }}
      >
        {state === "creating" ? (
          <>
            <span className="animate-spin text-base">⋯</span> {t("booking.savingBooking")}
          </>
        ) : state === "opening" ? (
          <>
            <ExternalLink size={16} /> {t("booking.openingWhatsapp")}
          </>
        ) : breakdown?.needsQuote ? (
          <>
            <MessageCircle size={18} /> {t("booking.requestGroupQuote")}
          </>
        ) : tour.pricePerPersonGel === null ? (
          <>
            <MessageCircle size={18} /> {t("booking.requestPriceWhatsapp")}
          </>
        ) : (
          <>
            <MessageCircle size={18} /> {t("booking.bookViaWhatsapp")}
          </>
        )}
      </button>

      <p className="text-[11px] text-center flex items-center justify-center gap-1.5" style={{ color: "#4CAF50" }}>
        <span>⚡</span>
        {language === "ru" ? "Левани отвечает в течение 1 часа" : "Levani usually replies within 1 hour"}
      </p>

      <p className="text-xs text-brand-muted text-center">
        {t("booking.noPaymentNote")}
      </p>

      {/* PayPal — pay online now */}
      {canPayOnline && (
        <div className="pt-2 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] uppercase tracking-wide text-brand-muted">
              {t("booking.orPayOnline")}
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-[11px] text-center leading-relaxed" style={{ color: "#7A6A52" }}>
            {t("booking.paypalCurrencyNote")}{" "}
            <Link href="/payment-policy" className="underline" style={{ color: "#C4923A" }}>
              {t("booking.paymentPolicyLink")}
            </Link>
          </p>

          {state === "paypal_creating" ? (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-brand-muted">
              <span className="animate-spin text-base">⋯</span> {t("booking.paypalPreparing")}
            </div>
          ) : state === "paypal_ready" ? (
            <PayPalButton
              tourSlug={tour.slug}
              bookingId={paypalBookingId}
              bookingCode={paypalBookingCode}
              peopleCount={people}
              onSuccess={handlePaypalSuccess}
              onError={handlePaypalError}
            />
          ) : (
            <button
              onClick={handlePayWithPaypal}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: "#0070BA" }}
            >
              <CreditCard size={16} />
              {t("booking.payWithPaypal")} — €{paypalEurAmount.toFixed(2)}
            </button>
          )}

          {paypalError && (
            <p className="text-red-400 text-xs flex items-center gap-1" role="alert">
              <AlertCircle size={12} /> {paypalError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
