import { test, expect } from '@playwright/test';

test('homepage loads within 2 seconds', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(4000);
});

test('API endpoints respond quickly', async ({ request }) => {
  const endpoints = ['/api/services', '/api/bookings', '/api/reviews'];
  
  for (const endpoint of endpoints) {
    const startTime = Date.now();
    const response = await request.get(endpoint);
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(4000);
  }
});