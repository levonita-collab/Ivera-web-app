"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Tour } from "@/data/tours";
import { calculateTotal, formatPrice } from "@/lib/pricing";
import { buildBookingLink } from "@/lib/whatsapp";
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

  const total = calculateTotal(tour.pricePerPersonGel, people);

  const today = new Date().toISOString().split("T")[0];

  function handleBook() {
    if (!date) {
      setError("Please select a date before booking.");
      return;
    }
    if (bookingState !== "idle") return;
    setError("");
    setBookingState("preparing");

    const link = buildBookingLink({
      tourTitle: tour.title,
      date,
      people,
      pricePerPerson: tour.pricePerPersonGel,
      total,
    });

    const profile = typeof window !== "undefined" ? getProfile() : null;
    // Fire-and-forget — WhatsApp opens regardless of Supabase result
    saveBookingToSupabase({
      explorerId: profile?.supabaseId ?? null,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      selectedDate: date,
      peopleCount: people,
      pricePerPerson: tour.pricePerPersonGel,
      total,
      whatsappMessage: link,
    }).catch(() => {});

    setBookingState("opening");
    window.open(link, "_blank", "noopener,noreferrer");
    setTimeout(() => setBookingState("idle"), 2000);
  }

  return (
    <div className="rounded-2xl bg-brand-dark border border-white/8 p-5 space-y-4">
      <h2 className="text-white font-semibold text-base">Book this Tour</h2>

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
            onClick={() => setPeople((p) => p + 1)}
            className="w-9 h-9 rounded-full bg-brand-black border border-white/10 text-white text-lg flex items-center justify-center hover:border-brand-gold transition-colors"
            aria-label="Increase people"
          >
            +
          </button>
        </div>
      </div>

      {/* Price summary */}
      <div className="rounded-xl bg-brand-black/60 border border-white/5 p-3 space-y-1.5">
        {tour.pricePerPersonGel !== null ? (
          <>
            <div className="flex justify-between text-sm text-brand-muted">
              <span>
                {formatPrice(tour.pricePerPersonGel)} × {people}{" "}
                {people === 1 ? "person" : "people"}
              </span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-white border-t border-white/5 pt-2">
              <span>Total</span>
              <span className="text-brand-gold">{formatPrice(total)}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-brand-gold text-center font-medium">
            {tour.priceLabel ?? "Price on Request"} — Levani will send you a custom quote.
          </p>
        )}
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
        {bookingState === "preparing" && "Saving request…"}
        {bookingState === "opening" && "Opening WhatsApp…"}
        {bookingState === "idle" && (tour.pricePerPersonGel !== null
          ? "Book via WhatsApp"
          : "Request Price via WhatsApp")}
      </button>

      <p className="text-xs text-brand-muted text-center">
        No payment now — Levani confirms via WhatsApp
      </p>
    </div>
  );
}
