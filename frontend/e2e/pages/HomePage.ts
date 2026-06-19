import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly bannerHeading: Locator;
  readonly aboutUsLink: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search here');
    this.bannerHeading = page.getByRole('heading', { name: 'New Releases This Week' });
    this.aboutUsLink = page.getByRole('link', { name: 'About Us' });
    // Header cart link
    this.cartIcon = page.locator('a[href="/cart"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async expectBannerVisible() {
    await expect(this.bannerHeading).toBeVisible({ timeout: 10000 });
  }
}
