'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Download,
  Calendar,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data - replace with real API calls
const commissionStats = [
  {
    name: 'Saldo Disponible',
    value: '$2,450.00',
    description: 'Listo para retirar',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Comisiones Pendientes',
    value: '$890.00',
    description: 'En proceso de aprobación',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    name: 'Total Ganado',
    value: '$12,450.00',
    description: 'Histórico total',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Próximo Pago',
    value: '5 días',
    description: '25 de Octubre, 2025',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

const commissions = [
  {
    id: 1,
    bookingId: 'BK-2025-001234',
    property: 'Villa Paradise - Cancún',
    guestName: 'Juan Pérez',
    checkIn: '2025-10-25',
    checkOut: '2025-10-30',
    nights: 5,
    bookingAmount: 3500,
    commissionRate: 10,
    commissionAmount: 350,
    status: 'paid',
    paidAt: '2025-10-18',
  },
  {
    id: 2,
    bookingId: 'BK-2025-001198',
    property: 'Beach House - Playa del Carmen',
    guestName: 'María González',
    checkIn: '2025-10-22',
    checkOut: '2025-10-27',
    nights: 5,
    bookingAmount: 2800,
    commissionRate: 8,
    commissionAmount: 224,
    status: 'approved',
    approvedAt: '2025-10-15',
  },
  {
    id: 3,
    bookingId: 'BK-2025-001156',
    property: 'Mountain Cabin - Valle de Bravo',
    guestName: 'Carlos Rodríguez',
    checkIn: '2025-10-20',
    checkOut: '2025-10-23',
    nights: 3,
    bookingAmount: 4200,
    commissionRate: 9,
    commissionAmount: 378,
    status: 'pending',
    createdAt: '2025-10-18',
  },
  {
    id: 4,
    bookingId: 'BK-2025-001089',
    property: 'City Loft - CDMX',
    guestName: 'Ana López',
    checkIn: '2025-10-15',
    checkOut: '2025-10-19',
    nights: 4,
    bookingAmount: 1900,
    commissionRate: 7,
    commissionAmount: 133,
    status: 'paid',
    paidAt: '2025-10-12',
  },
  {
    id: 5,
    bookingId: 'BK-2025-001045',
    property: 'Ocean View Penthouse - Puerto Vallarta',
    guestName: 'Roberto Sánchez',
    checkIn: '2025-10-10',
    checkOut: '2025-10-17',
    nights: 7,
    bookingAmount: 4500,
    commissionRate: 12,
    commissionAmount: 540,
    status: 'paid',
    paidAt: '2025-10-08',
  },
];

const paymentHistory = [
  {
    id: 1,
    date: '2025-10-15',
    amount: 2840,
    method: 'Transferencia Bancaria',
    reference: 'PAY-2025-10-001',
    status: 'completed',
  },
  {
    id: 2,
    date: '2025-09-30',
    amount: 3120,
    method: 'Transferencia Bancaria',
    reference: 'PAY-2025-09-002',
    status: 'completed',
  },
  {
    id: 3,
    date: '2025-09-15',
    amount: 2650,
    method: 'PayPal',
    reference: 'PAY-2025-09-001',
    status: 'completed',
  },
];

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  approved: {
    label: 'Aprobado',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
  },
  paid: {
    label: 'Pagado',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
};

export default function ComisionesPage() {
  const [selectedTab, setSelectedTab] = useState<'commissions' | 'payments'>('commissions');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comisiones</h1>
          <p className="text-muted-foreground">
            Gestiona tus ganancias y solicita retiros
          </p>
        </div>
        <Button
          onClick={() => setShowWithdrawalModal(true)}
          className="gap-2"
          size="lg"
        >
          <CreditCard className="h-4 w-4" />
          Solicitar Retiro
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {commissionStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.name}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">
            Información sobre pagos
          </p>
          <p className="text-sm text-blue-800">
            Los pagos se procesan cada 15 días. El monto mínimo para retiro es de $100
            USD. Las comisiones se aprueban 7 días después del check-out del huésped.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4">
          <button
            onClick={() => setSelectedTab('commissions')}
            className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              selectedTab === 'commissions'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Comisiones
          </button>
          <button
            onClick={() => setSelectedTab('payments')}
            className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              selectedTab === 'payments'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Historial de Pagos
          </button>
        </nav>
      </div>

      {/* Commissions Table */}
      {selectedTab === 'commissions' && (
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Reserva
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Propiedad
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Check-in / Check-out
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Noches
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Reserva
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Comisión
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {commissions.map((commission) => {
                  const StatusIcon =
                    statusConfig[commission.status as keyof typeof statusConfig].icon;

                  return (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono">
                            {commission.bookingId}
                          </code>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {commission.guestName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{commission.property}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm">{commission.checkIn}</p>
                        <p className="text-xs text-muted-foreground">
                          {commission.checkOut}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold">{commission.nights}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold">
                          ${commission.bookingAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-primary">
                          {commission.commissionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-green-600">
                          ${commission.commissionAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                              statusConfig[
                                commission.status as keyof typeof statusConfig
                              ].color
                            }`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {
                              statusConfig[
                                commission.status as keyof typeof statusConfig
                              ].label
                            }
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History Table */}
      {selectedTab === 'payments' && (
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Referencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Método
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium">{payment.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono">
                        {payment.reference}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-bold text-green-600">
                        ${payment.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        <CheckCircle className="h-3 w-3" />
                        Completado
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Recibo
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Withdrawal Modal Placeholder */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold">Solicitar Retiro</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Esta funcionalidad estará disponible próximamente. Podrás retirar tu saldo
              disponible mediante transferencia bancaria o PayPal.
            </p>
            <Button
              onClick={() => setShowWithdrawalModal(false)}
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
