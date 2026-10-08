import { test, expect } from '@playwright/test';

test('select an available date', async ({ page }) => {
    await page.goto('/calendar');
    await page.getByRole('button', { name: 'November 5,' }).click();
    await page.getByRole('button', { name: '10:' }).click();
    await expect(page.getByRole('button').filter({ hasText: /^$/ }).nth(1)).toBeVisible();
});