import { CollaborationPropertyCard } from './collaboration-property-card';
import type { MarketplacePropertySummary } from '../../types';

interface MarketplaceGridProps {
  properties: MarketplacePropertySummary[];
}

export function MarketplaceGrid({ properties }: MarketplaceGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="font-heading text-lg text-muted-foreground">
          No hay propiedades disponibles para colaborar
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Prueba ajustando los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <CollaborationPropertyCard key={property.propertyId} property={property} />
      ))}
    </div>
  );
}
