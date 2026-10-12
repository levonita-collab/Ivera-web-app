import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Some sandboxed dev environments pre-install Chromium at a fixed path and
// skip Playwright's own browser download — use it only if present, so this
// config still works unmodified on a normal machine or CI runner.
const PINNED_CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = existsSync(PINNED_CHROMIUM) ? PINNED_CHROMIUM : undefined;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
