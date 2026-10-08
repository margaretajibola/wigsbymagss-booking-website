# Test Folder Structure Guide

## Recommended Directory Structure

```
tests/
├── e2e/                    # End-to-end UI tests
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── signup.spec.ts
│   │   └── logout.spec.ts
│   ├── booking/
│   │   ├── create-booking.spec.ts
│   │   ├── edit-booking.spec.ts
│   │   └── cancel-booking.spec.ts
│   ├── admin/
│   │   ├── manage-services.spec.ts
│   │   └── view-bookings.spec.ts
│   └── user/
│       ├── profile.spec.ts
│       └── dashboard.spec.ts
├── api/                    # API endpoint tests
│   ├── auth/
│   │   ├── signup.spec.ts
│   │   ├── login.spec.ts
│   │   └── refresh-token.spec.ts
│   ├── bookings/
│   │   ├── create.spec.ts
│   │   ├── read.spec.ts
│   │   ├── update.spec.ts
│   │   └── delete.spec.ts
│   ├── services/
│   │   └── services.spec.ts
│   └── users/
│       └── users.spec.ts
├── security/               # Security-focused tests
│   ├── auth-security.spec.ts
│   ├── input-validation.spec.ts
│   ├── xss-prevention.spec.ts
│   ├── sql-injection.spec.ts
│   └── csrf-protection.spec.ts
├── performance/            # Performance tests
│   ├── load-times.spec.ts
│   ├── api-response-times.spec.ts
│   ├── stress-tests.spec.ts
│   └── memory-usage.spec.ts
├── integration/            # Integration tests
│   ├── database.spec.ts
│   ├── email-service.spec.ts
│   └── payment-gateway.spec.ts
├── fixtures/               # Reusable test setup
│   ├── auth-fixtures.ts
│   ├── db-fixtures.ts
│   └── api-fixtures.ts
├── page-objects/           # Page Object Model classes
│   ├── LoginPage.ts
│   ├── BookingPage.ts
│   └── AdminPage.ts
├── utils/                  # Test utilities
│   ├── test-data.ts
│   ├── helpers.ts
│   └── constants.ts
└── config/                 # Test configurations
    ├── test.config.ts
    └── environments.ts
```

## Configuration Files

### Main Playwright Config
```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'http://localhost:4000/api' }
    },
    {
      name: 'security',
      testDir: './tests/security',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'performance',
      testDir: './tests/performance',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
```

### Separate Configs for Different Test Types
```typescript
// tests/config/performance.config.ts
export const performanceConfig = {
  timeout: 60000,
  retries: 0,
  workers: 1,
  use: {
    trace: 'retain-on-failure'
  }
};
```

## Running Tests by Category

### Package.json Scripts
```json
{
  "scripts": {
    "test:e2e": "playwright test --project=e2e",
    "test:api": "playwright test --project=api",
    "test:security": "playwright test --project=security",
    "test:performance": "playwright test --project=performance",
    "test:all": "playwright test",
    "test:auth": "playwright test tests/e2e/auth tests/api/auth",
    "test:booking": "playwright test tests/e2e/booking tests/api/bookings"
  }
}
```

## Test Naming Conventions

### File Naming
- `*.spec.ts` - Test files
- `*.page.ts` - Page objects
- `*.fixture.ts` - Test fixtures
- `*.helper.ts` - Utility functions

### Test Organization
```typescript
// Group related tests
describe('Authentication', () => {
  describe('Login', () => {
    test('successful login');
    test('invalid credentials');
  });
  
  describe('Signup', () => {
    test('new user registration');
    test('duplicate email prevention');
  });
});
```