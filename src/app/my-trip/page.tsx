"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Calendar, Users, MapPin, MessageCircle, ExternalLink, Map } from "lucide-react";
import { MotionPage } from "@/components/motion";
import { getProfile } from "@/lib/questProgress";
import { getUserBookings } from "@/lib/supabase/bookingService";
import { getLocalBookings } from "@/lib/localBookings";
import { buildBookingCheckLink, buildGeneralLink } from "@/lib/whatsapp";
import type { BookingRecord, LocalBookingSummary, BookingStatus } from "@/lib/bookingTypes";

// Merge Supabase records + localStorage summaries into a unified display list
interface DisplayBooking {
  id: string;
  bookingCode: string;
  tourSlug: string;
  tourTitle: string;
  tourCategory: string | null;
  selectedDate: string;
  peopleCount: number;
  finalTotal: number | null;
  discountApplied: number;
  savings: number;
  xpReward: number;
  status: BookingStatus;
  createdAt: string;
  whatsappMessage: string | null;
}

function toDisplay(r: BookingRecord): DisplayBooking {
  return {
    id: r.id,
    bookingCode: r.bookingCode,
    tourSlug: r.tourSlug,
    tourTitle: r.tourTitle,
    tourCategory: r.tourCategory,
    selectedDate: r.selectedDate,
    peopleCount: r.peopleCount,
    finalTotal: r.finalTotal,
    discountApplied: r.discountApplied,
    savings: r.savings,
    xpReward: r.xpReward,
    status: r.status,
    createdAt: r.createdAt,
    whatsappMessage: r.whatsappMessage,
  };
}

function localToDisplay(l: LocalBookingSummary): DisplayBooking {
  return {
    id: l.id,
    bookingCode: l.bookingCode,
    tourSlug: l.tourSlug,
    tourTitle: l.tourTitle,
    tourCategory: l.tourCategory,
    selectedDate: l.selectedDate,
    peopleCount: l.peopleCount,
    finalTotal: l.finalTotal,
    discountApplied: l.discountApplied,
    savings: l.savings,
    xpReward: l.xpReward,
    status: l.status,
    createdAt: l.createdAt,
    whatsappMessage: null,
  };
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; color: string }
> = {
  pending: {
    label: "Pending confirmation",
    bg: "rgba(200,155,60,0.12)",
    color: "#C4923A",
  },
  contacted: {
    label: "WhatsApp sent",
    bg: "rgba(30,100,180,0.12)",
    color: "#5B9BFF",
  },
  confirmed: {
    label: "Confirmed ✓",
    bg: "rgba(47,93,80,0.15)",
    color: "#4CAF50",
  },
  completed: {
    label: "Completed",
    bg: "rgba(47,93,80,0.08)",
    color: "#2F5D50",
  },
  cancelled: {
    label: "Cancelled",
    bg: "rgba(255,255,255,0.05)",
    color: "#5A4A38",
  },
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function MyTripPage() {
  const [bookings, setBookings] = useState<DisplayBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show localStorage cache immediately
    const local = getLocalBookings().map(localToDisplay);
    setBookings(local);
    setLoading(local.length === 0);

    // Then fetch from Supabase for authoritative data
    const profile = getProfile();
    if (!profile?.supabaseId) {
      setLoading(false);
      return;
    }

    getUserBookings(profile.supabaseId).then((records) => {
      if (records.length > 0) {
        setBookings(records.map(toDisplay));
      }
      setLoading(false);
    });
  }, []);

  // Stats
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "pending" || b.status === "contacted").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const totalValue = bookings.reduce((s, b) => s + (b.finalTotal ?? 0), 0);
  const totalXP = bookings.reduce((s, b) => s + b.xpReward, 0);

  if (!loading && bookings.length === 0) {
    return (
      <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
        <MotionPage className="px-4 py-6">
          <h1 className="font-serif text-2xl text-white font-bold mb-1">My Trip</h1>
          <p className="text-xs mb-8" style={{ color: "#5A4A38" }}>
            Your booked tours and reservations
          </p>
          <div
            className="rounded-2xl border p-8 text-center space-y-4"
            style={{ backgroundColor: "#1A1408", borderColor: "rgba(200,155,60,0.15)" }}
          >
            <p className="text-4xl">🗺️</p>
            <h2 className="font-serif text-white text-lg font-semibold">No trips yet</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5A4A38" }}>
              Book a tour and it will appear here with your booking code and status updates.
            </p>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "#C4923A", color: "#1A0E04" }}
            >
              <Map size={14} /> Explore Tours
            </Link>
            <div className="pt-2">
              <a
                href={buildGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium"
                style={{ color: "#25D366" }}
              >
                <MessageCircle size={12} /> or chat with Levani on WhatsApp
              </a>
            </div>
          </div>
        </MotionPage>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0F0C07", minHeight: "100%" }}>
      <MotionPage className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl text-white font-bold">My Trip</h1>
          <p className="text-xs mt-0.5" style={{ color: "#5A4A38" }}>
            {total} booking{total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Booked", value: total, color: "#C4923A" },
            { label: "Pending", value: pending, color: pending > 0 ? "#C4923A" : "#5A4A38" },
            { label: "Confirmed", value: confirmed, color: confirmed > 0 ? "#4CAF50" : "#5A4A38" },
            { label: "Completed", value: completed, color: "#2F5D50" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center border border-white/5"
              style={{ backgroundColor: "#1A1408" }}
            >
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "#5A4A38" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Value + XP summary */}
        {(totalValue > 0 || totalXP > 0) && (
          <div
            className="rounded-xl p-3 flex items-center justify-around"
            style={{ backgroundColor: "rgba(200,155,60,0.06)", border: "1px solid rgba(200,155,60,0.15)" }}
          >
            {totalValue > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "#C4923A" }}>
                  {totalValue} GEL
                </p>
                <p className="text-[11px]" style={{ color: "#5A4A38" }}>
                  estimated value
                </p>
              </div>
            )}
            {totalValue > 0 && totalXP > 0 && (
              <div className="w-px h-8" style={{ backgroundColor: "rgba(200,155,60,0.2)" }} />
            )}
            {totalXP > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold flex items-center gap-1 justify-center" style={{ color: "#C4923A" }}>
                  <Zap size={14} /> {totalXP}
                </p>
                <p className="text-[11px]" style={{ color: "#5A4A38" }}>
                  XP from bookings
                </p>
              </div>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl h-40 animate-shimmer"
                style={{ backgroundColor: "#1A1408" }}
              />
            ))}
          </div>
        )}

        {/* Booking cards */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            <p
              className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: "#C4923A" }}
            >
              Your Bookings
            </p>
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}

        {/* WhatsApp CTA */}
        <a
          href={buildGeneralLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
          style={{ background: "linear-gradient(135deg, #1C1710 0%, #2A1F14 100%)" }}
        >
          <div>
            <p className="text-sm font-semibold text-white">Questions about your trip?</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#7A6A52" }}>
              Chat with Levani directly on WhatsApp
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={16} color="white" />
          </div>
        </a>
      </MotionPage>
    </div>
  );
}

