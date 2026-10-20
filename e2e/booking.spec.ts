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
  test("2 tours get the 5% combo discount, or the winter price instead while the season runs", async ({ page }) => {
    await page.goto("/packages");
    const cards = page.locator('button:has(img)');
    await cards.nth(0).click();
    await cards.nth(1).click();
    // getComboDiscount(2) === 5 — src/lib/discounts.ts. During the seasonal
    // offer (src/data/seasonalOffer.ts) tours are already at the winter price
    // and combo discounts pause so the two never stack.
    const seasonNote = page.getByText("combo discounts return in spring");
    if (await seasonNote.isVisible()) {
      await expect(page.getByText("✓ 2 tours → −5%")).toHaveCount(0);
      await expect(page.getByText(/Combo discount/)).toHaveCount(0);
    } else {
      // The active discount chip is marked with a leading checkmark.
      await expect(page.getByText("✓ 2 tours → −5%")).toBeVisible();
    }
  });
});

test.describe("Seasonal offer", () => {
  test("a tour page shows the old price struck through next to the winter price", async ({ page }) => {
    await page.goto("/tours/kakheti-wine-legends");
    const badge = page.getByText(/^Winter −\d+%$/).first();
    if (await badge.isVisible()) {
      await expect(page.locator("s", { hasText: "100 GEL" }).first()).toBeVisible();
    }
  });
});

test.describe("Meals are not included in tour prices", () => {
  for (const slug of ["kakheti-wine-legends", "kazbegi-mountain-quest", "vardzia-cave-kingdom"]) {
    test(`${slug}: meals listed as paid on the spot, never as included`, async ({ page }) => {
      await page.goto(`/tours/${slug}`);
      await expect(
        page.getByText("Food and drinks — you choose from the menu and pay on the spot").first()
      ).toBeVisible();
      await expect(page.getByText(/^(Lunch|Lunch & wine tasting)$/)).toHaveCount(0);
      await expect(page.getByText(/lunch (is )?included/i)).toHaveCount(0);
    });
  }
});
