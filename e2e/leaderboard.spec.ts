import { test, expect } from "@playwright/test";

test.describe("Leaderboard", () => {
  test("a fresh visitor sees an honest empty state, never fabricated other players", async ({ page }) => {
    // Regression guard for a historically-flagged issue (product-audit.md,
    // marketing-audit.md): the page must never render fabricated "other
    // players" — src/app/leaderboard/page.tsx builds `players` from only
    // the current explorer's own local XP, nothing else. A fresh browser
    // profile has 0 XP, so the honest empty state should show instead of
    // any podium/ranking rows.
    await page.goto("/leaderboard");
    await expect(page.getByText("Complete quests to appear on the leaderboard!")).toBeVisible();
  });
});
