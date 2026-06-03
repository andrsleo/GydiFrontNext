import { PropertyCalendar } from '@/features/calendar';
import { SeasonPricingConfig } from '@/features/calendar';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyCalendarPage({ params }: Props) {
  const { id } = await params;
  const propertyId = Number(id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Gestionar disponibilidad</h1>
        <p className="text-muted-foreground">
          Bloquea fechas, fija precios personalizados y configura multiplicadores por temporada.
        </p>
      </div>

      <PropertyCalendar
        propertyId={propertyId}
        currency="USD"
        isHost={true}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">Precios por temporada</h2>
        <SeasonPricingConfig propertyId={propertyId} />
      </div>
    </div>
  );
}
