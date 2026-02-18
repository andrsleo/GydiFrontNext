'use client';

import { ReferPropertiesTab } from '@/features/properties/components';

export default function ReferPropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Referir Propiedades</h1>
        <p className="text-muted-foreground">
          Refiere propiedades y gana comisiones
        </p>
      </div>

      {/* Content */}
      <ReferPropertiesTab />
    </div>
  );
}
