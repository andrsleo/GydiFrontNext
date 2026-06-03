import { Metadata } from 'next';
import { DollarSign, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const metadata: Metadata = {
  title: 'Gestión de Comisiones | Admin GYDI',
  description: 'Aprobar/rechazar comisiones y procesar pagos',
};

export default function AdminCommissionsPage() {
  const stats = {
    totalPaid: 45678.90,
    pending: 3456.78,
    thisMonth: 8234.50,
    rejected: 567.80,
  };

  const commissions = [
    {
      id: 1,
      user: 'Juan Pérez',
      amount: 125.50,
      referral: 'María García → Plan PRO',
      date: '2024-01-20',
      status: 'pending',
    },
    {
      id: 2,
      user: 'Ana Rodríguez',
      amount: 89.99,
      referral: 'Carlos López → Plan ELITE',
      date: '2024-01-19',
      status: 'pending',
    },
    {
      id: 3,
      user: 'Luis Martínez',
      amount: 245.00,
      referral: 'Sofia Torres → Plan PRO',
      date: '2024-01-18',
      status: 'approved',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Comisiones</h1>
          <p className="text-muted-foreground mt-2">
            Aprobar/rechazar comisiones y procesar pagos
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalPaid, 'USD')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(stats.pending, 'USD')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.thisMonth, 'USD')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rechazadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.rejected, 'USD')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comisiones Pendientes de Aprobación</CardTitle>
          <CardDescription>Revisa y procesa los pagos de comisiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Referido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-medium">{commission.user}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(commission.amount, 'USD')}
                    </TableCell>
                    <TableCell className="text-sm">{commission.referral}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(commission.date).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={commission.status === 'approved' ? 'default' : 'secondary'}
                        className={
                          commission.status === 'approved'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        }
                      >
                        {commission.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {commission.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">Aprobar</Button>
                          <Button size="sm" variant="destructive">Rechazar</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">🚧 En Desarrollo</CardTitle>
          <CardDescription>
            Próximamente: Integración con pasarelas de pago para procesamiento automático
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
