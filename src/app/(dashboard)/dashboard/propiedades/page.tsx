'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/features/properties/api/properties.api';
import { PropertyCard } from '@/features/properties/components';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyStatus } from '@/features/properties/types';
import { propertyKeys } from '@/lib/constants/query-keys';

export default function MyPropertiesPage() {
  const [activeTab, setActiveTab] = useState<PropertyStatus | 'all'>('all');

  const filters = activeTab === 'all' ? {} : { status: activeTab };
  const { data, isLoading } = useQuery({
    queryKey: propertyKeys.myProperties(filters),
    queryFn: () => propertiesApi.getMyProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Debug logging
  console.log('🔍 Active Tab:', activeTab);
  console.log('🔍 Filters:', filters);
  console.log('🔍 Data:', data);
  console.log('🔍 Is Loading:', isLoading);

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
            No tienes propiedades {activeTab !== 'all' && `en estado ${activeTab}`}
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
          <h1 className="text-3xl font-bold">Mis Propiedades</h1>
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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PropertyStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value={PropertyStatus.DRAFT}>Borradores</TabsTrigger>
          <TabsTrigger value={PropertyStatus.PUBLISHED}>Publicadas</TabsTrigger>
          <TabsTrigger value={PropertyStatus.INACTIVE}>Inactivas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.DRAFT} className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.PUBLISHED} className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value={PropertyStatus.INACTIVE} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
