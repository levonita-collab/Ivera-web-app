export const PRICE_FLOOR_GEL = 55;

export type DiscountSource = "group" | "lastSeats" | "none";

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
}): TourPriceBreakdown | null {
  const { basePricePerPerson, people, lastSeatsDiscountPct = 0, bookingBonusXp = 0 } = params;
  if (basePricePerPerson === null) return null;

  const groupDiscount = getGroupSizeDiscount(people);
  const needsQuote = groupDiscount.isSpecial;

  // Only apply monetary discounts if base price exceeds the floor
  const canDiscount = basePricePerPerson > PRICE_FLOOR_GEL;

  let discountPct = 0;
  let discountLabel = "";
  let discountSource: DiscountSource = "none";

  if (canDiscount && !needsQuote) {
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
  const floorApplied = rawFinal < PRICE_FLOOR_GEL && discountPct > 0;
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
