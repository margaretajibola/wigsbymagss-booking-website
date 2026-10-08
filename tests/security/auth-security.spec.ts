import { test, expect } from '@/tests/fixtures/auth-fixtures';

test('unauthorized access blocked', async ({ page }) => {
  await page.goto('/admin/bookings');
  await expect(page).toHaveURL('/auth/login');
});

test('user cannot access admin routes', async ({ loggedInUser }) => {
  await loggedInUser.page.goto('/admin/services');
  await expect(loggedInUser.page).toHaveURL('/unauthorized');
});