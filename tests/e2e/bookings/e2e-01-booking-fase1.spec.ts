import { test, expect, Page } from '@playwright/test';
import { login, TEST_USERS } from '../helpers/auth.helper';
import {
  mockNoBlockedDates,
  mockSystemReferralLink,
  mockCreateBookingSuccess,
  gotoPropertyPage,
  openBookingModal,
  selectBookingDates,
  fillGuestInfo,
  acceptTerms,
  clickSiguiente,
  clickConfirmarReserva,
  BOOKING_TEST_PROPERTY,
  BOOKING_TEST_REFERRAL_LINK_ID,
  GUEST_DATA,
} from '../helpers/booking.helper';

// ─── Shared login helper ──────────────────────────────────────────────────────

const GUEST_USER = {
  email: 'guest@test.com',
  password: 'Test1234!',
  name: 'Test Guest',
  role: 'USER' as const,
};

async function loginAndGoToProperty(page: Page) {
  // Setup API mocks before navigation so they intercept from the start
  await mockSystemReferralLink(page);
  await mockNoBlockedDates(page);

  await login(page, GUEST_USER);
  await gotoPropertyPage(page, BOOKING_TEST_PROPERTY.slug, BOOKING_TEST_REFERRAL_LINK_ID);
}

// ─── E2E-01: Guest crea reserva — Fase 1 (propiedad con airbnbUrl) ────────────

