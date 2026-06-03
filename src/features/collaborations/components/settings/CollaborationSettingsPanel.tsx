'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Zap, DollarSign, GitMerge, Link2, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  useGetCollaborationSettings,
  useUpdateCollaborationSettings,
} from '../../hooks/use-collaboration-settings';

// ── Compensation types ────────────────────────────────────────────────────────

interface CompensationOption {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const COMPENSATION_OPTIONS: CompensationOption[] = [
  {
    value: 'FREE_STAY',
    label: 'Estancia gratuita',
    description: 'El creador se hospeda sin costo a cambio de contenido',
    icon: Sparkles,
  },
  {
    value: 'CASH',
    label: 'Pago en efectivo',
    description: 'Compensación monetaria directa al creador',
    icon: DollarSign,
  },
  {
    value: 'HYBRID',
    label: 'Híbrido',
    description: 'Combinación de estancia y compensación económica',
    icon: GitMerge,
  },
  {
    value: 'AFFILIATE',
    label: 'Comisión por afiliado',
    description: 'El creador gana una comisión por cada reserva que genere',
    icon: Link2,
  },
  {
    value: 'EXPERIENCE_EXCHANGE',
    label: 'Intercambio de experiencia',
    description: 'Actividades, tours o servicios a cambio de contenido',
    icon: Zap,
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface CollaborationSettingsPanelProps {
  propertyId: number;
  isPublished: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CollaborationSettingsPanel({
  propertyId,
  isPublished,
}: CollaborationSettingsPanelProps) {
  const { data: settings, isLoading } = useGetCollaborationSettings(propertyId);
  const updateSettings = useUpdateCollaborationSettings();

  const [acceptCollaborations, setAcceptCollaborations] = useState(false);
  const [selectedCompensations, setSelectedCompensations] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Sync local state when remote data loads
  useEffect(() => {
    if (settings) {
      // Backend returns lowercase values; normalize to UPPER for UI
      const normalized = settings.acceptedCompensations.map((c) => c.toUpperCase());
      setAcceptCollaborations(settings.acceptCreatorCollaborations);
      setSelectedCompensations(normalized);
      setIsDirty(false);
    }
  }, [settings]);

  const handleToggle = (checked: boolean) => {
    setAcceptCollaborations(checked);
    if (!checked) {
      setSelectedCompensations([]);
    }
    setIsDirty(true);
  };

  const handleCompensationToggle = (value: string, checked: boolean) => {
    setSelectedCompensations((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
    setIsDirty(true);
  };

  const handleSave = () => {
    if (acceptCollaborations && selectedCompensations.length === 0) {
      toast.error('Selecciona al menos un tipo de compensación para activar las colaboraciones');
      return;
    }

    updateSettings.mutate(
      {
        propertyId,
        acceptCollaborations,
        acceptedCompensations: acceptCollaborations ? selectedCompensations : [],
      },
      {
        onSuccess: () => {
          toast.success('Configuración de colaboraciones guardada');
          setIsDirty(false);
        },
        onError: () => {
          toast.error('Error al guardar la configuración. Intenta de nuevo.');
        },
      }
    );
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // ── Not published warning ──────────────────────────────────────────────────

  if (!isPublished) {
    return (
      <Card className="border-0 shadow-sm opacity-60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-muted">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Colaboraciones con creadores</CardTitle>
              <CardDescription className="mt-0.5">
                Publica tu propiedad para activar las colaboraciones
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta sección estara disponible cuando la propiedad este en estado{' '}
            <span className="font-medium text-foreground">Publicada</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ── Panel ──────────────────────────────────────────────────────────────────

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[hsl(var(--gydi-primary))]/10">
            <Users className="h-4 w-4 text-[hsl(var(--gydi-primary))]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">Colaboraciones con creadores</CardTitle>
              {acceptCollaborations && (
                <Badge
                  className="text-[10px] px-1.5 py-0.5 bg-[hsl(var(--gydi-teal))]/10 text-[hsl(var(--gydi-teal))] border-[hsl(var(--gydi-teal))]/20"
                  variant="outline"
                >
                  Activo
                </Badge>
              )}
            </div>
            <CardDescription className="mt-0.5">
              Permite que creadores de contenido colaboren en tu propiedad a cambio de material
              audiovisual
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Main toggle */}
        <div
          className={cn(
            'flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors',
            acceptCollaborations
              ? 'border-[hsl(var(--gydi-primary))]/30 bg-[hsl(var(--gydi-primary))]/5'
              : 'border-border bg-muted/30'
          )}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug">
              Aceptar colaboraciones de creadores
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tu propiedad aparecera en el marketplace de creadores
            </p>
          </div>
          <Switch
            checked={acceptCollaborations}
            onCheckedChange={handleToggle}
            className="shrink-0"
            aria-label="Activar colaboraciones con creadores"
          />
        </div>

        {/* Compensation types */}
        {acceptCollaborations && (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Tipos de compensacion aceptados{' '}
              <span className="text-muted-foreground font-normal">(selecciona al menos uno)</span>
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {COMPENSATION_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isChecked = selectedCompensations.includes(option.value);
                return (
                  <label
                    key={option.value}
                    htmlFor={`comp-${option.value}`}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors min-h-11',
                      isChecked
                        ? 'border-[hsl(var(--gydi-primary))]/40 bg-[hsl(var(--gydi-primary))]/5'
                        : 'border-border bg-card hover:border-[hsl(var(--gydi-primary))]/20 hover:bg-muted/40'
                    )}
                  >
                    <Checkbox
                      id={`comp-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCompensationToggle(option.value, checked === true)
                      }
                      className="mt-0.5 shrink-0"
                    />
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div
                        className={cn(
                          'shrink-0 rounded-md p-1 mt-0.5',
                          isChecked
                            ? 'bg-[hsl(var(--gydi-primary))]/15 text-[hsl(var(--gydi-primary))]'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-snug">{option.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Save button */}
        {isDirty && (
          <div className="flex justify-end pt-1">
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending}
              size="sm"
              className="min-h-11 sm:min-h-9 w-full sm:w-auto"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar configuracion'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
