'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { User, CreditCard, Bell, Shield, Camera, Save, Crown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfileSettingsFormNew } from '@/features/auth/components/profile-settings-form-new';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';
import { useProfileByUserId, useUpdateProfile } from '@/features/auth/hooks/use-profile';
import { useUploadProfileImage } from '@/features/auth/hooks/use-image-upload';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

export default function ConfiguracionPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'membership' | 'payment' | 'notifications' | 'security'>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<typeof activeTab | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = session?.user?.id ? Number(session.user.id) : null;
  const { data: profile } = useProfileByUserId(userId!, {
    enabled: !!userId,
  });

  // Hooks for profile update and image upload
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: uploadImage } = useUploadProfileImage();

  const handleTabChange = (newTab: typeof activeTab) => {
    if (activeTab === 'profile' && hasUnsavedChanges) {
      setPendingTab(newTab);
      setShowDialog(true);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      setHasUnsavedChanges(false); // Reset unsaved changes flag
    }
    setShowDialog(false);
  };

  const handleDirtyChange = (isDirty: boolean) => {
    setHasUnsavedChanges(isDirty);
  };

  const [paymentData, setPaymentData] = useState({
    bankName: 'BBVA México',
    accountNumber: '****1234',
    clabe: '012180001234567890',
    paypalEmail: 'usuario@ejemplo.com',
  });

  // Mock notifications state
  const [notifications, setNotifications] = useState({
    emailCommissions: true,
    emailNews: false,
    pushCommissions: true,
  });

  const handleSavePayment = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Información de pago actualizada correctamente');
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Preferencias de notificaciones actualizadas');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 10MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Upload image to S3 via backend
      uploadImage(file, {
        onSuccess: (data) => {
          const s3Url = data.imageUrl;
          setProfileImage(s3Url);

          // Update profile with new S3 URL
          if (userId) {
            updateProfile(
              {
                userId,
                data: { coverImageUrl: s3Url },
              },
              {
                onSuccess: () => {
                  toast.success('Foto de perfil actualizada correctamente');
                  setIsUploadingImage(false);
                },
                onError: (error) => {
                  toast.error(`Error al actualizar el perfil: ${error.message}`);
                  setProfileImage(null);
                  setIsUploadingImage(false);
                },
              }
            );
          } else {
            setIsUploadingImage(false);
          }
        },
        onError: (error) => {
          console.error('Error uploading image to S3:', error);
          toast.error(`Error al subir la imagen: ${error.message}`);
          setIsUploadingImage(false);
        },
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Error inesperado al subir la imagen.');
      setIsUploadingImage(false);
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Get current profile image
  const currentImage = profileImage || profile?.coverImageUrl || null;

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'membership', label: 'Membresía', icon: Crown },
    { id: 'payment', label: 'Pagos', icon: CreditCard },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ];

  // Mostrar loading mientras la sesión carga
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  // Redirigir si no hay sesión (aunque el middleware debería evitar esto)
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">No autenticado. Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Información General</h2>

            {/* Profile Photo */}
            <div className="mb-6 flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-primary">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary-foreground">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleChangePhotoClick}
                  className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  disabled={isUploadingImage}
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-medium">Foto de Perfil</p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, GIF o WebP. Máximo 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploadingImage}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleChangePhotoClick}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? 'Subiendo...' : 'Cambiar Foto'}
                </Button>
              </div>
            </div>

            {/* Profile Form (Backend Integration) */}
            {session?.user?.id && (
              <ProfileSettingsFormNew
                userId={Number(session.user.id)}
                onDirtyChange={handleDirtyChange}
              />
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog for unsaved changes */}
      <ConfirmationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleConfirmNavigation}
      />

      {/* Membership Tab */}
      {activeTab === 'membership' && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Membresía y Suscripción</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Administra tu plan de suscripción, métodos de pago y facturación
                </p>
              </div>
              <Link href="/dashboard/subscription">
                <Button variant="outline" size="sm">
                  Ver detalles completos
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 p-6 border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Tu Plan Actual</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Accede a la página de suscripción para ver tu plan actual, cambiar de plan,
                      administrar métodos de pago y ver tu historial de facturación.
                    </p>
                    <Link href="/dashboard/subscription">
                      <Button className="w-full sm:w-auto">
                        <Crown className="mr-2 h-4 w-4" />
                        Administrar Suscripción
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Cambiar Plan</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Actualiza o cambia tu plan de membresía
                  </p>
                  <Link href="/dashboard/subscription/plans">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Planes Disponibles
                    </Button>
                  </Link>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Métodos de Pago</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Administra tus tarjetas y métodos de pago
                  </p>
                  <Link href="/dashboard/subscription">
                    <Button variant="outline" size="sm" className="w-full">
                      Administrar Pagos
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 ¿Necesitas ayuda?</h4>
                <p className="text-sm text-blue-800">
                  Si tienes preguntas sobre tu membresía, planes o facturación,
                  visita nuestra página de ayuda o contacta a soporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Información Bancaria</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Nombre del Banco</Label>
                <Input
                  id="bankName"
                  value={paymentData.bankName}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, bankName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Número de Cuenta</Label>
                <Input
                  id="accountNumber"
                  value={paymentData.accountNumber}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, accountNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clabe">CLABE Interbancaria</Label>
                <Input
                  id="clabe"
                  value={paymentData.clabe}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, clabe: e.target.value })
                  }
                  placeholder="18 dígitos"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSavePayment} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">PayPal</h2>

            <div className="space-y-2">
              <Label htmlFor="paypalEmail">Correo de PayPal</Label>
              <Input
                id="paypalEmail"
                type="email"
                value={paymentData.paypalEmail}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, paypalEmail: e.target.value })
                }
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSavePayment} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Notificaciones por Email</h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Comisiones Aprobadas</p>
                  <p className="text-sm text-muted-foreground">
                    Notificación cuando tus comisiones sean aprobadas
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailCommissions}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      emailCommissions: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Noticias y Promociones</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones sobre nuevas propiedades y ofertas
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailNews}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      emailNews: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Notificaciones Push</h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Comisiones</p>
                  <p className="text-sm text-muted-foreground">
                    Alertas sobre el estado de tus comisiones
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.pushCommissions}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      pushCommissions: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveNotifications} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar Preferencias'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Cambiar Contraseña</h2>
            <ChangePasswordForm />
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-red-900">Zona de Peligro</h2>
            <p className="mb-4 text-sm text-red-800">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate
              de que realmente quieres hacer esto.
            </p>
            <Button variant="destructive">Eliminar Cuenta</Button>
          </div>
        </div>
      )}
    </div>
  );
}
