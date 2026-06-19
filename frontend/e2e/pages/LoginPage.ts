import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.errorMessage = page.locator('.text-red-500');
    this.registerLink = page.getByRole('link', { name: 'Register' });

    // Register a page-wide handler to automatically accept any alerts (e.g. "Login successful!")
    // This avoids race conditions and test timeouts on failed logins where no dialog is shown.
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }
}
