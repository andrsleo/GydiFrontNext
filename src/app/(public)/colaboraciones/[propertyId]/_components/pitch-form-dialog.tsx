'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PitchForm } from '@/features/collaborations/components/pitch/pitch-form';

interface PitchFormDialogProps {
  propertyId: number;
  propertyTitle: string;
}

export function PitchFormDialog({ propertyId, propertyTitle }: PitchFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full min-h-11 bg-[hsl(var(--gydi-primary))] text-white hover:bg-[hsl(var(--gydi-primary-light))]"
        >
          Enviar Pitch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            Enviar pitch a {propertyTitle}
          </DialogTitle>
        </DialogHeader>
        <PitchForm
          propertyId={propertyId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
