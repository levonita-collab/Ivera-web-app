"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, X, CheckCircle } from "lucide-react";
import { getLocalBookings, getPendingBookingsCount } from "@/lib/localBookings";
import { buildBookingCheckLink, buildGeneralLink } from "@/lib/whatsapp";
import type { LocalBookingSummary } from "@/lib/bookingTypes";

export default function Header() {
  const [showPanel, setShowPanel] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [bookings, setBookings] = useState<LocalBookingSummary[]>([]);

  useEffect(() => {
    setPendingCount(getPendingBookingsCount());
    setBookings(getLocalBookings().slice(0, 5));
  }, []);

  // Refresh on panel open
  function openPanel() {
    setPendingCount(getPendingBookingsCount());
    setBookings(getLocalBookings().slice(0, 5));
    setShowPanel(true);
  }

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{ backgroundColor: "rgba(15,12,7,0.93)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Ivera home">
            <Image
              src="/images/logo-dark.png"
              alt="Ivera"
              width={120}
              height={40}
              className="object-contain h-9 w-auto"
              priority
            />
          </Link>

          <button
            onClick={openPanel}
            className="relative w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "#8A7A60" }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {pendingCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: "#B41E2E" }}
              >
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Notification panel overlay */}
      {showPanel && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowPanel(false)}
        >
          <div
            className="max-w-2xl w-full mx-auto rounded-t-3xl overflow-hidden max-h-[80vh] flex flex-col"
            style={{ backgroundColor: "#0F0C07", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-4 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <Bell size={16} style={{ color: "#C4923A" }} />
                <span className="text-white font-semibold text-sm">Notifications</span>
                {pendingCount > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: "#B41E2E" }}
                  >
                    {pendingCount} pending
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ color: "#7A6A52" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Panel body */}
            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
              {bookings.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-2xl">🔔</p>
                  <p className="text-sm font-medium text-white">No notifications yet</p>
                  <p className="text-xs" style={{ color: "#5A4A38" }}>
                    Book a tour to see your booking status here.
                  </p>
                  <Link
                    href="/tours"
                    onClick={() => setShowPanel(false)}
                    className="inline-block mt-2 text-xs font-semibold"
                    style={{ color: "#C4923A" }}
                  >
                    Explore tours →
                  </Link>
                </div>
              ) : (
                <>
                  {bookings.map((b) => (
                    <NotificationItem
                      key={b.id}
                      booking={b}
                      onClose={() => setShowPanel(false)}
                    />
                  ))}
                  <Link
                    href="/my-trip"
                    onClick={() => setShowPanel(false)}
                    className="block text-center py-3 text-xs font-semibold"
                    style={{ color: "#C4923A" }}
                  >
                    View all bookings in My Trip →
                  </Link>
                </>
              )}

              {/* Daily challenge promo */}
              <div
                className="rounded-xl px-4 py-3 flex items-center gap-3 mt-2"
                style={{
                  background: "linear-gradient(135deg, #1A1208 0%, #2A1A0A 100%)",
                  border: "1px solid rgba(200,155,60,0.18)",
                }}
              >
                <span className="text-xl flex-shrink-0">🏆</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">Daily Quest Challenge</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#7A6A52" }}>
                    Top 3 today earn a free bonus seat.
                  </p>
                </div>
                <Link
                  href="/leaderboard"
                  onClick={() => setShowPanel(false)}
                  className="text-[11px] font-semibold flex-shrink-0"
                  style={{ color: "#C4923A" }}
                >
                  Rankings →
                </Link>
              </div>
            </div>

            {/* Chat CTA */}
            <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <a
                href={buildGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: "#25D366" }}
                onClick={() => setShowPanel(false)}
              >
                Chat with Levani on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NotificationItem({
  booking,
  onClose,
}: {
  booking: LocalBookingSummary;
  onClose: () => void;
}) {
  const isPending = booking.status === "pending" || booking.status === "contacted";
  const isConfirmed = booking.status === "confirmed";

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{
        backgroundColor: isPending ? "rgba(180,30,46,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isPending ? "rgba(180,30,46,0.2)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <div className="flex items-start gap-2">
        {isConfirmed ? (
          <CheckCircle size={14} style={{ color: "#4CAF50", flexShrink: 0, marginTop: 1 }} />
        ) : (
          <Bell size={14} style={{ color: "#C4923A", flexShrink: 0, marginTop: 1 }} />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white leading-snug">{booking.tourTitle}</p>
          <p className="text-[10px] mt-0.5 font-mono" style={{ color: "#5A4A38" }}>
            {booking.bookingCode}
          </p>
          <p className="text-[11px] mt-1" style={{ color: "#7A6A52" }}>
            {isPending
              ? "Pending WhatsApp confirmation from Levani"
              : isConfirmed
                ? "Confirmed by Levani ✓"
                : booking.status}
          </p>
        </div>
      </div>
      <a
        href={buildBookingCheckLink(booking.bookingCode, booking.tourTitle)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="block text-center py-1.5 rounded-lg text-[11px] font-semibold"
        style={{ backgroundColor: "rgba(37,211,102,0.1)", color: "#25D366" }}
      >
        Check status on WhatsApp
      </a>
    </div>
  );
}
