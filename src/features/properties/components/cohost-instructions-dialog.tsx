'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CohostInstructionsDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
}

export function CohostInstructionsDialog({
  open,
  onClose,
  onConfirm,
  isConfirming = false,
}: CohostInstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Agrega a GYDI como co-host en Airbnb
          </DialogTitle>
          <DialogDescription className="text-base">
            Para publicar tu propiedad, necesitas agregar la cuenta GYDI como co-host en tu anuncio de Airbnb.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <p className="font-semibold text-sm">Datos de la cuenta GYDI en Airbnb:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Email:</span>
                <code className="font-mono text-sm font-semibold bg-background px-2 py-0.5 rounded border">
                  gydiproperties@gmail.com
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Teléfono:</span>
                <code className="font-mono text-sm font-semibold bg-background px-2 py-0.5 rounded border">
                  +17542317912
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-sm">Pasos para agregar el co-host:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground">
              <li>Inicia sesión en tu cuenta de Airbnb</li>
              <li>Ve a tu anuncio de la propiedad</li>
              <li>Desliza hacia abajo hasta encontrar la sección <strong className="text-foreground">Sobre el anfitrión</strong></li>
              <li>Justo debajo encontrarás el panel de <strong className="text-foreground">Co-anfitriones</strong>, ingresa ahí</li>
              <li>Haz clic en <strong className="text-foreground">Invitar a un co-anfitrión</strong></li>
              <li>Ingresa el email o teléfono de GYDI indicados arriba</li>
              <li>Envía la invitación y espera a que sea aceptada</li>
            </ol>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-3">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>¿Por qué es necesario?</strong> El equipo GYDI necesita acceso como co-anfitrión para gestionar y verificar tu propiedad antes de aprobar su publicación.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isConfirming}
            className="w-full sm:w-auto"
          >
            Entendido
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isConfirming}
            className="w-full sm:w-auto"
          >
            {isConfirming ? 'Enviando...' : 'Ya agregué a GYDI como co-host en Airbnb'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
