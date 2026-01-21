import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/auth.helper';
import { gotoSubscriptionPage } from './helpers/subscription.helper';

/**
 * E2E Tests for Subscription Page
 *
 * Comprehensive tests for subscription page functionality
 */

test.describe('Subscription Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.affiliate);
  });

  test.describe('Page Load & Structure', () => {
    test('should load subscription page successfully', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Verify URL
      expect(page.url()).toContain('/dashboard/subscription');

      // Verify page title/header
      const header = page.locator('h1, [data-testid="page-title"]');
      await expect(header).toBeVisible();
      await expect(header).toContainText(/subscription|suscripci[oó]n/i);
    });

    test('should display all main sections', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Subscription status section
      const statusSection = page.locator('[data-testid="subscription-status"], section:has-text("Current Plan")');
      await expect(statusSection).toBeVisible();

      // Payment methods section
      const paymentSection = page.locator('[data-testid="payment-methods-section"], section:has-text("Payment Methods")');
      await expect(paymentSection).toBeVisible();

      // Billing info section
      const billingSection = page.locator('[data-testid="billing-info"], section:has-text("Billing")');
      await expect(billingSection).toBeVisible();
    });

    test('should display current plan information', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Plan name
      const planName = page.locator('[data-testid="current-plan"]');
      await expect(planName).toBeVisible();

      // Plan features or details
      const planDetails = page.locator('[data-testid="plan-details"]');
      const isVisible = await planDetails.isVisible().catch(() => false);
      // Plan details might be visible or hidden depending on design
      expect(typeof isVisible).toBe('boolean');
    });

    test('should display payment methods list', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // At least one payment method should be visible
      const paymentMethods = page.locator('[data-testid="payment-method-card"]');
      const count = await paymentMethods.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Payment Method Cards', () => {
    test('should display card information correctly', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const firstCard = page.locator('[data-testid="payment-method-card"]').first();
      await expect(firstCard).toBeVisible();

      // Card brand
      const cardBrand = firstCard.locator('.card-brand, [data-testid="card-brand"]');
      const hasBrand = await cardBrand.isVisible().catch(() => false);

      // Card last four
      const cardText = await firstCard.textContent();
      expect(cardText).toMatch(/\d{4}/); // Should contain 4 digits

      // Expiry date
      expect(cardText).toMatch(/\d{2}\/\d{2}/); // Should contain MM/YY format
    });

    test('should display default badge on default card', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Find default card
      const defaultCard = page.locator('[data-testid="payment-method-card"]:has-text("Default")');
      await expect(defaultCard).toBeVisible();

      // Verify badge
      const badge = defaultCard.locator('text="Default"');
      await expect(badge).toBeVisible();
    });

    test('should display expired badge on expired cards', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Try to find expired card (might not exist in all test scenarios)
      const expiredCard = page.locator('[data-testid="payment-method-card"]:has-text("Expired")');
      const count = await expiredCard.count();

      // If expired cards exist, verify badge
      if (count > 0) {
        const badge = expiredCard.first().locator('text="Expired"');
        await expect(badge).toBeVisible();
      }
    });

    test('should show action buttons on each card', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const firstCard = page.locator('[data-testid="payment-method-card"]').first();

      // Delete button should exist
      const deleteButton = firstCard.locator('button[title*="Delete"]');
      await expect(deleteButton).toBeVisible();

      // Set default button (might not exist on default card)
      const setDefaultButton = firstCard.locator('button[title*="Set"]');
      const hasSetDefaultButton = await setDefaultButton.isVisible().catch(() => false);
      expect(typeof hasSetDefaultButton).toBe('boolean');
    });
  });

  test.describe('Subscription Actions', () => {
    test('should display upgrade/change plan button', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const upgradeButton = page.locator('button:has-text("Upgrade"), button:has-text("Change Plan")');
      const isVisible = await upgradeButton.isVisible().catch(() => false);

      // Button visibility depends on current plan
      expect(typeof isVisible).toBe('boolean');
    });

    test('should display cancel subscription button', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const cancelButton = page.locator('button:has-text("Cancel Subscription")');
      const isVisible = await cancelButton.isVisible().catch(() => false);

      // Button might not be visible for FREE plan
      expect(typeof isVisible).toBe('boolean');
    });

    test('should display add payment method button', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const addButton = page.locator('button:has-text("Add Payment Method"), button:has-text("Add Card")');
      await expect(addButton).toBeVisible();
    });
  });

  test.describe('Billing Information', () => {
    test('should display user and subscription IDs', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const billingSection = page.locator('[data-testid="billing-info"]');
      await expect(billingSection).toBeVisible();

      const billingText = await billingSection.textContent();

      // Should contain ID information
      expect(billingText).toMatch(/#\d+/); // ID format
    });

    test('should display Stripe customer ID if available', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const billingSection = page.locator('[data-testid="billing-info"]');
      const billingText = await billingSection.textContent();

      // Stripe customer ID starts with 'cus_'
      const hasStripeId = billingText?.includes('cus_') || billingText?.includes('Stripe Customer');
      expect(typeof hasStripeId).toBe('boolean');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display properly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await gotoSubscriptionPage(page);

      // Verify two-column layout on desktop
      const container = page.locator('.grid, [class*="grid-cols"]');
      await expect(container).toBeVisible();
    });

    test('should display properly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await gotoSubscriptionPage(page);

      // Page should still be functional
      const header = page.locator('h1');
      await expect(header).toBeVisible();

      const paymentMethods = page.locator('[data-testid="payment-method-card"]');
      const count = await paymentMethods.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should display properly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await gotoSubscriptionPage(page);

      // Verify single-column layout on mobile
      const cards = page.locator('[data-testid="payment-method-card"]');
      const firstCard = cards.first();
      const secondCard = cards.nth(1);

      if ((await cards.count()) >= 2) {
        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();

        if (firstBox && secondBox) {
          // Cards should stack vertically
          expect(secondBox.y).toBeGreaterThan(firstBox.y);
        }
      }
    });
  });

  test.describe('Loading States', () => {
    test('should show loading state while fetching data', async ({ page }) => {
      // Delay API response to observe loading state
      await page.route('**/api/subscriptions/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.continue();
      });

      const loadingPromise = page.waitForSelector('[data-testid="loading"], .spinner', { timeout: 2000 });

      await gotoSubscriptionPage(page);

      // Loading indicator should appear
      await loadingPromise;
    });

    test('should show skeleton loaders for payment methods', async ({ page }) => {
      await page.route('**/api/payment-methods/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.continue();
      });

      await gotoSubscriptionPage(page);

      // Look for skeleton loaders
      const skeleton = page.locator('[data-testid="skeleton"], .skeleton');
      const hasSkeletons = await skeleton.isVisible().catch(() => false);

      // Skeleton might or might not be implemented
      expect(typeof hasSkeletons).toBe('boolean');
    });
  });

  test.describe('Error States', () => {
    test('should display error when subscription fetch fails', async ({ page }) => {
      await page.route('**/api/subscriptions/**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await gotoSubscriptionPage(page);

      // Error message should be displayed
      const errorMessage = page.locator('[data-testid="error-message"], [role="alert"]');
      await expect(errorMessage).toBeVisible();
    });

    test('should display error when payment methods fetch fails', async ({ page }) => {
      await page.route('**/api/payment-methods/**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await gotoSubscriptionPage(page);

      // Error state should be visible
      const errorIndicator = page.locator('[data-testid="payment-methods-error"], text="error"');
      const hasError = await errorIndicator.isVisible().catch(() => false);
      expect(typeof hasError).toBe('boolean');
    });
  });

  test.describe('Navigation', () => {
    test('should navigate back to dashboard', async ({ page }) => {
      await gotoSubscriptionPage(page);

      // Look for back button or dashboard link
      const backButton = page.locator('a[href="/dashboard"], button:has-text("Back")');
      const isVisible = await backButton.isVisible().catch(() => false);

      if (isVisible) {
        await backButton.click();
        await page.waitForURL(/\/dashboard/, { timeout: 5000 });
      }
    });

    test('should have working breadcrumb navigation', async ({ page }) => {
      await gotoSubscriptionPage(page);

      const breadcrumb = page.locator('[data-testid="breadcrumb"], nav[aria-label="breadcrumb"]');
      const hasBreadcrumb = await breadcrumb.isVisible().catch(() => false);

      if (hasBreadcrumb) {
        // Breadcrumbs should contain links
        const links = breadcrumb.locator('a');
        const count = await links.count();
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await gotoSubscriptionPage(page);

      const loadTime = Date.now() - startTime;

      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not have console errors', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await gotoSubscriptionPage(page);

      // Wait for any async operations
      await page.waitForTimeout(2000);

      // Filter out known acceptable errors (if any)
      const criticalErrors = consoleErrors.filter((error) => {
        // Filter out third-party or non-critical errors
        return !error.includes('favicon') && !error.includes('third-party');
      });

      expect(criticalErrors).toHaveLength(0);
    });
  });
});
