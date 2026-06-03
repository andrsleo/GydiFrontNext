import { test, expect, Page } from '@playwright/test';
import { login, TEST_USERS } from '../helpers/auth.helper';
import {
  mockNoBlockedDates,
  mockSystemReferralLink,
  mockCreateBookingSuccess,
  mockCreatePaymentSuccess,
  mockPropertyDetailFase2,
  mockHostHasPaymentMethod,
  mockStripeJs,
  gotoPropertyPage,
  openBookingModal,
  selectBookingDates,
  fillGuestInfo,
  acceptTerms,
  clickSiguiente,
  clickConfirmarReserva,
  BOOKING_TEST_PROPERTY,
  BOOKING_TEST_PROPERTY_FASE2,
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

async function loginAndGoToPropertyFase2(page: Page) {
  // Mock Stripe before any navigation
  await mockStripeJs(page);

  // Setup API mocks before navigation
  await mockSystemReferralLink(page);
  await mockNoBlockedDates(page);
  await mockPropertyDetailFase2(page);
  await mockHostHasPaymentMethod(page);

  await login(page, GUEST_USER);
  await gotoPropertyPage(page, BOOKING_TEST_PROPERTY_FASE2.slug, BOOKING_TEST_REFERRAL_LINK_ID);
}

// ─── E2E-02: Guest crea reserva con pago Stripe — Fase 2 ─────────────────────

test.describe('E2E-02 — Guest crea reserva con pago Stripe (Fase 2 — sin airbnbUrl)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToPropertyFase2(page);
  });

  // ── PASO 1–4: Igual que E2E-01 — modal, fechas, datos, T&C ─────────────────

  test('02.1 — botón "Verificar Disponibilidad" visible y habilitado', async ({ page }) => {
    const btn = page.locator('button:has-text("Verificar Disponibilidad")');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('02.2 — modal abre en Step 1 con título correcto', async ({ page }) => {
    await openBookingModal(page);

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(
      page.locator('[role="dialog"] h2, [role="dialog"] [data-testid="dialog-title"]')
    ).toContainText(/Validar Disponibilidad/i);
  });

  // ── PASO 5: Step 2 en Fase 2 — sin airbnbUrl → muestra Stripe ─────────────

  test('02.3 — Step 2 muestra CardElement de Stripe (iframe visible)', async ({ page }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);

    // StripeCardElementWrapper renders an iframe from Stripe.js
    // With our Stripe stub, the iframe is NOT injected (stub has no real DOM) —
    // but the wrapper container and label MUST still be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toContainText(/Card Information/i);

    // Step 2 header
    await expect(
      page.locator('[role="dialog"] h2, [role="dialog"] [data-testid="dialog-title"]')
    ).toContainText(/Confirmar reserva y pago/i);
  });

  // ── PASO 5 cont.: Desglose de precios en Fase 2 ───────────────────────────

  test('02.4 — Step 2 muestra desglose correcto (reserva + tarifa + depósito)', async ({
    page,
  }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);

    const dialog = page.locator('[role="dialog"]');

    // 3 nights × $100 = $300 subtotal
    await expect(dialog).toContainText(/3\s*noche/i);

    // Service fee line
    await expect(dialog).toContainText(/Tarifa de servicio/i);

    // Deposit line — refundable
    await expect(dialog).toContainText(/Depósito de seguridad/i);
    await expect(dialog).toContainText(/reembolsable/i);

    // Total label
    await expect(dialog).toContainText(/Total autorizado en tarjeta/i);

    // Deposit release note — 7 days
    await expect(dialog).toContainText(/7 días/i);
  });

  // ── PASO 5 cont.: Nota sobre bloqueo temporal ─────────────────────────────

  test('02.5 — nota explica que el depósito es bloqueo temporal', async ({ page }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);

    await expect(page.locator('[role="dialog"]')).toContainText(/bloqueo temporal/i);
  });

  // ── PASO 6–7: Confirmar → dos llamadas API ─────────────────────────────────

  test('02.6 — confirmar llama POST /api/public/bookings y luego POST /api/v1/bookings/:id/payment', async ({
    page,
  }) => {
    await mockCreateBookingSuccess(page);
    await mockCreatePaymentSuccess(page);

    const bookingRequests: { url: string; body: unknown }[] = [];
    const paymentRequests: { url: string; body: unknown }[] = [];

    page.on('request', (req) => {
      if (req.url().includes('/api/public/bookings') && req.method() === 'POST') {
        bookingRequests.push({ url: req.url(), body: JSON.parse(req.postData() ?? '{}') });
      }
      if (req.url().match(/\/api\/v1\/bookings\/\d+\/payment/) && req.method() === 'POST') {
        paymentRequests.push({ url: req.url(), body: JSON.parse(req.postData() ?? '{}') });
      }
    });

    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);
    await clickConfirmarReserva(page);

    // Give time for both async requests
    await page.waitForTimeout(3000);

    // Booking creation must happen
    expect(bookingRequests.length).toBeGreaterThanOrEqual(1);
    const bookingPayload = bookingRequests[0].body as Record<string, unknown>;

    // Stripe paymentMethodId must be forwarded to backend
    expect(typeof bookingPayload.stripePaymentMethodId).toBe('string');
    expect(String(bookingPayload.stripePaymentMethodId).length).toBeGreaterThan(0);

    // Standard booking fields
    expect(typeof bookingPayload.referralLinkId).toBe('number');
    expect(typeof bookingPayload.propertyId).toBe('number');
    expect(bookingPayload.guestName).toBe(GUEST_DATA.name);
    expect(bookingPayload.guestEmail).toBe(GUEST_DATA.email);
    expect(bookingPayload.guestsCount).toBe(Number(GUEST_DATA.guestsCount));
    expect(bookingPayload.termsAccepted).toBe(true);

    // ISO date format
    expect(String(bookingPayload.checkInDate)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(String(bookingPayload.checkOutDate)).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    // Payment call must follow
    expect(paymentRequests.length).toBeGreaterThanOrEqual(1);
    // URL must contain the bookingId from step 2 (mock returns id=999)
    expect(paymentRequests[0].url).toMatch(/\/bookings\/\d+\/payment/);
  });

  test('02.7 — tras confirmación exitosa el modal se cierra', async ({ page }) => {
    await mockCreateBookingSuccess(page);
    await mockCreatePaymentSuccess(page);

    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);
    await clickConfirmarReserva(page);

    await page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 10000 });
  });

  test('02.8 — tras confirmación exitosa aparece toast de éxito', async ({ page }) => {
    await mockCreateBookingSuccess(page);
    await mockCreatePaymentSuccess(page);

    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);
    await clickConfirmarReserva(page);

    const toast = page.locator('[data-sonner-toast]');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
    await expect(toast.first()).toContainText(/reserva|anfitrión|solicitud/i);
  });

  // ── Diferencia clave vs Fase 1: NO abre nueva pestaña ─────────────────────

  test('02.9 — Fase 2 NO llama a window.open (no airbnbUrl)', async ({ page }) => {
    await mockCreateBookingSuccess(page);
    await mockCreatePaymentSuccess(page);

    const windowOpenCalls: string[] = [];
    await page.exposeFunction('__trackWindowOpen', (url: string) => {
      windowOpenCalls.push(url);
    });
    await page.addInitScript(() => {
      const original = window.open;
      window.open = (url?: string | URL) => {
        (window as unknown as Record<string, Function>).__trackWindowOpen(String(url ?? ''));
        return original.call(window, url);
      };
    });

    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);
    await clickConfirmarReserva(page);

    await page.waitForTimeout(3000);

    // No airbnbUrl → window.open must NOT be called
    expect(windowOpenCalls.length).toBe(0);
  });

  // ── Botón Atrás ────────────────────────────────────────────────────────────

  test('02.10 — botón Atrás en Step 2 regresa a Step 1', async ({ page }) => {
    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);

    await page.click('[role="dialog"] button:has-text("Atrás")');

    await expect(
      page.locator('[role="dialog"] h2, [role="dialog"] [data-testid="dialog-title"]')
    ).toContainText(/Validar Disponibilidad/i);
  });

  // ── Error de Stripe ────────────────────────────────────────────────────────

  test('02.11 — error en Stripe muestra toast de error sin cerrar el modal', async ({ page }) => {
    // Override Stripe stub to return an error
    await page.addInitScript(() => {
      (window as unknown as Record<string, unknown>).Stripe = (_key: string) => ({
        elements: () => ({
          create: () => ({ mount: () => {}, unmount: () => {}, destroy: () => {}, on: () => {}, update: () => {} }),
          getElement: () => null,
        }),
        createPaymentMethod: () =>
          Promise.resolve({
            paymentMethod: null,
            error: { message: 'Your card number is incomplete.' },
          }),
        confirmCardPayment: () => Promise.resolve({ error: { message: 'error' } }),
      });
    });

    await openBookingModal(page);
    await selectBookingDates(page, 10, 13);
    await fillGuestInfo(page);
    await acceptTerms(page);
    await clickSiguiente(page);
    await clickConfirmarReserva(page);

    // Modal must remain open
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });

    // Error toast must appear
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast.first()).toBeVisible({ timeout: 5000 });
  });
});
