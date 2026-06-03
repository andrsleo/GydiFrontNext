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
import { usePaymentMethods } from '@/features/subscriptions/hooks/use-payment-methods';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';
import { useTranslation } from '@/hooks/use-translation';

export default function MyPropertiesPage() {
  const [statusTab, setStatusTab] = useState<PropertyStatus | 'all'>('all');
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const { data: paymentMethods, isLoading: isLoadingMethods } = usePaymentMethods();
  const { t } = useTranslation('properties');

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
            {t('myProperties.emptyState')}{statusTab !== 'all' && t('myProperties.emptyStateStatus', { status: statusTab })}
          </p>
          <Link href="/dashboard/propiedades/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('myProperties.createFirst')}
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
          <h1 className="text-2xl sm:text-3xl font-bold">{t('myProperties.title')}</h1>
          <p className="text-muted-foreground">
            {t('myProperties.subtitle')}
          </p>
        </div>
        <Link href="/dashboard/propiedades/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('myProperties.newProperty')}
          </Button>
        </Link>
      </div>


      <AddPaymentMethodDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
        description="Agrega una tarjeta de crédito o débito para que GYDI pueda cobrar la comisión del 15% por cada reserva exitosa generada por referidos."
      />

      {/* Status Tabs */}
      <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as PropertyStatus | 'all')}>
        <div className="overflow-x-auto pb-0.5">
          <TabsList className="min-w-max">
            <TabsTrigger value="all">{t('myProperties.tabs.all')}</TabsTrigger>
            <TabsTrigger value={PropertyStatus.DRAFT}>{t('myProperties.tabs.draft')}</TabsTrigger>
            <TabsTrigger value={PropertyStatus.PENDING_APPROVAL}>{t('myProperties.tabs.pending')}</TabsTrigger>
            <TabsTrigger value={PropertyStatus.PUBLISHED}>{t('myProperties.tabs.published')}</TabsTrigger>
            <TabsTrigger value={PropertyStatus.INACTIVE}>{t('myProperties.tabs.inactive')}</TabsTrigger>
            <TabsTrigger value={PropertyStatus.DENY}>{t('myProperties.tabs.denied')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.DRAFT} className="mt-6">
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
