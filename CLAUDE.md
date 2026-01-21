# CLAUDE.md - Frontend (Next.js 15)

This file provides frontend-specific guidance for the GYDI 2.0 project.

> **📘 For general project overview**, see [../CLAUDE.md](../CLAUDE.md)
> **📐 For detailed architecture**, see [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Frontend Overview

Modern React 19 + Next.js 15 application with Server Components, bounded contexts, and subscription-based commission system.

**Tech Stack:**
- Next.js 15.1+ (App Router)
- React 19 + TypeScript 5.8+
- TailwindCSS 4 + shadcn/ui
- TanStack Query v5 + Zustand
- Backend-only Authentication (JWT)
- Vitest + Playwright

**Port:** http://localhost:3000
**Backend API:** http://localhost:8080

---

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test              # Vitest (unit)
npm run test:e2e      # Playwright (E2E)

# Code quality
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run format        # Prettier
```

---

## Project Structure (src/)

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (/, /propiedades)
│   │   ├── page.tsx             # Homepage
│   │   ├── layout.tsx           # Public layout
│   │   └── propiedades/
│   │       ├── page.tsx         # List (ISR)
│   │       └── [id]/page.tsx    # Detail (SSR)
│   │
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/              # Protected routes
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Main dashboard
│   │   │   ├── referidos/       # Referrals management
│   │   │   ├── suscripcion/     # Plan management
│   │   │   ├── ganancias/       # Earnings history
│   │   │   └── configuracion/   # Settings
│   │   │
│   │   ├── admin/               # Admin panel (ADMIN role only)
│   │   └── layout.tsx           # Dashboard layout
│   │
│   ├── api/                      # API Routes (BFF pattern)
│   │   ├── auth/[...nextauth]/
│   │   ├── properties/
│   │   └── referrals/
│   │
│   ├── layout.tsx                # Root layout
│   ├── providers.tsx             # React Query + Auth providers
│   └── globals.css               # Global styles
│
├── features/                     # Bounded Contexts (Feature modules)
│   ├── auth/                     # Authentication
│   │   ├── components/          # Login/Register forms
│   │   ├── hooks/               # useLogin, useRegister
│   │   ├── schemas/             # Zod validation
│   │   ├── types/               # TypeScript types
│   │   └── api/                 # API client
│   │
│   ├── properties/               # Properties catalog
│   │   ├── components/          # PropertyCard, PropertyFilters
│   │   ├── hooks/               # useProperties, usePropertyDetail
│   │   ├── schemas/
│   │   ├── types/
│   │   └── api/
│   │
│   ├── referrals/                # Referral system
│   │   ├── components/          # ReferralLinkGenerator, QRCode
│   │   ├── hooks/               # useGenerateReferral, useReferralStats
│   │   ├── types/
│   │   └── api/
│   │
│   ├── subscriptions/            # Plans & Earnings ⭐ NEW
│   │   ├── components/          # SubscriptionPlans, EarningsTable
│   │   ├── hooks/               # useSubscription, useEarnings
│   │   ├── schemas/             # Zod validation
│   │   ├── types/               # Subscription, Earning types
│   │   └── api/                 # subscriptions.api.ts
│   │
│   ├── dashboard/                # Dashboard widgets
│   └── admin/                    # Admin features
│
├── components/                   # Atomic Design
│   ├── ui/                       # Atoms (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ...
│   │
│   ├── shared/                   # Molecules (reusable)
│   │   ├── search-bar.tsx
│   │   ├── pagination.tsx
│   │   ├── file-uploader.tsx
│   │   └── ...
│   │
│   └── layout/                   # Organisms (layout)
│       ├── header.tsx
│       ├── footer.tsx
│       ├── sidebar.tsx
│       └── user-menu.tsx
│
├── lib/                          # Utilities & Configuration
│   ├── api/
│   │   ├── client.ts            # Axios instance
│   │   └── endpoints.ts         # API endpoints
│   │
│   ├── utils/
│   │   ├── cn.ts                # className utility
│   │   ├── format.ts            # Date/number formatters
│   │   └── validators.ts
│   │
│   └── constants/
│       ├── routes.ts            # App routes
│       ├── plans.ts             # Subscription plans ⭐
│       └── query-keys.ts        # React Query keys
│
├── hooks/                        # Global custom hooks
│   ├── use-media-query.ts
│   ├── use-disclosure.ts
│   ├── use-debounce.ts
│   └── use-copy-to-clipboard.ts
│
├── store/                        # Zustand stores (client state)
│   ├── ui-store.ts              # Sidebar, theme, modals
│   └── filters-store.ts         # Search filters
│
├── types/                        # Global TypeScript types
│   ├── api.ts
│   ├── models.ts
│   └── utils.ts
│
└── middleware.ts                 # Auth middleware (route protection)
```

---

## Bounded Contexts

### 1. auth/ - Authentication
**Responsibility:** Login, register, session management

**Key Files:**
- `components/login-form.tsx` - Login form with validation
- `components/register-form.tsx` - Registration form
- `hooks/use-login.ts` - useMutation for login
- `hooks/use-session.ts` - Session state
- `schemas/login.schema.ts` - Zod validation

### 2. properties/ - Properties
**Responsibility:** Property catalog, search, filters

**Key Files:**
- `components/property-card.tsx` - Property card (Organism)
- `components/property-filters.tsx` - Filters (Client Component)
- `hooks/use-properties.ts` - useQuery for properties list
- `hooks/use-property-detail.ts` - useQuery for single property

**Rendering Strategy:**
- List page: **ISR** (revalidate: 3600 - 1 hour)
- Detail page: **SSR** (fresh data)

### 3. referrals/ - Referral System
**Responsibility:** Generate links, QR codes, tracking

**Key Files:**
- `components/referral-link-generator.tsx` - Generate unique link (Client)
- `components/referral-qr-code.tsx` - QR code display
- `components/referral-stats-card.tsx` - Stats display
- `hooks/use-generate-referral.ts` - useMutation to generate
- `hooks/use-referral-stats.ts` - useQuery for stats

### 4. subscriptions/ - Plans & Earnings ⭐ NEW
**Responsibility:** Subscription plans, commission earnings

**Subscription Plans:**
| Plan | Price | Commission | Limit |
|------|-------|------------|-------|
| Basic | Free | 2% | 10/month |
| Pro | $29/month | 5% | 50/month |
| Plus | $99/month | 15% | Unlimited |

**Key Files:**
- `types/index.ts` - Subscription, Earning types
- `schemas/subscription.schema.ts` - Zod validation
- `api/subscriptions.api.ts` - API client
- `components/subscription-card.tsx` - Current plan display
- `components/subscription-plans.tsx` - Plan comparison
- `components/upgrade-modal.tsx` - Upgrade flow
- `components/earnings-summary.tsx` - Total earnings
- `components/earnings-table.tsx` - Earnings history
- `components/earnings-chart.tsx` - Chart visualization

**Hooks:**
- `use-subscription.ts` - Get current plan
- `use-upgrade-plan.ts` - Mutation to upgrade
- `use-earnings.ts` - Query earnings history
- `use-earnings-stats.ts` - Query earnings statistics

**Constants:**
See `lib/constants/plans.ts` for plan configuration.

### 5. dashboard/ - Dashboard
**Responsibility:** Stats, overview, quick actions

**Key Files:**
- `components/stats-card.tsx` - Stat display card
- `components/recent-activity.tsx` - Activity feed
- `hooks/use-dashboard-stats.ts` - Query for dashboard data

### 6. admin/ - Administration
**Responsibility:** User management, analytics (ADMIN only)

**Protection:** Middleware checks `role === 'ADMIN'`

---

## Server vs Client Components

### Server Components (Default) ✅

Use Server Components by default. They run on the server and:
- ✅ Reduce JavaScript bundle size
- ✅ Enable direct database/API access
- ✅ Improve SEO
- ✅ Faster initial page load

**When to use:**
```typescript
// ✅ Server Component (no 'use client')
export default async function PropertiesPage() {
  const properties = await fetchProperties(); // Server-side fetch
  return <PropertyList properties={properties} />;
}
```

### Client Components ('use client') ⚠️

Only use when you need:
- Event handlers (onClick, onChange, onSubmit)
- React hooks (useState, useEffect, useContext)
- Browser APIs (window, localStorage, navigator)
- TanStack Query hooks (useQuery, useMutation)
- Zustand stores

**When to use:**
```typescript
// ⚠️ Client Component (needs 'use client')
'use client';

import { useState } from 'react';
import { useGenerateReferral } from '../hooks/use-generate-referral';

export function ReferralLinkGenerator() {
  const [link, setLink] = useState('');
  const { mutate, isPending } = useGenerateReferral();

  const handleGenerate = () => {
    mutate();
  };

  return <button onClick={handleGenerate}>Generate</button>;
}
```

**Rule:** If you can remove `'use client'` and it still works, remove it!

---

## Rendering Strategies

### SSG (Static Site Generation)
For pages that rarely change:
```typescript
// app/(public)/page.tsx
export default async function HomePage() {
  const featuredProperties = await fetchFeaturedProperties();
  return <div>{/* ... */}</div>;
}
```

### ISR (Incremental Static Regeneration)
For pages that change occasionally (property catalog):
```typescript
// app/(public)/propiedades/page.tsx
export const revalidate = 3600; // Revalidate every 1 hour

export default async function PropertiesPage() {
  const properties = await fetchProperties();
  return <PropertyList properties={properties} />;
}
```

### SSR (Server-Side Rendering)
For dynamic pages (dashboard, property detail):
```typescript
// app/(public)/propiedades/[id]/page.tsx
export default async function PropertyDetailPage({ params }: Props) {
  const property = await fetchProperty(params.id); // Fresh data every time
  return <PropertyDetail property={property} />;
}
```

---

## State Management

### Server State (TanStack Query v5)

For data from APIs:

```typescript
// features/properties/hooks/use-properties.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../api/property.api';

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
}
```

### Client State (Zustand)

For UI state (sidebar, theme, modals):

```typescript
// store/ui-store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        theme: 'light',
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
      }),
      { name: 'ui-store' }
    )
  )
);
```

---

## Forms (React Hook Form + Zod)

### 1. Define Schema
```typescript
// features/subscriptions/schemas/subscription.schema.ts
import { z } from 'zod';

export const upgradePlanSchema = z.object({
  newPlan: z.enum(['BASIC', 'PRO', 'PLUS']),
  paymentMethodId: z.string().optional(),
});

export type UpgradePlanFormData = z.infer<typeof upgradePlanSchema>;
```

### 2. Create Form Component
```typescript
// features/subscriptions/components/upgrade-modal.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { upgradePlanSchema, type UpgradePlanFormData } from '../schemas';
import { useUpgradePlan } from '../hooks/use-upgrade-plan';

export function UpgradeModal() {
  const { mutate, isPending } = useUpgradePlan();

  const form = useForm<UpgradePlanFormData>({
    resolver: zodResolver(upgradePlanSchema),
    defaultValues: {
      newPlan: 'PRO',
    },
  });

  function onSubmit(data: UpgradePlanFormData) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
        <Button type="submit" disabled={isPending}>
          Upgrade Plan
        </Button>
      </form>
    </Form>
  );
}
```

---

## Authentication (Backend-Only)

**Note:** This project uses **backend-only authentication** (no NextAuth.js). Authentication is handled entirely by the Spring Boot backend with JWT tokens.

### Authentication Flow

```
1. User submits login form
   ↓
2. Frontend calls backend /api/v1/auth/login
   ↓
3. Backend validates credentials, returns JWT token
   ↓
4. Frontend stores token (localStorage/cookies)
   ↓
5. Frontend includes token in Authorization header for all requests
   ↓
6. Backend validates JWT on each request
```

### Middleware (Route Protection)

The middleware protects routes by calling the backend `/api/v1/auth/verify` endpoint:

```typescript
// middleware.ts (simplified)
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (allow without authentication)
  const publicRoutes = ['/', '/propiedades', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes - verify authentication with backend
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Call backend /verify endpoint
    const response = await fetch(`${apiUrl}/api/v1/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('authorization'),
        'Cookie': request.headers.get('cookie'),
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();

      // Check role for admin routes
      if (pathname.startsWith('/admin') && data.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      return NextResponse.next();
    } else {
      // Redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.next(); // Let app handle the error
  }
}
```

### Usage in Components

**Login Component:**
```typescript
'use client';

