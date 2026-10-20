import { describe, it, expect } from "vitest";
import {
  getGroupSizeDiscount,
  getComboDiscount,
  calculateTourPrice,
  getActiveSeasonalOffer,
  getSeasonalPrice,
  PRICE_FLOOR_GEL,
} from "./discounts";
import type { SeasonalOffer } from "@/data/seasonalOffer";

describe("getGroupSizeDiscount", () => {
  it("applies no discount for a solo traveller", () => {
    expect(getGroupSizeDiscount(1)).toMatchObject({ pct: 0, isSpecial: false });
  });

  it("applies 5% for a pair", () => {
    expect(getGroupSizeDiscount(2)).toMatchObject({ pct: 5, isSpecial: false });
  });

  it("applies 10% for a group of 3", () => {
    expect(getGroupSizeDiscount(3)).toMatchObject({ pct: 10, isSpecial: false });
  });

  it("applies 20% for groups of 4 or 5", () => {
    expect(getGroupSizeDiscount(4)).toMatchObject({ pct: 20, isSpecial: false });
    expect(getGroupSizeDiscount(5)).toMatchObject({ pct: 20, isSpecial: false });
  });

  it("requires a custom quote for 6 or more, with no numeric discount", () => {
    expect(getGroupSizeDiscount(6)).toMatchObject({ pct: 0, isSpecial: true });
    expect(getGroupSizeDiscount(12)).toMatchObject({ pct: 0, isSpecial: true });
  });
});

describe("getComboDiscount", () => {
  it.each([
    [0, 0],
    [1, 0],
    [2, 5],
    [3, 10],
    [4, 15],
    [7, 15],
  ])("toursCount=%i -> %i%%", (count, expected) => {
    expect(getComboDiscount(count)).toBe(expected);
  });
});

describe("calculateTourPrice", () => {
  it("returns null when the tour has no fixed price", () => {
    expect(calculateTourPrice({ seasonalOffer: null, basePricePerPerson: null, people: 2 })).toBeNull();
  });

  it("charges full price for a solo traveller with no last-seats discount", () => {
    const b = calculateTourPrice({ seasonalOffer: null, basePricePerPerson: 100, people: 1 });
    expect(b).not.toBeNull();
    expect(b!.discountPct).toBe(0);
    expect(b!.finalPerPerson).toBe(100);
    expect(b!.finalTotal).toBe(100);
    expect(b!.needsQuote).toBe(false);
  });

  it("applies the group-size discount for a pair", () => {
    const b = calculateTourPrice({ seasonalOffer: null, basePricePerPerson: 100, people: 2 });
    expect(b!.discountPct).toBe(5);
    expect(b!.discountSource).toBe("group");
    expect(b!.finalPerPerson).toBe(95);
    expect(b!.finalTotal).toBe(190);
    expect(b!.savingsPerPerson).toBe(5);
  });

  it("flags 6+ people as needing a custom quote and applies no discount", () => {
    const b = calculateTourPrice({ seasonalOffer: null, basePricePerPerson: 100, people: 6 });
    expect(b!.needsQuote).toBe(true);
    expect(b!.discountPct).toBe(0);
    expect(b!.finalPerPerson).toBe(100);
    expect(b!.finalTotal).toBe(600);
  });

  it("picks the larger of the last-seats and group discounts — never both (no stacking)", () => {
    // last-seats (30%) beats the pair discount (5%)
    const lastSeatsWins = calculateTourPrice({ seasonalOffer: null, basePricePerPerson: 100, people: 2, lastSeatsDiscountPct: 30 });
    expect(lastSeatsWins!.discountPct).toBe(30);
    expect(lastSeatsWins!.discountSource).toBe("lastSeats");
    expect(lastSeatsWins!.finalPerPerson).toBe(70);

    // group discount (20% for 4 people) beats a smaller last-seats offer (10%)
    const groupWins = calculateTourPrice({ seasonalOffer: null, basePricePerPerson: 100, people: 4, lastSeatsDiscountPct: 10 });
    expect(groupWins!.discountPct).toBe(20);
    expect(groupWins!.discountSource).toBe("group");
    expect(groupWins!.finalPerPerson).toBe(80);
  });

  it("never discounts a tour already at or below the price floor", () => {
    const b = calculateTourPrice({ seasonalOffer: null, basePricePerPerson: PRICE_FLOOR_GEL, people: 4 });
    expect(b!.discountPct).toBe(0);
    expect(b!.finalPerPerson).toBe(PRICE_FLOOR_GEL);
    expect(b!.isFloorApplied).toBe(false);
  });

  it("clamps the discounted price to the floor instead of going below it, and reports no discount", () => {
    // 60 GEL base, 20% off would be 48 — below the 55 GEL floor
    const b = calculateTourPrice({ seasonalOffer: null, basePricePerPerson: 60, people: 4 });
    expect(b!.isFloorApplied).toBe(true);
    expect(b!.finalPerPerson).toBe(PRICE_FLOOR_GEL);
    expect(b!.discountPct).toBe(0);
    expect(b!.discountLabel).toBe("");
  });

  it("carries the tour's bonus XP through unchanged", () => {
    const b = calculateTourPrice({ seasonalOffer: null, basePricePerPerson: 100, people: 1, bookingBonusXp: 150 });
    expect(b!.bonusXp).toBe(150);
  });
});