function BookingCard({ booking }: { booking: DisplayBooking }) {
  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "#1A1408", borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: cfg.bg }}
      >
        <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
        <span className="font-mono text-[10px]" style={{ color: "#5A4A38" }}>
          {booking.bookingCode}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Tour name */}
        <h3 className="font-serif text-white font-semibold text-base leading-snug">
          {booking.tourTitle}
        </h3>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "#7A6A52" }}>
          <span className="flex items-center gap-1">
            <Calendar size={10} /> {formatDate(booking.selectedDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={10} /> {booking.peopleCount}{" "}
            {booking.peopleCount === 1 ? "person" : "people"}
          </span>
          {booking.tourCategory && (
            <span className="flex items-center gap-1">
              <MapPin size={10} style={{ color: "#C4923A" }} /> {booking.tourCategory}
            </span>
          )}
        </div>

        {/* Price */}
        {booking.finalTotal != null && (
          <div
            className="rounded-xl px-3 py-2 flex items-center justify-between"
            style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
          >
            <div>
              <p className="text-base font-bold" style={{ color: "#C4923A" }}>
                {booking.finalTotal} GEL
              </p>
              {booking.discountApplied > 0 && (
                <p className="text-[10px]" style={{ color: "#4CAF50" }}>
                  {booking.discountApplied}% discount · saved {booking.savings} GEL
                </p>
              )}
            </div>
            {booking.xpReward > 0 && (
              <span
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold"
                style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A" }}
              >
                <Zap size={10} /> +{booking.xpReward} XP
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/tours/${booking.tourSlug}`}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(200,155,60,0.1)", color: "#C4923A" }}
          >
            View Tour
          </Link>
          <a
            href={buildBookingCheckLink(booking.bookingCode, booking.tourTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(37,211,102,0.08)", color: "#25D366" }}
          >
            <ExternalLink size={11} /> WhatsApp Levani
          </a>
        </div>
      </div>
    </div>
  );
}
