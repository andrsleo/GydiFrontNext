'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/features/properties/api/properties.api';
import { PropertyCard, ReferPropertiesTab } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Share2, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyStatus } from '@/features/properties/types';
import { propertyKeys } from '@/lib/constants/query-keys';

type MainTab = 'my-properties' | 'refer-properties';

export default function PropertiesPage() {
  const [mainTab, setMainTab] = useState<MainTab>('my-properties');
  const [statusTab, setStatusTab] = useState<PropertyStatus | 'all'>('all');

  const filters = statusTab === 'all' ? {} : { status: statusTab };
  const { data, isLoading } = useQuery({
    queryKey: propertyKeys.myProperties(filters),
    queryFn: () => propertiesApi.getMyProperties(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: mainTab === 'my-properties', // Only fetch when tab is active
  });

  const renderMyPropertiesContent = () => {
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Propiedades</h1>
          <p className="text-muted-foreground">
            {mainTab === 'my-properties'
              ? 'Gestiona tus propiedades en renta'
              : 'Refiere propiedades y gana comisiones'}
          </p>
        </div>
        {mainTab === 'my-properties' && (
          <Link href="/dashboard/propiedades/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Propiedad
            </Button>
          </Link>
        )}
      </div>

      {/* Main Tabs: Mis Propiedades vs Referir Propiedades */}
      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as MainTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-properties" className="gap-2">
            <Home className="h-4 w-4" />
            Mis Propiedades
          </TabsTrigger>
          <TabsTrigger value="refer-properties" className="gap-2">
            <Share2 className="h-4 w-4" />
            Referir Propiedades
          </TabsTrigger>
        </TabsList>

        {/* My Properties Tab Content */}
        <TabsContent value="my-properties" className="mt-6 space-y-6">
          <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as PropertyStatus | 'all')}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value={PropertyStatus.DRAFT}>Borradores</TabsTrigger>
              <TabsTrigger value={PropertyStatus.PUBLISHED}>Publicadas</TabsTrigger>
              <TabsTrigger value={PropertyStatus.INACTIVE}>Inactivas</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {renderMyPropertiesContent()}
            </TabsContent>

            <TabsContent value={PropertyStatus.DRAFT} className="mt-6">
              {renderMyPropertiesContent()}
            </TabsContent>

            <TabsContent value={PropertyStatus.PUBLISHED} className="mt-6">
              {renderMyPropertiesContent()}
            </TabsContent>

            <TabsContent value={PropertyStatus.INACTIVE} className="mt-6">
              {renderMyPropertiesContent()}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Refer Properties Tab Content */}
        <TabsContent value="refer-properties" className="mt-6">
          <ReferPropertiesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
