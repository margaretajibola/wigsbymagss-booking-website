import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My Booking App/);
});

test('services page navigation', async ({ page }) => {
  await page.goto('/');
  await page.goto('/services/sewins');
  await expect(page).toHaveURL('/services/sewins');
});