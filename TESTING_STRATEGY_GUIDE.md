# Comprehensive Testing Strategy Guide
## Booking Website - Playwright E2E Testing

---

## Table of Contents
1. [Project Setup](#project-setup)
2. [Test Architecture](#test-architecture)
3. [Authentication Testing](#authentication-testing)
4. [API Testing](#api-testing)
5. [Security Testing](#security-testing)
6. [Database Testing](#database-testing)
7. [Performance Testing](#performance-testing)
8. [CI/CD Integration](#cicd-integration)
9. [Best Practices](#best-practices)
10. [Implementation Checklist](#implementation-checklist)

---

## Project Setup

### Installation & Configuration
```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Project structure
./
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── admin/
│   │   └── user/
│   ├── api/
│   ├── fixtures/
│   ├── page-objects/
│   └── utils/
├── playwright.config.ts
└── .env.test
```

### Basic Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Test Architecture

### Page Object Model Implementation
```typescript
// tests/page-objects/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.loginButton = page.locator('[data-testid="login-btn"]');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Test Data Generator
```typescript
// tests/utils/test-data.ts
export class TestDataGenerator {
  static generateEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test${timestamp}${random}@example.com`;
  }

  static generatePassword(): string {
    return `Test${Math.floor(Math.random() * 10000)}!`;
  }

  static generateUserData() {
    return {
      name: this.generateName(),
      email: this.generateEmail(),
      password: this.generatePassword()
    };
  }
}
```

### Fixtures for Reusable Setup
```typescript
// tests/fixtures/auth-fixtures.ts
import { test as base } from '@playwright/test';
import { TestDataGenerator } from '../utils/test-data';

type AuthFixtures = {
  existingUser: { name: string; email: string; password: string; };
  loggedInUser: { page: any; };
};

export const test = base.extend<AuthFixtures>({
  existingUser: async ({ page }, use) => {
    const userData = TestDataGenerator.generateUserData();
    
    await page.request.post('/api/auth/signup', {
      data: userData
    });
    
    await use(userData);
  },

  loggedInUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('test@example.com', 'password123');
    await page.waitForURL('/user');
    await use({ page });
  }
});
```

---

## Authentication Testing

### Login Flow Tests
```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '../fixtures/auth-fixtures';
import { LoginPage } from '../../page-objects/LoginPage';

test('successful login with valid credentials', async ({ page, existingUser }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/auth/login');
  await loginPage.login(existingUser.email, existingUser.password);
  
  await expect(page).toHaveURL('/user');
  await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
});

test('login fails with invalid credentials', async ({ page }) => {
  const invalidData = TestDataGenerator.generateUserData();
  
  const loginPage = new LoginPage(page);
  await page.goto('/auth/login');
  await loginPage.login(invalidData.email, invalidData.password);
  
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
});

test('handles browser alert for invalid login', async ({ page }) => {
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toContain('Invalid credentials');
    await dialog.accept();
  });
  
  const loginPage = new LoginPage(page);
  await page.goto('/auth/login');
  await loginPage.login('invalid@test.com', 'wrongpassword');
});
```

### Signup Flow Tests
```typescript
// tests/e2e/auth/signup.spec.ts
test('successful user registration', async ({ page }) => {
  const userData = TestDataGenerator.generateUserData();
  const signupPage = new SignupPage(page);
  
  await page.goto('/auth/signup');
  await signupPage.signup(userData.name, userData.email, userData.password);
  
  await expect(page).toHaveURL('/user');
});

test('prevents duplicate email registration', async ({ page, existingUser }) => {
  const signupPage = new SignupPage(page);
  
  await page.goto('/auth/signup');
  await signupPage.signup('New User', existingUser.email, 'password123');
  
  await expect(page.locator('[data-testid="email-error"]')).toContainText('Email already exists');
});
```

---

## API Testing

### Authentication API Tests
```typescript
// tests/api/auth.spec.ts
import { test, expect } from '@playwright/test';

test('POST /api/auth/signup creates user', async ({ request }) => {
  const userData = TestDataGenerator.generateUserData();
  
  const response = await request.post('/api/auth/signup', {
    data: userData
  });
  
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.user.email).toBe(userData.email);
  expect(body.token).toBeTruthy();
});

test('POST /api/auth/login returns token', async ({ request }) => {
  // First create user
  const userData = TestDataGenerator.generateUserData();
  await request.post('/api/auth/signup', { data: userData });
  
  // Then login
  const response = await request.post('/api/auth/login', {
    data: {
      email: userData.email,
      password: userData.password
    }
  });
  
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.token).toBeTruthy();
});
```

### Booking API Tests
```typescript
test('POST /api/bookings creates booking with auth', async ({ request }) => {
  // Login to get token
  const loginResponse = await request.post('/api/auth/login', {
    data: { email: 'user@test.com', password: 'password' }
  });
  const { token } = await loginResponse.json();
  
  // Create booking
  const response = await request.post('/api/bookings', {
    headers: { 'Authorization': `Bearer ${token}` },
    data: {
      serviceId: 1,
      date: '2024-01-15',
      time: '10:00'
    }
  });
  
  expect(response.status()).toBe(201);
  const booking = await response.json();
  expect(booking.serviceId).toBe(1);
});
```

---

## Security Testing

### Authentication & Authorization
```typescript
// tests/e2e/security/auth-security.spec.ts
test('unauthorized access blocked', async ({ page }) => {
  await page.goto('/admin/bookings');
  await expect(page).toHaveURL('/auth/login');
});

test('user cannot access admin routes', async ({ loggedInUser }) => {
  await loggedInUser.page.goto('/admin/services');
  await expect(loggedInUser.page).toHaveURL('/user');
});

test('session expires after timeout', async ({ loggedInUser }) => {
  await loggedInUser.page.waitForTimeout(30000);
  await loggedInUser.page.goto('/user/profile');
  await expect(loggedInUser.page).toHaveURL('/auth/login');
});
```

### Input Validation & XSS Prevention
```typescript
test('prevents XSS in booking form', async ({ loggedInUser }) => {
  const maliciousScript = '<script>alert("XSS")</script>';
  
  await loggedInUser.page.goto('/booking/new');
  await loggedInUser.page.fill('[data-testid="notes"]', maliciousScript);
  await loggedInUser.page.click('[data-testid="submit"]');
  
  await expect(loggedInUser.page.locator('text=<script>')).toBeVisible();
});

test('validates email format', async ({ page }) => {
  await page.goto('/auth/signup');
  await page.fill('[data-testid="email"]', 'invalid-email');
  await page.click('[data-testid="submit"]');
  
  await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email');
});
```

### SQL Injection Testing
```typescript
test('prevents SQL injection in search', async ({ page }) => {
  const sqlInjection = "'; DROP TABLE users; --";
  
  await page.goto('/services');
  await page.fill('[data-testid="search"]', sqlInjection);
  await page.click('[data-testid="search-btn"]');
  
  await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
});
```

---

## Database Testing

### Database State Management
```typescript
// tests/fixtures/db-fixtures.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const test = base.extend({
  cleanDb: async ({}, use) => {
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
    await use();
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
  },

  seedDb: async ({}, use) => {
    const service = await prisma.service.create({
      data: { name: 'Sew-In', price: 150, duration: 120 }
    });
    await use({ service });
  }
});
```

### Data Integrity Tests
```typescript
test('booking creates correct database records', async ({ page, seedDb }) => {
  await page.goto('/booking/new');
  await page.selectOption('[data-testid="service"]', seedDb.service.id);
  await page.fill('[data-testid="date"]', '2024-01-15');
  await page.click('[data-testid="submit"]');
  
  const booking = await prisma.booking.findFirst({
    where: { serviceId: seedDb.service.id }
  });
  
  expect(booking).toBeTruthy();
  expect(booking.date).toBe(new Date('2024-01-15'));
});
```

---

## Performance Testing

### Page Load Performance
```typescript
// tests/e2e/performance/load-times.spec.ts
test('homepage loads within 2 seconds', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(2000);
});

test('booking page performance metrics', async ({ page }) => {
  await page.goto('/booking/new');
  
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    };
  });
  
  expect(metrics.domContentLoaded).toBeLessThan(1000);
});
```

### API Response Times
```typescript
test('API endpoints respond quickly', async ({ request }) => {
  const endpoints = ['/api/services', '/api/availability', '/api/reviews'];
  
  for (const endpoint of endpoints) {
    const startTime = Date.now();
    const response = await request.get(endpoint);
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(500);
  }
});
```

---

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Docker Integration
```dockerfile
# Dockerfile.test
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npx", "playwright", "test"]
```

---

## Best Practices

### 1. Test Organization
- **Separate concerns**: E2E, API, Security, Performance
- **Use Page Object Model** for UI interactions
- **Implement fixtures** for common setup/teardown
- **Generate test data** dynamically to avoid conflicts

### 2. Debugging Strategies
```bash
# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui

# Headed mode
npx playwright test --headed

# Add breakpoints in code
await page.pause();
```

### 3. Timing and Waits
```typescript
// Explicit waits
await expect(page.locator('[data-testid="element"]')).toBeVisible({ timeout: 10000 });

// Wait for network
await page.waitForResponse(response => 
  response.url().includes('/api/login') && response.status() === 200
);

// Wait for page state
await page.waitForLoadState('networkidle');
```

### 4. Error Handling
```typescript
test('handles network failures gracefully', async ({ page }) => {
  await page.route('/api/services', route => {
    route.fulfill({ status: 500, body: 'Server Error' });
  });
  
  await page.goto('/services');
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});
```

---

## Implementation Checklist

### Phase 1: Basic Setup
- [ ] Install Playwright and dependencies
- [ ] Create basic configuration file
- [ ] Set up project structure
- [ ] Create first simple test

### Phase 2: Core Testing
- [ ] Implement Page Object Model
- [ ] Create test data generators
- [ ] Set up authentication fixtures
- [ ] Write login/signup tests
- [ ] Add booking flow tests

### Phase 3: Advanced Testing
- [ ] Implement API testing
- [ ] Add security tests
- [ ] Create database fixtures
- [ ] Add performance tests
- [ ] Set up error handling

### Phase 4: CI/CD Integration
- [ ] Create GitHub Actions workflow
- [ ] Set up Docker containers
- [ ] Configure test environments
- [ ] Add test reporting
- [ ] Set up notifications

### Phase 5: Maintenance
- [ ] Regular test review and updates
- [ ] Performance monitoring
- [ ] Test data cleanup
- [ ] Documentation updates

---

## Commands Reference

```bash
# Installation
npm install -D @playwright/test
npx playwright install

# Running Tests
npx playwright test                    # Run all tests
npx playwright test --ui              # UI mode
npx playwright test --debug           # Debug mode
npx playwright test login.spec.ts     # Specific test
npx playwright test --project=chromium # Specific browser

# Reports
npx playwright show-report            # View HTML report
npx playwright test --reporter=line   # Line reporter

# Code Generation
npx playwright codegen http://localhost:4000  # Record interactions
```

---

## Conclusion

This comprehensive testing strategy provides:
- **Complete coverage** of authentication, booking, admin functions
- **Security testing** for common vulnerabilities
- **Performance monitoring** for optimal user experience
- **Database integrity** verification
- **CI/CD integration** for automated testing
- **Scalable architecture** for future enhancements

Implement incrementally, starting with basic E2E tests and gradually adding more sophisticated testing strategies as your application grows.

---

*Generated for Booking Website - Playwright Testing Strategy*
*Last Updated: $(date)*