'use client';

import { useState } from 'react';
import {
  MousePointerClick,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Download,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data - replace with real API calls
const referralStats = [
  {
    name: 'Total de Clicks',
    value: '1,234',
    change: '+23.1%',
    icon: MousePointerClick,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Conversiones',
    value: '48',
    change: '+8',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Tasa de Conversión',
    value: '3.89%',
    change: '-0.21%',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Días Activos',
    value: '42',
    change: 'Último click: Hace 2h',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const referrals = [
  {
    id: 1,
    code: 'REF-ABC123',
    property: 'Villa Paradise - Cancún',
    clicks: 156,
    conversions: 8,
    conversionRate: 5.13,
    commission: 350,
    status: 'active',
    createdAt: '2025-09-15',
    lastClick: '2025-10-19',
  },
  {
    id: 2,
    code: 'REF-XYZ789',
    property: 'Beach House - Playa del Carmen',
    clicks: 243,
    conversions: 12,
    conversionRate: 4.94,
    commission: 280,
    status: 'active',
    createdAt: '2025-09-01',
    lastClick: '2025-10-20',
  },
  {
    id: 3,
    code: 'REF-DEF456',
    property: 'Mountain Cabin - Valle de Bravo',
    clicks: 89,
    conversions: 3,
    conversionRate: 3.37,
    commission: 420,
    status: 'active',
    createdAt: '2025-09-22',
    lastClick: '2025-10-18',
  },
  {
    id: 4,
    code: 'REF-GHI012',
    property: 'City Loft - CDMX',
    clicks: 312,
    conversions: 15,
    conversionRate: 4.81,
    commission: 190,
    status: 'active',
    createdAt: '2025-08-10',
    lastClick: '2025-10-20',
  },
  {
    id: 5,
    code: 'REF-JKL345',
    property: 'Ocean View Penthouse - Puerto Vallarta',
    clicks: 67,
    conversions: 2,
    conversionRate: 2.99,
    commission: 450,
    status: 'paused',
    createdAt: '2025-10-01',
    lastClick: '2025-10-15',
  },
];

const statusConfig = {
  active: { label: 'Activo', color: 'bg-green-100 text-green-800' },
  paused: { label: 'Pausado', color: 'bg-gray-100 text-gray-800' },
};

export default function ReferidosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredReferrals = referrals.filter(
    (referral) =>
      referral.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (referralCode: string, id: number) => {
    const affiliateLink = `${window.location.origin}/propiedades?ref=${referralCode}`;
    navigator.clipboard.writeText(affiliateLink);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referidos</h1>
          <p className="text-muted-foreground">
            Monitorea tus enlaces de referido y su rendimiento
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {referralStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.name}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o propiedad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Filtrar por Fecha
        </Button>
      </div>

      {/* Referrals Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Propiedad
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Clicks
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Conversiones
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tasa Conv.
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Comisión
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReferrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono">
                        {referral.code}
                      </code>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{referral.property}</p>
                      <p className="text-xs text-muted-foreground">
                        Creado: {referral.createdAt}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold">{referral.clicks}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-blue-600">
                      {referral.conversions}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-green-600">
                      {referral.conversionRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold">${referral.commission}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        statusConfig[referral.status as keyof typeof statusConfig]
                          .color
                      }`}
                    >
                      {
                        statusConfig[referral.status as keyof typeof statusConfig]
                          .label
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyLink(referral.code, referral.id)}
                        title="Copiar enlace"
                      >
                        {copiedId === referral.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(
                            `/dashboard/referidos/${referral.id}`,
                            '_blank'
                          )
                        }
                        title="Ver detalles"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredReferrals.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No se encontraron referidos
            </h3>
            <p className="text-sm text-muted-foreground">
              Intenta con otro término de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Performance Tips */}
      <div className="rounded-lg border bg-blue-50 p-6">
        <h3 className="mb-2 font-semibold text-blue-900">
          💡 Consejos para mejorar tu tasa de conversión
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Comparte tus enlaces en grupos relevantes de Facebook y WhatsApp</li>
          <li>Crea contenido de valor en Instagram y TikTok mostrando las propiedades</li>
          <li>Usa descripciones atractivas y fotos de alta calidad en tus publicaciones</li>
          <li>Incluye un llamado a la acción claro en cada publicación</li>
        </ul>
      </div>
    </div>
  );
}
