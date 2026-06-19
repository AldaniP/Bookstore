import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration file for End-to-End (E2E) and Smoke Testing.
 * Configured to be CI-ready, default headless execution, and parallel test runs.
 *
 * See https://playwright.dev/docs/test-configuration for reference.
 */
export default defineConfig({
  // Directory where E2E test files are located
  testDir: './e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI to avoid resource congestion.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: process.env.CI 
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions
  use: {
    // Base URL to use for actions like `await page.goto('/')`.
    baseURL: 'http://localhost:5173',

    // Run tests headlessly by default
    headless: true,

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',

    // Record screenshot on failure
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // WebKit is commented out locally due to OS compatibility limitations on this machine.
    // Uncomment this project when running in standard GitHub Actions / CI environments.
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
