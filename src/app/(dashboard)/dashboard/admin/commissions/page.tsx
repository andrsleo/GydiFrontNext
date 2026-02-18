/**
 * Admin Commissions Page
 *
 * Server Component - Dashboard for commission management
 */

import { Suspense } from 'react';
import {
  CommissionStatsCards,
  HostCommissionsTable,
  AffiliateCommissionsTable,
} from '@/features/admin/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Gestión de Comisiones | GYDI Admin',
  description: 'Administra comisiones de hosts y afiliados',
};

export default function AdminCommissionsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Comisiones</h1>
        <p className="text-muted-foreground mt-2">
          Monitorea comisiones cobradas a hosts y pagadas a afiliados
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        }
      >
        <CommissionStatsCards />
      </Suspense>

      {/* Tabs for Host and Affiliate Commissions */}
      <Tabs defaultValue="host" className="space-y-4">
        <TabsList>
          <TabsTrigger value="host">Comisiones Hosts (Cobrado)</TabsTrigger>
          <TabsTrigger value="affiliate">Comisiones Afiliados (Pagado)</TabsTrigger>
        </TabsList>

        <TabsContent value="host" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Comisiones de Hosts</h2>
              <p className="text-sm text-muted-foreground">
                Montos cobrados a hosts por reservas generadas
              </p>
            </div>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <HostCommissionsTable />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="affiliate" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Comisiones de Afiliados</h2>
              <p className="text-sm text-muted-foreground">
                Montos pagados a afiliados por referidos exitosos
              </p>
            </div>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <AffiliateCommissionsTable />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