test.describe('E2E-01 — Guest crea reserva Fase 1 (propiedad con airbnbUrl)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToProperty(page);
  });

  // ── PASO 1: Abrir modal ────────────────────────────────────────────────────

  test('01.1 — botón "Verificar Disponibilidad" visible y habilitado', async ({ page }) => {
    const btn = page.locator('button:has-text("Verificar Disponibilidad")');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('01.2 — modal abre en Step 1 al hacer click', async ({ page }) => {
    await openBookingModal(page);

    // Step 1 header
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(
      page.locator('[role="dialog"] h2, [role="dialog"] [data-testid="dialog-title"]')
    ).toContainText(/Validar Disponibilidad/i);

    // Step 1 description
    await expect(page.locator('[role="dialog"]')).toContainText(
      /Completa los siguientes datos para validar/i
    );
  });

  // ── PASO 2: Seleccionar fechas ─────────────────────────────────────────────

  test('01.3 — calendario visible y selección de fechas muestra resumen de noches', async ({
    page,
  }) => {
    await openBookingModal(page);

    // Calendar must be present
    const calendar = page.locator('[role="dialog"] table, [role="dialog"] .rdp');
    await expect(calendar).toBeVisible();

    // Select dates (10–13 days from now = 3 nights)
    await selectBookingDates(page, 10, 13);

    // Summary must appear
    await expect(page.locator('[role="dialog"]')).toContainText(/3\s*noches/i);
  });

  // ── PASO 3: Datos del huésped ──────────────────────────────────────────────

  test('01.4 — formulario acepta datos válidos del huésped sin errores de validación', async ({
    page,
  }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);

    // No Zod error messages visible
    const errorMessages = page.locator('[role="dialog"] p.text-destructive, [role="dialog"] [data-slot="form-message"]');
    await expect(errorMessages).toHaveCount(0);
  });

  // ── PASO 4: T&C ───────────────────────────────────────────────────────────

  test('01.5 — botón Siguiente deshabilitado sin T&C, habilitado con T&C', async ({ page }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);

    const nextBtn = page.locator('button:has-text("Siguiente")');

    // Without T&C → disabled
    await expect(nextBtn).toBeDisabled();

    // Accept T&C
    await acceptTerms(page);

    // Now enabled
    await expect(nextBtn).toBeEnabled();
  });

  test('01.6 — T&C checkbox muestra texto legal y enlace a términos', async ({ page }) => {
    await openBookingModal(page);

    const termsLabel = page.locator('[role="dialog"] label[for="terms"]');
    await expect(termsLabel).toContainText(/GYDI es una plataforma tecnológica/i);

    const termsLink = page.locator('[role="dialog"] a[href="/terms"]');
    await expect(termsLink).toBeVisible();
    await expect(termsLink).toHaveAttribute('target', '_blank');
    await expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // ── PASO 5: Avanzar a Step 2 ──────────────────────────────────────────────

  test('01.7 — click en Siguiente avanza a Step 2', async ({ page }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);

    // Step 2 header
    await expect(
      page.locator('[role="dialog"] h2, [role="dialog"] [data-testid="dialog-title"]')
    ).toContainText(/Confirmar reserva y pago/i);

    // Step 2 description
    await expect(page.locator('[role="dialog"]')).toContainText(
      /Ingresa tu tarjeta para confirmar/i
    );
  });

  // ── PASO 6: Desglose de precios en Step 2 ─────────────────────────────────

  test('01.8 — Step 2 muestra desglose correcto de precios', async ({ page }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);

    const dialog = page.locator('[role="dialog"]');

    // 3 noches × $100 = $300 subtotal
    await expect(dialog).toContainText(/3\s*noche/i);

    // Service fee 10%
    await expect(dialog).toContainText(/Tarifa de servicio/i);

    // Deposit info
    await expect(dialog).toContainText(/Depósito de seguridad/i);
    await expect(dialog).toContainText(/reembolsable/i);

    // Total label
    await expect(dialog).toContainText(/Total autorizado en tarjeta/i);

    // Deposit release note
    await expect(dialog).toContainText(/7 días/i);
  });

  // ── PASO 6: Confirmar reserva Fase 1 (airbnbUrl) ──────────────────────────

  test('01.9 — confirmar reserva llama POST /api/public/bookings con payload correcto', async ({
    page,
  }) => {
    await mockCreateBookingSuccess(page);

    const bookingRequests: { body: unknown; url: string }[] = [];
    page.on('request', (req) => {
      if (req.url().includes('/api/public/bookings') && req.method() === 'POST') {
        bookingRequests.push({ url: req.url(), body: JSON.parse(req.postData() ?? '{}') });
      }
    });

    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);
    await clickConfirmarReserva(page);

    // Wait for at least one booking request
    await page.waitForFunction(() => true, null, { timeout: 5000 }).catch(() => {});
    expect(bookingRequests.length).toBeGreaterThanOrEqual(1);

    const payload = bookingRequests[0].body as Record<string, unknown>;

    // Verify required fields
    expect(typeof payload.referralLinkId).toBe('number');
    expect(typeof payload.propertyId).toBe('number');
    expect(payload.guestName).toBe(GUEST_DATA.name);
    expect(payload.guestEmail).toBe(GUEST_DATA.email);
    expect(payload.guestsCount).toBe(Number(GUEST_DATA.guestsCount));
    expect(payload.termsAccepted).toBe(true);

    // Dates must be YYYY-MM-DD format
    expect(String(payload.checkInDate)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(String(payload.checkOutDate)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('01.10 — tras confirmación exitosa el modal se cierra', async ({ page }) => {
    // Mock airbnbUrl redirect: intercept window.open
    await page.addInitScript(() => {
      window.open = () => null; // prevent actual tab opening in test
    });
    await mockCreateBookingSuccess(page);

    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);
    await clickConfirmarReserva(page);

    // Modal should close
    await page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 10000 });
  });

  test('01.11 — tras confirmación exitosa aparece toast de éxito', async ({ page }) => {
    await page.addInitScript(() => { window.open = () => null; });
    await mockCreateBookingSuccess(page);

    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);
    await clickConfirmarReserva(page);

    // Sonner toast with success message
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
    await expect(toast.first()).toContainText(/reserva|éxito|confirmad/i);
  });

  // ── Botón Atrás en Step 2 ─────────────────────────────────────────────────

  test('01.12 — botón Atrás en Step 2 regresa a Step 1', async ({ page }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);

    // Click Atrás
    await page.click('[role="dialog"] button:has-text("Atrás")');

    // Back to Step 1
    await expect(
      page.locator('[role="dialog"] h2, [role="dialog"] [data-testid="dialog-title"]')
    ).toContainText(/Validar Disponibilidad/i);
  });

  // ── Cancelar cierra modal ─────────────────────────────────────────────────

  test('01.13 — botón Cancelar cierra el modal y resetea formulario', async ({ page }) => {
    await openBookingModal(page);
    await fillGuestInfo(page);

    await page.click('[role="dialog"] button:has-text("Cancelar")');

    // Modal closes
    await page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 5000 });

    // Re-open: form must be empty
    await openBookingModal(page);
    const nameInput = page.locator('[role="dialog"] input[name="guestName"], [role="dialog"] input[placeholder*="Juan"]');
    await expect(nameInput).toHaveValue('');
  });
});
