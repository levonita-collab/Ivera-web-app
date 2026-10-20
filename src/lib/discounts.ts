import { SEASONAL_OFFER, type SeasonalOffer } from "@/data/seasonalOffer";

export const PRICE_FLOOR_GEL = 55;

export type DiscountSource = "season" | "group" | "lastSeats" | "none";

/** Calendar date in Georgia, so the offer flips at Tbilisi midnight for everyone. */
function tbilisiDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tbilisi" }).format(date);
}

export function getActiveSeasonalOffer(
  date: Date = new Date(),
  offer: SeasonalOffer | null = SEASONAL_OFFER
): SeasonalOffer | null {
  if (!offer || offer.pct <= 0) return null;
  const today = tbilisiDateKey(date);
  return today >= offer.startsOn && today <= offer.endsOn ? offer : null;
}

/** Per-person price shown on cards: the seasonal price when an offer is on. */
export function getSeasonalPrice(
  basePricePerPerson: number,
  date: Date = new Date(),
  offer: SeasonalOffer | null = SEASONAL_OFFER
): { base: number; final: number; pct: number } {
  const active = getActiveSeasonalOffer(date, offer);
  const pct = active?.pct ?? 0;
  return { base: basePricePerPerson, final: Math.round(basePricePerPerson * (1 - pct / 100)), pct };
}

export interface GroupDiscount {
  pct: number;
  label: string;
  isSpecial: boolean;
}

export interface TourPriceBreakdown {
  basePerPerson: number;
  people: number;
  discountPct: number;
  discountLabel: string;
  discountSource: DiscountSource;
  savingsPerPerson: number;
  finalPerPerson: number;
  finalTotal: number;
  isFloorApplied: boolean;
  needsQuote: boolean;
  bonusXp: number;
}

/**
 * Multi-tour combo-builder discount — a different axis from
 * getGroupSizeDiscount (people per tour): this is the number of distinct
 * tours bundled together. Single source of truth for /packages, the
 * ComboPassCTA marketing tiers, and the WhatsApp combo message builder,
 * which previously each hard-coded their own copy of the same thresholds.
 */
export function getComboDiscount(toursCount: number): number {
  if (toursCount >= 4) return 15;
  if (toursCount === 3) return 10;
  if (toursCount === 2) return 5;
  return 0;
}

export function getGroupSizeDiscount(people: number): GroupDiscount {
  if (people >= 6) return { pct: 0, label: "Custom group rate", isSpecial: true };
  if (people >= 4) return { pct: 20, label: `Group of ${people} — 20% off`, isSpecial: false };
  if (people === 3) return { pct: 10, label: "Group of 3 — 10% off", isSpecial: false };
  if (people === 2) return { pct: 5, label: "Pair — 5% off", isSpecial: false };
  return { pct: 0, label: "", isSpecial: false };
}

export function calculateTourPrice(params: {
  basePricePerPerson: number | null;
  people: number;
  lastSeatsDiscountPct?: number;
  bookingBonusXp?: number;
  /** Defaults to now; pass a date in tests. */
  date?: Date;
  /** Defaults to SEASONAL_OFFER; pass null in tests to ignore it. */
  seasonalOffer?: SeasonalOffer | null;
}): TourPriceBreakdown | null {
  const { basePricePerPerson, people, lastSeatsDiscountPct = 0, bookingBonusXp = 0 } = params;
  const season = getActiveSeasonalOffer(params.date, params.seasonalOffer === undefined ? SEASONAL_OFFER : params.seasonalOffer);
  if (basePricePerPerson === null) return null;

  const groupDiscount = getGroupSizeDiscount(people);
  const needsQuote = groupDiscount.isSpecial;

  // Only apply monetary discounts if base price exceeds the floor
  const canDiscount = basePricePerPerson > PRICE_FLOOR_GEL;

  let discountPct = 0;
  let discountLabel = "";
  let discountSource: DiscountSource = "none";

  if (season && !needsQuote && season.pct >= Math.max(groupDiscount.pct, lastSeatsDiscountPct)) {
    // The seasonal offer is a deliberate promotion, so the price floor does not apply to it.
    discountPct = season.pct;
    discountLabel = `${season.title} — ${season.pct}% off`;
    discountSource = "season";
  } else if (canDiscount && !needsQuote) {
    // Best discount wins — no stacking
    if (lastSeatsDiscountPct > 0 && lastSeatsDiscountPct >= groupDiscount.pct) {
      discountPct = lastSeatsDiscountPct;
      discountLabel = `Last seats — ${lastSeatsDiscountPct}% off`;
      discountSource = "lastSeats";
    } else if (groupDiscount.pct > 0) {
      discountPct = groupDiscount.pct;
      discountLabel = groupDiscount.label;
      discountSource = "group";
    }
  }

  const rawFinal = discountPct > 0
    ? basePricePerPerson * (1 - discountPct / 100)
    : basePricePerPerson;

  // Clamp to floor if discount pushed price below minimum
  const floorApplied = rawFinal < PRICE_FLOOR_GEL && discountPct > 0 && discountSource !== "season";
  const finalPerPerson = floorApplied ? PRICE_FLOOR_GEL : Math.round(rawFinal);

  return {
    basePerPerson: basePricePerPerson,
    people,
    discountPct: floorApplied ? 0 : discountPct,
    discountLabel: floorApplied ? "" : discountLabel,
    discountSource: floorApplied ? "none" : discountSource,
    savingsPerPerson: Math.max(0, basePricePerPerson - finalPerPerson),
    finalPerPerson,
    finalTotal: finalPerPerson * people,
    isFloorApplied: floorApplied,
    needsQuote,
    bonusXp: bookingBonusXp,
  };
}
