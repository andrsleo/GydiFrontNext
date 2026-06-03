import { test, expect, Page } from '@playwright/test';
import { login, TEST_USERS } from '../helpers/auth.helper';
import {
  mockHostBookingsWithPending,
  mockHostBookingsWithCancelled,
  mockRejectBookingSuccess,
  mockHostBookingStats,
  GUEST_DATA,
} from '../helpers/booking.helper';

// ─── Setup ────────────────────────────────────────────────────────────────────

const REJECTION_REASON = 'Las fechas no están disponibles por mantenimiento';

async function loginAsHostAndGoToBookings(page: Page) {
  await mockHostBookingsWithPending(page);
  await mockHostBookingStats(page);

  await login(page, TEST_USERS.host);
  await page.goto('/dashboard/host/bookings');
  await page.waitForLoadState('networkidle');
}

// ─── E2E-04: Host rechaza reserva (REQUEST → CANCELLED) ──────────────────────

test.describe('E2E-04 — Host rechaza reserva (REQUEST → CANCELLED)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHostAndGoToBookings(page);
  });

  // ── PASO 2: Abrir formulario de rechazo ───────────────────────────────────

  test('04.1 — click en "Rechazar" muestra el Textarea de razón', async ({ page }) => {
    await page.click('button:has-text("Rechazar")');

    // Textarea must appear
    const textarea = page.locator('textarea[placeholder*="Razón del rechazo"]');
    await expect(textarea).toBeVisible();
  });

  test('04.2 — click en "Rechazar" oculta los botones Confirmar/Rechazar originales', async ({
    page,
  }) => {
    await page.click('button:has-text("Rechazar")');

    // "Confirmar reserva" button should now be hidden (replaced by reject form)
    await expect(page.locator('button:has-text("Confirmar reserva")')).toBeHidden();
  });

  // ── PASO 3: Validación — botón deshabilitado sin razón ────────────────────

  test('04.3 — botón "Confirmar rechazo" deshabilitado con textarea vacío', async ({ page }) => {
    await page.click('button:has-text("Rechazar")');

    const rejectConfirmBtn = page.locator('button:has-text("Confirmar rechazo")');
    await expect(rejectConfirmBtn).toBeVisible();
    await expect(rejectConfirmBtn).toBeDisabled();
  });

  test('04.4 — botón "Confirmar rechazo" habilitado cuando hay razón', async ({ page }) => {
    await page.click('button:has-text("Rechazar")');

    await page.fill('textarea[placeholder*="Razón del rechazo"]', REJECTION_REASON);

    const rejectConfirmBtn = page.locator('button:has-text("Confirmar rechazo")');
    await expect(rejectConfirmBtn).toBeEnabled();
  });

  // ── PASO 4: Rechazar con razón ────────────────────────────────────────────

  test('04.5 — confirmar rechazo llama PUT /api/v1/bookings/:id/reject con body correcto', async ({
    page,
  }) => {
    await mockRejectBookingSuccess(page);

    const rejectRequests: { url: string; body: unknown }[] = [];
    page.on('request', (req) => {
      if (req.url().match(/\/api\/v1\/bookings\/\d+\/reject/) && req.method() === 'PUT') {
        rejectRequests.push({ url: req.url(), body: JSON.parse(req.postData() ?? '{}') });
      }
    });

    await page.click('button:has-text("Rechazar")');
    await page.fill('textarea[placeholder*="Razón del rechazo"]', REJECTION_REASON);
    await page.click('button:has-text("Confirmar rechazo")');

    await page.waitForTimeout(2000);

    expect(rejectRequests.length).toBeGreaterThanOrEqual(1);

    const body = rejectRequests[0].body as Record<string, unknown>;
    expect(body.reason).toBe(REJECTION_REASON);

    // URL must include booking ID
    expect(rejectRequests[0].url).toMatch(/\/bookings\/999\/reject/);
  });

  test('04.6 — tras rechazar aparece toast de rechazo', async ({ page }) => {
    await mockRejectBookingSuccess(page);

    await page.click('button:has-text("Rechazar")');
    await page.fill('textarea[placeholder*="Razón del rechazo"]', REJECTION_REASON);
    await page.click('button:has-text("Confirmar rechazo")');

    const toast = page.locator('[data-sonner-toast]');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
    await expect(toast.first()).toContainText(/rechazad/i);
  });

  test('04.7 — tras rechazar el booking desaparece de "Pendientes"', async ({ page }) => {
    await mockRejectBookingSuccess(page);
    await mockHostBookingsWithCancelled(page);

    await page.click('button:has-text("Rechazar")');
    await page.fill('textarea[placeholder*="Razón del rechazo"]', REJECTION_REASON);
    await page.click('button:has-text("Confirmar rechazo")');

    await page.waitForTimeout(2000);

    // After list refresh, "Pendientes" tab should show empty state
    await expect(
      page.locator('text=No hay reservas pendientes de aprobación')
    ).toBeVisible({ timeout: 5000 });
  });

  // ── Cancelar rechazo ──────────────────────────────────────────────────────

  test('04.8 — botón "Cancelar" en formulario de rechazo restaura los botones originales', async ({
    page,
  }) => {
    await page.click('button:has-text("Rechazar")');
    await page.fill('textarea[placeholder*="Razón del rechazo"]', 'alguna razón');

    await page.click('button:has-text("Cancelar")');

    // Textarea should disappear
    await expect(page.locator('textarea[placeholder*="Razón del rechazo"]')).toBeHidden();

    // Original buttons should reappear
    await expect(page.locator('button:has-text("Confirmar reserva")')).toBeVisible();
    await expect(page.locator('button:has-text("Rechazar")')).toBeVisible();
  });

  test('04.9 — razón de rechazo visible en el card tras rechazar', async ({ page }) => {
    await mockRejectBookingSuccess(page);
    await mockHostBookingsWithCancelled(page);

    await page.click('button:has-text("Rechazar")');
    await page.fill('textarea[placeholder*="Razón del rechazo"]', REJECTION_REASON);
    await page.click('button:has-text("Confirmar rechazo")');

    await page.waitForTimeout(2000);

    // Navigate to Historial tab
    await page.click('[role="tab"]:has-text("Historial")');

    // Rejection reason should be displayed in the card
    await expect(page.locator(`text=${REJECTION_REASON}`).first()).toBeVisible({ timeout: 5000 });
  });
});
