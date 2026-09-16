import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.TEST_PORT ?? 4173);
const browserPath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].find(existsSync);

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `bun run build && bun run preview -- --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          ...(browserPath ? { executablePath: browserPath } : {}),
          args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
        },
      },
    },
  ],
});
