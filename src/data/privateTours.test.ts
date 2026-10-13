import { describe, it, expect } from "vitest";
import { getPrivateTourLoyaltyDiscount } from "./privateTours";

describe("getPrivateTourLoyaltyDiscount", () => {
  it.each([
    [1, 0],
    [2, 0],
    [3, 10],
    [4, 10],
    [5, 15],
    [14, 15],
  ])("%i day(s) -> %i%% off the next tour", (days, pct) => {
    expect(getPrivateTourLoyaltyDiscount(days)).toBe(pct);
  });
});
