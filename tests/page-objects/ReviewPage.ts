import { Page, Locator } from '@playwright/test';

export class ReviewPage {
  readonly page: Page;
  readonly textField: Locator;
  readonly fileInput: Locator;
  readonly postButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.textField = page.getByRole('textbox');
    this.fileInput = page.locator('input[type="file"]');
    this.postButton = page.getByRole('button', { name: 'Post' });
  }

  async createReview(reviewText: string) {
    await this.textField.fill(reviewText);
    await this.postButton.click();
  }

  async createReviewWithImage(reviewText: string, imageUrl: string) {
    await this.textField.fill(reviewText);
    await this.fileInput.setInputFiles(imageUrl);
    await this.postButton.click();
  }
}