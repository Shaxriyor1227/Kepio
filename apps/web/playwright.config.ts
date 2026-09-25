import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // The build runs in the "pretest" script, so the server only has to start here.
  webServer: {
    command: 'npm run start',
    url: `${baseURL}/uz`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
