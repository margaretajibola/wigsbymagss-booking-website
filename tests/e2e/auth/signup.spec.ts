import { test, expect } from '@playwright/test';
import { SignupPage } from '@/tests/page-objects/SignupPage';
import { TestDataGenerator } from '@/tests/utils/test-data';

test('signup flow', async ({ page }) => {
    const userData = TestDataGenerator.generateUserData();
    const signupPage = new SignupPage(page);
    
    await page.goto('/auth/signup');
    await signupPage.signup(userData.name, userData.email, userData.password);
    await expect(page).toHaveURL('/auth/login');
});