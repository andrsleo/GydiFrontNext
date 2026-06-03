'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Eye, EyeOff, SendHorizonal, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { PropertyStatus } from '../types';
import {
  useSubmitForApproval,
  useActivateProperty,
  useDeactivateProperty,
  useDeleteProperty,
} from '../hooks';
import { useRouter } from 'next/navigation';
import { useHostHasPaymentMethod } from '@/features/subscriptions/hooks/use-host-payment-method';
import { AddPaymentMethodDialog } from '@/features/subscriptions/components/add-payment-method-dialog';

interface PropertyActionsMenuProps {
  propertyId: string;
  status: PropertyStatus;
  denialReason?: string;
  onEdit?: () => void;
}

export function PropertyActionsMenu({ propertyId, status, denialReason, onEdit }: PropertyActionsMenuProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showDenialReasonDialog, setShowDenialReasonDialog] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);

  const submitForApproval = useSubmitForApproval();
  const activateProperty = useActivateProperty();
  const deactivateProperty = useDeactivateProperty();
  const deleteProperty = useDeleteProperty();
  const { hasHostPaymentMethod } = useHostHasPaymentMethod();

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/dashboard/propiedades/${propertyId}/editar`);
    }
  };

  const handleSubmitForApproval = () => {
    submitForApproval.mutate(propertyId);
    setShowSubmitDialog(false);
  };

  const handleActivate = () => {
    activateProperty.mutate(propertyId);
  };

  const handleDeactivate = () => {
    deactivateProperty.mutate(propertyId);
  };

  const handleDelete = () => {
    deleteProperty.mutate(propertyId);
    setShowDeleteDialog(false);
  };

  const isPending =
    submitForApproval.isPending ||
    activateProperty.isPending ||
    deactivateProperty.isPending ||
    deleteProperty.isPending;

  // Re-submission from DENY requires explicit host action + payment method
  const canSubmitForApproval = status === PropertyStatus.DENY;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={(e) => e.preventDefault()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Editar - disponible para todos los estados */}
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Re-enviar a Revisión - solo para DENY */}
          {canSubmitForApproval && (
            hasHostPaymentMethod ? (
              <DropdownMenuItem onClick={() => setShowSubmitDialog(true)}>
                <SendHorizonal className="h-4 w-4 mr-2" />
                Re-enviar a Revisión
              </DropdownMenuItem>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="w-full">
                      <DropdownMenuItem
                        disabled
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-not-allowed opacity-50"
                      >
                        <SendHorizonal className="h-4 w-4 mr-2" />
                        Re-enviar a Revisión
                      </DropdownMenuItem>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[250px]">
                    <p>Agrega una tarjeta para enviar a revisión. La plataforma cobra comisiones cuando se realizan reservas.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          )}

          {/* Ver motivo de rechazo - solo para DENY */}
          {status === PropertyStatus.DENY && denialReason && (
            <DropdownMenuItem onClick={() => setShowDenialReasonDialog(true)}>
              <AlertCircle className="h-4 w-4 mr-2" />
              Ver motivo de rechazo
            </DropdownMenuItem>
          )}

          {/* Inactivar - solo para PUBLISHED */}
          {status === PropertyStatus.PUBLISHED && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeactivate}
                className="text-destructive focus:text-destructive"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Inactivar
              </DropdownMenuItem>
            </>
          )}

          {/* Reactivar - solo para INACTIVE */}
          {status === PropertyStatus.INACTIVE && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleActivate}>
                <Eye className="h-4 w-4 mr-2" />
                Reactivar
              </DropdownMenuItem>
            </>
          )}

          {/* PENDING_APPROVAL - solo info, sin acciones de transición */}
          {status === PropertyStatus.PENDING_APPROVAL && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled
                onSelect={(e) => e.preventDefault()}
                className="cursor-default opacity-70 text-xs"
              >
                En revisión por el equipo de GYDI
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          {/* Eliminar - disponible excepto en PENDING_APPROVAL */}
          {status !== PropertyStatus.PENDING_APPROVAL && (
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo de agregar tarjeta (requerida antes de re-enviar a revisión) */}
      <AddPaymentMethodDialog
        open={showAddCardDialog}
        onOpenChange={setShowAddCardDialog}
        description="Para enviar tu propiedad a revisión necesitas agregar una tarjeta. La plataforma cobra comisiones cuando se realizan reservas en tu propiedad."
      />

      {/* Diálogo de confirmación para re-enviar a revisión */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Re-enviar propiedad a revisión</AlertDialogTitle>
            <AlertDialogDescription>
              El equipo de GYDI revisará tu propiedad y te notificará cuando esté aprobada o si requiere cambios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitForApproval}>Enviar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para ver motivo de rechazo */}
      <Dialog open={showDenialReasonDialog} onOpenChange={setShowDenialReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo de rechazo</DialogTitle>
            <DialogDescription>
              El equipo de GYDI rechazó tu propiedad por el siguiente motivo:
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-foreground">
            {denialReason}
          </div>
          <p className="text-sm text-muted-foreground">
            Edita tu propiedad para corregir los problemas y envíala nuevamente a revisión.
          </p>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar propiedad</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La propiedad será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
