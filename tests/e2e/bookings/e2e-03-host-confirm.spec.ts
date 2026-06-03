import { test, expect, Page } from '@playwright/test';
import { login, TEST_USERS } from '../helpers/auth.helper';
import {
  mockHostBookingsWithPending,
  mockHostBookingsWithReserved,
  mockConfirmBookingSuccess,
  mockHostBookingStats,
  GUEST_DATA,
} from '../helpers/booking.helper';

// ─── Setup ────────────────────────────────────────────────────────────────────

async function loginAsHostAndGoToBookings(page: Page) {
  await mockHostBookingsWithPending(page);
  await mockHostBookingStats(page);

  await login(page, TEST_USERS.host);
  await page.goto('/dashboard/host/bookings');
  await page.waitForLoadState('networkidle');
}

// ─── E2E-03: Host confirma reserva (REQUEST → RESERVED) ──────────────────────

test.describe('E2E-03 — Host confirma reserva (REQUEST → RESERVED)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHostAndGoToBookings(page);
  });

  // ── PASO 1: Ver lista de reservas ──────────────────────────────────────────

  test('03.1 — pestaña "Pendientes" visible con booking en REQUEST', async ({ page }) => {
    const pendingTab = page.locator('[role="tab"]:has-text("Pendientes")');
    await expect(pendingTab).toBeVisible();

    // Must show the guest name
    await expect(page.locator(`text=${GUEST_DATA.name}`)).toBeVisible();
  });

  // ── PASO 2: Datos del card ─────────────────────────────────────────────────

  test('03.2 — card muestra nombre, email y badge "Solicitud"', async ({ page }) => {
    // Guest name visible
    await expect(page.locator(`text=${GUEST_DATA.name}`)).toBeVisible();

    // Guest email visible
    await expect(page.locator(`text=${GUEST_DATA.email}`)).toBeVisible();

    // Status badge shows "Solicitud" (REQUEST label)
    await expect(page.locator('text=Solicitud').first()).toBeVisible();
  });

  test('03.3 — card muestra fechas y número de huéspedes', async ({ page }) => {
    // Dates in format "10 jun → 13 jun 2026"
    await expect(page.locator('text=/jun/i').first()).toBeVisible();

    // Guest count (2 huéspedes)
    await expect(page.locator(`text=${GUEST_DATA.guestsCount}`).first()).toBeVisible();
  });

  test('03.4 — botones "Confirmar reserva" y "Rechazar" visibles para REQUEST', async ({
    page,
  }) => {
    await expect(page.locator('button:has-text("Confirmar reserva")')).toBeVisible();
    await expect(page.locator('button:has-text("Rechazar")')).toBeVisible();
  });

  // ── PASO 3: Confirmar ─────────────────────────────────────────────────────

  test('03.5 — click en "Confirmar reserva" llama PUT /api/v1/bookings/:id/confirm', async ({
    page,
  }) => {
    await mockConfirmBookingSuccess(page);

    const confirmRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().match(/\/api\/v1\/bookings\/\d+\/confirm/) && req.method() === 'PUT') {
        confirmRequests.push(req.url());
      }
    });

    await page.click('button:has-text("Confirmar reserva")');
    await page.waitForTimeout(2000);

    expect(confirmRequests.length).toBeGreaterThanOrEqual(1);
    expect(confirmRequests[0]).toMatch(/\/bookings\/999\/confirm/);
  });

  test('03.6 — tras confirmar aparece toast de éxito', async ({ page }) => {
    await mockConfirmBookingSuccess(page);

    await page.click('button:has-text("Confirmar reserva")');

    const toast = page.locator('[data-sonner-toast]');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
    await expect(toast.first()).toContainText(/confirmad/i);
  });

  test('03.7 — tras confirmar el booking aparece en "Confirmadas" (lista actualizada)', async ({
    page,
  }) => {
    await mockConfirmBookingSuccess(page);

    // Setup: after confirm, re-fetch returns RESERVED booking
    await mockHostBookingsWithReserved(page);

    await page.click('button:has-text("Confirmar reserva")');

    // Wait for mutation + cache invalidation + re-fetch
    await page.waitForTimeout(2000);

    // Navigate to "Confirmadas" tab
    await page.click('[role="tab"]:has-text("Confirmadas")');

    // Guest name should appear in confirmed tab
    await expect(page.locator(`text=${GUEST_DATA.name}`)).toBeVisible({ timeout: 5000 });
  });

  // ── Botón deshabilitado durante la petición ────────────────────────────────

  test('03.8 — botón "Confirmar reserva" deshabilitado durante la petición', async ({ page }) => {
    // Slow confirm response to capture loading state
    await page.route('**/api/v1/bookings/*/confirm', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 999, status: 'RESERVED' }),
      });
    });

    const confirmBtn = page.locator('button:has-text("Confirmar reserva")');
    await confirmBtn.click();

    // Button should be disabled while processing
    await expect(confirmBtn).toBeDisabled();
  });
});
