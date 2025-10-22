'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Save,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfiguracionPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'payment' | 'notifications' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Mock form state
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '+52 555 123 4567',
    address: 'Ciudad de México, México',
    bio: 'Afiliado apasionado por las propiedades vacacionales',
  });

  const [paymentData, setPaymentData] = useState({
    bankName: 'BBVA México',
    accountNumber: '****1234',
    clabe: '012180001234567890',
    paypalEmail: 'usuario@ejemplo.com',
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailCommissions: true,
    emailNews: false,
    pushBookings: true,
    pushCommissions: true,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Perfil actualizado correctamente');
  };

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

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'payment', label: 'Pagos', icon: CreditCard },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ];

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
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
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
            <h2 className="mb-6 text-xl font-semibold">Información Personal</h2>

            {/* Profile Photo */}
            <div className="mb-6 flex items-center gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-medium">Foto de Perfil</p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG o GIF. Máximo 5MB
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Cambiar Foto
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="mr-2 inline h-4 w-4" />
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="mr-2 inline h-4 w-4" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="mr-2 inline h-4 w-4" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="mr-2 inline h-4 w-4" />
                  Ubicación
                </Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData({ ...profileData, address: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <textarea
                id="bio"
                rows={4}
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
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
                  <p className="font-medium">Nuevas Reservas</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe un email cuando alguien haga una reserva con tu link
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailBookings}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      emailBookings: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

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
                  <p className="font-medium">Nuevas Reservas</p>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones instantáneas en tu navegador
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.pushBookings}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      pushBookings: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input id="currentPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="gap-2">
                <Shield className="h-4 w-4" />
                Actualizar Contraseña
              </Button>
            </div>
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
