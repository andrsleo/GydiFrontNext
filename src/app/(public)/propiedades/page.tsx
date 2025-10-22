import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Maximize, Star, Search, SlidersHorizontal } from 'lucide-react';

// Mock data de propiedades
const properties = [
  {
    id: 1,
    title: 'Villa de Lujo Frente al Mar',
    location: 'Bali, Indonesia',
    price: 450,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    rating: 4.9,
    reviews: 128,
    badge: 'Popular',
    badgeColor: 'primary',
  },
  {
    id: 2,
    title: 'Apartamento Moderno en el Centro',
    location: 'Dubai, UAE',
    price: 320,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80',
    rating: 4.8,
    reviews: 95,
  },
  {
    id: 3,
    title: 'Casa de Campo Toscana',
    location: 'Toscana, Italia',
    price: 280,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    rating: 4.7,
    reviews: 72,
    badge: 'Nuevo',
    badgeColor: 'purple',
  },
  {
    id: 4,
    title: 'Penthouse de Lujo Manhattan',
    location: 'Nueva York, USA',
    price: 850,
    bedrooms: 5,
    bathrooms: 4,
    area: 380,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    rating: 5.0,
    reviews: 156,
    badge: 'Premium',
    badgeColor: 'blue',
  },
  {
    id: 5,
    title: 'Cabaña en las Montañas',
    location: 'Aspen, Colorado',
    price: 380,
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 6,
    title: 'Loft Moderno Industrial',
    location: 'Barcelona, España',
    price: 290,
    bedrooms: 2,
    bathrooms: 2,
    area: 140,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    rating: 4.8,
    reviews: 103,
  },
  {
    id: 7,
    title: 'Villa con Piscina Infinity',
    location: 'Santorini, Grecia',
    price: 520,
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    rating: 4.9,
    reviews: 142,
    badge: 'Popular',
    badgeColor: 'primary',
  },
  {
    id: 8,
    title: 'Apartamento Vista al Mar',
    location: 'Miami Beach, Florida',
    price: 410,
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80',
    rating: 4.7,
    reviews: 87,
  },
  {
    id: 9,
    title: 'Casa Colonial Restaurada',
    location: 'Cartagena, Colombia',
    price: 260,
    bedrooms: 3,
    bathrooms: 2,
    area: 170,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    rating: 4.6,
    reviews: 64,
  },
];

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in-down mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Star className="h-4 w-4" />
              <span>Más de 500 propiedades disponibles</span>
            </div>

            <h1 className="animate-fade-in-up mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Explora Nuestro{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Catálogo de Propiedades
              </span>
            </h1>

            <p className="animate-fade-in-up animation-delay-100 mb-8 text-base text-muted-foreground sm:text-lg md:text-xl">
              Propiedades inmobiliarias en venta y destinos vacacionales premium para generar ingresos
            </p>

            {/* Search Bar */}
            <div className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl">
              <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-xl backdrop-blur-sm sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por ubicación, ciudad o país..."
                    className="h-12 w-full rounded-xl border border-border/50 bg-background pl-12 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button size="lg" className="h-12 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{properties.length}</span> propiedades
            </p>

            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {properties.map((property, index) => (
              <Link
                key={property.id}
                href={`/propiedades/${property.id}`}
                className={`animate-scale-in group relative overflow-hidden rounded-3xl bg-card shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Badge */}
                {property.badge && (
                  <div
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg ${
                      property.badgeColor === 'primary'
                        ? 'bg-gradient-to-r from-primary to-blue-600'
                        : property.badgeColor === 'purple'
                          ? 'bg-purple-600'
                          : 'bg-gradient-to-r from-blue-600 to-blue-500'
                    }`}
                  >
                    {property.badge}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Location */}
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{property.location}</span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-extrabold text-foreground transition-colors group-hover:text-primary">
                    {property.title}
                  </h3>

                  {/* Features */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="h-4 w-4" />
                      <span>{property.area}m²</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-foreground">{property.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({property.reviews} reseñas)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between border-t border-border/50 pt-4">
                    <div>
                      <div className="text-2xl font-extrabold text-foreground">${property.price}</div>
                      <div className="text-sm text-muted-foreground">por noche</div>
                    </div>

                    <Button size="sm" className="transition-all group-hover:scale-105">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="transition-all hover:scale-105 hover:border-primary hover:bg-primary/5"
            >
              Cargar Más Propiedades
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t bg-gradient-to-br from-primary via-primary/95 to-blue-600 py-16 text-primary-foreground sm:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl md:text-5xl">
            ¿Listo para Generar Ingresos?
          </h2>
          <p className="mb-8 text-base opacity-95 sm:text-lg">
            Únete y empieza a vender propiedades o gana comisiones promocionando destinos vacacionales
          </p>

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <Link href="/register">Comenzar Ahora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
