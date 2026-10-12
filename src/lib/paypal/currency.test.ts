import { describe, it, expect } from "vitest";
import { gelToEur, DEFAULT_GEL_EUR_RATE } from "./currency";

describe("gelToEur", () => {
  it("uses the default rate when none is given", () => {
    expect(gelToEur(100)).toBe(Math.round(100 * DEFAULT_GEL_EUR_RATE * 100) / 100);
  });

  it("rounds to the nearest eurocent", () => {
    // 33.33 * 0.34 = 11.3322 -> rounds to 11.33
    expect(gelToEur(33.33, 0.34)).toBe(11.33);
  });

  it("respects a custom rate", () => {
    expect(gelToEur(100, 0.5)).toBe(50);
  });

  it("returns 0 for 0 GEL", () => {
    expect(gelToEur(0)).toBe(0);
  });
});
