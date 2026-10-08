import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByRole('textbox', { name: 'Name' })
    this.emailInput = page.getByRole('textbox', { name: 'Email' })
    this.passwordInput = page.getByRole('textbox', { name: 'Password' })
    this.signupButton = page.getByRole('button', { name: 'Sign Up' })
  }

  async signup(name: string, email: string, password: string) {
    await this.nameInput.fill(name)
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signupButton.click();
  }
}