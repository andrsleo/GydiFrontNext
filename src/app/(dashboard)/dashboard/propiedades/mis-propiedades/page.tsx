'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/features/properties/api/properties.api';
import { PropertyCard } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyStatus } from '@/features/properties/types';
import { propertyKeys } from '@/lib/constants/query-keys';
import { useHostHasPaymentMethod } from '@/features/subscriptions/hooks/use-host-payment-method';

export default function MyPropertiesPage() {
  const [statusTab, setStatusTab] = useState<PropertyStatus | 'all'>('all');
  const { hasHostPaymentMethod, isLoading: isLoadingPayment } = useHostHasPaymentMethod();

  const filters = statusTab === 'all' ? {} : { status: statusTab };
  const { data, isLoading } = useQuery({
    queryKey: propertyKeys.myProperties(filters),
    queryFn: () => propertiesApi.getMyProperties(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      );
    }

    if (!data?.content || data.content.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            No tienes propiedades {statusTab !== 'all' && `en estado ${statusTab}`}
          </p>
          <Link href="/dashboard/propiedades/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Propiedad
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.content.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showActions={true}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mis Propiedades</h1>
          <p className="text-muted-foreground">
            Gestiona tus propiedades en renta
          </p>
        </div>
        <Link href="/dashboard/propiedades/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      {/* Banner: método de pago requerido para publicar */}
      {!isLoadingPayment && !hasHostPaymentMethod && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-medium">Agrega una tarjeta para publicar tus propiedades</p>
            <p className="mt-1 text-xs leading-relaxed">
              Para que tus propiedades sean visibles al público y puedan recibir reservas, debes registrar una tarjeta de crédito o débito.
              La plataforma la utiliza para cobrar automáticamente las comisiones generadas por cada reserva exitosa.
            </p>
          </div>
          <Link href="/dashboard/subscription">
            <Button size="sm" variant="outline" className="flex-shrink-0 border-amber-400 text-amber-800 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-200 dark:hover:bg-amber-900">
              Agregar tarjeta
            </Button>
          </Link>
        </div>
      )}

      {/* Status Tabs */}
      <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as PropertyStatus | 'all')}>
        <div className="overflow-x-auto pb-0.5">
        <TabsList className="min-w-max">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value={PropertyStatus.DRAFT}>Borradores</TabsTrigger>
          <TabsTrigger value={PropertyStatus.SEND_GYDI_COHOST}>Agregar Co-host</TabsTrigger>
          <TabsTrigger value={PropertyStatus.PENDING_APPROVAL}>En Revisión</TabsTrigger>
          <TabsTrigger value={PropertyStatus.PUBLISHED}>Publicadas</TabsTrigger>
          <TabsTrigger value={PropertyStatus.INACTIVE}>Inactivas</TabsTrigger>
          <TabsTrigger value={PropertyStatus.DENY}>Rechazadas</TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="all" className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.DRAFT} className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.SEND_GYDI_COHOST} className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.PENDING_APPROVAL} className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.PUBLISHED} className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.INACTIVE} className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.DENY} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
