"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Search,
  Calendar,
  Users,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { buildBookingCheckLink } from "@/lib/whatsapp";
import { ALLOWED_STATUS_TRANSITIONS } from "@/lib/bookingTransitions";
import type { BookingRecord, BookingStatus } from "@/lib/bookingTypes";

// Admin auth model: the caller must be signed in with Supabase Auth (the
// same account system as the Explorer Pass) AND that account's email must
// be on the server-only ADMIN_EMAILS allowlist. The browser never holds a
// shared admin secret — every request carries the user's own session token,
// verified server-side in src/lib/supabase/adminAuth.ts. See
// docs/security-hardening-checklist.md for how to add an admin email.

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

function formatDate(d: string) {
  try {
    return new Date(d + (d.includes("T") ? "" : "T00:00:00")).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return d;
  }
}

async function authHeader(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Main component ────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const { user, loading: authLoading, openAuthModal, signOut } = useAuth();
  const [forbidden, setForbidden] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setForbidden(false);
    try {
      const headers = await authHeader();
      const qs = statusFilter === "all" ? "" : `?status=${statusFilter}`;
      const res = await fetch(`/api/admin/bookings${qs}`, { headers });
      if (res.status === 401 || res.status === 403) {
        setForbidden(true);
        setBookings([]);
        return;
      }
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user, statusFilter]);

  useEffect(() => {
    // Deferred via .then() rather than calling the async function directly —
    // its first statements set state, and doing that synchronously within an
    // effect body triggers cascading renders (react-hooks/set-state-in-effect).
    Promise.resolve().then(() => loadBookings());
  }, [loadBookings]);

  async function handleStatusChange(id: string, newStatus: BookingStatus) {
    setUpdatingId(id);
    try {
      const headers = await authHeader();
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRefund(id: string) {
    setUpdatingId(id);
    try {
      const headers = await authHeader();
      const res = await fetch(`/api/admin/bookings/${id}/refund`, {
        method: "PATCH",
        headers,
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, paymentStatus: "refunded" } : b))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  // ─── Sign-in gate ─────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0805" }}>
        <RefreshCw size={24} className="animate-spin" style={{ color: "#C4923A" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#0A0805" }}
      >
        <div
          className="w-full max-w-sm rounded-2xl border p-6 space-y-5 text-center"
          style={{ backgroundColor: "#1A1408", borderColor: "rgba(200,155,60,0.2)" }}
        >
          <ShieldCheck size={32} className="mx-auto" style={{ color: "#C4923A" }} />
          <div>
            <h1 className="font-serif text-xl text-white font-bold">Admin Orders</h1>
            <p className="text-xs mt-1" style={{ color: "#5A4A38" }}>
              Sign in with your Ivera account to continue.
            </p>
          </div>
          <button
            onClick={openAuthModal}
            className="w-full py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#C4923A" }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#0A0805" }}
      >
        <div
          className="w-full max-w-sm rounded-2xl border p-6 space-y-4 text-center"
          style={{ backgroundColor: "#1A1408", borderColor: "rgba(180,30,30,0.25)" }}
        >
          <ShieldAlert size={32} className="mx-auto" style={{ color: "#B41E2E" }} />
          <div>
            <h1 className="font-serif text-xl text-white font-bold">Not authorized</h1>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#8A6A68" }}>
              Signed in as <strong>{user.email}</strong>, but this account isn&apos;t on the
              admin allowlist. Ask whoever manages the deployment to add your email to
              <code className="mx-1 px-1 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                ADMIN_EMAILS
              </code>
              .
            </p>
          </div>
          <button
            onClick={signOut}
            className="text-xs font-medium"
            style={{ color: "#5A4A38" }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.bookingCode.toLowerCase().includes(q) ||
      b.tourTitle.toLowerCase().includes(q) ||
      (b.customerName ?? "").toLowerCase().includes(q)
    );
  });

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
              Signed in as {user.email}
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
                onRefund={handleRefund}
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
            onClick={signOut}
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
  onRefund,
}: {
  booking: BookingRecord;
  updating: boolean;
  onStatusChange: (id: string, status: BookingStatus) => void;
  onRefund: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_COLORS[booking.status];
  const nextStatuses = ALLOWED_STATUS_TRANSITIONS[booking.status] ?? [];

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
            {booking.paymentStatus === "paid" && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(0,112,186,0.12)", color: "#5B9BFF" }}
              >
                PayPal ✓ {booking.paidAmount != null ? `${booking.paidAmount} ${booking.paidCurrency}` : ""}
              </span>
            )}
            {booking.paymentStatus === "refunded" && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(200,155,60,0.12)", color: "#C4923A" }}
              >
                Refunded
              </span>
            )}
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
        <div className="flex gap-2 pt-1 flex-wrap">
          <a
            href={buildBookingCheckLink(booking.bookingCode, booking.tourTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: "rgba(37,211,102,0.08)", color: "#25D366" }}
          >
            <MessageCircle size={11} /> WhatsApp
          </a>

          {nextStatuses.map((ns) => (
            <button
              key={ns}
              onClick={() => onStatusChange(booking.id, ns)}
              disabled={updating}
              className="flex-1 py-2 rounded-full text-xs font-semibold transition-opacity min-w-[100px]"
              style={{
                backgroundColor: STATUS_COLORS[ns].bg,
                color: STATUS_COLORS[ns].color,
                opacity: updating ? 0.6 : 1,
              }}
            >
              {updating ? "…" : `→ ${STATUS_COLORS[ns].label}`}
            </button>
          ))}

          {booking.paymentStatus === "paid" && (
            <button
              onClick={() => onRefund(booking.id)}
              disabled={updating}
              className="flex-1 py-2 rounded-full text-xs font-semibold transition-opacity min-w-[100px]"
              style={{
                backgroundColor: "rgba(180,30,46,0.1)",
                color: "#B41E2E",
                opacity: updating ? 0.6 : 1,
              }}
            >
              {updating ? "…" : "Mark refunded"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