describe("seasonal offer", () => {
  const WINTER: SeasonalOffer = {
    id: "test-winter", pct: 40, startsOn: "2026-11-01", endsOn: "2027-02-28", title: "Winter season", titleRu: "Зимний сезон",
  };
  const IN = new Date("2026-12-15T10:00:00Z");
  const OUT = new Date("2027-03-02T10:00:00Z");

  it("is active only between its dates, by the calendar in Georgia", () => {
    expect(getActiveSeasonalOffer(IN, WINTER)).toBe(WINTER);
    expect(getActiveSeasonalOffer(OUT, WINTER)).toBeNull();
    // 21:00 UTC on Oct 31 is already Nov 1 in Tbilisi (UTC+4)
    expect(getActiveSeasonalOffer(new Date("2026-10-31T21:00:00Z"), WINTER)).toBe(WINTER);
    expect(getActiveSeasonalOffer(new Date("2026-10-31T19:00:00Z"), WINTER)).toBeNull();
  });

  it("takes 40% off and beats the group discount instead of stacking with it", () => {
    const b = calculateTourPrice({ basePricePerPerson: 130, people: 4, date: IN, seasonalOffer: WINTER })!;
    expect(b.discountSource).toBe("season");
    expect(b.discountPct).toBe(40);
    expect(b.finalPerPerson).toBe(78);
    expect(b.finalTotal).toBe(312);
  });

  it("ignores the price floor so the cheapest tour is discounted too", () => {
    const b = calculateTourPrice({ basePricePerPerson: 55, people: 1, date: IN, seasonalOffer: WINTER })!;
    expect(b.finalPerPerson).toBe(33);
    expect(b.isFloorApplied).toBe(false);
  });

  it("still asks for a custom quote for 6 or more people", () => {
    const b = calculateTourPrice({ basePricePerPerson: 130, people: 6, date: IN, seasonalOffer: WINTER })!;
    expect(b.needsQuote).toBe(true);
    expect(b.discountPct).toBe(0);
  });

  it("returns to the normal discounts after the season", () => {
    const b = calculateTourPrice({ basePricePerPerson: 130, people: 4, date: OUT, seasonalOffer: WINTER })!;
    expect(b.discountSource).toBe("group");
    expect(b.discountPct).toBe(20);
  });

  it("gives the card price for one person", () => {
    expect(getSeasonalPrice(150, IN, WINTER)).toEqual({ base: 150, final: 90, pct: 40 });
    expect(getSeasonalPrice(150, OUT, WINTER)).toEqual({ base: 150, final: 150, pct: 0 });
  });
});
