import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for E2E Testing
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4, // Reduced from 16 to 4 for better performance
  reporter: 'html',
  timeout: 60000, // Increased global timeout to 60s (was 30s default)

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15000, // Timeout for actions like click, fill (15s)
    navigationTimeout: 30000, // Timeout for page navigation (30s)
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // webServer config commented out - manually start dev server with: npm run dev
  // This avoids Windows path issues with NextAuth and allows using existing server
  /* webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3005',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  }, */
});
