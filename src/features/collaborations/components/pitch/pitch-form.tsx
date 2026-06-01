'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { pitchSchema, type PitchFormData } from '../../schemas/pitch.schema';
import { useCreatePitch } from '../../hooks/use-create-pitch';

const DELIVERABLE_TYPES = [
  { value: 'reel', label: 'Reel' },
  { value: 'photo', label: 'Fotografías' },
  { value: 'story', label: 'Story' },
  { value: 'video', label: 'Video' },
  { value: 'blog_post', label: 'Blog post' },
  { value: 'tiktok', label: 'TikTok' },
];

const COMPENSATION_TYPES = [
  { value: 'free_stay', label: 'Estadía gratis' },
  { value: 'cash', label: 'Pago en efectivo' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'affiliate', label: 'Comisión de afiliado' },
  { value: 'experience_exchange', label: 'Intercambio de experiencia' },
];

interface PitchFormProps {
  propertyId: number;
  onSuccess?: () => void;
}

export function PitchForm({ propertyId, onSuccess }: PitchFormProps) {
  const { mutate: createPitch, isPending } = useCreatePitch();

  const form = useForm<PitchFormData>({
    resolver: zodResolver(pitchSchema),
    defaultValues: {
      propertyId,
      introduction: '',
      portfolioUrl: '',
      preferredCheckIn: '',
      preferredCheckOut: '',
      deliverables: [{ type: 'reel', quantity: 1, notes: '' }],
      compensation: { type: 'free_stay' },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'deliverables',
  });

  function onSubmit(data: PitchFormData) {
    const payload = {
      ...data,
      portfolioUrl: data.portfolioUrl || undefined,
    };
    createPitch(payload, { onSuccess });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Introduction */}
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presentacion</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntale al host quién eres y qué tipo de contenido creas..."
                  rows={5}
                  className="w-full resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Portfolio URL */}
        <FormField
          control={form.control}
          name="portfolioUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio URL (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://instagram.com/tucuenta"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="preferredCheckIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in preferido</FormLabel>
                <FormControl>
                  <Input type="date" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredCheckOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-out preferido</FormLabel>
                <FormControl>
                  <Input type="date" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Deliverables */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Entregables</p>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-start"
            >
              <FormField
                control={form.control}
                name={`deliverables.${index}.type`}
                render={({ field: f }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Tipo</FormLabel>
                    <Select value={f.value} onValueChange={f.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full min-h-11">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DELIVERABLE_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`deliverables.${index}.quantity`}
                render={({ field: f }) => (
                  <FormItem className="w-full sm:w-24">
                    <FormLabel className="sr-only">Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Cant."
                        className="w-full min-h-11"
                        {...f}
                        onChange={(e) => f.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-11 min-w-11 text-destructive"
                  onClick={() => remove(index)}
                  aria-label="Eliminar entregable"
                >
                  Eliminar
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={() => append({ type: 'photo', quantity: 1, notes: '' })}
          >
            + Agregar entregable
          </Button>
        </div>

        {/* Compensation */}
        <FormField
          control={form.control}
          name="compensation.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compensación solicitada</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full min-h-11">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COMPENSATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full min-h-11 bg-[hsl(var(--gydi-primary))] text-white hover:bg-[hsl(var(--gydi-primary-light))]"
        >
          {isPending ? 'Enviando...' : 'Enviar pitch'}
        </Button>
      </form>
    </Form>
  );
}
