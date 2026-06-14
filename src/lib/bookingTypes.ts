import type { BookingStatus, PaymentMethod, PaymentStatus } from "@/lib/supabase/types";

export type { BookingStatus, PaymentMethod, PaymentStatus };

export interface BookingRecord {
  id: string;
  bookingCode: string;
  explorerId: string | null;
  customerName: string | null;
  tourSlug: string;
  tourTitle: string;
  tourCategory: string | null;
  selectedDate: string;
  peopleCount: number;
  basePricePerPerson: number | null;
  baseTotal: number | null;
  discountApplied: number;
  discountReason: string | null;
  savings: number;
  finalPricePerPerson: number | null;
  finalTotal: number | null;
  currency: string;
  xpReward: number;
  seatsLeftAtBooking: number | null;
  status: BookingStatus;
  whatsappOpened: boolean;
  whatsappMessage: string | null;
  notes: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paypalOrderId: string | null;
  paidAmount: number | null;
  paidCurrency: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateBookingInput {
  bookingCode: string;
  explorerId: string | null;
  customerName: string | null;
  tourSlug: string;
  tourTitle: string;
  tourCategory: string;
  selectedDate: string;
  peopleCount: number;
  basePricePerPerson: number | null;
  baseTotal: number | null;
  discountApplied: number;
  discountReason: string | null;
  savings: number;
  finalPricePerPerson: number | null;
  finalTotal: number | null;
  xpReward: number;
  seatsLeftAtBooking: number;
  whatsappMessage: string;
  paymentMethod?: PaymentMethod;
}

export interface BookingResult {
  success: boolean;
  bookingId: string | null;
  bookingCode: string | null;
  error: string | null;
}

// Minimal version stored in localStorage for offline/quick display
export interface LocalBookingSummary {
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
}
