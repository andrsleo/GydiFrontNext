import { Page, Route } from '@playwright/test';

// ─── Fixtures ────────────────────────────────────────────────────────────────

export const BOOKING_TEST_PROPERTY = {
  id: 1,
  slug: 'test-property-e2e',
  title: 'Propiedad E2E Test',
  pricePerNight: 100,
  currency: 'USD',
  /** Fase 1 variant — has airbnbUrl */
  airbnbUrl: 'https://www.airbnb.com/rooms/123456',
  hostId: 2, // matches host TEST_USER
};

export const BOOKING_TEST_PROPERTY_FASE2 = {
  ...BOOKING_TEST_PROPERTY,
  slug: 'test-property-e2e-fase2',
  /** Fase 2 variant — no airbnbUrl → triggers Stripe flow */
  airbnbUrl: undefined,
};

export const BOOKING_TEST_REFERRAL_LINK_ID = '42';

export const GUEST_DATA = {
  name: 'Juan Pérez García',
  email: 'juan@test.com',
  phone: '+573001234567',
  guestsCount: '2',
};

// Stripe test card that always succeeds
export const STRIPE_TEST_CARD = {
  number: '4242424242424242',
  expiry: '12/30',
  cvc: '123',
  zip: '10001',
};

// ─── API Mock Factories ───────────────────────────────────────────────────────

/**
 * Intercepts GET /api/v1/properties/:id/calendar → returns empty (no blocked dates)
 */
export async function mockNoBlockedDates(page: Page) {
  await page.route('**/api/v1/properties/*/calendar**', (route: Route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
}

/**
 * Mocks GET /api/properties/by-slug/:slug → returns property with airbnbUrl (Fase 1)
 */
export async function mockPropertyDetailFase1(page: Page) {
  await page.route(`**/api/properties/by-slug/${BOOKING_TEST_PROPERTY.slug}**`, (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildPropertyDetail({ airbnbUrl: BOOKING_TEST_PROPERTY.airbnbUrl })),
    });
  });
}

/**
 * Mocks GET /api/properties/by-slug/:slug → returns property WITHOUT airbnbUrl (Fase 2)
 */
export async function mockPropertyDetailFase2(page: Page) {
  await page.route(`**/api/properties/by-slug/${BOOKING_TEST_PROPERTY_FASE2.slug}**`, (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildPropertyDetail({ slug: BOOKING_TEST_PROPERTY_FASE2.slug, airbnbUrl: undefined })),
    });
  });
}

/**
 * Mocks GET /api/payment-methods → returns one active payment method
 * (needed so booking is enabled for the property owner)
 */
export async function mockHostHasPaymentMethod(page: Page) {
  await page.route('**/api/payment-methods**', (route: Route) => {
    if (route.request().method() !== 'GET') { route.continue(); return; }
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'pm_mock_host',
          brand: 'visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2030,
          status: 'ACTIVE',
          isDefault: true,
        },
      ]),
    });
  });
}

/**
 * Mocks Stripe.js CDN + overrides window.Stripe so createPaymentMethod()
 * resolves immediately with a fake PaymentMethod — no real Stripe calls.
 *
 * Call BEFORE page.goto() (uses addInitScript).
 */
export async function mockStripeJs(page: Page) {
  // Block the Stripe.js CDN script so it doesn't override our stub
  await page.route('https://js.stripe.com/**', (route: Route) => {
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });

  // Inject a minimal Stripe stub before any page code runs
  await page.addInitScript(() => {
    const fakeCardElement = {
      mount: () => {},
      unmount: () => {},
      destroy: () => {},
      on: () => fakeCardElement,
      update: () => {},
    };
    const fakeElements = {
      create: (_type: string) => fakeCardElement,
      getElement: (_type: string) => fakeCardElement,
    };

    (window as unknown as Record<string, unknown>).Stripe = (_key: string) => ({
      elements: () => fakeElements,
      createPaymentMethod: (_opts: unknown) =>
        Promise.resolve({
          paymentMethod: { id: 'pm_test_mock_4242' },
          error: null,
        }),
      confirmCardPayment: (_secret: string) =>
        Promise.resolve({
          paymentIntent: { id: 'pi_test_mock', status: 'requires_capture' },
          error: null,
        }),
    });
  });
}

