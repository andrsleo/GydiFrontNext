import { Page } from '@playwright/test';

/**
 * Helper functions for authentication in E2E tests
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

/**
 * Default test users for E2E testing
 */
export const TEST_USERS = {
  affiliate: {
    email: 'affiliate@test.com',
    password: 'Test123!',
    name: 'Test Affiliate',
    role: 'USER' as const,
  },
  admin: {
    email: 'admin@test.com',
    password: 'Admin123!',
    name: 'Test Admin',
    role: 'ADMIN' as const,
  },
  host: {
    email: 'host@test.com',
    password: 'Host123!',
    name: 'Test Host',
    role: 'USER' as const,
  },
};

/**
 * Logs in a user via the login page
 */
export async function login(page: Page, user: TestUser) {
  await page.goto('/login');

  // Wait for login form
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');

  // Fill credentials
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}

/**
 * Logs out the current user
 */
export async function logout(page: Page) {
  // Click on user menu
  await page.click('[data-testid="user-menu"]');

  // Click logout button
  await page.click('button:has-text("Logout"), button:has-text("Cerrar sesión")');

  // Wait for redirect to home or login
  await page.waitForURL(/\/(login)?/, { timeout: 10000 });
}

/**
 * Checks if user is logged in by verifying dashboard access
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded', timeout: 5000 });
    return page.url().includes('/dashboard');
  } catch {
    return false;
  }
}
