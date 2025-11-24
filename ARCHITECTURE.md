# 🏗️ Arquitectura Frontend GYDI 2.0

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Bounded Contexts](#bounded-contexts)
4. [Atomic Design Pattern](#atomic-design-pattern)
5. [Server vs Client Components](#server-vs-client-components)
6. [Convenciones de Código](#convenciones-de-código)

---

## 🎯 Visión General

Frontend de GYDI 2.0 construido con **Next.js 15** (App Router), **React 19** y **TypeScript**, siguiendo arquitectura basada en **bounded contexts** y **Atomic Design**.

### Principios Arquitectónicos

1. **Feature-Based Organization** - Organización por bounded contexts (no por tipo de archivo)
2. **Server Components First** - Maximizar uso de Server Components, Client solo cuando necesario
3. **Progressive Disclosure** - Cargar datos bajo demanda, no todo de entrada
4. **Type Safety** - TypeScript estricto, sin `any`
5. **Atomic Design** - Componentes organizados en: Atoms → Molecules → Organisms → Templates

---

## 📁 Estructura de Directorios

```
gydi-nextjs/
├── src/                              # ← NUEVO: Todo el código va aquí
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Route group - páginas públicas
│   │   │   ├── page.tsx              # Homepage (/)
│   │   │   ├── layout.tsx            # Layout público
│   │   │   └── propiedades/
│   │   │       ├── page.tsx          # /propiedades (ISR)
│   │   │       └── [id]/
│   │   │           └── page.tsx      # /propiedades/[id] (SSR)
│   │   │
│   │   ├── (auth)/                   # Route group - autenticación
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # /login
│   │   │   ├── register/
│   │   │   │   └── page.tsx          # /register
│   │   │   └── layout.tsx            # Layout de auth
│   │   │
│   │   ├── (dashboard)/              # Route group - área protegida
│   │   │   ├── dashboard/            # /dashboard
│   │   │   │   ├── page.tsx          # Dashboard principal (SSR)
│   │   │   │   ├── referidos/
│   │   │   │   │   └── page.tsx      # /dashboard/referidos
│   │   │   │   ├── suscripcion/      # ← NUEVO
│   │   │   │   │   └── page.tsx      # /dashboard/suscripcion
│   │   │   │   ├── ganancias/        # ← RENOMBRADO (era comisiones)
│   │   │   │   │   └── page.tsx      # /dashboard/ganancias
│   │   │   │   └── configuracion/
│   │   │   │       └── page.tsx      # /dashboard/configuracion
│   │   │   │
│   │   │   ├── admin/                # /admin (solo ADMIN role)
│   │   │   │   ├── usuarios/
│   │   │   │   ├── propiedades/
│   │   │   │   └── reportes/
│   │   │   │
│   │   │   └── layout.tsx            # Layout dashboard
│   │   │
│   │   ├── api/                      # API Routes (BFF pattern)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts      # NextAuth handler
│   │   │   ├── properties/
│   │   │   │   └── route.ts          # Proxy a backend
│   │   │   ├── referrals/
│   │   │   │   └── route.ts
│   │   │   └── subscriptions/        # ← NUEVO
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Estilos globales
│   │   ├── providers.tsx             # React Query, Auth, Zustand
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── features/                     # ← BOUNDED CONTEXTS
│   │   ├── auth/                     # Autenticación y autorización
│   │   │   ├── components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   └── auth-provider.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-login.ts
│   │   │   │   ├── use-register.ts
│   │   │   │   └── use-session.ts
│   │   │   ├── schemas/
│   │   │   │   ├── login.schema.ts
│   │   │   │   └── register.schema.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── api/
│   │   │       └── auth.api.ts       # Llamadas a backend
│   │   │
│   │   ├── properties/               # Propiedades vacacionales
│   │   │   ├── components/
│   │   │   │   ├── property-card.tsx
│   │   │   │   ├── property-detail.tsx
│   │   │   │   ├── property-filters.tsx
│   │   │   │   ├── property-list.tsx
│   │   │   │   └── property-search.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-properties.ts
│   │   │   │   ├── use-property-detail.ts
│   │   │   │   └── use-property-filters.ts
│   │   │   ├── schemas/
│   │   │   │   └── property.schema.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── api/
│   │   │       └── properties.api.ts
│   │   │
│   │   ├── referrals/                # Sistema de referidos
│   │   │   ├── components/
│   │   │   │   ├── referral-link-generator.tsx
│   │   │   │   ├── referral-stats-card.tsx
│   │   │   │   ├── referral-qr-code.tsx
│   │   │   │   └── referral-history-table.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-generate-referral.ts
│   │   │   │   ├── use-referral-stats.ts
│   │   │   │   └── use-referral-history.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── api/
│   │   │       └── referrals.api.ts
│   │   │
│   │   ├── subscriptions/            # ← NUEVO: Suscripciones y ganancias
│   │   │   ├── components/
│   │   │   │   ├── subscription-card.tsx        # Mostrar plan actual
│   │   │   │   ├── subscription-plans.tsx       # Planes: Basic, Pro, Plus
│   │   │   │   ├── upgrade-modal.tsx            # Modal para upgrade
│   │   │   │   ├── earnings-summary.tsx         # Resumen de ganancias
│   │   │   │   ├── earnings-chart.tsx           # Gráfico de ganancias
│   │   │   │   └── earnings-table.tsx           # Tabla de ganancias
│   │   │   ├── hooks/
│   │   │   │   ├── use-subscription.ts          # Current subscription
│   │   │   │   ├── use-upgrade-plan.ts          # Upgrade a plan superior
│   │   │   │   ├── use-earnings.ts              # Earnings history
│   │   │   │   └── use-earnings-stats.ts        # Estadísticas
│   │   │   ├── schemas/
│   │   │   │   └── subscription.schema.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   │       # SubscriptionPlan: BASIC | PRO | PLUS
│   │   │   │       # CommissionRate: 2% | 5% | 15%
│   │   │   └── api/
│   │   │       └── subscriptions.api.ts
│   │   │
│   │   ├── dashboard/                # Dashboard y stats
│   │   │   ├── components/
│   │   │   │   ├── stats-card.tsx
│   │   │   │   ├── recent-activity.tsx
│   │   │   │   ├── quick-actions.tsx
│   │   │   │   └── dashboard-header.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-dashboard-stats.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   │
│   │   └── admin/                    # Administración
│   │       ├── components/
│   │       │   ├── user-management-table.tsx
│   │       │   ├── property-approval-list.tsx
│   │       │   └── analytics-dashboard.tsx
│   │       ├── hooks/
│   │       │   ├── use-users.ts
│   │       │   └── use-analytics.ts
│   │       └── types/
│   │           └── index.ts
│   │
│   ├── components/                   # ← ATOMIC DESIGN
│   │   ├── ui/                       # Atoms (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ...                   # Más componentes shadcn
│   │   │
│   │   ├── shared/                   # Molecules (componentes compartidos)
│   │   │   ├── search-bar.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── file-uploader.tsx
│   │   │   ├── date-range-picker.tsx
│   │   │   ├── currency-input.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── loading-spinner.tsx
│   │   │
│   │   └── layout/                   # Organisms (layouts)
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       ├── sidebar.tsx
│   │       ├── mobile-nav.tsx
│   │       └── user-menu.tsx
│   │
│   ├── lib/                          # Utilidades y configuraciones
│   │   ├── api/
│   │   │   ├── client.ts             # Axios instance configurado
│   │   │   ├── endpoints.ts          # Endpoints del backend
│   │   │   └── types.ts              # Response types comunes
│   │   │
│   │   ├── auth/
│   │   │   ├── auth-config.ts        # NextAuth configuration
│   │   │   └── auth-options.ts       # Auth providers config
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                 # className utility
│   │   │   ├── format.ts             # Date/number formatters
│   │   │   ├── validators.ts         # Custom validators
│   │   │   └── constants.ts          # App constants
│   │   │
│   │   └── constants/
│   │       ├── routes.ts             # App routes
│   │       ├── plans.ts              # ← NUEVO: Subscription plans
│   │       └── query-keys.ts         # React Query keys
│   │
│   ├── hooks/                        # Global hooks
│   │   ├── use-media-query.ts
│   │   ├── use-disclosure.ts
│   │   ├── use-debounce.ts
│   │   └── use-copy-to-clipboard.ts
│   │
│   ├── store/                        # Zustand stores (client state)
│   │   ├── ui-store.ts               # Sidebar, theme, modals
│   │   └── filters-store.ts          # Search filters state
│   │
│   ├── types/                        # Global TypeScript types
│   │   ├── api.ts                    # API response types
│   │   ├── models.ts                 # Domain models
│   │   └── utils.ts                  # Utility types
│   │
│   └── middleware.ts                 # Next.js middleware
│
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/                            # ← NUEVO: Tests organizados
│   ├── unit/                         # Vitest tests
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── e2e/                          # Playwright tests
│       ├── auth.spec.ts
│       ├── properties.spec.ts
│       ├── referrals.spec.ts
│       └── subscriptions.spec.ts
│
├── .env.development
├── .env.production
├── .env.local.example              # ← NUEVO: Template para .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── vitest.config.ts                # ← NUEVO
├── playwright.config.ts            # ← NUEVO
├── ARCHITECTURE.md                 # Este archivo
└── README.md
```

---

## 🎯 Bounded Contexts

### 1. **auth/** - Autenticación y Autorización

**Responsabilidad:** Login, register, session management, protected routes

**Componentes clave:**
- `login-form.tsx` - Formulario de login con validación
- `register-form.tsx` - Formulario de registro
- `auth-provider.tsx` - Context provider

**Hooks:**
- `use-login()` - Mutation para login
- `use-register()` - Mutation para registro
- `use-session()` - Session state

### 2. **properties/** - Propiedades Vacacionales

**Responsabilidad:** Catálogo de propiedades, búsqueda, filtros

**Componentes clave:**
- `property-card.tsx` - Card de propiedad (Organism)
- `property-list.tsx` - Lista paginada (Template)
- `property-filters.tsx` - Filtros de búsqueda (Client Component)
- `property-detail.tsx` - Detalle completo

**Estrategia:**
- **ISR** para listado (`revalidate: 3600` - 1 hora)
- **SSR** para detalle (datos frescos)

### 3. **referrals/** - Sistema de Referidos

**Responsabilidad:** Generar links, QR codes, tracking, stats

**Componentes clave:**
- `referral-link-generator.tsx` - Generar link único (Client Component)
- `referral-qr-code.tsx` - QR code para compartir
- `referral-stats-card.tsx` - Estadísticas (clicks, conversiones)
- `referral-history-table.tsx` - Historial de referidos

**Hooks:**
- `use-generate-referral()` - Mutation para generar link
- `use-referral-stats()` - Query para stats
- `use-referral-history()` - Query para historial

### 4. **subscriptions/** - Suscripciones y Ganancias (NUEVO)

**Responsabilidad:** Gestión de planes, comisiones, earnings

**Planes de Suscripción:**

| Plan      | Comisión por Referido | Precio/mes | Features                    |
|-----------|----------------------|------------|-----------------------------|
| **Basic** | 2%                   | Gratis     | 10 referidos/mes, Link básico |
| **Pro**   | 5%                   | $29        | 50 referidos/mes, QR + Analytics |
| **Plus**  | 15%                  | $99        | Ilimitado, API access, White label |

**Componentes clave:**
- `subscription-plans.tsx` - Mostrar planes con pricing
- `subscription-card.tsx` - Plan actual del usuario
- `upgrade-modal.tsx` - Modal para upgrade
- `earnings-summary.tsx` - Resumen de ganancias totales
- `earnings-chart.tsx` - Gráfico de evolución
- `earnings-table.tsx` - Tabla detallada de earnings

**Hooks:**
- `use-subscription()` - Current plan del usuario
- `use-upgrade-plan()` - Mutation para upgrade
- `use-earnings()` - Query para earnings history
- `use-earnings-stats()` - Stats (total, este mes, pendiente)

**Types:**
```typescript
// src/features/subscriptions/types/index.ts
export type SubscriptionPlan = 'BASIC' | 'PRO' | 'PLUS';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  commissionRate: number; // 2, 5, or 15
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  autoRenew: boolean;
}

export interface Earning {
  id: string;
  userId: string;
  referralId: string;  
  amount: number;
  commissionRate: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: Date;
  paidAt?: Date;
}
```

### 5. **dashboard/** - Dashboard General

**Responsabilidad:** Vista general, stats, quick actions

**Componentes clave:**
- `stats-card.tsx` - Card de estadística (Molecule)
- `recent-activity.tsx` - Actividad reciente
- `quick-actions.tsx` - Acciones rápidas

### 6. **admin/** - Administración

**Responsabilidad:** Gestión de usuarios, propiedades, reportes

**Protección:** Middleware verifica `role === 'ADMIN'`

---

## ⚛️ Atomic Design Pattern

### Atoms (`components/ui/`)

Componentes básicos, no divisibles, reutilizables:
- `button.tsx`, `input.tsx`, `badge.tsx`
- Basados en **shadcn/ui**
- No tienen lógica de negocio
- Solo reciben props y renderean

### Molecules (`components/shared/`)

Combinación de atoms con lógica simple:
- `search-bar.tsx` - Input + Button
- `pagination.tsx` - Buttons + Text
- `date-range-picker.tsx` - Inputs + Calendar

### Organisms (`features/*/components/`)

Componentes complejos con lógica de negocio:
- `property-card.tsx` - Card + Image + Badge + Button
- `referral-link-generator.tsx` - Form + Button + Toast
- Usan hooks personalizados
- Pueden ser Server o Client Components

### Templates (`app/(group)/*/page.tsx`)

Páginas completas que componen organisms:
- `app/(public)/propiedades/page.tsx`
- `app/(dashboard)/dashboard/page.tsx`

---

## 🖥️ Server vs Client Components

### Server Components (por defecto)

✅ **Usar cuando:**
- Data fetching (async/await en servidor)
- Rendering estático
- No hay interactividad (onClick, onChange)
- No se usa state (useState, useContext)

📝 **Ejemplos:**
```tsx
// app/(public)/propiedades/page.tsx
export default async function PropertiesPage() {
  const properties = await fetchProperties(); // Server-side
  return <PropertyList properties={properties} />;
}
```

### Client Components ('use client')

✅ **Usar cuando:**
- Event handlers (onClick, onSubmit)
- Hooks (useState, useEffect, useQuery)
- Browser APIs (window, localStorage)
- Interactividad

📝 **Ejemplos:**
```tsx
// features/referrals/components/referral-link-generator.tsx
'use client';

export function ReferralLinkGenerator() {
  const [link, setLink] = useState('');
  const { mutate } = useGenerateReferral();

  const handleGenerate = () => {
    mutate();
  };

  return <button onClick={handleGenerate}>Generar</button>;
}
```

---

## 📐 Convenciones de Código

### Naming Conventions

```typescript
// Components: PascalCase
PropertyCard.tsx
ReferralLinkGenerator.tsx

// Hooks: camelCase con 'use' prefix
use-properties.ts
use-generate-referral.ts

// Types: PascalCase
SubscriptionPlan
Earning

// Constants: UPPER_SNAKE_CASE
const MAX_REFERRALS = 10;
const COMMISSION_RATES = { BASIC: 0.02, PRO: 0.05, PLUS: 0.15 };

// Files: kebab-case
property-card.tsx
subscription-plans.tsx
```

### Import Order

```typescript
// 1. React
import { useState } from 'react';

// 2. Next.js
import Link from 'next/link';
import Image from 'next/image';

// 3. External libraries
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 4. Internal - Components
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/features/properties/components/property-card';

// 5. Internal - Hooks/Utils
import { useProperties } from '@/features/properties/hooks/use-properties';
import { cn } from '@/lib/utils/cn';

// 6. Types
import type { Property } from '@/features/properties/types';
```

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### File Structure per Feature

```
features/subscriptions/
├── components/          # UI components
│   ├── subscription-card.tsx
│   └── earnings-table.tsx
├── hooks/              # Custom hooks (use-*)
│   ├── use-subscription.ts
│   └── use-earnings.ts
├── schemas/            # Zod validation schemas
│   └── subscription.schema.ts
├── types/              # TypeScript types
│   └── index.ts
└── api/                # API calls
    └── subscriptions.api.ts
```

---

## 🚀 Migration Plan (Estructura Actual → Nueva)

### Fase 1: Setup Básico
1. ✅ Crear carpeta `src/`
2. ✅ Mover `app/`, `components/`, `features/`, `lib/`, `hooks/`, `store/`, `types/` dentro de `src/`
3. ✅ Actualizar `tsconfig.json` con path aliases
4. ✅ Actualizar `next.config.ts` con `appDir: 'src/app'`

### Fase 2: Reorganización
1. ✅ Renombrar `(marketing)` → `(public)`
2. ✅ Crear bounded context `subscriptions/`
3. ✅ Mover componentes de "comisiones" → `subscriptions/earnings`
4. ✅ Reorganizar `components/` en `ui/`, `shared/`, `layout/`

### Fase 3: Implementación
1. ✅ Implementar tipos de `subscriptions/`
2. ✅ Crear componentes de plans y earnings
3. ✅ Implementar hooks y API calls
4. ✅ Crear páginas: `/dashboard/suscripcion`, `/dashboard/ganancias`

### Fase 4: Validación
1. ✅ Validar con AIArchitect (#9)
2. ✅ Validar con AICodeMentor (#10)
3. ✅ Tests unitarios (Vitest)
4. ✅ Tests E2E (Playwright)

---

## 📚 Referencias

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [GYDI Backend Architecture](../../GydiMicroservices/CLAUDE.md)

---

**Última actualización:** Octubre 2025
**Versión:** 2.0
**Autor:** Frontend_AI + AIArchitect
