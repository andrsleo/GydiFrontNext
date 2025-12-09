'use client';

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

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
import { CountryCitySelector } from '@/components/shared/country-city-selector';

import { useProfileByUserId, useUpdateProfile } from '../hooks/use-profile';
import { profileFormSchema, type ProfileFormData } from '../schemas/profile.schema';
import {
  GENDER_OPTIONS,
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  VISIBILITY_OPTIONS,
} from '@/lib/constants/profile-options';
import { SocialLinksManager } from './social-links-manager';
import { PreferencesManager } from './preferences-manager';
import { toast } from 'sonner';

interface ProfileSettingsFormNewProps {
  userId: number;
  onDirtyChange?: (isDirty: boolean) => void;
}


export function ProfileSettingsFormNew({ userId, onDirtyChange }: ProfileSettingsFormNewProps) {
  const { data: profile, isLoading: isLoadingProfile } = useProfileByUserId(userId, {
    enabled: !!userId,
  });
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { update: updateSession } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: undefined,
      bio: '',
      country: '',
      city: '',
      address: '',
      postalCode: '',
      websiteUrl: '',
      preferredLanguage: '',
      coverImageUrl: '',
      profileVisibility: 'public',
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false,
      socialLinks: {},
      preferences: {},
    },
  });

  // Track isDirty changes and notify parent
  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(form.formState.isDirty);
    }
  }, [form.formState.isDirty, onDirtyChange]);

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender,
        bio: profile.bio || '',
        country: profile.country || '',
        city: profile.city || '',
        address: profile.address || '',
        postalCode: profile.postalCode || '',
        websiteUrl: profile.websiteUrl || '',
        preferredLanguage: profile.preferredLanguage || '',
        coverImageUrl: profile.coverImageUrl || '',
        profileVisibility: profile.profileVisibility || 'public',
        emailNotificationsEnabled: profile.emailNotificationsEnabled ?? true,
        smsNotificationsEnabled: profile.smsNotificationsEnabled ?? false,
        socialLinks: profile.socialLinks || {},
        preferences: profile.preferences || {},
      });
      setImagePreview(profile.coverImageUrl || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]); // Only reset when profile data changes, not when form changes

  const { showDialog, setShowDialog, handleConfirm } = useUnsavedChanges(form.formState.isDirty);

  function onSubmit(data: ProfileFormData) {
    console.log('=== FORM SUBMIT CALLED ===');
    console.log('Form data:', data);
    console.log('User ID:', userId);
    console.log('Is form dirty:', form.formState.isDirty);
    console.log('Is pending:', isPending);

    updateProfile(
      { userId, data },
      {
        onSuccess: async () => {
          console.log('Profile updated successfully');
          toast.success('Perfil actualizado correctamente');
          form.reset(data); // Reset form with new data to clear dirty state

          // Update session to refresh user name in UI
          if (updateSession) {
            await updateSession({
              user: {
                name: `${data.firstName} ${data.lastName}`.trim() || undefined,
              },
            });
          }
        },
        onError: (error) => {
          console.error('Error updating profile:', error);
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
    <>
      <ConfirmationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleConfirm}
      />
      <form
        onSubmit={form.handleSubmit(
          onSubmit,
          (errors) => {
            console.log('=== FORM VALIDATION ERRORS ===');
            console.log('Validation errors:', errors);
            toast.error('Por favor corrige los errores en el formulario');
          }
        )}
        className="space-y-8"
      >
        {/* Personal Information Section */}
        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Información Personal</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                {...form.register('firstName')}
                placeholder="Juan"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                {...form.register('lastName')}
                placeholder="Pérez"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono</Label>
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    placeholder="+52 55 1234 5678"
                    value={value}
                    onChange={onChange}
                    defaultCountry="CO"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                )}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
              <Input
                id="dateOfBirth"
                {...form.register('dateOfBirth')}
                type="date"
                max={(() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  return yesterday.toISOString().split('T')[0];
                })()}
              />
              {form.formState.errors.dateOfBirth && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                key={`gender-${form.watch('gender')}`}
                value={form.watch('gender') || ''}
                onValueChange={(value) =>
                  form.setValue('gender', value as ProfileFormData['gender'], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Selecciona tu género" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.gender && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.gender.message}
                </p>
              )}
            </div>
          </div>

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
        </div>

        {/* Location Section */}
        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Ubicación</h3>

          <Controller
            name="country"
            control={form.control}
            render={({ field: countryField }) => (
              <Controller
                name="city"
                control={form.control}
                render={({ field: cityField }) => (
                  <CountryCitySelector
                    countryValue={countryField.value || ''}
                    cityValue={cityField.value || ''}
                    onCountryChange={(value) => {
                      countryField.onChange(value);
                      form.trigger('country'); // Trigger validation
                    }}
                    onCityChange={(value) => {
                      cityField.onChange(value);
                      form.trigger('city'); // Trigger validation
                    }}
                    disabled={isPending}
                    required={false}
                    countryError={form.formState.errors.country?.message}
                    cityError={form.formState.errors.city?.message}
                    showLabels
                  />
                )}
              />
            )}
          />

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                {...form.register('address')}
                placeholder="Calle Principal #123"
              />
              {form.formState.errors.address && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                id="postalCode"
                {...form.register('postalCode')}
                placeholder="01000"
              />
              {form.formState.errors.postalCode && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.postalCode.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Section */}
        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Información Profesional</h3>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Sitio Web</Label>
            <Input
              id="websiteUrl"
              {...form.register('websiteUrl')}
              placeholder="https://tusitio.com"
              type="url"
            />
            {form.formState.errors.websiteUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.websiteUrl.message}
              </p>
            )}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Redes Sociales</h3>
          <SocialLinksManager
            value={form.watch('socialLinks') || {}}
            onChange={(value) => form.setValue('socialLinks', value, { shouldDirty: true })}
          />
          {form.formState.errors.socialLinks && (
            <p className="text-sm text-destructive">
              {form.formState.errors.socialLinks.message}
            </p>
          )}
        </div>

        {/* Preferences Section */}
        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Preferencias</h3>

          {/* User Preferences Manager */}
          <PreferencesManager
            value={form.watch('preferences') || {}}
            onChange={(value) => form.setValue('preferences', value, { shouldDirty: true })}
          />
          {form.formState.errors.preferences && (
            <p className="text-sm text-destructive">
              {form.formState.errors.preferences.message}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2 pt-4">
            <div className="space-y-2">
              <Label htmlFor="preferredLanguage">Idioma Preferido</Label>
              <Select
                key={`lang-${form.watch('preferredLanguage')}`}
                value={form.watch('preferredLanguage') || ''}
                onValueChange={(value) =>
                  form.setValue('preferredLanguage', value, { shouldDirty: true })
                }
              >
                <SelectTrigger id="preferredLanguage">
                  <SelectValue placeholder="Selecciona tu idioma" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.preferredLanguage && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.preferredLanguage.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileVisibility">Visibilidad del Perfil</Label>
              <Select
                key={`vis-${form.watch('profileVisibility')}`}
                value={form.watch('profileVisibility') || ''}
                onValueChange={(value) =>
                  form.setValue(
                    'profileVisibility',
                    value as ProfileFormData['profileVisibility'],
                    { shouldDirty: true }
                  )
                }
              >
                <SelectTrigger id="profileVisibility">
                  <SelectValue placeholder="Selecciona la visibilidad" />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.profileVisibility && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.profileVisibility.message}
                </p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3 pt-4">
            <h4 className="font-medium">Notificaciones</h4>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications" className="font-normal">
                  Notificaciones por Email
                </Label>
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

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="smsNotifications" className="font-normal">
                  Notificaciones por SMS
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recibe alertas por mensaje de texto
                </p>
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            className="gap-2"
            onClick={(e) => {
              console.log('=== BUTTON CLICKED ===');
              console.log('Button type:', e.currentTarget.type);
              console.log('Is pending:', isPending);
              console.log('Is dirty:', form.formState.isDirty);
              console.log('Is button disabled:', isPending || !form.formState.isDirty);
              console.log('Form values:', form.getValues());
              console.log('Form errors:', form.formState.errors);
              console.log('Will submit form...');
            }}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </>
  );
}
