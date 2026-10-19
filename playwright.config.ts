import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  use: {
    baseURL: "http://127.0.0.1:8797",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], colorScheme: "light" },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
        colorScheme: "light",
      },
    },
    {
      name: "chromium-dark",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark" },
    },
    {
      name: "mobile-dark",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
        colorScheme: "dark",
      },
    },
  ],
  webServer: {
    command: "npx wrangler dev --ip 127.0.0.1 --port 8797",
    url: "http://127.0.0.1:8797/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
