# Admin Feature Module

Bounded Context para administración de reservas (bookings) y comisiones en GYDI 2.0.

## Descripción

Este módulo proporciona dashboards administrativos para:
- **Gestión de Reservas**: Visualizar, confirmar, cancelar y gestionar el ciclo de vida completo de las reservas
- **Gestión de Comisiones**: Monitorear comisiones cobradas a hosts y pagadas a afiliados

## Estructura

```
admin/
├── types/                    # TypeScript types
│   ├── booking.types.ts     # Booking DTOs and status
│   ├── commission.types.ts  # Commission DTOs and status
│   └── index.ts
│
├── schemas/                  # Zod validation schemas
│   ├── booking.schema.ts    # Reserve, cancel, create booking schemas
│   └── index.ts
│
├── api/                      # API clients
│   ├── bookings-admin.api.ts   # Booking CRUD operations
│   ├── commissions-admin.api.ts # Commission operations
│   └── index.ts
│
├── hooks/                    # TanStack Query hooks
│   ├── use-bookings.ts      # Query hooks for bookings
│   ├── use-booking-mutations.ts # Mutation hooks (reserve, cancel, etc.)
│   ├── use-commissions.ts   # Query hooks for commissions
│   ├── use-commission-mutations.ts # Mutation hooks (retry, approve, etc.)
│   └── index.ts
│
├── components/               # React components
│   ├── bookings/
│   │   ├── booking-status-badge.tsx       # Status badge
│   │   ├── booking-actions-dropdown.tsx   # Action menu
│   │   ├── bookings-table.tsx             # Bookings list table
│   │   ├── reserve-booking-dialog.tsx     # Confirm booking dialog
│   │   └── cancel-booking-dialog.tsx      # Cancel booking dialog
│   │
│   ├── commissions/
│   │   ├── commission-status-badge.tsx           # Status badge
│   │   ├── host-commissions-table.tsx            # Host commissions table
│   │   └── affiliate-commissions-table.tsx       # Affiliate commissions table
│   │
│   ├── stats/
│   │   └── commission-stats-cards.tsx     # Stats cards
│   │
│   └── index.ts
│
├── index.ts                  # Main export file
└── README.md                 # This file
```

## Tipos Principales

### Booking

```typescript
interface BookingDto {
  id: number;
  referralLinkId: number;
  propertyId: number;
  checkInDate: string; // ISO date
  checkOutDate: string; // ISO date
  guestEmail: string;
  guestFirstName: string;
  guestLastName: string;
  guestPhone?: string;
  guestsCount: number;
  totalAmount?: number;
  currency: Currency;
  airbnbConfirmationCode?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  reservedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  cancelledAt?: string;
}

type BookingStatus =
  | 'REQUEST'     // Solicitud inicial (sin confirmar en Airbnb)
  | 'RESERVED'    // Confirmada en Airbnb
  | 'IN_PROGRESS' // Guest ha hecho check-in
  | 'FINISHED'    // Guest ha hecho check-out
  | 'CANCELLED'   // Cancelada
  | 'DISPUTED';   // En disputa
```

### Commission

```typescript
// Host Commission (Platform charges host)
interface HostCommissionDto {
  id: number;
  bookingId: number;
  hostId: number;
  hostPlan: SubscriptionPlan;
  commissionRate: number; // 0.25, 0.20, 0.15
  bookingAmount: number;
  commissionAmount: number;
  currency: Currency;
  status: HostCommissionStatus;
  stripePaymentIntentId?: string;
  chargedAt?: string;
  failureReason?: string;
  attemptCount: number;
}

type HostCommissionStatus =
  | 'PENDING'     // Pendiente de cobro
  | 'PROCESSING'  // Procesando pago
  | 'CHARGED'     // Cobrado exitosamente
  | 'FAILED'      // Falló el cobro
  | 'REFUNDED';   // Reembolsado

// Affiliate Commission (Platform pays affiliate)
interface AffiliateCommissionDto {
  id: number;
  bookingId: number;
  affiliateId: number;
  affiliatePlan: SubscriptionPlan;
  commissionRate: number; // 0.02, 0.05, 0.10
  bookingAmount: number;
  commissionAmount: number;
  currency: Currency;
  scheduledPaymentDate: string;
  disputePeriodEndsAt: string;
  status: AffiliateCommissionStatus;
  stripeTransferId?: string;
  paidAt?: string;
  failureReason?: string;
  attemptCount: number;
}

type AffiliateCommissionStatus =
  | 'PENDING'   // Pendiente aprobación
  | 'APPROVED'  // Aprobado, esperando fecha de pago
  | 'PAID'      // Pagado exitosamente
  | 'CANCELLED'; // Cancelado
```

