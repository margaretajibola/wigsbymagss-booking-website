import { test, expect } from '@playwright/test';

test('select an installation service', async ({ page }) => {
    await page.goto('/services/installations');
    await page.getByRole('button', { name: 'Service Type: Closure Re-' }).click();
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
});

test('select a sewin service', async ({ page }) => {
    await page.goto('/services/sewins');
    await page.getByRole('button', { name: 'Service Type: Frontal Sew-In' }).click();
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
});

test('select an other service', async ({ page }) => {
    await page.goto('/services/otherservices');
    await page.getByRole('button', { name: 'Service Type: Wig Wash and' }).click();
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
});