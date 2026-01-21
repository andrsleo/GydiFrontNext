import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/auth.helper';
import {
  gotoSubscriptionPage,
  getPaymentMethodCount,
  clickDeletePaymentMethod,
  confirmDeleteDialog,
  cancelDeleteDialog,
  waitForSuccessToast,
  waitForErrorToast,
} from './helpers/subscription.helper';

/**
 * E2E Tests for Delete Payment Method Feature
 *
 * Tests cover:
 * - Successful deletion of non-default payment methods
 * - Prevention of deleting only payment method on paid subscription
 * - Prevention of deleting default payment method when others exist
 * - Canceling deletion
 * - Error handling
 */

test.describe('Delete Payment Method', () => {
  test.beforeEach(async ({ page }) => {
    // Login as affiliate user
    await login(page, TEST_USERS.affiliate);
  });

  test.describe('Happy Path', () => {
    test('should successfully delete a non-default payment method', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Get initial count
      const initialCount = await getPaymentMethodCount(page);
      expect(initialCount).toBeGreaterThan(1); // Ensure user has multiple methods

      // Click delete on a non-default method (assuming card ending in 5555)
      await clickDeletePaymentMethod(page, '5555');

      // Confirm deletion
      await confirmDeleteDialog(page);

      // Wait for success notification
      await waitForSuccessToast(page, 'Payment method deleted');

      // Verify count decreased
      await page.waitForTimeout(1000); // Wait for re-render
      const finalCount = await getPaymentMethodCount(page);
      expect(finalCount).toBe(initialCount - 1);

      // Verify the card is no longer visible
      const deletedCard = page.locator('[data-testid="payment-method-card"]:has-text("5555")');
      await expect(deletedCard).not.toBeVisible();
    });

    test('should successfully cancel deletion', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const initialCount = await getPaymentMethodCount(page);

      // Click delete
      await clickDeletePaymentMethod(page, '5555');

      // Cancel deletion
      await cancelDeleteDialog(page);

      // Verify count unchanged
      const finalCount = await getPaymentMethodCount(page);
      expect(finalCount).toBe(initialCount);

      // Verify card still visible
      const card = page.locator('[data-testid="payment-method-card"]:has-text("5555")');
      await expect(card).toBeVisible();
    });
  });

  test.describe('Business Rules - Paid Subscription', () => {
    test('should prevent deleting only payment method on paid subscription', async ({ page }) => {
      // Assuming user has PRO or PLUS plan with only one payment method
      await gotoSubscriptionPage(page);

      // Verify user is on paid plan
      const planName = await page.locator('[data-testid="current-plan"]').textContent();
      expect(planName).toMatch(/PRO|PLUS/i);

      // Verify only one payment method
      const count = await getPaymentMethodCount(page);
      if (count !== 1) {
        test.skip('User must have exactly one payment method for this test');
      }

      // Try to delete the only method
      await clickDeletePaymentMethod(page, '4242');

      // Confirm deletion
      await confirmDeleteDialog(page);

      // Should show error
      await waitForErrorToast(page, 'cannot delete');

      // Verify method still exists
      const finalCount = await getPaymentMethodCount(page);
      expect(finalCount).toBe(1);
    });

    test('should allow deleting only payment method on FREE plan', async ({ page }) => {
      // This test requires a user on FREE plan with one payment method
      // You may need to set up test data accordingly
      test.skip('Requires specific test data setup');
    });
  });

  test.describe('Business Rules - Default Payment Method', () => {
    test('should prevent deleting default payment method when others exist', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Verify multiple methods exist
      const count = await getPaymentMethodCount(page);
      expect(count).toBeGreaterThan(1);

      // Find the default method (has "Default" badge)
      const defaultCard = page.locator('[data-testid="payment-method-card"]:has-text("Default")');
      await expect(defaultCard).toBeVisible();

      // Get the last four digits of default card
      const defaultCardText = await defaultCard.textContent();
      const lastFour = defaultCardText?.match(/\d{4}/)?.[0] || '4242';

      // Try to delete default method
      await clickDeletePaymentMethod(page, lastFour);

      // Confirm deletion
      await confirmDeleteDialog(page);

      // Should show error
      await waitForErrorToast(page, 'default payment method');

      // Verify method still exists
      await expect(defaultCard).toBeVisible();
    });

    test('should allow deleting default payment method when it is the only one', async ({ page }) => {
      // This test requires specific setup: user with only one payment method (which is default)
      test.skip('Requires specific test data setup');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Simulate network failure by blocking API requests
      await page.route('**/api/payment-methods/**', (route) => {
        route.abort('failed');
      });

      // Try to delete a method
      await clickDeletePaymentMethod(page, '5555');
      await confirmDeleteDialog(page);

      // Should show error notification
      await waitForErrorToast(page);

      // Verify method still exists
      const card = page.locator('[data-testid="payment-method-card"]:has-text("5555")');
      await expect(card).toBeVisible();
    });

    test('should handle server errors (500) gracefully', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Mock 500 error response
      await page.route('**/api/payment-methods/**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await clickDeletePaymentMethod(page, '5555');
      await confirmDeleteDialog(page);

      // Should show error
      await waitForErrorToast(page);
    });

    test('should handle unauthorized errors (401) by redirecting to login', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Mock 401 error
      await page.route('**/api/payment-methods/**', (route) => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      });

      await clickDeletePaymentMethod(page, '5555');
      await confirmDeleteDialog(page);

      // Should redirect to login
      await page.waitForURL(/\/login/, { timeout: 10000 });
    });
  });

  test.describe('UI/UX Validation', () => {
    test('should disable delete button while deletion is in progress', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Click delete
      await clickDeletePaymentMethod(page, '5555');

      // Confirm deletion
      const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")');
      await confirmButton.click();

      // Button should be disabled during API call
      await expect(confirmButton).toBeDisabled();
    });

    test('should show loading state during deletion', async ({ page }) => {
      await gotoSubscriptionPage(page);

      await clickDeletePaymentMethod(page, '5555');
      await page.click('button:has-text("Delete"), button:has-text("Confirm")');

      // Look for loading spinner or text
      const loadingIndicator = page.locator('[data-testid="loading"], .spinner, text="Deleting"');
      await expect(loadingIndicator).toBeVisible();
    });

    test('should close dialog after successful deletion', async ({ page }) => {
      await gotoSubscriptionPage(page);

      await clickDeletePaymentMethod(page, '5555');
      await confirmDeleteDialog(page);

      // Wait for success
      await waitForSuccessToast(page);

      // Dialog should be closed
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).not.toBeVisible();
    });

    test('should keep dialog open on error', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Mock error
      await page.route('**/api/payment-methods/**', (route) => {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Cannot delete' }),
        });
      });

      await clickDeletePaymentMethod(page, '5555');
      await confirmDeleteDialog(page);

      // Wait for error
      await waitForErrorToast(page);

      // Dialog should still be visible
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard accessible', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Tab to delete button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Navigate to delete button

      // Activate with Enter
      await page.keyboard.press('Enter');

      // Dialog should open
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Focus should be on confirm button
      const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")');
      await expect(confirmButton).toBeFocused();

      // Cancel with Escape
      await page.keyboard.press('Escape');

      // Dialog should close
      await expect(dialog).not.toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Check for ARIA labels on delete buttons
      const deleteButtons = page.locator('button[title="Delete payment method"]');
      const count = await deleteButtons.count();
      expect(count).toBeGreaterThan(0);

      // Check dialog accessibility
      await clickDeletePaymentMethod(page, '5555');
      const dialog = page.locator('[role="dialog"], [role="alertdialog"]');
      await expect(dialog).toBeVisible();

      // Check for aria-labelledby or aria-label
      const ariaLabel = await dialog.getAttribute('aria-label');
      const ariaLabelledBy = await dialog.getAttribute('aria-labelledby');
      expect(ariaLabel || ariaLabelledBy).toBeTruthy();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test('should work correctly on mobile viewport', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Verify page is responsive
      const container = page.locator('.container, [data-testid="subscription-page"]');
      await expect(container).toBeVisible();

      // Verify cards are stacked vertically
      const firstCard = page.locator('[data-testid="payment-method-card"]').first();
      const secondCard = page.locator('[data-testid="payment-method-card"]').nth(1);

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      if (firstBox && secondBox) {
        // Second card should be below first card (higher Y position)
        expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);
      }

      // Delete functionality should work
      await clickDeletePaymentMethod(page, '5555');
      await confirmDeleteDialog(page);
      await waitForSuccessToast(page);
    });
  });
});
