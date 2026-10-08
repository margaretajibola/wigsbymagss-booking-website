import { test, expect } from '@/tests/fixtures/auth-fixtures';
import { LoginPage } from '@/tests/page-objects/LoginPage';
import { TestDataGenerator } from '@/tests/utils/test-data';

test('login with existing user', async ({ page, existingUser }) => {
    const loginPage = new LoginPage(page);
    await page.goto('/auth/login');
    await loginPage.login(existingUser.email, existingUser.password);

    await expect(page).toHaveURL('/user');
});

test('login with admin credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('/auth/login');
    await loginPage.login('margaretajibola56@yahoo.com', 'Messenger90@');
    
    await expect(page).toHaveURL('/admin');
});

test('login with invalid credentials', async ({ page }) => {
    const invalidData = TestDataGenerator.generateUserData();

     // Listen for browser alert
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('Invalid credentials');
        await dialog.accept();
    });
    
    const loginPage = new LoginPage(page);
    await page.goto('/auth/login');
    await loginPage.login(invalidData.email, invalidData.password);
    
    // await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});