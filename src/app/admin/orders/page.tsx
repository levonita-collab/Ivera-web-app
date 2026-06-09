"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  RefreshCw,
  Search,
  Calendar,
  Users,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { getAdminBookings, updateBookingStatus } from "@/lib/supabase/bookingService";
import { buildBookingCheckLink } from "@/lib/whatsapp";
import type { BookingRecord, BookingStatus } from "@/lib/bookingTypes";

// ⚠️  SECURITY NOTE ─────────────────────────────────────────────────────────
// This page uses a basic sessionStorage token check. Anyone who knows the
// token can access all booking data. The Supabase RLS policies also currently
// use `using (true)` which allows any authenticated request to read all rows.
//
// Before production launch:
// 1. Add Supabase Auth (email/password or SSO) for admin accounts.
// 2. Replace RLS policies with `using (auth.uid() = admin_user_id)`.
// 3. Remove NEXT_PUBLIC_ADMIN_TOKEN — use server-side session checks.
// ────────────────────────────────────────────────────────────────────────────

const ADMIN_TOKEN =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "ivera2026"
    : "ivera2026";

const STATUS_OPTIONS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_COLORS: Record<BookingStatus, { bg: string; color: string; label: string }> = {
  pending: { bg: "rgba(200,155,60,0.15)", color: "#C4923A", label: "Pending" },
  contacted: { bg: "rgba(30,100,180,0.15)", color: "#5B9BFF", label: "Contacted" },
  confirmed: { bg: "rgba(47,93,80,0.2)", color: "#4CAF50", label: "Confirmed" },
  completed: { bg: "rgba(47,93,80,0.1)", color: "#2F5D50", label: "Completed" },
  cancelled: { bg: "rgba(255,255,255,0.05)", color: "#5A4A38", label: "Cancelled" },
};

const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus[]>> = {
  pending: ["confirmed", "cancelled"],
  contacted: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
};

function formatDate(d: string) {
  try {
    return new Date(d + (d.includes("T") ? "" : "T00:00:00")).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return d;
  }
}