// ─── Host-flow Mocks ─────────────────────────────────────────────────────────

/** Shared REQUEST-status booking used in host flow mocks */
const HOST_BOOKING_MOCK = {
  id: 999,
  referralLinkId: 42,
  propertyId: BOOKING_TEST_PROPERTY.id,
  checkInDate: '2026-06-10',
  checkOutDate: '2026-06-13',
  numberOfNights: 3,
  guestName: GUEST_DATA.name,
  guestEmail: GUEST_DATA.email,
  guestPhone: GUEST_DATA.phone,
  guestsCount: Number(GUEST_DATA.guestsCount),
  airbnbConfirmationCode: null,
  totalAmount: 330,
  currency: 'USD',
  status: 'REQUEST',
  statusHistory: [],
  reservedAt: null,
  startedAt: null,
  finishedAt: null,
  cancelledAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rejectionReason: null,
  stripeBookingIntentId: null,
  stripeDepositIntentId: null,
  depositAmount: null,
  depositCurrency: null,
  depositCapturedAt: null,
  depositCaptureAmount: null,
  paymentReleasedAt: null,
};

/**
 * Intercepts GET /api/v1/bookings/host → returns one booking in REQUEST status
 */
export async function mockHostBookingsWithPending(page: Page) {
  await page.route('**/api/v1/bookings/host**', (route: Route) => {
    if (route.request().method() !== 'GET') { route.continue(); return; }
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([HOST_BOOKING_MOCK]),
    });
  });
}

/**
 * Intercepts GET /api/v1/bookings/host → returns one booking in RESERVED status
 * (use after confirm to simulate list refresh)
 */
export async function mockHostBookingsWithReserved(page: Page) {
  await page.route('**/api/v1/bookings/host**', (route: Route) => {
    if (route.request().method() !== 'GET') { route.continue(); return; }
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ ...HOST_BOOKING_MOCK, status: 'RESERVED', reservedAt: new Date().toISOString() }]),
    });
  });
}

/**
 * Intercepts GET /api/v1/bookings/host → returns one booking in CANCELLED status
 * (use after reject to simulate list refresh)
 */
export async function mockHostBookingsWithCancelled(page: Page) {
  await page.route('**/api/v1/bookings/host**', (route: Route) => {
    if (route.request().method() !== 'GET') { route.continue(); return; }
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        ...HOST_BOOKING_MOCK,
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        rejectionReason: 'Las fechas no están disponibles por mantenimiento',
      }]),
    });
  });
}

/**
 * Intercepts PUT /api/v1/bookings/:id/confirm → returns BookingDto with RESERVED status
 */
export async function mockConfirmBookingSuccess(page: Page) {
  await page.route('**/api/v1/bookings/*/confirm', (route: Route) => {
    if (route.request().method() !== 'PUT') { route.continue(); return; }
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...HOST_BOOKING_MOCK, status: 'RESERVED', reservedAt: new Date().toISOString() }),
    });
  });
}

/**
 * Intercepts PUT /api/v1/bookings/:id/reject → returns BookingDto with CANCELLED status
 */
export async function mockRejectBookingSuccess(page: Page, reason = 'Las fechas no están disponibles por mantenimiento') {
  await page.route('**/api/v1/bookings/*/reject', (route: Route) => {
    if (route.request().method() !== 'PUT') { route.continue(); return; }
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...HOST_BOOKING_MOCK,
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        rejectionReason: reason,
      }),
    });
  });
}

// ─── Calendar Mocks ───────────────────────────────────────────────────────────

/**
 * Intercepts POST /api/v1/properties/:id/calendar → returns 204 (block dates success)
 */
export async function mockBlockDatesSuccess(page: Page) {
  await page.route('**/api/v1/properties/*/calendar', (route: Route) => {
    if (route.request().method() !== 'POST') { route.continue(); return; }
    route.fulfill({ status: 204, body: '' });
  });
}

/**
 * Intercepts DELETE /api/v1/properties/:id/calendar/:date → returns 204 (unblock success)
 */
export async function mockUnblockDateSuccess(page: Page) {
  await page.route('**/api/v1/properties/*/calendar/*', (route: Route) => {
    if (route.request().method() !== 'DELETE') { route.continue(); return; }
    route.fulfill({ status: 204, body: '' });
  });
}