import { useLogin } from '@/features/auth/hooks/use-login';

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        // Token is stored automatically by the hook
        router.push('/dashboard');
      },
    });
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

**Protected Page:**
```typescript
// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null; // Middleware redirects to login

  return <div>Hello {user.name}</div>;
}
```

---

## API Client

### Setup
```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token'); // Or from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Feature API
```typescript
// features/subscriptions/api/subscriptions.api.ts
import { apiClient } from '@/lib/api/client';
import type { Subscription, UpgradePlanRequest } from '../types';

export const subscriptionsApi = {
  async getCurrent(): Promise<Subscription> {
    const { data } = await apiClient.get<Subscription>('/api/subscriptions/current');
    return data;
  },

  async upgradePlan(request: UpgradePlanRequest): Promise<Subscription> {
    const { data } = await apiClient.post<Subscription>('/api/subscriptions/upgrade', request);
    return data;
  },
};
```

---

## Testing

### Unit Tests (Vitest)
```typescript
// features/subscriptions/components/subscription-card.test.tsx
import { render, screen } from '@testing-library/react';
import { SubscriptionCard } from './subscription-card';

describe('SubscriptionCard', () => {
  const mockSubscription = {
    id: '1',
    plan: 'PRO',
    commissionRate: 0.05,
    status: 'ACTIVE',
  };

  it('renders plan name', () => {
    render(<SubscriptionCard subscription={mockSubscription} />);
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('displays commission rate', () => {
    render(<SubscriptionCard subscription={mockSubscription} />);
    expect(screen.getByText('5%')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)
```typescript
// tests/e2e/subscription-upgrade.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Subscription Upgrade Flow', () => {
  test('user can upgrade from Basic to Pro', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Navigate to subscription page
    await page.goto('/dashboard/suscripcion');
    await expect(page.getByText('Basic')).toBeVisible();

    // Click upgrade to Pro
    await page.click('button:has-text("Upgrade to Pro")');

    // Fill payment details
    await page.fill('[name="cardNumber"]', '4242424242424242');
    await page.fill('[name="expiry"]', '12/25');
    await page.fill('[name="cvc"]', '123');

    // Confirm upgrade
    await page.click('button:has-text("Confirm Upgrade")');

    // Verify success
    await expect(page.getByText('Pro')).toBeVisible();
    await expect(page.getByText('5% commission')).toBeVisible();
  });
});
```

---

## Code Style & Conventions

### Naming
- **Files**: kebab-case (`subscription-card.tsx`)
- **Components**: PascalCase (`SubscriptionCard`)
- **Hooks**: camelCase with `use` prefix (`useSubscription`)
- **Types**: PascalCase (`SubscriptionPlan`)
- **Constants**: UPPER_SNAKE_CASE (`COMMISSION_RATES`)

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
import { Card } from '@/components/ui/card';

// 5. Internal - Hooks/Utils
import { useSubscription } from '@/features/subscriptions/hooks/use-subscription';
import { cn } from '@/lib/utils/cn';

// 6. Types
import type { Subscription } from '@/features/subscriptions/types';
```

### Path Aliases
Always use `@/` for imports:
```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { useProperties } from '@/features/properties/hooks/use-properties';

// ❌ Bad
import { Button } from '../../../components/ui/button';
import { useProperties } from '../../features/properties/hooks/use-properties';
```

---

## Performance Optimization

### next/image
```typescript
import Image from 'next/image';

<Image
  src={property.mainImage}
  alt={property.title}
  width={800}
  height={600}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={property.blurHash}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Dynamic Imports (Code Splitting)
```typescript
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(
  () => import('@/components/properties/property-map'),
  {
    loading: () => <Skeleton className="h-[400px]" />,
    ssr: false, // Don't render on server (for Leaflet, Mapbox, etc.)
  }
);
```

### Suspense Boundaries
```typescript
import { Suspense } from 'react';

export default function PropertyDetailPage({ params }: Props) {
  return (
    <div>
      <Suspense fallback={<PropertyDetailSkeleton />}>
        <PropertyDetail id={params.id} />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <PropertyComments id={params.id} />
      </Suspense>
    </div>
  );
}
```

---

## Environment Variables

Required in `.env.local`:

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080

# App Config
NEXT_PUBLIC_APP_NAME=GYDI
NEXT_PUBLIC_ENV=local

# Optional - Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Optional - Stripe (Test Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional - Feature Flags
NEXT_PUBLIC_FEATURE_REFERRALS=true
NEXT_PUBLIC_FEATURE_SUBSCRIPTIONS=true

# Optional - Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=123456
NEXT_PUBLIC_SENTRY_DSN=https://...
```

---

## Common Tasks

### Add shadcn/ui Component
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add table
```

### Add New Feature
```bash
# Create structure
mkdir -p src/features/{name}/{components,hooks,schemas,types,api}

# Create files
touch src/features/{name}/types/index.ts
touch src/features/{name}/api/{name}.api.ts
touch src/features/{name}/hooks/use-{name}.ts
```

### Add New Page
```bash
# Create page
mkdir -p src/app/(dashboard)/dashboard/{name}
touch src/app/(dashboard)/dashboard/{name}/page.tsx
```

---

## Troubleshooting

### TypeScript Errors
```bash
# Restart TypeScript server
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Check types
npm run type-check

# Verify tsconfig.json paths
cat tsconfig.json | grep -A 10 "paths"
```

### Build Errors
```bash
# Clean .next directory
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Hydration Errors
- Check for mismatched HTML between server and client
- Verify no `useEffect` causing immediate state changes
- Use Suspense boundaries for async data

---

## Resources

- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture docs
- **Main CLAUDE.md**: [../CLAUDE.md](../CLAUDE.md) - Project overview
- **Next.js 15**: https://nextjs.org/docs
- **React 19**: https://react.dev
- **TanStack Query**: https://tanstack.com/query/latest
- **shadcn/ui**: https://ui.shadcn.com
- **Axios**: https://axios-http.com/docs/intro

---

**Last Updated:** October 2025
**Version:** 2.0
**Framework:** Next.js 15 + React 19