import { describe, it, expect } from "vitest";
import { formatDateRange } from "./diploma";

describe("formatDateRange", () => {
  it("formats a single day", () => {
    expect(formatDateRange("2026-10-12", "2026-10-12", "en")).toBe("12 October 2026");
  });
  it("collapses a range within one month", () => {
    expect(formatDateRange("2026-10-12", "2026-10-15", "en")).toBe("12–15 October 2026");
    expect(formatDateRange("2026-10-12", "2026-10-15", "ru")).toBe("12–15 октября 2026 г.");
  });
  it("spans months and years", () => {
    expect(formatDateRange("2026-09-28", "2026-10-02", "en")).toBe("28 September – 2 October 2026");
    expect(formatDateRange("2026-12-30", "2027-01-02", "en")).toBe("30 December 2026 – 2 January 2027");
  });
  it("treats a missing end date as a one-day tour", () => {
    expect(formatDateRange("2026-10-12", "", "en")).toBe("12 October 2026");
  });
});