/**
 * Intercepts GET /api/v1/properties/:id/calendar → returns some blocked dates (host calendar)
 */
export async function mockCalendarWithBlockedDates(page: Page, dates: string[]) {
  await page.route('**/api/v1/properties/*/calendar**', (route: Route) => {
    if (route.request().method() !== 'GET') { route.continue(); return; }
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(dates) });
  });
}

/**
 * Intercepts GET /api/v1/bookings/host/stats → returns empty stats
 */
export async function mockHostBookingStats(page: Page) {
  await page.route('**/api/v1/bookings/host/stats**', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalBookings: 1, activeBookings: 0, totalRevenue: 0, currency: 'USD' }),
    });
  });
}

/**
 * Intercepts GET /api/v1/properties/:id/calendar → returns specific blocked dates
 */
export async function mockBlockedDates(page: Page, dates: string[]) {
  await page.route('**/api/v1/properties/*/calendar**', (route: Route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(dates) });
  });
}

/**
 * Intercepts GET /api/v1/referrals/public/system-link/:propertyId
 */
export async function mockSystemReferralLink(page: Page, referralLinkId = BOOKING_TEST_REFERRAL_LINK_ID) {
  await page.route('**/api/v1/referrals/public/system-link/**', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ referralLinkId: Number(referralLinkId) }),
    });
  });
}

/**
 * Intercepts POST /api/public/bookings → returns 201 with BookingDto
 */
export async function mockCreateBookingSuccess(
  page: Page,
  overrides: Partial<BookingDtoMock> = {}
) {
  await page.route('**/api/public/bookings', (route: Route) => {
    if (route.request().method() !== 'POST') { route.continue(); return; }
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 999,
        referralLinkId: 42,
        propertyId: BOOKING_TEST_PROPERTY.id,
        checkInDate: '2026-06-10',
        checkOutDate: '2026-06-13',
        numberOfNights: 3,
        guestName: GUEST_DATA.name,
        guestEmail: GUEST_DATA.email,
        guestPhone: GUEST_DATA.phone,
        guestsCount: 2,
        airbnbConfirmationCode: null,
        totalAmount: null,
        currency: 'USD',
        status: 'REQUEST',
        statusHistory: [],
        reservedAt: null,
        startedAt: null,
        finishedAt: null,
        cancelledAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rejectionReason: null,
        stripeBookingIntentId: null,
        stripeDepositIntentId: null,
        depositAmount: null,
        depositCurrency: null,
        depositCapturedAt: null,
        depositCaptureAmount: null,
        paymentReleasedAt: null,
        ...overrides,
      }),
    });
  });
}

/**
 * Intercepts POST /api/public/bookings → returns 409 conflict
 */
export async function mockCreateBookingConflict(page: Page) {
  await page.route('**/api/public/bookings', (route: Route) => {
    if (route.request().method() !== 'POST') { route.continue(); return; }
    route.fulfill({
      status: 409,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Las fechas seleccionadas no están disponibles' }),
    });
  });
}

/**
 * Intercepts POST /api/v1/bookings/:id/payment → returns 204
 */
export async function mockCreatePaymentSuccess(page: Page) {
  await page.route('**/api/v1/bookings/*/payment', (route: Route) => {
    if (route.request().method() !== 'POST') { route.continue(); return; }
    route.fulfill({ status: 204, body: '' });
  });
}

// ─── UI Helpers ──────────────────────────────────────────────────────────────

/**
 * Navigates to the property detail page with a referral link
 */
export async function gotoPropertyPage(
  page: Page,
  slug = BOOKING_TEST_PROPERTY.slug,
  refId = BOOKING_TEST_REFERRAL_LINK_ID
) {
  await page.goto(`/propiedades/${slug}?ref=${refId}`);
  await page.waitForLoadState('networkidle');
}

/**
 * Clicks "Verificar Disponibilidad" and waits for modal to open
 */
export async function openBookingModal(page: Page) {
  await page.click('button:has-text("Verificar Disponibilidad")');
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
}

/**
 * Selects check-in and check-out dates in the BookingCalendar (DayPicker range)
 * Clicks two different days in the calendar.
 * @param checkInOffset days from today for check-in
 * @param checkOutOffset days from today for check-out
 */
