import { Page } from '@playwright/test';

export class CalendarPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createAvailability(date: string, time: string) {
    await this.page.goto('/calendar');
    await this.page.getByRole('button', { name: date }).click();
    await this.page.getByRole('textbox').click();
    await this.page.getByRole('textbox').fill(time);
    await this.page.getByRole('button', { name: 'Add' }).click();
  }
}