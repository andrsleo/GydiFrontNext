import { Metadata } from 'next';
import {
  Settings,
  Database,
  Mail,
  Shield,
  Webhook,
  Key,
  Server,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Configuración del Sistema | Admin GYDI',
  description: 'Variables del sistema, webhooks e integraciones',
};

export default function AdminConfigPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Variables del sistema, webhooks e integraciones
          </p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Configuración General
              </CardTitle>
              <CardDescription>Parámetros básicos de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site-name">Nombre del Sitio</Label>
                <Input id="site-name" defaultValue="GYDI Properties" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="site-url">URL del Sitio</Label>
                <Input id="site-url" defaultValue="https://gydi.app" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="support-email">Email de Soporte</Label>
                <Input id="support-email" type="email" defaultValue="gydiproperties@gmail.com" className="mt-2" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Mantenimiento</Label>
                  <p className="text-sm text-muted-foreground">
                    Desactivar acceso público al sitio
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Registro de Usuarios</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir nuevos registros
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuración de Email
              </CardTitle>
              <CardDescription>SMTP y notificaciones por email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.sendgrid.net" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" type="number" defaultValue="587" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="smtp-user">SMTP Usuario</Label>
                <Input id="smtp-user" defaultValue="apikey" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="smtp-password">SMTP Contraseña</Label>
                <Input id="smtp-password" type="password" placeholder="••••••••••" className="mt-2" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de Bienvenida</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar email al registrarse
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de Comisiones</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar email cuando se apruebe una comisión
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>Configurar webhooks para eventos del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">URL del Webhook</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://api.example.com/webhooks"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Eventos</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-user" className="font-normal">
                      user.created
                    </Label>
                    <Switch id="event-user" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-property" className="font-normal">
                      property.published
                    </Label>
                    <Switch id="event-property" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-commission" className="font-normal">
                      commission.approved
                    </Label>
                    <Switch id="event-commission" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-subscription" className="font-normal">
                      subscription.upgraded
                    </Label>
                    <Switch id="event-subscription" />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Probar Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>Configuración de seguridad y autenticación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="jwt-secret">JWT Secret Key</Label>
                <Input
                  id="jwt-secret"
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="jwt-expiration">JWT Token Expiration (hours)</Label>
                <Input id="jwt-expiration" type="number" defaultValue="24" className="mt-2" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Verificación de Email Obligatoria</Label>
                  <p className="text-sm text-muted-foreground">
                    Requerir verificación antes de usar la plataforma
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">
                    Habilitar 2FA para administradores
                  </p>
                </div>
                <Switch />
              </div>
              <div>
                <Label htmlFor="rate-limit">Rate Limit (requests/min)</Label>
                <Input id="rate-limit" type="number" defaultValue="100" className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Integraciones de Terceros
              </CardTitle>
              <CardDescription>API keys y configuración de servicios externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stripe */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center">
                    <CreditCardIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <Label className="text-base">Stripe</Label>
                    <p className="text-sm text-muted-foreground">Procesamiento de pagos</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="stripe-key">Publishable Key</Label>
                  <Input id="stripe-key" placeholder="pk_test_..." className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="stripe-secret">Secret Key</Label>
                  <Input id="stripe-secret" type="password" placeholder="sk_test_..." className="mt-2" />
                </div>
              </div>

              {/* Cloudinary */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                    <Database className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <Label className="text-base">Cloudinary</Label>
                    <p className="text-sm text-muted-foreground">Almacenamiento de imágenes</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="cloudinary-name">Cloud Name</Label>
                  <Input id="cloudinary-name" placeholder="your-cloud-name" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="cloudinary-key">API Key</Label>
                  <Input id="cloudinary-key" placeholder="123456789012345" className="mt-2" />
                </div>
              </div>

              {/* Analytics */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-orange-100 flex items-center justify-center">
                    <BarChart3Icon className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <Label className="text-base">Google Analytics</Label>
                    <p className="text-sm text-muted-foreground">Analítica web</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="ga-id">Tracking ID</Label>
                  <Input id="ga-id" placeholder="G-XXXXXXXXXX" className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">🚧 En Desarrollo</CardTitle>
          <CardDescription>
            Próximamente: Persistencia en base de datos y variables de entorno dinámicas
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

// Helper icons
function CreditCardIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function BarChart3Icon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
