import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Bookstore E2E - Books & Mocking API', () => {
  let homePage: HomePage;

  // Mock list of books to isolate frontend testing from live backend changes
  const mockBooks = [
    {
      _id: 'book-1',
      title: 'E2E Testing Guide',
      description: 'Master Playwright and Jest for frontend apps.',
      coverImage: 'book-1.png',
      category: 'business',
      newPrice: 15.99,
      oldPrice: 19.99
    },
    {
      _id: 'book-2',
      title: 'Fiction of the Future',
      description: 'A sci-fi story about agentic AI coding helpers.',
      coverImage: 'book-2.png',
      category: 'fiction',
      newPrice: 9.99,
      oldPrice: 14.99
    }
  ];

  test.beforeEach(async ({ page }) => {
    // Intercept books endpoint API calls using a regex to match the endpoint
    // regardless of trailing slashes (e.g. /api/books/)
    await page.route(/\/api\/books/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBooks),
      });
    });

    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display mocked books on the homepage', async ({ page }) => {
    await homePage.expectBannerVisible();

    // Verify mock book titles are rendered
    const book1Title = page.getByText('E2E Testing Guide');
    const book2Title = page.getByText('Fiction of the Future');
    
    await expect(book1Title).toBeVisible();
    await expect(book2Title).toBeVisible();
  });

  test('should filter books by category', async ({ page }) => {
    await homePage.expectBannerVisible();

    // Locating the category selector
    const categorySelector = page.locator('#category');
    
    // Choose "Fiction" from the dropdown list
    await categorySelector.selectOption({ label: 'Fiction' });

    // "Fiction of the Future" should be visible while "E2E Testing Guide" is filtered out
    await expect(page.getByText('Fiction of the Future')).toBeVisible();
    await expect(page.getByText('E2E Testing Guide')).not.toBeVisible();
  });
});
