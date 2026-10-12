import { test, expect } from "@playwright/test";

test.describe("Tour detail & booking widget", () => {
  test("a tour page loads and the booking widget renders a price", async ({ page }) => {
    await page.goto("/tours/tbilisi-city-quest");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // The booking widget shows a per-person price or an explicit
    // "price on request" state — either way it must never be blank/crash.
    await expect(page.getByText(/GEL|on request/i).first()).toBeVisible();
  });
});

test.describe("Combo builder discount math", () => {
  test("selecting 2 tours applies the documented 5% combo discount", async ({ page }) => {
    await page.goto("/packages");
    const cards = page.locator('button:has(img)');
    await cards.nth(0).click();
    await cards.nth(1).click();
    // getComboDiscount(2) === 5 — src/lib/discounts.ts, now the single
    // shared source for /packages, ComboPassCTA, and the WhatsApp combo
    // message builder (previously three separately hard-coded copies).
    // The active discount chip is marked with a leading checkmark.
    await expect(page.getByText("✓ 2 tours → −5%")).toBeVisible();
  });
});
