'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { propertyActionsApi } from '@/features/properties/api/property-actions.api';
import { useAdminApproveProperty, useAdminDenyProperty } from '@/features/properties/hooks/use-property-actions';
import { PropertyStatusBadge } from '@/features/properties/components/property-status-badge';
import type { PropertyResponse } from '@/features/properties/types';
import { formatCurrency } from '@/lib/utils/format';

export default function AdminPropertiesPage() {
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [denyReason, setDenyReason] = useState('');

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ['admin', 'properties', 'pending'],
    queryFn: () => propertyActionsApi.getPendingProperties(),
    staleTime: 30 * 1000,
  });

  const approveProperty = useAdminApproveProperty();
  const denyProperty = useAdminDenyProperty();

  const handleApprove = (propertyId: string) => {
    approveProperty.mutate(propertyId);
  };

  const handleDenyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setDenyReason('');
    setDenyDialogOpen(true);
  };

  const handleDenyConfirm = () => {
    if (selectedPropertyId && denyReason.trim()) {
      denyProperty.mutate({ propertyId: selectedPropertyId, reason: denyReason });
      setDenyDialogOpen(false);
      setSelectedPropertyId(null);
      setDenyReason('');
    }
  };

  const properties: PropertyResponse[] = pendingData?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Propiedades</h1>
          <p className="text-muted-foreground mt-2">
            Revisa y modera las propiedades enviadas por los anfitriones
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pendingData?.totalElements ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Aprobadas hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rechazadas hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades Pendientes de Aprobación</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
              <p className="text-muted-foreground">No hay propiedades pendientes de aprobación</p>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  {/* Thumbnail placeholder */}
                  <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {property.mainImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={property.mainImageUrl}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate">{property.title}</h3>
                      <PropertyStatusBadge status={property.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {property.city}, {property.country}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{property.bedrooms} hab.</span>
                      <span>·</span>
                      <span>{property.bathrooms} baños</span>
                      <span>·</span>
                      <span>{property.maxGuests} huéspedes</span>
                      <span>·</span>
                      <span>{formatCurrency(property.pricePerNight, property.currency)}/noche</span>
                    </div>
                    {property.submittedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Enviada: {new Date(property.submittedAt).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(property.id)}
                      disabled={approveProperty.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDenyClick(property.id)}
                      disabled={denyProperty.isPending}
                    >
                      Rechazar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deny Dialog */}
      <AlertDialog open={denyDialogOpen} onOpenChange={setDenyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar Propiedad</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, indica el motivo del rechazo. El anfitrión verá este mensaje y podrá corregir los problemas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Motivo del rechazo..."
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
            className="my-2"
            rows={4}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPropertyId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDenyConfirm}
              disabled={!denyReason.trim() || denyProperty.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar Rechazo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
