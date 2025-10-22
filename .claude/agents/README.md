# 🤖 Agentes IA - Frontend (GydiFront)

Agentes especializados para el proyecto frontend de GYDI 2.0.

---

## 📋 Agentes Disponibles

| # | Agente | Rol | Stack Principal |
|---|--------|-----|-----------------|
| **3** | **Frontend_AI** | Frontend Lead | Next.js 15, React 19, TypeScript, TanStack Query |
| **7** | **UX_AI** | UX/UI Specialist | Figma, Design Systems, Accesibilidad (WCAG 2.1) |

---

## 🚀 Inicio Rápido

### Para Tareas Frontend

**Opción 1: Usar Orchestrator (Recomendado para tareas complejas)**
```bash
# Desde la raíz del proyecto
cat ../.claude/agents/0_Orchestrator.md | pbcopy
```

**Opción 2: Usar Frontend_AI directamente (Para tareas específicas)**
```bash
# Desde GydiFront/
cat .claude/agents/3_Frontend_AI.md | pbcopy
```

---

## 🎯 Cuándo Usar Cada Agente

### Frontend_AI (#3)
**Úsalo para:**
- ✅ Implementar bounded contexts frontend (features/)
- ✅ Crear páginas Next.js (App Router)
- ✅ Desarrollar componentes React (Server/Client)
- ✅ Implementar formularios (React Hook Form + Zod)
- ✅ Configurar TanStack Query (server state)
- ✅ Crear hooks personalizados
- ✅ Integración con APIs backend

**Regla de Oro: Server Components First**
- ✅ Por defecto: Server Components
- ❌ Solo usa Client Components cuando sea estrictamente necesario (useState, onClick, useEffect)