// ─── Main component ────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [authenticated, setAuthenticated] = useState(() =>
    typeof window !== "undefined" &&
    sessionStorage.getItem("ivera_admin_session") === ADMIN_TOKEN
  );
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(authenticated);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadBookings() {
    setLoading(true);
    const data = await getAdminBookings(
      statusFilter === "all" ? undefined : statusFilter
    );
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!authenticated) return;
    getAdminBookings(statusFilter === "all" ? undefined : statusFilter).then(
      (data) => {
        setBookings(data);
        setLoading(false);
      }
    );
  }, [authenticated, statusFilter]);

  function handleLogin() {
    if (tokenInput === ADMIN_TOKEN) {
      sessionStorage.setItem("ivera_admin_session", ADMIN_TOKEN);
      setAuthenticated(true);
      setTokenError(false);
    } else {
      setTokenError(true);
    }
  }

  async function handleStatusChange(id: string, newStatus: BookingStatus) {
    setUpdatingId(id);
    const ok = await updateBookingStatus(id, newStatus);
    if (ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
    setUpdatingId(null);
  }

  // ─── Login gate ───────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#0A0805" }}
      >
        <div
          className="w-full max-w-sm rounded-2xl border p-6 space-y-5"
          style={{ backgroundColor: "#1A1408", borderColor: "rgba(200,155,60,0.2)" }}
        >
          <div className="text-center space-y-2">
            <ShieldCheck size={32} className="mx-auto" style={{ color: "#C4923A" }} />
            <h1 className="font-serif text-xl text-white font-bold">Admin Orders</h1>
            <p className="text-xs" style={{ color: "#5A4A38" }}>
              Enter the admin token to continue
            </p>
          </div>
          <input
            type="password"
            placeholder="Admin token"
            value={tokenInput}
            onChange={(e) => { setTokenInput(e.target.value); setTokenError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-brand-black border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
            style={{
              borderColor: tokenError ? "#B41E2E" : "rgba(255,255,255,0.1)",
            }}
          />
          {tokenError && (
            <p className="text-xs text-red-400">Incorrect token. Check NEXT_PUBLIC_ADMIN_TOKEN.</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#C4923A" }}
          >
            Enter Dashboard
          </button>
          <p className="text-[10px] text-center" style={{ color: "#3A2A18" }}>
            ⚠️ MVP guard only — not production-secure
          </p>
        </div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  // Filter
  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.bookingCode.toLowerCase().includes(q) ||
      b.tourTitle.toLowerCase().includes(q) ||
      (b.customerName ?? "").toLowerCase().includes(q)
    );
  });

  // Stats
  const counts = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };
  const totalValue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + (b.finalTotal ?? 0), 0);

  return (
    <div style={{ backgroundColor: "#0A0805", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} style={{ color: "#C4923A" }} />
              <h1 className="font-serif text-xl text-white font-bold">Orders</h1>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: "#3A2A18" }}>
              ⚠️ MVP admin — requires proper auth before public launch
            </p>
          </div>
          <button
            onClick={loadBookings}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(200,155,60,0.1)", color: "#C4923A" }}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total", value: counts.total, color: "#C4923A" },
            { label: "Pending", value: counts.pending, color: counts.pending > 0 ? "#C4923A" : "#5A4A38" },
            { label: "Confirmed", value: counts.confirmed, color: "#4CAF50" },
            { label: "Completed", value: counts.completed, color: "#2F5D50" },
            { label: "Cancelled", value: counts.cancelled, color: "#5A4A38" },
            {
              label: "Est. Value",
              value: `${totalValue} GEL`,
              color: "#C4923A",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center border border-white/5"
              style={{ backgroundColor: "#1A1408" }}
            >
              <p className="text-lg font-bold leading-none" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "#5A4A38" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="space-y-2">
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: "#1A1408", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Search size={14} style={{ color: "#5A4A38" }} />
            <input
              type="text"
              placeholder="Search booking code, tour, or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-[#3A2A18]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  backgroundColor:
                    statusFilter === opt.value
                      ? "rgba(200,155,60,0.2)"
                      : "rgba(255,255,255,0.04)",
                  color: statusFilter === opt.value ? "#C4923A" : "#5A4A38",
                  border: statusFilter === opt.value
                    ? "1px solid rgba(200,155,60,0.3)"
                    : "1px solid transparent",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Booking list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl h-32 animate-shimmer"
                style={{ backgroundColor: "#1A1408" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-2xl">📋</p>
            <p className="text-white font-medium">No bookings found</p>
            <p className="text-xs" style={{ color: "#5A4A38" }}>
              {search ? "Try a different search term" : "No bookings in this status yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs" style={{ color: "#5A4A38" }}>
              Showing {filtered.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            </p>
            {filtered.map((b) => (
              <AdminBookingCard
                key={b.id}
                booking={b}
                updating={updatingId === b.id}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Nav */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/"
            className="text-xs font-medium"
            style={{ color: "#5A4A38" }}
          >
            ← Back to site
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("ivera_admin_session");
              setAuthenticated(false);
            }}
            className="text-xs font-medium"
            style={{ color: "#5A4A38" }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin booking card ────────────────────────────────────────────────────

function AdminBookingCard({
  booking,
  updating,
  onStatusChange,
}: {
  booking: BookingRecord;
  updating: boolean;
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_COLORS[booking.status];
  const nextStatuses = NEXT_STATUS[booking.status] ?? [];

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "#1A1408", borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: statusCfg.bg }}
      >
        <span
          className="text-[10px] font-semibold tracking-wider uppercase"
          style={{ color: statusCfg.color }}
        >
          {statusCfg.label}
        </span>
        <span className="font-mono text-[10px]" style={{ color: "#5A4A38" }}>
          {booking.bookingCode}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Tour + name */}
        <div>
          <h3 className="font-serif text-white font-semibold text-base">
            {booking.tourTitle}
          </h3>
          {booking.customerName && (
            <p className="text-xs mt-0.5" style={{ color: "#7A6A52" }}>
              {booking.customerName}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "#5A4A38" }}>
          <span className="flex items-center gap-1">
            <Calendar size={10} /> {formatDate(booking.selectedDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={10} /> {booking.peopleCount}{" "}
            {booking.peopleCount === 1 ? "person" : "people"}
          </span>
          <span className="flex items-center gap-1">
            {formatDate(booking.createdAt)}
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            {booking.finalTotal != null && (
              <p className="text-lg font-bold" style={{ color: "#C4923A" }}>
                {booking.finalTotal} GEL
              </p>
            )}
            {booking.discountApplied > 0 && (
              <p className="text-[10px]" style={{ color: "#4CAF50" }}>
                {booking.discountApplied}% off · saved {booking.savings} GEL
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {booking.whatsappOpened && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(37,211,102,0.1)", color: "#25D366" }}
              >
                WhatsApp ✓
              </span>
            )}
          </div>
        </div>

        {/* Expandable details */}
        {(booking.notes || booking.discountReason || booking.seatsLeftAtBooking != null) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px]"
            style={{ color: "#5A4A38" }}
          >
            <ChevronDown
              size={12}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
            {expanded ? "Hide details" : "Show details"}
          </button>
        )}
        {expanded && (
          <div
            className="rounded-xl p-3 space-y-1.5 text-xs"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {booking.discountReason && (
              <p style={{ color: "#7A6A52" }}>Discount reason: {booking.discountReason}</p>
            )}
            {booking.seatsLeftAtBooking != null && (
              <p style={{ color: "#7A6A52" }}>
                Seats available at booking: {booking.seatsLeftAtBooking}
              </p>
            )}
            {booking.notes && (
              <p style={{ color: "#7A6A52" }}>Notes: {booking.notes}</p>
            )}
            {booking.xpReward > 0 && (
              <p style={{ color: "#C4923A" }}>XP reward: +{booking.xpReward}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <a
            href={buildBookingCheckLink(booking.bookingCode, booking.tourTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: "rgba(37,211,102,0.08)", color: "#25D366" }}
          >
            <MessageCircle size={11} /> WhatsApp
          </a>

          {nextStatuses.length > 0 && (
            <div className="flex gap-1.5 flex-1 flex-wrap">
              {nextStatuses.map((ns) => (
                <button
                  key={ns}
                  onClick={() => onStatusChange(booking.id, ns)}
                  disabled={updating}
                  className="flex-1 py-2 rounded-full text-xs font-semibold transition-opacity"
                  style={{
                    backgroundColor: STATUS_COLORS[ns].bg,
                    color: STATUS_COLORS[ns].color,
                    opacity: updating ? 0.6 : 1,
                  }}
                >
                  {updating ? "…" : `→ ${STATUS_COLORS[ns].label}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