export async function selectBookingDates(
  page: Page,
  checkInOffset = 10,
  checkOutOffset = 13
) {
  const checkIn = daysFromNow(checkInOffset);
  const checkOut = daysFromNow(checkOutOffset);

  // DayPicker renders day buttons with aria-label = "day month year"
  const checkInLabel = formatDateLabel(checkIn);
  const checkOutLabel = formatDateLabel(checkOut);

  await page.click(`button[aria-label="${checkInLabel}"]`);
  await page.click(`button[aria-label="${checkOutLabel}"]`);
}

/**
 * Fills the guest info form fields in Step 1
 */
export async function fillGuestInfo(page: Page, data = GUEST_DATA) {
  await page.fill('input[placeholder*="Juan"], input[name="guestName"]', data.name);
  await page.fill('input[type="email"]', data.email);
  // PhoneInput renders an input inside the component
  await page.fill('input[type="tel"], .PhoneInputInput', data.phone);
  await page.fill('input[type="number"]', data.guestsCount);
}

/**
 * Checks the T&C checkbox in Step 1
 */
export async function acceptTerms(page: Page) {
  await page.check('#terms');
}

/**
 * Clicks "Siguiente" to advance from Step 1 to Step 2
 */
export async function clickSiguiente(page: Page) {
  await page.click('button:has-text("Siguiente")');
  // Wait for Step 2 to appear
  await page.waitForSelector('text=Confirmar reserva y pago', { timeout: 5000 });
}

/**
 * Fills Stripe CardElement inside its iframe
 */
export async function fillStripeCard(page: Page, card = STRIPE_TEST_CARD) {
  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
  await stripeFrame.locator('[name="cardnumber"]').fill(card.number);
  await stripeFrame.locator('[name="exp-date"]').fill(card.expiry);
  await stripeFrame.locator('[name="cvc"]').fill(card.cvc);
  await stripeFrame.locator('[name="postal"]').fill(card.zip);
}

/**
 * Clicks "Confirmar reserva" in Step 2
 */
export async function clickConfirmarReserva(page: Page) {
  await page.click('button:has-text("Confirmar reserva")');
}

/**
 * Waits for sonner toast with given text
 */
export async function waitForToast(page: Page, text: string | RegExp, timeout = 10000) {
  await page.waitForSelector(`[data-sonner-toast], li[data-type]`, { timeout });
  await page.waitForFunction(
    (t) => {
      const toasts = document.querySelectorAll('[data-sonner-toast]');
      return Array.from(toasts).some((el) =>
        typeof t === 'string' ? el.textContent?.includes(t) : new RegExp(t).test(el.textContent ?? '')
      );
    },
    text instanceof RegExp ? text.source : text,
    { timeout }
  );
}

// ─── Date utilities ──────────────────────────────────────────────────────────

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateLabel(date: Date): string {
  // DayPicker aria-label format: "15 de junio de 2026"
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Property builder ─────────────────────────────────────────────────────────

function buildPropertyDetail(overrides: { slug?: string; airbnbUrl?: string } = {}) {
  return {
    id: String(BOOKING_TEST_PROPERTY.id),
    hostId: String(BOOKING_TEST_PROPERTY.hostId),
    title: overrides.slug ? 'Propiedad E2E Test Fase 2' : BOOKING_TEST_PROPERTY.title,
    slug: overrides.slug ?? BOOKING_TEST_PROPERTY.slug,
    description: 'Property for E2E testing',
    pricePerNight: BOOKING_TEST_PROPERTY.pricePerNight,
    currency: BOOKING_TEST_PROPERTY.currency,
    country: 'CO',
    city: 'Bogotá',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    propertyType: 'APARTMENT',
    listingType: 'SHORT_TERM_RENTAL',
    status: 'PUBLISHED',
    imageCount: 0,
    videoCount: 0,
    location: { address: 'Test Address', city: 'Bogotá', country: 'CO' },
    amenities: [],
    specs: { bedrooms: 2, bathrooms: 1, maxGuests: 4 },
    images: [],
    videos: [],
    updatedAt: new Date().toISOString(),
    ...(overrides.airbnbUrl !== undefined ? { airbnbUrl: overrides.airbnbUrl } : {}),
  };
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookingDtoMock {
  id: number;
  referralLinkId: number;
  propertyId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestsCount: number;
  totalAmount: number | null;
  currency: string;
  status: string;
}
