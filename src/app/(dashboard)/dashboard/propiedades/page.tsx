'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Users,
  Link as LinkIcon,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data - replace with real API calls
const properties = [
  {
    id: 1,
    name: 'Villa Paradise',
    location: 'Cancún, Quintana Roo',
    price: 350,
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80',
    commission: 10,
    category: 'Villa',
  },
  {
    id: 2,
    name: 'Beach House Sunset',
    location: 'Playa del Carmen, Quintana Roo',
    price: 280,
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    commission: 8,
    category: 'Casa',
  },
  {
    id: 3,
    name: 'Mountain Cabin Retreat',
    location: 'Valle de Bravo, Estado de México',
    price: 220,
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
    commission: 9,
    category: 'Cabaña',
  },
  {
    id: 4,
    name: 'City Loft Modern',
    location: 'CDMX, Ciudad de México',
    price: 190,
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    commission: 7,
    category: 'Departamento',
  },
  {
    id: 5,
    name: 'Ocean View Penthouse',
    location: 'Puerto Vallarta, Jalisco',
    price: 450,
    bedrooms: 5,
    bathrooms: 4,
    guests: 10,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    commission: 12,
    category: 'Penthouse',
  },
  {
    id: 6,
    name: 'Colonial House Centro',
    location: 'San Miguel de Allende, Guanajuato',
    price: 300,
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
    commission: 10,
    category: 'Casa',
  },
];

export default function PropiedadesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ['all', 'Villa', 'Casa', 'Cabaña', 'Departamento', 'Penthouse'];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || property.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (propertyId: number) => {
    const affiliateLink = `${window.location.origin}/propiedades/${propertyId}?ref=affiliate123`;
    navigator.clipboard.writeText(affiliateLink);
    setCopiedId(propertyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Propiedades</h1>
        <p className="text-muted-foreground">
          Explora propiedades y genera tus enlaces de afiliado
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 rounded-lg border bg-card p-4">
        <div>
          <p className="text-sm text-muted-foreground">Total de Propiedades</p>
          <p className="text-2xl font-bold">{filteredProperties.length}</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div>
          <p className="text-sm text-muted-foreground">Comisión Promedio</p>
          <p className="text-2xl font-bold">9.5%</p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={property.image}
                alt={property.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                {property.commission}% comisión
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-lg">{property.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  {property.location}
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Bed className="mr-1 h-4 w-4" />
                  {property.bedrooms}
                </div>
                <div className="flex items-center">
                  <Bath className="mr-1 h-4 w-4" />
                  {property.bathrooms}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {property.guests}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Desde</p>
                  <p className="text-xl font-bold">${property.price}</p>
                  <p className="text-xs text-muted-foreground">por noche</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(`/propiedades/${property.id}`, '_blank')}
                    title="Ver detalles"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleCopyLink(property.id)}
                    size="sm"
                    className="gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {copiedId === property.id ? 'Copiado!' : 'Link'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No se encontraron propiedades</h3>
          <p className="text-sm text-muted-foreground">
            Intenta con otro término de búsqueda o categoría
          </p>
        </div>
      )}
    </div>
  );
}
