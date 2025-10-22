# 🏠 GYDI Frontend - Next.js 15

Frontend moderno para GYDI 2.0, plataforma de afiliados para propiedades vacacionales.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 15.1+ (App Router)
- **React:** React 19
- **TypeScript:** 5.8+
- **Styling:** TailwindCSS 4 + shadcn/ui
- **State Management:**
  - TanStack Query v5 (server state)
  - Zustand (client state)
- **Forms:** React Hook Form + Zod
- **Auth:** NextAuth.js v5
- **Testing:**
  - Vitest (unit tests)
  - Playwright (E2E tests)
  - React Testing Library

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Páginas públicas (/, /propiedades)
│   ├── (auth)/            # Autenticación (/login, /register)
│   ├── (dashboard)/       # Área protegida (/dashboard/*)
│   └── api/               # API Routes (BFF pattern)
│
├── features/              # Bounded Contexts
│   ├── auth/             # Autenticación
│   ├── properties/       # Propiedades
│   ├── referrals/        # Sistema de referidos
│   ├── subscriptions/    # Suscripciones y ganancias
│   ├── dashboard/        # Dashboard stats
│   └── admin/            # Administración
│
├── components/            # Atomic Design
│   ├── ui/               # Atoms (shadcn/ui)
│   ├── shared/           # Molecules
│   └── layout/           # Organisms
│
├── lib/                   # Utilidades
│   ├── api/              # API client
│   ├── auth/             # NextAuth config
│   ├── utils/            # Helpers
│   └── constants/        # Constants
│
├── hooks/                 # Global hooks
├── store/                 # Zustand stores
├── types/                 # Global types
└── middleware.ts          # Auth middleware
```

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para más detalles.

## 🎯 Bounded Contexts

### 1. Auth - Autenticación
- Login, registro, gestión de sesión
- NextAuth.js con JWT
- Protected routes con middleware

### 2. Properties - Propiedades
- Catálogo de propiedades vacacionales
- Búsqueda y filtros
- ISR para listado, SSR para detalle

### 3. Referrals - Sistema de Referidos
- Generación de links únicos
- QR codes para compartir
- Tracking de clicks y conversiones
- Estadísticas en tiempo real

### 4. Subscriptions - Suscripciones y Ganancias ⭐ NUEVO
- **3 planes de suscripción:**
  - **Basic** (Gratis): 2% de comisión, 10 referidos/mes
  - **Pro** ($29/mes): 5% de comisión, 50 referidos/mes
  - **Plus** ($99/mes): 15% de comisión, ilimitado
- Dashboard de ganancias
- Historial de earnings
- Gráficos y analytics

### 5. Dashboard - Vista General
- Stats cards (clicks, conversiones, ganancias)
- Actividad reciente
- Quick actions

### 6. Admin - Administración
- Gestión de usuarios
- Aprobación de propiedades
- Reportes y analytics

## 🏗️ Principios Arquitectónicos

1. **Server Components First**
   - Maximizar uso de Server Components
   - Client Components solo cuando necesario (interactividad)

2. **Feature-Based Organization**
   - Organizado por bounded contexts
   - Cada feature es auto-contenida

3. **Progressive Disclosure**
   - Cargar datos bajo demanda
   - Optimización de rendimiento

4. **Type Safety**
   - TypeScript estricto
   - Sin `any`

5. **Atomic Design**
   - Atoms → Molecules → Organisms → Templates

## 🚦 Getting Started

### Prerrequisitos

- Node.js 20 LTS
- npm o pnpm
- Backend corriendo en `http://localhost:8080`

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local

# Editar .env.local con tus valores
```

### Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Build para Producción

```bash
npm run build
npm run start
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter (ESLint)
npm run type-check   # Verificar tipos TypeScript
npm run format       # Formatear código (Prettier)
npm run test         # Tests unitarios (Vitest)
npm run test:e2e     # Tests E2E (Playwright)
```

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm run test

# Con coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

### E2E Tests (Playwright)

```bash
npm run test:e2e

# Solo Chrome
npm run test:e2e -- --project=chromium

# UI mode
npm run test:e2e -- --ui
```

## 📚 Convenciones de Código

### Naming

- **Components:** PascalCase (`PropertyCard.tsx`)
- **Hooks:** camelCase con `use` prefix (`use-properties.ts`)
- **Types:** PascalCase (`SubscriptionPlan`)
- **Constants:** UPPER_SNAKE_CASE (`COMMISSION_RATES`)
- **Files:** kebab-case (`property-card.tsx`)

### Import Order

```typescript
// 1. React
import { useState } from 'react';

// 2. Next.js
import Link from 'next/link';

// 3. External libraries
import { useQuery } from '@tanstack/react-query';

// 4. Internal - Components
import { Button } from '@/components/ui/button';

// 5. Internal - Hooks/Utils
import { useProperties } from '@/features/properties/hooks/use-properties';

// 6. Types
import type { Property } from '@/features/properties/types';
```

### Server vs Client Components

```typescript
// ✅ Server Component (por defecto)
export default async function Page() {
  const data = await fetchData(); // Server-side
  return <div>{data}</div>;
}

// ❌ Client Component (solo cuando necesario)
'use client';

export function Interactive() {
  const [state, setState] = useState();
  return <button onClick={() => setState()}>Click</button>;
}
```

## 🎨 UI Components (shadcn/ui)

Usamos [shadcn/ui](https://ui.shadcn.com/) para componentes base.

### Agregar Componentes

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Los componentes se instalan en `src/components/ui/`.

## 📊 Sistema de Comisiones

### Planes de Suscripción

| Plan      | Comisión | Precio/mes | Límite Referidos |
|-----------|----------|------------|------------------|
| **Basic** | 2%       | Gratis     | 10/mes           |
| **Pro**   | 5%       | $29        | 50/mes           |
| **Plus**  | 15%      | $99        | Ilimitado        |

### Ejemplo de Cálculo

```typescript
import { getCommissionAmount, SUBSCRIPTION_PLANS } from '@/lib/constants/plans';

// Usuario con plan PRO (5%) refiere una suscripción de $100
const earning = getCommissionAmount(SUBSCRIPTION_PLANS.PRO, 100);
console.log(earning); // 5
```

## 🔐 Autenticación

### NextAuth.js v5

```typescript
import { auth } from '@/lib/auth/auth-config';

// En Server Component
export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <div>Hello {session.user.name}</div>;
}

// En Client Component
import { useSession } from 'next-auth/react';

export function Component() {
  const { data: session } = useSession();
  // ...
}
```

### Protected Routes

Protegidos automáticamente por `middleware.ts`:
- `/dashboard/*` - Requiere autenticación
- `/admin/*` - Requiere rol ADMIN

## 📖 Recursos

- [Documentación de Arquitectura](./ARCHITECTURE.md)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contribuir

1. Crear branch: `git checkout -b feature/nueva-feature`
2. Commit cambios: `git commit -m 'Add nueva feature'`
3. Push: `git push origin feature/nueva-feature`
4. Crear Pull Request

## 📄 Licencia

Propiedad de GYDI - Todos los derechos reservados

---

**Última actualización:** Octubre 2025
**Versión:** 2.0
**Stack:** Next.js 15 + React 19 + TypeScript