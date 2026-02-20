'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { PropertyStatus } from '../types';
import {
  usePublishProperty,
  useActivateProperty,
  useDeactivateProperty,
  useDeleteProperty,
} from '../hooks';
import { useRouter } from 'next/navigation';
import { useHostHasPaymentMethod } from '@/features/subscriptions/hooks/use-host-payment-method';

interface PropertyActionsMenuProps {
  propertyId: string;
  status: PropertyStatus;
  onEdit?: () => void;
}

export function PropertyActionsMenu({ propertyId, status, onEdit }: PropertyActionsMenuProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const publishProperty = usePublishProperty();
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

  const handlePublish = () => {
    publishProperty.mutate(propertyId);
    setShowPublishDialog(false);
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
    publishProperty.isPending ||
    activateProperty.isPending ||
    deactivateProperty.isPending ||
    deleteProperty.isPending;

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

          {/* Publicar - solo para DRAFT */}
          {status === PropertyStatus.DRAFT && (
            hasHostPaymentMethod ? (
              <DropdownMenuItem onClick={() => setShowPublishDialog(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Publicar
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
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publicar
                      </DropdownMenuItem>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[250px]">
                    <p>Agrega un método de pago para publicar. La plataforma cobra comisiones cuando se realizan reservas.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          )}

          {/* Inactivar - para DRAFT y PUBLISHED */}
          {(status === PropertyStatus.DRAFT || status === PropertyStatus.PUBLISHED) && (
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

          {/* Activar - solo para INACTIVE */}
          {status === PropertyStatus.INACTIVE && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleActivate}>
                <Eye className="h-4 w-4 mr-2" />
                Activar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo de confirmación para publicar */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Publicar propiedad?</AlertDialogTitle>
            <AlertDialogDescription>
              La propiedad será visible en el catálogo público y los usuarios podrán verla y reservarla.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>Publicar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar propiedad?</AlertDialogTitle>
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