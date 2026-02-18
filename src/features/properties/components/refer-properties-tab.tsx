/**
 * ReferPropertiesTab - Tab para referir propiedades de la plataforma
 * Muestra todas las propiedades disponibles con opción de generar link de referido
 */
'use client';

import { useState } from 'react';
import { useUser } from '@/features/auth/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { PropertyCard } from './property-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Check, Copy, ExternalLink } from 'lucide-react';
import { useGenerateReferralLink } from '@/features/referrals/hooks';
import { propertyKeys } from '@/lib/constants/query-keys';
import { PropertyStatus } from '../types';
import type { PropertyResponse } from '../types';

export function ReferPropertiesTab() {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const generateLink = useGenerateReferralLink();

  // Fetch only PUBLISHED properties (non-published should not be referrable)
  const { data, isLoading } = useQuery({
    queryKey: propertyKeys.list({ page, size: pageSize, searchText: searchQuery, status: PropertyStatus.PUBLISHED }),
    queryFn: () => propertiesApi.getAll({ page, size: pageSize, searchText: searchQuery, status: PropertyStatus.PUBLISHED }),
    staleTime: 5 * 60 * 1000,
  });

  const handleGenerateAndCopyLink = async (property: PropertyResponse) => {
    if (!user?.id) {
      alert('Debes iniciar sesión para generar links de referido');
      return;
    }

    try {
      // Expiration is calculated automatically by backend based on user plan
      const response = await generateLink.mutateAsync({
        propertyId: property.id.toString(),
      });

      // Copy to clipboard
      await navigator.clipboard.writeText(response.fullUrl);

      setCopiedId(property.id.toString());
      setTimeout(() => setCopiedId(null), 3000);
    } catch (error) {
      console.error('Error generating referral link:', error);
      alert('Error al generar el link de referido. Intenta de nuevo.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.content || data.content.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">
          No hay propiedades disponibles para referir
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar propiedades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>💡 Cómo funciona:</strong> Haz click en "Copiar Link de Referido" en cualquier propiedad.
          Comparte ese link y gana comisiones por cada reserva que se realice a través de tu enlace.
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.content.map((property) => (
          <div key={property.id} className="flex flex-col gap-2">
            <PropertyCard
              property={property}
              showActions={false}
            />

            {/* Referral Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerateAndCopyLink(property)}
                disabled={generateLink.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                {copiedId === property.id.toString() ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Link
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-white"
              >
                <a
                  href={`/propiedades/${property.slug || property.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Anterior
          </Button>

          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Página {page + 1} de {data.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}