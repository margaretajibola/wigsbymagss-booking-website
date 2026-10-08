import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000, // 30 seconds per test
  expect: {
    timeout: 10000 // 10 seconds for assertions
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
     {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] }
    },
     {
      name: 'api',
      testDir: './tests/api',
      use: { ...devices['Desktop Chrome'] }
    },
     {
      name: 'performance',
      testDir: './tests/performance',
      use: { ...devices['Desktop Chrome'] }
    },
     {
      name: 'security',
      testDir: './tests/security',
      use: { ...devices['Desktop Chrome'] }
    },
  ],

  webServer: {
    command: process.env.NODE_ENV === 'test' ? 'npm run start' : 'npm run dev',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: process.env.NODE_ENV === 'test' 
        ? 'postgresql://magss:5TvCTH4jgtbwFC8jxyAv@localhost:5432/wbm_booking_app_test'
        : process.env.DATABASE_URL || 'postgresql://magss:5TvCTH4jgtbwFC8jxyAv@localhost:5432/wbm_booking_app'
    }
  },
});