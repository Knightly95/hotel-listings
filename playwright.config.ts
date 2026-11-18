import { defineConfig, devices } from '@playwright/test';

/**
 * Browser tests against the static export. Build it first:
 *   STATIC_EXPORT=true npm run build && npm run test:e2e
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
  webServer: {
    command: 'node scripts/serve-static.mjs out 4173',
    url: 'http://localhost:4173/en/',
    reuseExistingServer: !process.env.CI,
  },
});
