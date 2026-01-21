'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useProfileByUserId, useUpdateProfile } from '../hooks/use-profile';
import { profileFormSchema, type ProfileFormData } from '../schemas/profile.schema';
import { toast } from 'sonner';

interface ProfileSettingsFormProps {
  userId: number;
}

export function ProfileSettingsForm({ userId }: ProfileSettingsFormProps) {
  const { data: profile, isLoading: isLoadingProfile } = useProfileByUserId(userId);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: '',
      preferredLanguage: 'en',
      profileVisibility: 'public',
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false,
    },
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      form.reset({
        bio: profile.bio || '',
        preferredLanguage: (profile.preferredLanguage as 'en' | 'es' | 'pt') || 'en',
        profileVisibility: (profile.profileVisibility as 'public' | 'private') || 'public',
        emailNotificationsEnabled: profile.emailNotificationsEnabled,
        smsNotificationsEnabled: profile.smsNotificationsEnabled,
      });
    }
  }, [profile, form]);

  function onSubmit(data: ProfileFormData) {
    updateProfile(
      { userId, data },
      {
        onSuccess: () => {
          toast.success('Perfil actualizado correctamente');
        },
        onError: (error) => {
          toast.error(`Error al actualizar perfil: ${error.message}`);
        },
      }
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Biografía</Label>
        <Textarea
          id="bio"
          {...form.register('bio')}
          placeholder="Cuéntanos sobre ti..."
          rows={4}
          className="resize-none"
        />
        {form.formState.errors.bio && (
          <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {form.watch('bio')?.length || 0} / 1000 caracteres
        </p>
      </div>

      {/* Avatar URL field removed - not in schema */}

      {/* Country & Timezone fields removed - not in schema */}

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="preferredLanguage">Idioma Preferido</Label>
        <Select
          value={form.watch('preferredLanguage')}
          onValueChange={(value) => form.setValue('preferredLanguage', value as 'en' | 'es' | 'pt')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.preferredLanguage && (
          <p className="text-sm text-destructive">
            {form.formState.errors.preferredLanguage.message}
          </p>
        )}
      </div>

      {/* Profile Visibility */}
      <div className="space-y-3">
        <Label>Visibilidad del Perfil</Label>
        <RadioGroup
          value={form.watch('profileVisibility')}
          onValueChange={(value) => form.setValue('profileVisibility', value as 'public' | 'private')}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public" className="cursor-pointer font-normal">
              Público - Tu perfil es visible para todos
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private" className="cursor-pointer font-normal">
              Privado - Solo tú puedes ver tu perfil
            </Label>
          </div>
        </RadioGroup>
        {form.formState.errors.profileVisibility && (
          <p className="text-sm text-destructive">
            {form.formState.errors.profileVisibility.message}
          </p>
        )}
      </div>

      {/* Notifications */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Notificaciones</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe actualizaciones importantes por correo
              </p>
            </div>
            <input
              id="emailNotifications"
              type="checkbox"
              {...form.register('emailNotificationsEnabled')}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="smsNotifications">Notificaciones por SMS</Label>
              <p className="text-sm text-muted-foreground">Recibe alertas por mensaje de texto</p>
            </div>
            <input
              id="smsNotifications"
              type="checkbox"
              {...form.register('smsNotificationsEnabled')}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !form.formState.isDirty} className="gap-2">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}