**Automáticamente invoca:**
- AIArchitect (#9) - Valida separación Server/Client
- AICodeMentor (#10) - Revisa composición y accesibilidad

**Ejemplo:**
```
Usuario: "Implementa la página de subscriptions con upgrade flow"
Frontend_AI:
  - src/app/(dashboard)/subscriptions/page.tsx (Server Component)
  - src/features/subscriptions/components/ (UI components)
  - src/features/subscriptions/hooks/use-subscription.ts
  → AIArchitect valida Server/Client separation
  → AICodeMentor revisa accesibilidad y composición
```

### UX_AI (#7)
**Úsalo para:**
- ✅ Diseñar wireframes y prototipos (Figma)
- ✅ Crear design system y tokens
- ✅ Diseñar flujos de usuario
- ✅ Validar accesibilidad (WCAG 2.1 AA)
- ✅ Research de usuarios
- ✅ Optimizar conversión (CRO)

**Colabora con:**
- Frontend_AI (#3) para implementación

**Ejemplo:**
```
Usuario: "Diseña el flujo de upgrade de suscripción"
UX_AI:
  - User flow diagram
  - Wireframes (mobile + desktop)
  - Component specs para Frontend_AI
```

---

## 🏗️ Arquitectura del Proyecto

```
GydiFront/src/
├── app/                         # ← Frontend_AI (App Router)
│   ├── (public)/               # Marketing pages (Server Components)
│   ├── (dashboard)/            # Authenticated pages
│   ├── api/                    # API Routes (BFF pattern)
│   └── layout.tsx
│
├── features/                    # ← Frontend_AI (Bounded Contexts)
│   ├── auth/
│   │   ├── components/         # Feature components
│   │   ├── hooks/              # Feature hooks
│   │   ├── api/                # API client
│   │   ├── schemas/            # Zod validation
│   │   └── types/
│   │
│   ├── properties/             # Bounded Context: Propiedades
│   ├── referrals/              # Bounded Context: Referidos
│   └── subscriptions/          # Bounded Context: Suscripciones
│
├── components/                  # ← Frontend_AI + UX_AI
│   ├── ui/                     # shadcn/ui components
│   │   ├── atoms/              # Buttons, Inputs
│   │   ├── molecules/          # Cards, Forms
│   │   └── organisms/          # Navbars, Footers
│   └── layout/                 # Layout wrappers
│
├── lib/                         # ← Frontend_AI
│   ├── api-client.ts           # Axios instance
│   ├── constants/              # App constants
│   └── utils.ts                # Utilities
│
├── hooks/                       # ← Frontend_AI
│   ├── use-auth.ts
│   └── use-media-query.ts
│
└── store/                       # ← Frontend_AI (Zustand)
    └── auth-store.ts
```

---

## ✅ Workflow Recomendado

### Implementar Nueva Feature Frontend

```markdown
1. Orchestrator (#0) coordina
   ↓
2. UX_AI (#7) diseña
   - Wireframes en Figma
   - User flows
   - Component specs
   ↓
3. Frontend_AI (#3) implementa
   - Bounded context en features/
   - Páginas en app/
   - Server Components (default)
   - Client Components (solo si necesario)
   - Hooks con TanStack Query
   - Forms con Zod + React Hook Form
   ↓
4. AIArchitect (#9) valida
   - Separación Server/Client correcta
   - Arquitectura de bounded contexts
   ↓
5. AICodeMentor (#10) revisa
   - Composición de componentes
   - Accesibilidad (ARIA, semantic HTML)
   - Performance (code splitting)
   ↓
6. QA_AI (#6) crea tests
   - Vitest (unit + integration)
   - Playwright (E2E)
```

---

## 📐 Principios Arquitectónicos

### Server Components First (Non-Negotiable)

```tsx
// ✅ CORRECTO: Server Component por defecto
// app/subscriptions/page.tsx
export default async function SubscriptionsPage() {
  const subscription = await getSubscription(); // Fetch directo en server

  return (
    <div>
      <SubscriptionCard subscription={subscription} /> {/* Server Component */}
      <UpgradeButton /> {/* Client Component (solo este) */}
    </div>
  );
}

// ✅ Client Component solo cuando sea necesario
// components/upgrade-button.tsx
'use client';

export function UpgradeButton() {
  const { mutate } = useMutation({ ... }); // Hook de React

  return <Button onClick={() => mutate()}>Upgrade</Button>; // Event handler
}
```

**Cuándo usar Client Components:**
- `useState`, `useEffect`, hooks de React
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)
- TanStack Query (`useQuery`, `useMutation`)

### Bounded Contexts (Feature-Based)

Cada bounded context es autónomo:

```
features/subscriptions/
├── components/          # Componentes específicos de subscriptions
├── hooks/              # use-subscription.ts, use-upgrade-plan.ts
├── api/                # subscriptions.api.ts (API client)
├── schemas/            # subscription.schema.ts (Zod)
├── types/              # index.ts (TypeScript types)
└── __tests__/          # Tests unitarios
```

**Reglas:**
- ❌ No importar entre bounded contexts (usar shared/)
- ✅ Cada BC tiene su propia carpeta de components/hooks/api
- ✅ Types compartidos en `src/types/`
- ✅ UI components compartidos en `src/components/ui/`

---

## 🎨 Design System (shadcn/ui + Tailwind)

**Atomic Design:**
```
components/ui/
├── atoms/              # ← UX_AI define, Frontend_AI implementa
│   ├── button.tsx
│   ├── input.tsx
│   └── badge.tsx
│
├── molecules/          # Combinación de atoms
│   ├── form-field.tsx
│   └── card.tsx
│
└── organisms/          # Combinaciones complejas
    ├── navbar.tsx
    └── property-card.tsx
```

**Tailwind Config:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',    // ← UX_AI define tokens
        secondary: 'hsl(var(--secondary))',
      }
    }
  }
}
```

---

## 🔗 Agentes Globales

Para validaciones y coordinación, estos agentes están en `../.claude/agents/`:

| # | Agente | Cuándo Invocar |
|---|--------|---------------|
| **0** | **Orchestrator** | Punto de entrada para tareas complejas |
| **6** | **QA_AI** | Tests E2E con Playwright |
| **8** | **PM_AI** | Definir user stories, priorización |
| **9** | **AIArchitect** | Validar arquitectura (automático) |
| **10** | **AICodeMentor** | Code review (automático) |

---

## 💡 Tips

1. **Progressive Disclosure**: Frontend_AI usa Glob → Grep → Read (nunca carga todo)
2. **Server Components First**: Por defecto Server, Client solo cuando necesario
3. **TanStack Query**: Para server state (queries, mutations, cache)
4. **Zustand**: Solo para client state (UI, preferences)
5. **Forms**: React Hook Form + Zod siempre
6. **Accesibilidad**: ARIA labels, semantic HTML, keyboard navigation

---

## 🚀 Performance

**Métricas Meta (Core Web Vitals):**
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

**Optimizaciones:**
- ISR (Incremental Static Regeneration) para property listings
- SSR para páginas dinámicas autenticadas
- Code splitting por ruta (automático con Next.js)
- `next/image` para optimización de imágenes
- Dynamic imports para componentes pesados

---

## 📚 Documentación Adicional

- **Proyecto General**: `../CLAUDE.md`
- **Frontend Específico**: `../GydiFront/CLAUDE.md`
- **Frontend Architecture**: `../GydiFront/ARCHITECTURE.md`
- **Sistema de Agentes**: `../.claude/agents/README.md`

---

**Última actualización:** Octubre 2025
**Versión:** 1.0 (Multi-Proyecto)