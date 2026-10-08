import { test as base } from '@playwright/test';
import { TestDataGenerator } from '@/tests/utils/test-data';
import { LoginPage } from '@/tests/page-objects/LoginPage';

type AuthFixtures = {
  existingUser: {
    name: string;
    email: string;
    password: string;
  };
  loggedInUser: {
    page: any;
  };
  loggedInAdmin: {
    page: any;
  };
};

export const test = base.extend<AuthFixtures>({
  // Creates a user in database and provides credentials
  existingUser: async ({ page }, use) => {
    const userData = TestDataGenerator.generateUserData();
    
    // Create user via API call to signup endpoint
    await page.request.post('/api/auth/signup', {
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password
      }
    });
    
    await use(userData);
    
    // Cleanup: Delete user after test (optional)
    // await page.request.delete(`/api/users/${userData.email}`);
  },

  // Logs in existing user 
  loggedInUser: async ({ page }, use) => {
    await page.goto('/auth/login');
    const loginPage = new LoginPage(page);
    await loginPage.login('tester2@yahoo.com', 'tester123456789');
    await page.waitForURL('/user');
    
    await use({ page });
  },

  // Logs in admin
  loggedInAdmin: async ({ page }, use) => {
    await page.goto('/auth/login');
    const loginPage = new LoginPage(page);
    await loginPage.login('tester@yahoo.com', 'tester123456789');
    await page.waitForURL('/admin');
    
    await use({ page });
  }
});

export { expect } from '@playwright/test';