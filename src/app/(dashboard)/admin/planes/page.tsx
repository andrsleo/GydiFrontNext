import { Metadata } from 'next';
import { Crown, DollarSign, Percent, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = {
  title: 'Planes y Precios | Admin GYDI',
  description: 'Ajustar precios, comisiones y límites de planes',
};

export default function AdminPlansPage() {
  const plans = [
    {
      name: 'FREE',
      price: 0,
      commission: 2,
      limits: {
        properties: 10,
        referrals: 50,
      },
      features: [
        'Publicación básica',
        'Enlaces de referido',
        'Comisión del 2%',
        'Soporte por email',
      ],
      subscribers: 892,
      revenue: 0,
    },
    {
      name: 'PRO',
      price: 29.99,
      commission: 5,
      limits: {
        properties: 50,
        referrals: 200,
      },
      features: [
        'Todo de FREE',
        'Propiedades destacadas',
        'Comisión del 5%',
        'Analíticas avanzadas',
        'Soporte prioritario',
      ],
      subscribers: 284,
      revenue: 8517.16,
    },
    {
      name: 'ELITE',
      price: 99.99,
      commission: 10,
      limits: {
        properties: Infinity,
        referrals: Infinity,
      },
      features: [
        'Todo de PRO',
        'Propiedades ilimitadas',
        'Comisión del 10%',
        'Referidos ilimitados',
        'Gerente de cuenta dedicado',
        'API access',
      ],
      subscribers: 71,
      revenue: 7099.29,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planes y Precios</h1>
          <p className="text-muted-foreground mt-2">
            Ajustar precios, comisiones y límites de planes de suscripción
          </p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      {/* Revenue Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(plans[1].revenue + plans[2].revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {plans[1].subscribers + plans[2].subscribers} suscriptores pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.reduce((sum, plan) => sum + plan.subscribers, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {plans[0].subscribers} en plan gratuito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {(((plans[1].subscribers + plans[2].subscribers) / plans.reduce((sum, plan) => sum + plan.subscribers, 0)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Usuarios de pago</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Configuration */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.name === 'ELITE' ? 'border-primary' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {plan.name === 'ELITE' && <Crown className="h-5 w-5 text-primary" />}
                  {plan.name}
                </CardTitle>
                <Badge
                  variant={plan.name === 'FREE' ? 'secondary' : 'default'}
                  className={
                    plan.name === 'ELITE'
                      ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                      : plan.name === 'PRO'
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                      : ''
                  }
                >
                  {plan.subscribers} usuarios
                </Badge>
              </div>
              <CardDescription>
                {plan.name === 'FREE' && 'Plan gratuito para empezar'}
                {plan.name === 'PRO' && 'Más propiedades y comisiones'}
                {plan.name === 'ELITE' && 'Acceso ilimitado premium'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              <div>
                <Label htmlFor={`price-${plan.name}`}>Precio Mensual</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`price-${plan.name}`}
                    type="number"
                    step="0.01"
                    defaultValue={plan.price}
                    className="pl-10"
                    disabled={plan.name === 'FREE'}
                  />
                </div>
              </div>

              {/* Commission */}
              <div>
                <Label htmlFor={`commission-${plan.name}`}>Tasa de Comisión</Label>
                <div className="relative mt-2">
                  <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`commission-${plan.name}`}
                    type="number"
                    step="0.1"
                    defaultValue={plan.commission}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Limits */}
              <div>
                <Label>Límites</Label>
                <div className="mt-2 space-y-2">
                  <div>
                    <Label htmlFor={`props-${plan.name}`} className="text-xs text-muted-foreground">
                      Propiedades
                    </Label>
                    <Input
                      id={`props-${plan.name}`}
                      type="number"
                      defaultValue={plan.limits.properties === Infinity ? 9999 : plan.limits.properties}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`refs-${plan.name}`} className="text-xs text-muted-foreground">
                      Referidos/mes
                    </Label>
                    <Input
                      id={`refs-${plan.name}`}
                      type="number"
                      defaultValue={plan.limits.referrals === Infinity ? 9999 : plan.limits.referrals}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Revenue */}
              {plan.revenue > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ingresos mensuales</span>
                    <span className="font-semibold text-green-600">
                      ${plan.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">🚧 En Desarrollo</CardTitle>
          <CardDescription>
            Próximamente: Edición en tiempo real con validación y historial de cambios
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
