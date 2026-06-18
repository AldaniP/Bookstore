import { test, expect } from '@playwright/test';

test.describe('Smoke Test - Bookstore Frontend', () => {
  test('should load the homepage and render key navigation and banner elements', async ({ page }) => {
    // Navigate to the homepage (uses baseURL from playwright.config.ts)
    await page.goto('/');

    // 1. Verify the HTML document title is correct
    await expect(page).toHaveTitle(/MERN Bookstore APP/i);

    // 2. Verify the main landing heading is rendered
    // Note: The app has a 2-second loading screen. Playwright's locator assertions
    // will auto-wait up to 5 seconds (default) or longer if configured, which perfectly
    // handles the transitions from the Loading state to the actual content.
    const bannerHeading = page.getByRole('heading', { name: 'New Releases This Week' });
    await expect(bannerHeading).toBeVisible({ timeout: 10000 }); // Extra timeout to safely bypass loading screen

    // 3. Verify the navigation search input is present
    const searchInput = page.getByPlaceholder('Search here');
    await expect(searchInput).toBeVisible();

    // 4. Verify footer navigation link (e.g., "About Us") is rendered
    const aboutUsLink = page.getByRole('link', { name: 'About Us' });
    await expect(aboutUsLink).toBeVisible();
  });
});
