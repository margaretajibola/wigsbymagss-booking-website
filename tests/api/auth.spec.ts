import { test, expect } from '@playwright/test';
import { TestDataGenerator } from '@/tests/utils/test-data';

test('POST /api/auth/signup creates user', async ({ request }) => {
    const userData = TestDataGenerator.generateUserData();

    const response = await request.post('/api/auth/signup', {
    data: userData
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(userData.email);
    expect(body.user.name).toBe(userData.name);
});

test('POST /api/auth/login returns user token', async( { request }) => {
    const userData = TestDataGenerator.generateUserData();
    const signupResponse = await request.post('/api/auth/signup', {
    data: userData
    });
    expect(signupResponse.status()).toBe(200);
    const loginResponse = await request.post('/api/auth/login', {
    data: {
        email: userData.email,
        password: userData.password
    }
    });

    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    expect(body.user).toBeDefined();
});

test('POST /api/auth/login returns admin token', async( { request }) => {
    const loginResponse = await request.post('/api/auth/login', {
    data: {
        email: 'tester@yahoo.com',
        password: 'tester123456789'
    }
    });

    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    expect(body.user).toBeDefined();
});

test('POST /api/auth/login returns 401 for invalid credentials', async( { request }) => {
    const userData = TestDataGenerator.generateUserData();
    const loginResponse = await request.post('/api/auth/login', {
    data: {
        email: userData.email,
        password: userData.password
    }
    });

    expect(loginResponse.status()).toBe(401);
});