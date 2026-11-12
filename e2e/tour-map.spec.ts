import { test, expect } from "@playwright/test";

// The real basemap comes from tiles.openfreemap.org. Tests swap it for an
// empty local style so they don't depend on the network.
const EMPTY_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: "bg", type: "background", paint: { "background-color": "#E9E4D8" } }],
};

test.describe("Tour route map", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://tiles.openfreemap.org/**", (route) =>
      route.fulfill({ json: EMPTY_STYLE }),
    );
  });

  test("a day tour shows the meeting point and numbered stops", async ({ page }) => {
    await page.goto("/tours/kazbegi-mountain-quest");
    const map = page.getByTestId("tour-route-map");
    await map.scrollIntoViewIfNeeded();
    await expect(map.locator("canvas")).toBeVisible();
    // Meeting point + 3 markers covering the 7 stops of the route list.
    await expect(map.locator(".maplibregl-marker")).toHaveCount(4);
    await map.getByRole("button", { name: /Gergeti Trinity Church/ }).click();
    await expect(map.locator(".maplibregl-popup")).toContainText("7. Gergeti Trinity Church");
  });

  test("the page still works when the map service is down", async ({ page }) => {
    await page.unroute("https://tiles.openfreemap.org/**");
    await page.route("https://tiles.openfreemap.org/**", (route) => route.abort());
    await page.goto("/tours/kazbegi-mountain-quest");
    // The map only starts loading once it is scrolled near the viewport.
    await page.getByTestId("tour-route-map").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("tour-route-map")).toHaveCount(0);
    await expect(page.getByText("Gergeti Trinity Church").first()).toBeVisible();
  });
});
