import { test, expect } from "@playwright/test";

test.describe("Homepage — new visitor", () => {
  test("loads with no console errors and shows the marketing homepage", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await page.waitForTimeout(500);

    expect(errors, `Console/page errors on /: ${errors.join("\n")}`).toEqual([]);
  });

  test("the free Tbilisi quest is reachable from the homepage", async ({ page }) => {
    // Historically flagged across prior audits (product-audit.md,
    // marketing-audit.md) as "CRITICAL — unreachable, not linked anywhere".
    // This test guards against that regressing silently again.
    await page.goto("/");
    const link = page.locator('a[href="/free-tbilisi-quest"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/free-tbilisi-quest/);
  });

  test("language toggle switches visible copy between English and Russian", async ({ page }) => {
    await page.goto("/");
    const ruButton = page.getByRole("button", { name: "RU" });
    await expect(ruButton).toBeVisible();
    await ruButton.click();
    // A Russian-only string that appears once the RU dictionary is active.
    await expect(page.getByText("Квест-туры", { exact: false }).first()).toBeVisible({ timeout: 5000 });
  });
});
