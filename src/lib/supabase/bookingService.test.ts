import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CreateBookingInput } from "@/lib/bookingTypes";

// A stand-in for the Supabase client: records what createBooking sends and
// lets each test choose the insert's outcome.
const insert = vi.fn();
const from = vi.fn(() => ({ insert }));
vi.mock("./client", () => ({ supabase: { from } }));

const { createBooking, generateBookingId } = await import("./bookingService");

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const input: CreateBookingInput = {
  bookingCode: "IVERA-20261101-1234",
  explorerId: null,
  customerName: null,
  tourSlug: "kazbegi-mountain-quest",
  tourTitle: "Kazbegi Mountain Quest",
  tourCategory: "quest",
  selectedDate: "2026-11-15",
  peopleCount: 2,
  basePricePerPerson: 130,
  baseTotal: 260,
  discountApplied: 40,
  discountReason: "Winter season — 40% off",
  savings: 104,
  finalPricePerPerson: 78,
  finalTotal: 156,
  xpReward: 0,
  seatsLeftAtBooking: 10,
  whatsappMessage: "test",
};

beforeEach(() => {
  insert.mockReset();
  from.mockClear();
});

describe("generateBookingId", () => {
  it("returns a v4 UUID, different each time", () => {
    const a = generateBookingId();
    const b = generateBookingId();
    expect(a).toMatch(UUID_V4);
    expect(b).toMatch(UUID_V4);
    expect(a).not.toBe(b);
  });
});

describe("createBooking", () => {
  it("inserts with a client-generated id and does not read the row back", async () => {
    // The real query builder returns a thenable from insert(); a plain
    // object without .select() proves createBooking never chains a read.
    insert.mockResolvedValue({ error: null });

    const result = await createBooking(input);

    expect(from).toHaveBeenCalledWith("bookings");
    const row = insert.mock.calls[0][0];
    expect(row.id).toMatch(UUID_V4);
    expect(row.booking_code).toBe(input.bookingCode);
    expect(result).toEqual({
      success: true,
      bookingId: row.id,
      bookingCode: input.bookingCode,
      error: null,
    });
  });

  it("never sends status or payment columns the anon role may not insert", async () => {
    insert.mockResolvedValue({ error: null });
    await createBooking(input);
    const row = insert.mock.calls[0][0];
    for (const col of ["status", "payment_status", "whatsapp_opened", "paypal_order_id", "paid_amount", "paid_at"]) {
      expect(row).not.toHaveProperty(col);
    }
  });

  it("reports a Supabase error without a booking id", async () => {
    insert.mockResolvedValue({ error: { message: "permission denied for table bookings" } });
    const result = await createBooking(input);
    expect(result).toEqual({
      success: false,
      bookingId: null,
      bookingCode: null,
      error: "permission denied for table bookings",
    });
  });
});
