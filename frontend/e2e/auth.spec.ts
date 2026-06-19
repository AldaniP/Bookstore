import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Bookstore E2E - Authentication UI & Validation', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should render the login form correctly', async ({ page }) => {
    // Check main elements
    await expect(page.getByRole('heading', { name: 'Please Login' })).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
  });

  test('should show validation error message on failed login', async ({ page }) => {
    // Intercept Google Firebase Authentication endpoint using regex
    await page.route(/\/identitytoolkit\.googleapis\.com\/v1\/accounts:signInWithPassword/, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'INVALID_LOGIN_CREDENTIALS',
            errors: [{ message: 'INVALID_LOGIN_CREDENTIALS' }]
          }
        })
      });
    });

    // Try logging in with invalid credentials
    await loginPage.login('wrong@example.com', 'wrongpassword');

    // Assert custom alert/message is rendered (the local React state handles error with 'Please provide a valid email and password')
    const errorMessage = page.locator('.text-red-500');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Please provide a valid email and password');
  });

  test('should redirect to homepage on successful login', async ({ page }) => {
    // 1. Intercept Google Firebase Authentication signInWithPassword endpoint
    await page.route(/\/identitytoolkit\.googleapis\.com\/v1\/accounts:signInWithPassword/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          localId: 'mock-user-123',
          email: 'user@example.com',
          displayName: 'Mock User',
          idToken: 'mock-jwt-token',
          registered: true,
          refreshToken: 'mock-refresh-token',
          expiresIn: '3600'
        })
      });
    });

    // 2. Intercept Google Firebase Authentication lookup endpoint (to retrieve user details)
    await page.route(/\/identitytoolkit\.googleapis\.com\/v1\/accounts:lookup/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          kind: 'identitytoolkit#GetAccountInfoResponse',
          users: [
            {
              localId: 'mock-user-123',
              email: 'user@example.com',
              emailVerified: true,
              displayName: 'Mock User',
              providerUserInfo: [
                {
                  providerId: 'password',
                  displayName: 'Mock User',
                  email: 'user@example.com'
                }
              ]
            }
          ]
        })
      });
    });

    // Perform login with valid-looking credentials
    await loginPage.login('user@example.com', 'password123');

    // Assert redirection to the homepage (URL becomes root '/')
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});
