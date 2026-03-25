/**
 * User Commissions Page
 *
 * Unified commissions dashboard for USER role with dynamic tabs based on capabilities:
 * - canRefer: Show "Comisiones Ganadas" tab (platform PAYS affiliate)
 * - canPublish: Show "Comisiones Pagadas" tab (platform CHARGES host)
 * - Both: Show both tabs
 *
 * Default tab: First available capability
 */

'use client';

import { useUser } from '@/features/auth/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AffiliateCommissionsTable,
  HostCommissionsTable,
} from '@/features/commissions/components';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UserCommissionsPage() {
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
            No tienes permisos para ver comisiones. Contacta al administrador para habilitar
            tus capacidades (canRefer o canPublish).
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Determine default tab (first available)
  const defaultTab = canRefer ? 'earned' : 'paid';

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mis Comisiones</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tus comisiones como{' '}
          {canRefer && canPublish
            ? 'referido y anfitrión'
            : canRefer
              ? 'referido'
              : 'anfitrión'}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          {canRefer && (
            <TabsTrigger value="earned">Comisiones Ganadas</TabsTrigger>
          )}
          {canPublish && (
            <TabsTrigger value="paid">Comisiones Pagadas</TabsTrigger>
          )}
        </TabsList>

        {/* Earned Tab (Affiliate) */}
        {canRefer && (
          <TabsContent value="earned" className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">💰 Comisiones que Recibes</h3>
              <p className="text-sm text-muted-foreground">
                Estas comisiones te las <strong>paga la plataforma</strong> cuando alguien
                reserva a través de tus enlaces de referido.
              </p>
            </div>
            <AffiliateCommissionsTable />
          </TabsContent>
        )}

        {/* Paid Tab (Host) */}
        {canPublish && (
          <TabsContent value="paid" className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">💸 Comisiones que Pagas</h3>
              <p className="text-sm text-muted-foreground">
                Estas comisiones las <strong>pagas tú a la plataforma</strong> cuando se
                reserva una de tus propiedades a través de un referido.
              </p>
            </div>
            <HostCommissionsTable />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
