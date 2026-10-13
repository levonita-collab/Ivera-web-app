import { test, expect } from "@playwright/test";

test.describe("Private tours", () => {
  test("is linked from the homepage", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('a[href="/private-tours"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/private-tours$/);
  });

  test("3+ days earn the loyalty discount and the WhatsApp request carries gifts and polyphony", async ({ page }) => {
    await page.goto("/private-tours");
    await expect(page.getByText("+ 10% off your next tour")).toHaveCount(0);

    for (let i = 0; i < 2; i++) await page.getByRole("button", { name: "Add a day" }).click();
    await expect(page.getByText("3 personal songs from Levani")).toBeVisible();
    await expect(page.getByText("+ 10% off your next tour")).toBeVisible();

    await page.getByRole("button", { name: /Live Georgian polyphony/ }).click();

    await page.evaluate(() => {
      (window as unknown as { __opened: string[] }).__opened = [];
      window.open = ((url: string) => {
        (window as unknown as { __opened: string[] }).__opened.push(url);
        return null;
      }) as typeof window.open;
    });
    await page.getByRole("button", { name: "Send to WhatsApp" }).click();
    const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
    expect(opened).toHaveLength(1);
    const message = new URL(opened[0]).searchParams.get("text") ?? "";
    expect(message).toContain("Duration: 3 days");
    expect(message).toContain("Georgian polyphony (on request)");
    expect(message).toContain("3 personal songs from Levani");
    expect(message).toContain("10% off my next tour");
  });
});
