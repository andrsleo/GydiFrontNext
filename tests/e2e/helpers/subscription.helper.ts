import { Page, expect } from '@playwright/test';

/**
 * Helper functions for subscription page interactions in E2E tests
 */

/**
 * Navigates to the subscription page
 */
export async function gotoSubscriptionPage(page: Page) {
  await page.goto('/dashboard/subscription');
  await page.waitForLoadState('networkidle');
}

/**
 * Gets the current plan name displayed on the page
 */
export async function getCurrentPlan(page: Page): Promise<string> {
  const planElement = await page.locator('[data-testid="current-plan"], .plan-name, h2:has-text("Plan")').first();
  return await planElement.textContent() || '';
}

/**
 * Gets all payment methods displayed on the page
 */
export async function getPaymentMethods(page: Page) {
  return await page.locator('[data-testid="payment-method-card"]').all();
}

/**
 * Counts the number of payment methods
 */
export async function getPaymentMethodCount(page: Page): Promise<number> {
  const methods = await getPaymentMethods(page);
  return methods.length;
}

/**
 * Clicks the delete button for a specific payment method
 */
export async function clickDeletePaymentMethod(page: Page, cardLastFour: string) {
  // Find the card with the specific last four digits
  const card = page.locator(`[data-testid="payment-method-card"]:has-text("${cardLastFour}")`);

  // Click the delete button within that card
  await card.locator('button[title="Delete payment method"], button:has-text("Delete")').click();
}

/**
 * Clicks the set as default button for a specific payment method
 */
export async function clickSetDefaultPaymentMethod(page: Page, cardLastFour: string) {
  const card = page.locator(`[data-testid="payment-method-card"]:has-text("${cardLastFour}")`);
  await card.locator('button[title="Set as default"], button:has-text("Default")').click();
}

/**
 * Confirms deletion in the confirmation dialog
 */
export async function confirmDeleteDialog(page: Page) {
  // Wait for dialog to appear
  await page.waitForSelector('[role="dialog"], [data-testid="delete-dialog"]');

  // Click confirm button
  await page.click('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Eliminar")');

  // Wait for dialog to close
  await page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 5000 });
}

/**
 * Cancels deletion in the confirmation dialog
 */
export async function cancelDeleteDialog(page: Page) {
  await page.waitForSelector('[role="dialog"]');
  await page.click('button:has-text("Cancel"), button:has-text("Cancelar")');
  await page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 5000 });
}

/**
 * Checks if a payment method is marked as default
 */
export async function isPaymentMethodDefault(page: Page, cardLastFour: string): Promise<boolean> {
  const card = page.locator(`[data-testid="payment-method-card"]:has-text("${cardLastFour}")`);
  const defaultBadge = card.locator('text="Default"');
  return await defaultBadge.isVisible();
}

/**
 * Checks if a payment method is expired
 */
export async function isPaymentMethodExpired(page: Page, cardLastFour: string): Promise<boolean> {
  const card = page.locator(`[data-testid="payment-method-card"]:has-text("${cardLastFour}")`);
  const expiredBadge = card.locator('text="Expired"');
  return await expiredBadge.isVisible();
}

/**
 * Opens the add payment method dialog
 */
export async function openAddPaymentMethodDialog(page: Page) {
  await page.click('button:has-text("Add Payment Method"), button:has-text("Add Card")');
  await page.waitForSelector('[role="dialog"]');
}

/**
 * Waits for a success toast notification
 */
export async function waitForSuccessToast(page: Page, message?: string) {
  const toastSelector = message
    ? `[data-testid="toast"]:has-text("${message}"), .toast:has-text("${message}")`
    : '[data-testid="toast"], .toast';

  await page.waitForSelector(toastSelector, { timeout: 10000 });
}

/**
 * Waits for an error toast notification
 */
export async function waitForErrorToast(page: Page, message?: string) {
  const toastSelector = message
    ? `[data-testid="toast-error"]:has-text("${message}"), .toast-error:has-text("${message}")`
    : '[data-testid="toast-error"], .toast-error';

  await page.waitForSelector(toastSelector, { timeout: 10000 });
}

/**
 * Gets the error message from the page
 */
export async function getErrorMessage(page: Page): Promise<string> {
  const errorElement = await page.locator('[data-testid="error-message"], .error-message, [role="alert"]').first();
  return await errorElement.textContent() || '';
}
