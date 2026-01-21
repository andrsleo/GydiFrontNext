# E2E Tests - GYDI 2.0 Frontend

End-to-End tests para el frontend de GYDI 2.0 usando Playwright.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecutar Tests](#ejecutar-tests)
- [Estructura de Tests](#estructura-de-tests)
- [Test Suites](#test-suites)
- [Helpers](#helpers)
- [Configuración](#configuración)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)

## 🔧 Requisitos Previos

- Node.js 20 LTS
- Backend ejecutándose en `http://localhost:8080`
- Frontend ejecutándose en `http://localhost:3000`
- Datos de prueba configurados en la base de datos

### Usuarios de Prueba Requeridos

Los tests requieren que existan los siguientes usuarios en la base de datos:

```typescript
// Affiliate User (para tests de suscripción)
{
  email: 'affiliate@test.com',
  password: 'Test123!',
  role: 'AFFILIATE'
}

// Admin User (para tests administrativos)
{
  email: 'admin@test.com',
  password: 'Admin123!',
  role: 'ADMIN'
}

// Host User (para tests de propiedades)
{
  email: 'host@test.com',
  password: 'Host123!',
  role: 'HOST'
}
```

## 📦 Instalación

Los navegadores de Playwright se instalan automáticamente:

```bash
# Instalar dependencias
npm install

# Instalar navegadores de Playwright (si no se instalaron automáticamente)
npx playwright install
```

## 🚀 Ejecutar Tests

### Todos los tests

```bash
npm run test:e2e
```

### Tests específicos

```bash
# Solo tests de delete payment method
npx playwright test delete-payment-method

# Solo tests de set default payment method
npx playwright test set-default-payment-method

# Solo tests de subscription page
npx playwright test subscription-page
```

### Modo interactivo (con UI)

```bash
npx playwright test --ui
```

### Modo debug

```bash
npx playwright test --debug
```

### Un solo navegador

```bash
# Solo Chrome
npx playwright test --project=chromium

# Solo Firefox
npx playwright test --project=firefox

# Solo Safari
npx playwright test --project=webkit

# Solo Mobile Chrome
npx playwright test --project="Mobile Chrome"
```

### Con headed mode (ver el navegador)

```bash
npx playwright test --headed
```

## 📁 Estructura de Tests

```
tests/e2e/
├── README.md                          # Este archivo
├── helpers/                           # Funciones auxiliares
│   ├── auth.helper.ts                # Login, logout, autenticación
│   └── subscription.helper.ts        # Interacciones con página de suscripción
│
├── delete-payment-method.spec.ts     # Tests de eliminación de métodos de pago
├── set-default-payment-method.spec.ts # Tests de establecer método default
└── subscription-page.spec.ts         # Tests generales de la página
```

## 🧪 Test Suites

### 1. Delete Payment Method (`delete-payment-method.spec.ts`)

**Cobertura: 20 test cases**

- ✅ Happy Path (2 tests)
  - Eliminación exitosa de método no-default
  - Cancelar eliminación

- ✅ Business Rules - Paid Subscription (2 tests)
  - Prevenir eliminación del único método en plan pagado
  - Permitir eliminación del único método en plan FREE

- ✅ Business Rules - Default Method (2 tests)
  - Prevenir eliminación de método default con otros presentes
  - Permitir eliminación de método default cuando es el único

- ✅ Error Handling (3 tests)
  - Network errors
  - Server errors (500)
  - Unauthorized errors (401)

- ✅ UI/UX Validation (3 tests)
  - Disable button durante eliminación
  - Loading state
  - Cierre de dialog después de éxito

- ✅ Accessibility (2 tests)
  - Navegación con teclado
  - ARIA labels

- ✅ Mobile Responsiveness (1 test)
  - Viewport móvil (iPhone SE)

### 2. Set Default Payment Method (`set-default-payment-method.spec.ts`)

**Cobertura: 14 test cases**

- ✅ Happy Path (2 tests)
  - Establecer método no-default como default
  - Remover badge de método default anterior

- ✅ Edge Cases (2 tests)
  - Clic en método ya default
  - Validar solo un método default a la vez

- ✅ Error Handling (2 tests)
  - Network errors
  - Server errors (500)

- ✅ UI/UX Validation (3 tests)
  - Disable button durante operación
  - Loading state
  - Update inmediato de UI

- ✅ Optimistic UI Updates (1 test)
  - Update optimista antes de respuesta del servidor

- ✅ Multiple Rapid Clicks (1 test)
  - Manejo de clics rápidos consecutivos

### 3. Subscription Page (`subscription-page.spec.ts`)

**Cobertura: 30+ test cases**

- ✅ Page Load & Structure (4 tests)
- ✅ Payment Method Cards (4 tests)
- ✅ Subscription Actions (3 tests)
- ✅ Billing Information (2 tests)
- ✅ Responsive Design (3 tests)
- ✅ Loading States (2 tests)
- ✅ Error States (2 tests)
- ✅ Navigation (2 tests)
- ✅ Performance (2 tests)

## 🛠 Helpers

### Auth Helper (`helpers/auth.helper.ts`)

Funciones para autenticación:

```typescript
// Login
await login(page, TEST_USERS.affiliate);

// Logout
await logout(page);

// Check if logged in
const loggedIn = await isLoggedIn(page);
```

### Subscription Helper (`helpers/subscription.helper.ts`)

Funciones para interacciones con página de suscripción:

```typescript
// Navegar a página
await gotoSubscriptionPage(page);

// Obtener plan actual
const plan = await getCurrentPlan(page);

// Contar métodos de pago
const count = await getPaymentMethodCount(page);

// Eliminar método
await clickDeletePaymentMethod(page, '5555');
await confirmDeleteDialog(page);

// Establecer como default
await clickSetDefaultPaymentMethod(page, '4242');

// Esperar notificaciones
await waitForSuccessToast(page, 'Success message');
await waitForErrorToast(page, 'Error message');
```

## ⚙️ Configuración

### Environment Variables

Crear `.env.test` (opcional):

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Playwright Config

Ver `playwright.config.ts` para configuración completa:

- **Timeout**: 30s para navegación
- **Retries**: 2 en CI, 0 en local
- **Workers**: 1 en CI, paralelo en local
- **Screenshots**: Solo en fallos
- **Video**: Solo en fallos
- **Trace**: En primer retry

## 🔄 CI/CD

### GitHub Actions Example

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 🐛 Troubleshooting

### Tests fallan con timeout

```bash
# Aumentar timeout en playwright.config.ts
use: {
  actionTimeout: 30000,
  navigationTimeout: 60000,
}
```

### Backend no está disponible

```bash
# Verificar que el backend está corriendo
curl http://localhost:8080/actuator/health

# Iniciar backend
cd ../GydiMicroservices
./mvnw spring-boot:run
```

### Frontend no está disponible

```bash
# Verificar que el frontend está corriendo
curl http://localhost:3000

# Iniciar frontend
npm run dev
```

### Usuarios de prueba no existen

Ejecutar script de seed (si existe) o crear usuarios manualmente en la base de datos.

### Tests pasan localmente pero fallan en CI

- Verificar variables de entorno en CI
- Verificar timeouts (CI suele ser más lento)
- Verificar datos de prueba en base de datos de CI
- Revisar logs de CI para errores específicos

### Navegadores no instalados

```bash
# Reinstalar navegadores
npx playwright install --with-deps
```

### Problemas con permisos (Linux/macOS)

```bash
# Dar permisos de ejecución
chmod +x node_modules/.bin/playwright
```

## 📊 Test Reports

### HTML Report

Después de ejecutar tests:

```bash
npx playwright show-report
```

### JSON Report

Ver resultados en `test-results/results.json`

### Screenshots y Videos

- **Screenshots**: `test-results/` (solo en fallos)
- **Videos**: `test-results/` (solo en fallos)
- **Traces**: Ver con `npx playwright show-trace <trace-file>`

## 🎯 Best Practices

1. **Data Test IDs**: Usar `data-testid` para selectores estables
2. **Page Objects**: Usar helpers para encapsular lógica
3. **Wait Strategies**: Usar `waitForSelector` en lugar de `waitForTimeout`
4. **Cleanup**: Cada test debe ser independiente
5. **Assertions**: Usar `expect()` de Playwright, no AssertJ
6. **Screenshots**: Capturar en fallos para debugging
7. **Parallelization**: Tests deben poder ejecutarse en paralelo

## 📚 Recursos

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Test Generator](https://playwright.dev/docs/codegen)
- [Playwright Inspector](https://playwright.dev/docs/inspector)

## 📝 Notas

- Los tests asumen que el backend tiene datos de prueba configurados
- Algunos tests pueden estar marcados como `.skip()` si requieren setup específico
- Los tests de mobile usan viewports de iPhone 12 y Pixel 5
- Los tests están diseñados para ejecutarse contra ambiente de desarrollo local

---

**Última actualización**: Enero 2026
**Versión**: 1.0.0
**Framework**: Playwright Test
