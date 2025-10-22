import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Maximize, Star, ArrowLeft, Share2, Heart, Calendar } from 'lucide-react';

// Mock data - en producción esto vendría de la API
const getPropertyById = (id: string) => {
  const properties: Record<string, any> = {
    '1': {
      id: 1,
      title: 'Villa de Lujo Frente al Mar',
      location: 'Bali, Indonesia',
      price: 450,
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      ],
      rating: 4.9,
      reviews: 128,
      description: 'Espectacular villa de lujo ubicada frente al mar en Bali. Con vistas panorámicas al océano, piscina infinity y acabados de primera calidad. Perfecta para familias o grupos que buscan una experiencia inolvidable.',
      amenities: ['Piscina Infinity', 'WiFi Alta Velocidad', 'Aire Acondicionado', 'Cocina Completa', 'Servicio de Limpieza', 'Estacionamiento'],
    },
    // Puedes agregar más propiedades aquí
  };

  return properties[id] || properties['1']; // Fallback a la propiedad 1
};

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = getPropertyById(params.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Back Button */}
      <div className="border-b bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/propiedades">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Propiedades
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="mb-2 text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-lg font-medium">{property.location}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{property.rating}</span>
              <span className="text-muted-foreground">({property.reviews} reseñas)</span>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:row-span-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
          {property.images.slice(1).map((image: string, index: number) => (
            <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={image}
                alt={`${property.title} ${index + 2}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Features */}
            <div className="mb-8 rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="mb-4 text-2xl font-extrabold">Características</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Bed className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Habitaciones</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-500/10 p-3">
                    <Bath className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Baños</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-500/10 p-3">
                    <Maximize className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{property.area}</div>
                    <div className="text-sm text-muted-foreground">m²</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-extrabold">Descripción</h2>
              <p className="leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-extrabold">Comodidades</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {property.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 rounded-xl bg-card p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border-2 border-border/50 bg-card p-6 shadow-2xl">
              <div className="mb-6">
                <div className="mb-1 text-3xl font-extrabold text-foreground">${property.price}</div>
                <div className="text-muted-foreground">por noche</div>
              </div>

              <div className="mb-6 space-y-3">
                <Button className="w-full" size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservar Ahora
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  No se realizará ningún cargo todavía
                </p>
              </div>

              <div className="space-y-3 border-t border-border/50 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">$450 × 5 noches</span>
                  <span className="font-semibold">$2,250</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tarifa de servicio</span>
                  <span className="font-semibold">$180</span>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-3">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-extrabold">$2,430</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-primary/5 p-4">
                <p className="text-center text-sm font-medium text-primary">
                  🎉 ¡Gana comisiones promocionando esta propiedad!
                </p>
                <Button asChild variant="link" className="mt-2 w-full">
                  <Link href="/register">Hazte Afiliado</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
