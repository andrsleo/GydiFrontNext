import { Metadata } from 'next';
import { Building2, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Gestión de Propiedades | Admin GYDI',
  description: 'Moderar propiedades y aprobar/rechazar publicaciones',
};

export default function AdminPropertiesPage() {
  const stats = {
    total: 3456,
    published: 2891,
    pending: 245,
    rejected: 320,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Propiedades</h1>
          <p className="text-muted-foreground mt-2">
            Moderar propiedades, aprobar/rechazar publicaciones
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Publicadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.published.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rechazadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Pendientes de Aprobación</CardTitle>
          <CardDescription>Revisa y modera las propiedades enviadas por usuarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar propiedades..." className="pl-10" />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Villa de Lujo en Marbella</h3>
                  <p className="text-sm text-muted-foreground">
                    Publicado por: juan.perez@example.com
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">5 habitaciones</Badge>
                    <Badge variant="outline">$450/noche</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default">Aprobar</Button>
                  <Button size="sm" variant="outline">Ver</Button>
                  <Button size="sm" variant="destructive">Rechazar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">🚧 En Desarrollo</CardTitle>
          <CardDescription>
            Próximamente: Sistema completo de moderación de propiedades con notificaciones automáticas
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