## API Endpoints Utilizados

### Bookings API

```
GET    /api/v1/bookings/{id}          - Get booking by ID
GET    /api/v1/bookings               - List bookings (with filters)
POST   /api/v1/bookings               - Create booking
PUT    /api/v1/bookings/{id}/reserve  - Confirm booking with Airbnb
PUT    /api/v1/bookings/{id}/cancel   - Cancel booking
PUT    /api/v1/bookings/{id}/start    - Mark as in progress (check-in)
PUT    /api/v1/bookings/{id}/finish   - Mark as finished (check-out)
PUT    /api/v1/bookings/{id}/dispute  - Mark as disputed
```

### Commissions API

```
GET    /api/v1/commissions/host                     - List host commissions
GET    /api/v1/commissions/host/{id}                - Get host commission
POST   /api/v1/commissions/host/{id}/retry          - Retry failed charge

GET    /api/v1/commissions/affiliate                - List affiliate commissions
GET    /api/v1/commissions/affiliate/{id}           - Get affiliate commission
POST   /api/v1/commissions/affiliate/{id}/approve   - Approve for payment
POST   /api/v1/commissions/affiliate/{id}/retry     - Retry failed payment
POST   /api/v1/commissions/affiliate/{id}/cancel    - Cancel commission

GET    /api/v1/commissions/stats                    - Get statistics
```

## Uso de Hooks

### Bookings

```typescript
// Query hooks
const { data: booking, isLoading } = useBooking(bookingId);
const { data: bookings, isLoading } = useBookings({ status: 'REQUEST' });

// Mutation hooks
const { mutate: create, isPending } = useCreateBooking();
const { mutate: reserve, isPending } = useReserveBooking();
const { mutate: cancel, isPending } = useCancelBooking();
const { mutate: start, isPending } = useStartBooking();
const { mutate: finish, isPending } = useFinishBooking();
const { mutate: dispute, isPending } = useDisputeBooking();

// Ejemplo de uso
reserve(
  { id: bookingId, data: { airbnbConfirmationCode, totalAmount, currency } },
  {
    onSuccess: () => console.log('Reserva confirmada'),
    onError: (error) => console.error('Error', error),
  }
);
```

### Commissions

```typescript
// Query hooks
const { data: hostCommissions } = useHostCommissions({ status: 'PENDING' });
const { data: affiliateCommissions } = useAffiliateCommissions();
const { data: stats } = useCommissionStats();

// Mutation hooks
const { mutate: retryHost } = useRetryHostCommission();
const { mutate: retryAffiliate } = useRetryAffiliateCommission();
const { mutate: approve } = useApproveAffiliateCommission();
const { mutate: cancelCommission } = useCancelAffiliateCommission();

// Ejemplo
approve(commissionId, {
  onSuccess: () => console.log('Comisión aprobada'),
});
```

## Componentes

### Bookings

```tsx
import { BookingsTable } from '@/features/admin/components';

// Tabla con filtros y acciones
<BookingsTable />
```

```tsx
import { BookingActionsDropdown } from '@/features/admin/components';

// Dropdown con acciones disponibles según estado
<BookingActionsDropdown booking={booking} />
```

