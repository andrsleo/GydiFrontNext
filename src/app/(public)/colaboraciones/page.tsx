/**
 * Creator Collaboration Marketplace — Public listing
 * ISR: revalidates every 1 hour
 */

import { Suspense } from 'react';
import { collaborationsApi } from '@/features/collaborations/api/collaborations.api';
import { MarketplaceGrid } from '@/features/collaborations/components/marketplace/marketplace-grid';
import { MarketplaceFilters } from '@/features/collaborations/components/marketplace/marketplace-filters';
import { Skeleton } from '@/components/ui/skeleton';
import type { MarketplaceFilters as Filters } from '@/features/collaborations/types';

export const revalidate = 3600;

export const metadata = {
  title: 'Colaboraciones | GYDI Properties',
  description:
    'Conectamos a creadores de contenido con propiedades que buscan colaboraciones. Aplica con tu pitch y gana estadías o compensación.',
};

interface PageProps {
  searchParams: Promise<{
    country?: string;
    city?: string;
    propertyType?: string;
    compensationType?: string;
    page?: string;
  }>;
}

export default async function ColaboracionesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: Filters = {
    country: params.country,
    city: params.city,
    propertyType: params.propertyType,
    compensationType: params.compensationType as Filters['compensationType'],
    page: params.page ? Number(params.page) : 0,
    size: 12,
  };

  // Server-side fetch for SSR/ISR initial data
  let initialProperties: Awaited<ReturnType<typeof collaborationsApi.getMarketplace>> | null = null;
  try {
    initialProperties = await collaborationsApi.getMarketplace(filters);
  } catch {
    // Graceful degradation — show empty state
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            Marketplace de Colaboraciones
          </h1>
          <p className="mt-2 text-muted-foreground text-base sm:text-lg">
            Propiedades abiertas a colaboraciones con creadores de contenido
          </p>
        </div>

        {/* Filters — client component for interactive updates */}
        <div className="mb-6">
          <Suspense fallback={<Skeleton className="h-12 w-full rounded-lg" />}>
            <MarketplaceFilters />
          </Suspense>
        </div>

        {/* Property grid */}
        {initialProperties ? (
          <>
            <MarketplaceGrid properties={initialProperties.content} />
            {initialProperties.totalElements > 0 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {initialProperties.totalElements} propiedades disponibles
              </p>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
