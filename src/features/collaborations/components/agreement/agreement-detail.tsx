'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAgreement } from '../../hooks/use-agreement';
import { useApproveDeliverable } from '../../hooks/use-approve-deliverable';
import { useCancelAgreement } from '../../hooks/use-cancel-agreement';
import type { AgreementDeliverable, DeliverableStatus } from '../../types';

const DELIVERABLE_STATUS_LABELS: Record<DeliverableStatus, string> = {
  PENDING: 'Pendiente',
  SUBMITTED: 'Enviado',
  APPROVED: 'Aprobado',
  REVISION_REQUESTED: 'Revisión solicitada',
};

const COMPENSATION_LABELS: Record<string, string> = {
  free_stay: 'Estadía gratis',
  cash: 'Pago en efectivo',
  hybrid: 'Híbrido',
  affiliate: 'Comisión de afiliado',
  experience_exchange: 'Intercambio de experiencia',
};

interface AgreementDetailProps {
  agreementId: number;
}

function DeliverableRow({
  deliverable,
  agreementId,
}: {
  deliverable: AgreementDeliverable;
  agreementId: number;
}) {
  const { mutate: approve, isPending: approving } = useApproveDeliverable(agreementId);

  return (
    <div className="flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium capitalize">{deliverable.type.replace('_', ' ')}</p>
        <p className="text-xs text-muted-foreground">Cantidad: {deliverable.quantity}</p>
        {deliverable.revisionFeedback && (
          <p className="text-xs text-destructive mt-1">{deliverable.revisionFeedback}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {DELIVERABLE_STATUS_LABELS[deliverable.status]}
        </Badge>
        {deliverable.status === 'SUBMITTED' && (
          <Button
            size="sm"
            variant="outline"
            className="min-h-9"
            disabled={approving}
            onClick={() => approve(deliverable.id)}
          >
            {approving ? 'Aprobando...' : 'Aprobar'}
          </Button>
        )}
      </div>
    </div>
  );
}

export function AgreementDetail({ agreementId }: AgreementDetailProps) {
  const { data: agreement, isLoading, isError } = useAgreement(agreementId);
  const { mutate: cancelAgreement, isPending: cancelling } = useCancelAgreement();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !agreement) {
    return (
      <p className="text-center text-sm text-destructive">
        Error al cargar el acuerdo.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold">{agreement.propertyTitle}</h2>
          <Badge variant="secondary">{agreement.status}</Badge>
        </div>
        {['ACTIVE', 'IN_PROGRESS'].includes(agreement.status) && (
          <Button
            variant="destructive"
            size="sm"
            className="min-h-11"
            disabled={cancelling}
            onClick={() => cancelAgreement(agreementId)}
          >
            {cancelling ? 'Cancelando...' : 'Cancelar acuerdo'}
          </Button>
        )}
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <p className="font-heading font-semibold">Detalles del acuerdo</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Check-in:</span>
            <span>{new Date(agreement.checkInDate).toLocaleDateString('es', { dateStyle: 'medium' })}</span>
            <span className="text-muted-foreground">Check-out:</span>
            <span>{new Date(agreement.checkOutDate).toLocaleDateString('es', { dateStyle: 'medium' })}</span>
            <span className="text-muted-foreground">Entrega contenido:</span>
            <span>{new Date(agreement.deliveryDeadline).toLocaleDateString('es', { dateStyle: 'medium' })}</span>
            <span className="text-muted-foreground">Publicacion:</span>
            <span>{new Date(agreement.postingDeadline).toLocaleDateString('es', { dateStyle: 'medium' })}</span>
            <span className="text-muted-foreground">Compensacion:</span>
            <span>{COMPENSATION_LABELS[agreement.compensation.type] ?? agreement.compensation.type}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <p className="font-heading font-semibold">Entregables</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {agreement.deliverables.map((d) => (
            <DeliverableRow key={d.id} deliverable={d} agreementId={agreementId} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
