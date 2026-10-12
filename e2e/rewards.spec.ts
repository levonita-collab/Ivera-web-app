import { test, expect } from "@playwright/test";

test.describe("Rewards", () => {
  test("the old leaderboard URL redirects to the rewards page", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page).toHaveURL(/\/rewards$/);
  });

  test("a fresh visitor sees every reward locked and no fabricated players", async ({ page }) => {
    await page.goto("/rewards");
    await expect(page.getByRole("heading", { name: "Rewards", exact: true })).toBeVisible();
    await expect(page.getByText("0 XP").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Claim on WhatsApp/ })).toHaveCount(0);
    await expect(page.getByText(/Complete every mission of a quest/)).toBeVisible();
  });

  test("a completed quest today unlocks tier rewards and a downloadable diploma", async ({ page }) => {
    const at = new Date().toISOString();
    const missions = [
      ["tbs-1", 50],
      ["tbs-2", 75],
      ["tbs-3", 50],
      ["tbs-4", 75],
    ] as const;
    const progress = {
      completedMissions: missions.map(([id]) => id),
      xp: 250,
      events: missions.map(([id, points]) => ({ id, points, at })),
    };
    await page.goto("/rewards");
    await page.evaluate(
      ({ progress }) => {
        localStorage.setItem("ivera_quest_tbilisi-city-quest", JSON.stringify(progress));
        localStorage.setItem(
          "ivera_profile",
          JSON.stringify({ name: "Anna Test", country: "Germany", joinedAt: new Date().toISOString() })
        );
      },
      { progress }
    );
    await page.reload();

    await expect(page.getByText("250 XP").first()).toBeVisible();
    // 250 XP today: Bronze (150) earned, Silver (300) and Gold (600 + bonus) still locked.
    await expect(page.getByRole("button", { name: /Claim on WhatsApp/ })).toHaveCount(1);
    await expect(page.getByText("Still needed: 50 XP to go")).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Diploma" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("ivera-diploma-tbilisi-city-quest.png");
  });
});
