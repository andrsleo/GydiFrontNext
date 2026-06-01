/**
 * Collaboration property detail page — SSR
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { collaborationsApi } from '@/features/collaborations/api/collaborations.api';
import { Badge } from '@/components/ui/badge';
import { PitchFormDialog } from './_components/pitch-form-dialog';
import type { Metadata } from 'next';

const COMPENSATION_LABELS: Record<string, string> = {
  free_stay: 'Estadía gratis',
  cash: 'Pago en efectivo',
  hybrid: 'Híbrido',
  affiliate: 'Comisión de afiliado',
  experience_exchange: 'Intercambio de experiencia',
};

interface PageProps {
  params: Promise<{ propertyId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { propertyId } = await params;
  try {
    const property = await collaborationsApi.getMarketplaceProperty(Number(propertyId));
    return {
      title: `${property.title} | Colaboraciones GYDI`,
      description: property.description ?? `Colabora con ${property.title} en ${property.location.city}`,
    };
  } catch {
    return { title: 'Propiedad | Colaboraciones GYDI' };
  }
}

export default async function ColaboracionPropertyPage({ params }: PageProps) {
  const { propertyId } = await params;
  const numericId = Number(propertyId);

  if (!numericId || isNaN(numericId)) {
    notFound();
  }

  let property: Awaited<ReturnType<typeof collaborationsApi.getMarketplaceProperty>>;
  try {
    property = await collaborationsApi.getMarketplaceProperty(numericId);
  } catch {
    notFound();
  }

  const mainImage = property.images.find((img) => img.displayOrder === 0) ?? property.images[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Images */}
        {mainImage && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
            <Image
              src={mainImage.url}
              alt={property.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold sm:text-3xl">{property.title}</h1>
              <p className="mt-1 text-muted-foreground">
                {property.location.city}, {property.location.country}
              </p>
              <p className="text-sm text-muted-foreground capitalize">{property.propertyType}</p>
            </div>

            {property.description && (
              <div>
                <h2 className="font-heading text-lg font-semibold mb-2">Descripcion</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </div>
            )}

            {property.amenities.length > 0 && (
              <div>
                <h2 className="font-heading text-lg font-semibold mb-2">Amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <Badge key={a} variant="outline" className="text-xs">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: compensation + CTA */}
          <div className="space-y-4">
            <div className="rounded-2xl border p-4 space-y-3">
              <h2 className="font-heading text-base font-semibold">Compensaciones aceptadas</h2>
              <div className="flex flex-wrap gap-2">
                {property.acceptedCompensations.map((comp) => (
                  <Badge key={comp} variant="secondary">
                    {COMPENSATION_LABELS[comp] ?? comp}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Host: {property.hostDisplayName}
              </p>
              <PitchFormDialog propertyId={numericId} propertyTitle={property.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
