"use client";

import { useState } from "react";
import { MessageCircle, Zap, Users } from "lucide-react";
import { Tour } from "@/data/tours";
import { calculateTourPrice } from "@/lib/discounts";
import { buildBookingLink, buildGroupQuoteLink } from "@/lib/whatsapp";
import { getProfile } from "@/lib/questProgress";
import { saveBookingToSupabase } from "@/lib/supabase/bookingService";

interface Props {
  tour: Tour;
}

type BookingState = "idle" | "preparing" | "opening";

export default function BookingWidget({ tour }: Props) {
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);
  const [error, setError] = useState("");
  const [bookingState, setBookingState] = useState<BookingState>("idle");

  const breakdown = calculateTourPrice({
    basePricePerPerson: tour.pricePerPersonGel,
    people,
    lastSeatsDiscountPct: tour.lastSeatsDiscountPct,
    bookingBonusXp: tour.bookingBonusXp,
  });

  const today = new Date().toISOString().split("T")[0];

  function handleBook() {
    if (!date) {
      setError("Please select a date before booking.");
      return;
    }
    if (bookingState !== "idle") return;
    setError("");
    setBookingState("preparing");

    const savingsTotal = breakdown ? breakdown.savingsPerPerson * people : 0;
    const link = breakdown?.needsQuote
      ? buildGroupQuoteLink({ tourTitle: tour.title, date, people })
      : buildBookingLink({
          tourTitle: tour.title,
          date,
          people,
          pricePerPerson: tour.pricePerPersonGel,
          total: breakdown?.finalTotal ?? null,
          discountLabel: breakdown?.discountLabel,
          savingsTotal,
        });

    const profile = typeof window !== "undefined" ? getProfile() : null;
    saveBookingToSupabase({
      explorerId: profile?.supabaseId ?? null,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      selectedDate: date,
      peopleCount: people,
      pricePerPerson: tour.pricePerPersonGel,
      total: breakdown?.finalTotal ?? null,
      whatsappMessage: link,
    }).catch(() => {});

    setBookingState("opening");
    window.open(link, "_blank", "noopener,noreferrer");
    setTimeout(() => setBookingState("idle"), 2000);
  }

  const ctaLabel = (() => {
    if (bookingState === "preparing") return "Saving request…";
    if (bookingState === "opening") return "Opening WhatsApp…";
    if (tour.pricePerPersonGel === null) return "Request Price via WhatsApp";
    if (breakdown?.needsQuote) return "Request Group Quote via WhatsApp";
    return "Book via WhatsApp";
  })();

  const groupHint = !breakdown?.needsQuote && people >= 2
    ? people === 2 ? "5% off" : people === 3 ? "10% off" : "20% off"
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
        <label className="block text-xs text-brand-muted mb-1.5" htmlFor="date">
          Select date <span className="text-red-400">*</span>
        </label>
        <input
          id="date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setError("");
          }}
          className="w-full bg-brand-black border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      {/* People */}
      <div>
        <label className="block text-xs text-brand-muted mb-1.5" htmlFor="people">
          Number of people
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            className="w-9 h-9 rounded-full bg-brand-black border border-white/10 text-white text-lg flex items-center justify-center hover:border-brand-gold transition-colors"
            aria-label="Decrease people"
          >
            −
          </button>
          <span className="text-white font-semibold text-lg w-8 text-center">
            {people}
          </span>
          <button
            type="button"
            onClick={() => setPeople((p) => Math.min(12, p + 1))}
            className="w-9 h-9 rounded-full bg-brand-black border border-white/10 text-white text-lg flex items-center justify-center hover:border-brand-gold transition-colors"
            aria-label="Increase people"
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
              Levani offers special group rates. Message him and he&apos;ll build a custom quote.
            </p>
          </div>
        ) : breakdown ? (
          <>
            {/* Base line */}
            <div className="flex justify-between text-sm text-brand-muted">
              <span>
                {breakdown.basePerPerson} GEL × {people}{" "}
                {people === 1 ? "person" : "people"}
              </span>
              <span>{breakdown.basePerPerson * people} GEL</span>
            </div>

            {/* Discount line */}
            {breakdown.discountPct > 0 && (
              <div className="flex justify-between text-xs" style={{ color: "#4CAF50" }}>
                <span>{breakdown.discountLabel}</span>
                <span>− {breakdown.savingsPerPerson * people} GEL</span>
              </div>
            )}

            <div className="border-t border-white/5 pt-1.5" />

            {/* Per person after discount */}
            {breakdown.discountPct > 0 && (
              <div className="flex justify-between text-xs text-brand-muted">
                <span>Per person</span>
                <span>{breakdown.finalPerPerson} GEL</span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-base font-semibold">
              <span className="text-white">Total</span>
              <span style={{ color: "#C4923A" }}>{breakdown.finalTotal} GEL</span>
            </div>

            {/* Savings callout */}
            {breakdown.savingsPerPerson > 0 && (
              <p className="text-[11px] text-center pt-0.5" style={{ color: "#4CAF50" }}>
                ✓ You save {breakdown.savingsPerPerson * people} GEL with this booking
              </p>
            )}
          </>
        ) : null}
      </div>

      {/* Validation error */}
      {error && (
        <p className="text-red-400 text-xs" role="alert">
          {error}
        </p>
      )}

      {/* CTA */}
      <button
        onClick={handleBook}
        disabled={bookingState !== "idle"}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm text-white transition-all active:scale-95"
        style={{ backgroundColor: "#25D366", opacity: bookingState !== "idle" ? 0.75 : 1 }}
      >
        <MessageCircle size={18} />
        {ctaLabel}
      </button>

      <p className="text-xs text-brand-muted text-center">
        No payment now — Levani confirms via WhatsApp
      </p>
    </div>
  );
}
