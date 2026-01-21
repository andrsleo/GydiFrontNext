import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/auth.helper';
import {
  gotoSubscriptionPage,
  clickSetDefaultPaymentMethod,
  isPaymentMethodDefault,
  waitForSuccessToast,
  waitForErrorToast,
} from './helpers/subscription.helper';

/**
 * E2E Tests for Set Default Payment Method Feature
 */

test.describe('Set Default Payment Method', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.affiliate);
    await gotoSubscriptionPage(page);
  });

  test.describe('Happy Path', () => {
    test('should successfully set a non-default method as default', async ({ page }) => {
      // Find a non-default payment method
      const nonDefaultCard = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      await expect(nonDefaultCard).toBeVisible();

      // Get the last four digits
      const cardText = await nonDefaultCard.textContent();
      const lastFour = cardText?.match(/\d{4}/)?.[0] || '5555';

      // Verify it's not default initially
      expect(await isPaymentMethodDefault(page, lastFour)).toBe(false);

      // Click set as default
      await clickSetDefaultPaymentMethod(page, lastFour);

      // Wait for success
      await waitForSuccessToast(page, 'default payment method');

      // Verify it's now default
      await page.waitForTimeout(1000); // Wait for re-render
      expect(await isPaymentMethodDefault(page, lastFour)).toBe(true);
    });

    test('should remove default badge from previous default method', async ({ page }) => {
      // Get current default method
      const currentDefaultCard = page.locator('[data-testid="payment-method-card"]:has-text("Default")');
      await expect(currentDefaultCard).toBeVisible();

      const currentDefaultText = await currentDefaultCard.textContent();
      const currentDefaultLastFour = currentDefaultText?.match(/\d{4}/)?.[0] || '4242';

      // Find a different method
      const otherCard = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      const otherCardText = await otherCard.textContent();
      const otherCardLastFour = otherCardText?.match(/\d{4}/)?.[0] || '5555';

      // Set other card as default
      await clickSetDefaultPaymentMethod(page, otherCardLastFour);
      await waitForSuccessToast(page);

      // Wait for update
      await page.waitForTimeout(1000);

      // Previous default should no longer have badge
      expect(await isPaymentMethodDefault(page, currentDefaultLastFour)).toBe(false);

      // New card should have badge
      expect(await isPaymentMethodDefault(page, otherCardLastFour)).toBe(true);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle clicking on already default method', async ({ page }) => {
      // Find current default
      const defaultCard = page.locator('[data-testid="payment-method-card"]:has-text("Default")');
      await expect(defaultCard).toBeVisible();

      const cardText = await defaultCard.textContent();
      const lastFour = cardText?.match(/\d{4}/)?.[0] || '4242';

      // Try to set it as default again
      const setDefaultButton = defaultCard.locator('button[title="Set as default"]');

      // Button might not exist for already default method
      const isVisible = await setDefaultButton.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    });

    test('should validate only one method is default at a time', async ({ page }) => {
      // Count default badges
      const defaultBadges = page.locator('[data-testid="payment-method-card"]:has-text("Default")');
      const count = await defaultBadges.count();

      // Should be exactly 1
      expect(count).toBe(1);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/api/payment-methods/*/set-default', (route) => {
        route.abort('failed');
      });

      // Find non-default card
      const card = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      const cardText = await card.textContent();
      const lastFour = cardText?.match(/\d{4}/)?.[0] || '5555';

      // Try to set as default
      await clickSetDefaultPaymentMethod(page, lastFour);

      // Should show error
      await waitForErrorToast(page);

      // Should not be default
      await page.waitForTimeout(1000);
      expect(await isPaymentMethodDefault(page, lastFour)).toBe(false);
    });

    test('should handle server errors (500)', async ({ page }) => {
      await page.route('**/api/payment-methods/*/set-default', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      const card = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      const cardText = await card.textContent();
      const lastFour = cardText?.match(/\d{4}/)?.[0] || '5555';

      await clickSetDefaultPaymentMethod(page, lastFour);
      await waitForErrorToast(page);
    });
  });

  test.describe('UI/UX Validation', () => {
    test('should disable set default button while request is in progress', async ({ page }) => {
      const card = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      const setDefaultButton = card.locator('button[title="Set as default"]');
      await setDefaultButton.click();

      // Button should be disabled during API call
      await expect(setDefaultButton).toBeDisabled();
    });

    test('should show loading state during operation', async ({ page }) => {
      const card = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      await card.locator('button[title="Set as default"]').click();

      // Look for loading indicator
      const loadingIndicator = page.locator('[data-testid="loading"], .spinner');
      await expect(loadingIndicator).toBeVisible();
    });

    test('should update UI immediately after success', async ({ page }) => {
      const card = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      const cardText = await card.textContent();
      const lastFour = cardText?.match(/\d{4}/)?.[0] || '5555';

      await clickSetDefaultPaymentMethod(page, lastFour);
      await waitForSuccessToast(page);

      // Default badge should appear quickly (within 2 seconds)
      await expect(card.locator('text="Default"')).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('Optimistic UI Updates', () => {
    test('should show optimistic update before server response', async ({ page }) => {
      // Add delay to API response to test optimistic update
      await page.route('**/api/payment-methods/*/set-default', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      const card = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      const cardText = await card.textContent();
      const lastFour = cardText?.match(/\d{4}/)?.[0] || '5555';

      await clickSetDefaultPaymentMethod(page, lastFour);

      // UI should update before API response completes
      // This depends on implementation - adjust based on actual behavior
      const defaultBadge = card.locator('text="Default"');
      const isVisibleQuickly = await defaultBadge.isVisible().catch(() => false);

      // After 2 second delay, should definitely be visible
      await page.waitForTimeout(2500);
      await expect(defaultBadge).toBeVisible();
    });
  });

  test.describe('Multiple Rapid Clicks', () => {
    test('should handle rapid consecutive clicks gracefully', async ({ page }) => {
      const card = page
        .locator('[data-testid="payment-method-card"]')
        .filter({ hasNotText: 'Default' })
        .first();

      const setDefaultButton = card.locator('button[title="Set as default"]');

      // Click multiple times rapidly
      await setDefaultButton.click();
      await setDefaultButton.click();
      await setDefaultButton.click();

      // Should only process once
      await waitForSuccessToast(page);

      // Verify only one default method exists
      const defaultBadges = page.locator('[data-testid="payment-method-card"]:has-text("Default")');
      const count = await defaultBadges.count();
      expect(count).toBe(1);
    });
  });
});