### Commissions

```tsx
import {
  CommissionStatsCards,
  HostCommissionsTable,
  AffiliateCommissionsTable
} from '@/features/admin/components';

// Stats cards
<CommissionStatsCards />

// Tablas
<HostCommissionsTable />
<AffiliateCommissionsTable />
```

## Páginas

### Bookings List
**URL**: `/dashboard/admin/bookings`

Muestra tabla con todas las reservas, filtros por estado, y acciones rápidas.

### Booking Detail
**URL**: `/dashboard/admin/bookings/[id]`

Vista detallada de una reserva con toda la información y acciones disponibles.

### Commissions Dashboard
**URL**: `/dashboard/admin/commissions`

Dashboard con estadísticas y tabs para:
- Comisiones de Hosts (cobradas por plataforma)
- Comisiones de Afiliados (pagadas por plataforma)

## Flujo de Trabajo

### Ciclo de Vida de una Reserva

```
1. REQUEST (Solicitud)
   ↓ [Admin confirma en Airbnb]
2. RESERVED (Confirmada)
   ↓ [Guest hace check-in]
3. IN_PROGRESS (En curso)
   ↓ [Guest hace check-out]
4. FINISHED (Finalizada)

En cualquier momento:
- CANCELLED (si se cancela)
- DISPUTED (si hay disputa)
```

### Acciones Disponibles por Estado

| Estado | Acciones |
|--------|----------|
| REQUEST | Confirmar en Airbnb, Cancelar |
| RESERVED | Iniciar (Check-in), Cancelar, Marcar como Disputada |
| IN_PROGRESS | Finalizar (Check-out), Marcar como Disputada |
| FINISHED | Marcar como Disputada |
| CANCELLED | (ninguna) |
| DISPUTED | (ninguna) |

### Gestión de Comisiones

**Host Commissions (Platform cobra a host):**
1. Reserva finalizada → Se crea comisión (PENDING)
2. Sistema intenta cobro automático (PROCESSING)
3. Éxito: CHARGED / Fallo: FAILED
4. Si falla: Admin puede reintentar manualmente

**Affiliate Commissions (Platform paga a afiliado):**
1. Reserva finalizada → Se crea comisión (PENDING)
2. Admin aprueba comisión (APPROVED)
3. Sistema espera fecha programada
4. Sistema intenta pago automático
5. Éxito: PAID / Fallo: se reintenta
6. Admin puede cancelar si es necesario

## Seguridad

- ✅ Solo usuarios con rol `ADMIN` pueden acceder
- ✅ Validación con Zod en todos los formularios
- ✅ CSRF protection en mutaciones
- ✅ Error handling con toast notifications
- ✅ Loading states en todas las operaciones

## Testing

```bash
# Unit tests (TODO)
npm test -- src/features/admin

# E2E tests (TODO)
npm run test:e2e -- tests/e2e/admin
```

## Notas de Implementación

- **Server Components por defecto**: Solo se usan Client Components donde hay interactividad
- **TypeScript strict**: Sin uso de `any` (excepto workaround temporal en Link dinámico)
- **TanStack Query**: Invalidación automática de cache después de mutaciones
- **Optimistic updates**: Se invalidan queries relevantes al modificar datos
- **Error handling**: Toast notifications con `sonner`
- **Responsive**: Mobile-first design con TailwindCSS

## TODO

- [ ] Implementar paginación en tablas (backend + frontend)
- [ ] Agregar filtros avanzados (rango de fechas, búsqueda por propiedad)
- [ ] Implementar tests unitarios (Vitest)
- [ ] Implementar tests E2E (Playwright)
- [ ] Agregar visualizaciones con gráficos (Recharts)
- [ ] Implementar export a CSV/Excel
- [ ] Agregar notificaciones push cuando hay acciones requeridas
- [ ] Implementar audit log para acciones administrativas

## Contacto

Para dudas o soporte, contactar al equipo de desarrollo.
