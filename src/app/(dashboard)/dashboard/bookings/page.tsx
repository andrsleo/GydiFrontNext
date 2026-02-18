/**
 * User Bookings Page
 *
 * Unified bookings dashboard for USER role with dynamic tabs based on capabilities:
 * - canRefer: Show "Como Afiliado" tab (bookings from referral links)
 * - canPublish: Show "Como Anfitrión" tab (bookings on own properties)
 * - Both: Show both tabs
 *
 * Default tab: First available capability
 */

'use client';

import { useUser } from '@/features/auth/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AffiliateBookingsTable, HostBookingsTable } from '@/features/bookings/components';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UserBookingsPage() {
  const user = useUser();

  // Loading state
  if (!user) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Extract capabilities
  const canRefer = user.capabilities?.canRefer ?? false;
  const canPublish = user.capabilities?.canPublish ?? false;

  // No capabilities - show error
  if (!canRefer && !canPublish) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sin permisos</AlertTitle>
          <AlertDescription>
            No tienes permisos para ver reservas. Contacta al administrador para habilitar
            tus capacidades (canRefer o canPublish).
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Determine default tab (first available)
  const defaultTab = canRefer ? 'affiliate' : 'host';

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Reservas</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tus reservas como{' '}
          {canRefer && canPublish
            ? 'afiliado y anfitrión'
            : canRefer
            ? 'afiliado'
            : 'anfitrión'}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          {canRefer && <TabsTrigger value="affiliate">Como Afiliado</TabsTrigger>}
          {canPublish && <TabsTrigger value="host">Como Anfitrión</TabsTrigger>}
        </TabsList>

        {/* Affiliate Tab */}
        {canRefer && (
          <TabsContent value="affiliate" className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Reservas generadas por tus enlaces de referidos. Ganas comisión cuando se
                completan.
              </p>
            </div>
            <AffiliateBookingsTable />
          </TabsContent>
        )}

        {/* Host Tab */}
        {canPublish && (
          <TabsContent value="host" className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Reservas en tus propiedades. Pagas comisión a la plataforma cuando se
                completan.
              </p>
            </div>
            <HostBookingsTable />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
