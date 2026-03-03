'use client';

import { useState, useRef } from 'react';
import { useUser } from '@/features/auth/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
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
  const user = useUser();
  const { t } = useTranslation('settings');
  const [activeTab, setActiveTab] = useState<'profile' | 'membership' | 'payment' | 'notifications' | 'security'>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<typeof activeTab | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = user?.id ? Number(user.id) : null;
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
    { id: 'profile', label: t('tabs.profile'), icon: User },
    { id: 'membership', label: t('tabs.membership'), icon: Crown },
    { id: 'payment', label: t('tabs.payment'), icon: CreditCard },
    { id: 'notifications', label: t('tabs.notifications'), icon: Bell },
    { id: 'security', label: t('tabs.security'), icon: Shield },
  ];

  // No need for loading/auth checks - middleware handles authentication
  // and useUser() returns data from Zustand store immediately

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-2 sm:gap-4 overflow-x-auto pb-px">
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
            <h2 className="mb-6 text-xl font-semibold">{t('profile.sectionTitle')}</h2>

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
                      {user?.name?.charAt(0) || 'U'}
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
                <p className="font-medium">{t('profile.photo')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('profile.photoDesc')}
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
                  {isUploadingImage ? t('profile.uploading') : t('profile.changePhoto')}
                </Button>
              </div>
            </div>

            {/* Profile Form (Backend Integration) */}
            {user?.id && (
              <ProfileSettingsFormNew
                userId={Number(user.id)}
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
                <h2 className="text-xl font-semibold">{t('membership.sectionTitle')}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('membership.sectionSubtitle')}
                </p>
              </div>
              <Link href="/dashboard/subscription">
                <Button variant="outline" size="sm">
                  {t('membership.viewDetails')}
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 p-6 border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{t('membership.currentPlan')}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      {t('membership.currentPlanDesc')}
                    </p>
                    <Link href="/dashboard/subscription">
                      <Button className="w-full sm:w-auto">
                        <Crown className="mr-2 h-4 w-4" />
                        {t('membership.manageSubscription')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">{t('membership.changePlan')}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('membership.changePlanDesc')}
                  </p>
                  <Link href="/dashboard/subscription/plans">
                    <Button variant="outline" size="sm" className="w-full">
                      {t('membership.viewPlans')}
                    </Button>
                  </Link>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">{t('membership.paymentMethods')}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('membership.paymentMethodsDesc')}
                  </p>
                  <Link href="/dashboard/subscription">
                    <Button variant="outline" size="sm" className="w-full">
                      {t('membership.managePayments')}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <h4 className="font-medium text-blue-900 mb-2">{t('membership.helpTitle')}</h4>
                <p className="text-sm text-blue-800">
                  {t('membership.helpDesc')}
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
            <h2 className="mb-6 text-xl font-semibold">{t('payment.bankTitle')}</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">{t('payment.bankName')}</Label>
                <Input
                  id="bankName"
                  value={paymentData.bankName}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, bankName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">{t('payment.accountNumber')}</Label>
                <Input
                  id="accountNumber"
                  value={paymentData.accountNumber}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, accountNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clabe">{t('payment.clabe')}</Label>
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
                {isSaving ? t('payment.saving') : t('payment.saveChanges')}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">{t('payment.paypalTitle')}</h2>

            <div className="space-y-2">
              <Label htmlFor="paypalEmail">{t('payment.paypalEmail')}</Label>
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
                {isSaving ? t('payment.saving') : t('payment.saveChanges')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">{t('notifications.emailTitle')}</h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('notifications.approvedCommissions')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('notifications.approvedCommissionsDesc')}
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
                  <p className="font-medium">{t('notifications.newsPromotions')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('notifications.newsPromotionsDesc')}
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
            <h2 className="mb-6 text-xl font-semibold">{t('notifications.pushTitle')}</h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('notifications.commissions')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('notifications.commissionsDesc')}
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
                {isSaving ? t('payment.saving') : t('notifications.savePreferences')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">{t('security.changePassword')}</h2>
            <ChangePasswordForm />
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-red-900">{t('security.dangerZone')}</h2>
            <p className="mb-4 text-sm text-red-800">
              {t('security.dangerDesc')}
            </p>
            <Button variant="destructive">{t('security.deleteAccount')}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
