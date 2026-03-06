/**
 * ReferPropertiesTab - Tab para referir propiedades de la plataforma
 * Muestra todas las propiedades disponibles con opción de generar link de referido
 */
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/features/auth/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/properties.api';
import { PropertyCard } from './property-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Check, Copy, ExternalLink } from 'lucide-react';
import { useGenerateReferralLink } from '@/features/referrals/hooks';
import { propertyKeys } from '@/lib/constants/query-keys';
import { PropertyStatus } from '../types';
import type { PropertyResponse } from '../types';
// MOCK DATA - Remover cuando haya suficientes propiedades reales en DB
import { MOCK_PAGINATED_RESPONSE } from '../data/mock-properties';

export function ReferPropertiesTab() {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const generateLink = useGenerateReferralLink();

  // Debounce search to avoid firing API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0); // Reset to first page on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch real published properties
  const { data, isLoading } = useQuery({
    queryKey: propertyKeys.list({ page, size: pageSize, searchText: debouncedSearch, status: PropertyStatus.PUBLISHED }),
    queryFn: () => propertiesApi.getAll({ page, size: pageSize, searchText: debouncedSearch, status: PropertyStatus.PUBLISHED }),
    staleTime: 5 * 60 * 1000,
  });

  // MOCK DATA - Propiedades mock filtradas por búsqueda
  const mockPageData = MOCK_PAGINATED_RESPONSE(page, pageSize, {
    searchText: debouncedSearch || undefined,
  });

  // Combinar reales + mocks (mismo patrón que /propiedades)
  const realContent = (!isLoading && data?.content) ? data.content : [];
  const combinedContent = page === 0
    ? [...realContent, ...mockPageData.content]
    : mockPageData.content;
  const displayData = {
    content: combinedContent,
    totalPages: mockPageData.totalPages,
    totalElements: (data?.totalElements ?? 0) + mockPageData.totalElements,
    first: mockPageData.first,
    last: mockPageData.last,
  };

  const isMock = (property: PropertyResponse) =>
    String(property.id).startsWith('mock-airbnb-');

  const handleGenerateAndCopyLink = async (property: PropertyResponse) => {
    if (!user?.id) {
      alert('Debes iniciar sesión para generar links de referido');
      return;
    }

    try {
      const response = await generateLink.mutateAsync({
        propertyId: property.id.toString(),
      });

      await navigator.clipboard.writeText(response.fullUrl);

      setCopiedId(property.id.toString());
      setTimeout(() => setCopiedId(null), 3000);
    } catch (error) {
      console.error('Error generating referral link:', error);
      alert('Error al generar el link de referido. Intenta de nuevo.');
    }
  };

  if (isLoading && combinedContent.length === 0) {
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

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar propiedades..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>💡 Cómo funciona:</strong> Haz click en "Copiar Link" en cualquier propiedad.
          Comparte ese link y gana comisiones por cada reserva que se realice a través de tu enlace.
        </p>
      </div>

      {/* Empty state */}
      {displayData.content.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            {debouncedSearch
              ? 'No se encontraron propiedades con esa búsqueda'
              : 'No hay propiedades disponibles para referir'}
          </p>
        </div>
      )}

      {/* Properties Grid */}
      {displayData.content.length > 0 && (
        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayData.content.map((property) => {
              const mock = isMock(property);
              const propertyIdStr = property.id.toString();
              const isCopied = copiedId === propertyIdStr;

              return (
                <div key={property.id} className="flex flex-col gap-2">
                  <PropertyCard property={property} showActions={false} />

                  {/* Referral Action Buttons */}
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex-1">
                          <Button
                            onClick={() => handleGenerateAndCopyLink(property)}
                            disabled={mock || generateLink.isPending}
                            className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
                            size="sm"
                          >
                            {isCopied ? (
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
                        </span>
                      </TooltipTrigger>
                      {mock && (
                        <TooltipContent>
                          <p>Disponibilidad sujeta a Airbnb</p>
                        </TooltipContent>
                      )}
                    </Tooltip>

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
              );
            })}
          </div>
        </TooltipProvider>
      )}

      {/* Pagination */}
      {displayData.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={displayData.first}
          >
            Anterior
          </Button>

          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Página {page + 1} de {displayData.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(displayData.totalPages - 1, p + 1))}
            disabled={displayData.last}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
