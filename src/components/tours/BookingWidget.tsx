"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Zap, Users, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { Tour } from "@/data/tours";
import { calculateTourPrice } from "@/lib/discounts";
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

interface Props {
  tour: Tour;
}

type WidgetState =
  | "idle"
  | "creating"
  | "opening"
  | "error_retry"   // Supabase failed but can retry
  | "error_fallback" // Supabase failed, offering WhatsApp-only fallback
  | "success";

export default function BookingWidget({ tour }: Props) {
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);
  const [state, setState] = useState<WidgetState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedCode, setConfirmedCode] = useState("");
  const [confirmedWhatsappUrl, setConfirmedWhatsappUrl] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  const breakdown = calculateTourPrice({
    basePricePerPerson: tour.pricePerPersonGel,
    people,
    lastSeatsDiscountPct: tour.lastSeatsDiscountPct,
    bookingBonusXp: tour.bookingBonusXp,
  });

  const today = new Date().toISOString().split("T")[0];

  async function handleBook() {
    if (!date) {
      setValidationError("Please select a date before booking.");
      return;
    }
    if (state !== "idle" && state !== "error_retry") return;
    setValidationError("");
    setState("creating");

    const profile = typeof window !== "undefined" ? getProfile() : null;
    const isGroupQuote = breakdown?.needsQuote ?? false;

    if (isGroupQuote) {
      // 6+ people → open WhatsApp directly for custom group quote
      const url = buildGroupQuoteLink({ tourTitle: tour.title, date, people });
      setState("opening");
      window.open(url, "_blank", "noopener,noreferrer");
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
      seatsLeft: tour.seatsLeft,
    });
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
      setErrorMsg(result.error ?? "Could not save booking. Please try again.");
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
    setState("opening");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Mark WhatsApp opened in background
    if (result.bookingId) {
      markWhatsAppOpened(result.bookingId).catch(() => {});
    }

    // Transition to success state after brief delay
    setTimeout(() => setState("success"), 1500);
  }

  function handleFallbackOpen() {
    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
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
          <p className="text-white font-semibold text-base">Booking Request Sent!</p>
          <p
            className="font-mono text-xs mt-1 px-2 py-1 rounded inline-block"
            style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A" }}
          >
            {confirmedCode}
          </p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
          WhatsApp should have opened with your request ready. If it didn&apos;t, tap below to open
          it and send your booking to Levani.
        </p>
        <button
          onClick={() => window.open(confirmedWhatsappUrl, "_blank", "noopener,noreferrer")}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={15} />
          Open WhatsApp
        </button>
        <div className="flex gap-2">
          <Link
            href="/my-trip"
            className="flex-1 py-2.5 rounded-full text-xs font-semibold text-center"
            style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A" }}
          >
            View My Trip
          </Link>
          <button
            onClick={() => setState("idle")}
            className="flex-1 py-2.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#8A7A60" }}
          >
            Book Another Date
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
            <p className="text-white font-semibold text-sm">Booking could not be saved online</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#8A6A68" }}>
              {errorMsg}
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
          You can still message Levani directly on WhatsApp. Your booking won&apos;t appear in My Trip,
          but Levani will confirm manually.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleFallbackOpen}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={15} />
            Continue to WhatsApp (no booking ID)
          </button>
          <button
            onClick={() => setState("idle")}
            className="w-full py-2.5 rounded-full text-xs font-medium"
            style={{ color: "#7A6A52" }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ─── Normal booking form ────────────────────────────────────────────────
  const isCreating = state === "creating" || state === "opening";
  const groupHint =
    !breakdown?.needsQuote && people >= 2
      ? people === 2
        ? "5% off"
        : people === 3
          ? "10% off"
          : "20% off"
      : null;

  return (
    <div className="rounded-2xl bg-brand-dark border border-white/8 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-white font-semibold text-base">Book this Tour</h2>
        {tour.bookingBonusXp > 0 && (
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0"
            style={{ backgroundColor: "rgba(200,155,60,0.15)", color: "#C4923A" }}
          >
            <Zap size={10} /> +{tour.bookingBonusXp} XP
          </span>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs text-brand-muted mb-1.5" htmlFor="booking-date">
          Select date <span className="text-red-400">*</span>
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
          className="w-full bg-brand-black border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      {/* People */}
      <div>
        <label className="block text-xs text-brand-muted mb-1.5">
          Number of people
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            className="w-9 h-9 rounded-full bg-brand-black border border-white/10 text-white text-lg flex items-center justify-center hover:border-brand-gold transition-colors"
            aria-label="Decrease"
          >
            −
          </button>
          <span className="text-white font-semibold text-lg w-8 text-center">{people}</span>
          <button
            type="button"
            onClick={() => setPeople((p) => Math.min(12, p + 1))}
            className="w-9 h-9 rounded-full bg-brand-black border border-white/10 text-white text-lg flex items-center justify-center hover:border-brand-gold transition-colors"
            aria-label="Increase"
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
              <Users size={11} /> Custom rate
            </span>
          )}
        </div>
      </div>

      {/* Price summary */}
      <div className="rounded-xl bg-brand-black/60 border border-white/5 p-3 space-y-1.5">
        {tour.pricePerPersonGel === null ? (
          <p className="text-sm text-brand-gold text-center font-medium">
            {tour.priceLabel ?? "Price on Request"} — Levani will send a custom quote.
          </p>
        ) : breakdown?.needsQuote ? (
          <div className="text-center space-y-1 py-1">
            <p className="text-sm font-semibold text-white">Group of {people} people</p>
            <p className="text-xs leading-relaxed" style={{ color: "#7A6A52" }}>
              Levani builds custom group rates. He&apos;ll send you a personalised quote.
            </p>
          </div>
        ) : breakdown ? (
          <>
            <div className="flex justify-between text-sm text-brand-muted">
              <span>
                {breakdown.basePerPerson} GEL × {people}{" "}
                {people === 1 ? "person" : "people"}
              </span>
              <span>{breakdown.basePerPerson * people} GEL</span>
            </div>
            {breakdown.discountPct > 0 && (
              <div className="flex justify-between text-xs" style={{ color: "#4CAF50" }}>
                <span>{breakdown.discountLabel}</span>
                <span>− {breakdown.savingsPerPerson * people} GEL</span>
              </div>
            )}
            <div className="border-t border-white/5 pt-1.5" />
            {breakdown.discountPct > 0 && (
              <div className="flex justify-between text-xs text-brand-muted">
                <span>Per person</span>
                <span>{breakdown.finalPerPerson} GEL</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold">
              <span className="text-white">Total</span>
              <span style={{ color: "#C4923A" }}>{breakdown.finalTotal} GEL</span>
            </div>
            {breakdown.savingsPerPerson > 0 && (
              <p className="text-[11px] text-center pt-0.5" style={{ color: "#4CAF50" }}>
                ✓ You save {breakdown.savingsPerPerson * people} GEL with this booking
              </p>
            )}
          </>
        ) : null}
      </div>

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
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm text-white transition-all active:scale-95"
        style={{ backgroundColor: "#25D366", opacity: isCreating ? 0.75 : 1 }}
      >
        {state === "creating" ? (
          <>
            <span className="animate-spin text-base">⋯</span> Saving booking…
          </>
        ) : state === "opening" ? (
          <>
            <ExternalLink size={16} /> Opening WhatsApp…
          </>
        ) : breakdown?.needsQuote ? (
          <>
            <MessageCircle size={18} /> Request Group Quote via WhatsApp
          </>
        ) : tour.pricePerPersonGel === null ? (
          <>
            <MessageCircle size={18} /> Request Price via WhatsApp
          </>
        ) : (
          <>
            <MessageCircle size={18} /> Book via WhatsApp
          </>
        )}
      </button>

      <p className="text-xs text-brand-muted text-center">
        No payment now — Levani confirms via WhatsApp
      </p>
    </div>
  );
}
