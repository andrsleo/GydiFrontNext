/**
 * CommissionCalculator Component
 *
 * Interactive calculator to demonstrate commission distribution
 * between platform, affiliate, and host.
 *
 * Business Model:
 * - AFFILIATE: RECEIVES commission FROM platform
 * - HOST: PAYS commission TO platform
 * - PLATFORM: Keeps the difference
 */

'use client';

import { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, CreditCard, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  calculateAffiliateEarnings,
  calculatePlatformFee,
  calculateHostNetIncome,
  calculatePlatformProfit,
  formatAffiliateRate,
  formatHostFeeRate,
  SUBSCRIPTION_PLANS,
} from '@/lib/constants/plans';
import type { SubscriptionPlan } from '@/types/user';

export function CommissionCalculator() {
  const [bookingAmount, setBookingAmount] = useState<string>('100');
  // PRO_ELITE_DISABLED: Cambiar default a 'PRO' cuando se reactiven planes pagos
  const [hostPlan, setHostPlan] = useState<SubscriptionPlan>('FREE');
  const [affiliatePlan, setAffiliatePlan] = useState<SubscriptionPlan>('FREE');

  // Parse booking amount safely
  const amount = parseFloat(bookingAmount) || 0;

  // Calculate commission breakdown
  const platformFee = calculatePlatformFee(hostPlan, amount);
  const affiliateEarnings = calculateAffiliateEarnings(affiliatePlan, amount);
  const hostNetIncome = calculateHostNetIncome(hostPlan, amount);
  const platformProfit = calculatePlatformProfit(hostPlan, affiliatePlan, amount);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Calculadora de Comisiones</CardTitle>
        </div>
        <CardDescription>
          Simula cómo se distribuyen las comisiones según los planes de suscripción
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Inputs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-muted/30 rounded-lg">
          {/* Booking Amount */}
          <div className="space-y-2">
            <Label htmlFor="booking-amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Monto de Reserva
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="booking-amount"
                type="number"
                min="0"
                step="10"
                value={bookingAmount}
                onChange={(e) => setBookingAmount(e.target.value)}
                className="pl-7"
                placeholder="100.00"
              />
            </div>
            <p className="text-xs text-muted-foreground">Total de la reserva</p>
          </div>

          {/* Host Plan */}
          <div className="space-y-2">
            <Label htmlFor="host-plan" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Plan del Anfitrión
            </Label>
            <Select value={hostPlan} onValueChange={(value) => setHostPlan(value as SubscriptionPlan)}>
              <SelectTrigger id="host-plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">
                  FREE (Paga {formatHostFeeRate('FREE')})
                </SelectItem>
                {/* PRO_ELITE_DISABLED: Descomentar cuando se reactiven planes pagos
                <SelectItem value="PRO">
                  PRO (Paga {formatHostFeeRate('PRO')})
                </SelectItem>
                <SelectItem value="ELITE">
                  ELITE (Paga {formatHostFeeRate('ELITE')})
                </SelectItem>
                */}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Quien tiene la propiedad</p>
          </div>

          {/* Affiliate Plan */}
          <div className="space-y-2">
            <Label htmlFor="affiliate-plan" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Plan del referido
            </Label>
            <Select value={affiliatePlan} onValueChange={(value) => setAffiliatePlan(value as SubscriptionPlan)}>
              <SelectTrigger id="affiliate-plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">
                  FREE (Gana {formatAffiliateRate('FREE')})
                </SelectItem>
                {/* PRO_ELITE_DISABLED: Descomentar cuando se reactiven planes pagos
                <SelectItem value="PRO">
                  PRO (Gana {formatAffiliateRate('PRO')})
                </SelectItem>
                <SelectItem value="ELITE">
                  ELITE (Gana {formatAffiliateRate('ELITE')})
                </SelectItem>
                */}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Quien refirió la reserva</p>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Resultados del Cálculo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Host Net Income */}
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Anfitrión Recibe</p>
                      <p className="text-xs text-muted-foreground">Después de comisión</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                    Paga {formatHostFeeRate(hostPlan)}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-orange-700">
                  {formatCurrency(hostNetIncome)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  = {formatCurrency(amount)} - {formatCurrency(platformFee)} (comisión)
                </p>
              </CardContent>
            </Card>

            {/* Affiliate Earnings */}
            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">referido Recibe</p>
                      <p className="text-xs text-muted-foreground">Comisión de plataforma</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                    Gana {formatAffiliateRate(affiliatePlan)}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-emerald-700">
                  {formatCurrency(affiliateEarnings)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  = {formatCurrency(amount)} × {formatAffiliateRate(affiliatePlan)}
                </p>
              </CardContent>
            </Card>

            {/* Platform Fee */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Plataforma Cobra</p>
                      <p className="text-xs text-muted-foreground">Al anfitrión</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    {formatHostFeeRate(hostPlan)}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  {formatCurrency(platformFee)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  = {formatCurrency(amount)} × {formatHostFeeRate(hostPlan)}
                </p>
              </CardContent>
            </Card>

            {/* Platform Profit */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Plataforma Gana</p>
                      <p className="text-xs text-muted-foreground">Después de pagar referido</p>
                    </div>
                  </div>
                </div>
                <p className="text-3xl font-bold text-purple-700">
                  {formatCurrency(platformProfit)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  = {formatCurrency(platformFee)} - {formatCurrency(affiliateEarnings)} (pago a referido)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-lg p-6 space-y-3 border border-blue-100/50">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <span>📊</span> Resumen del Flujo de Dinero
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>💰 Reserva Total:</span>
              <span className="font-semibold text-foreground">{formatCurrency(amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🏠 Anfitrión ({hostPlan}) recibe:</span>
              <span className="font-semibold text-orange-700">{formatCurrency(hostNetIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>📈 referido ({affiliatePlan}) recibe:</span>
              <span className="font-semibold text-emerald-700">{formatCurrency(affiliateEarnings)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🏢 Plataforma GYDI gana:</span>
              <span className="font-semibold text-purple-700">{formatCurrency(platformProfit)}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200/50">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Modelo de negocio:</strong> La plataforma cobra al anfitrión{' '}
              <strong className="text-orange-700">{formatHostFeeRate(hostPlan)}</strong> y paga al referido{' '}
              <strong className="text-emerald-700">{formatAffiliateRate(affiliatePlan)}</strong>, manteniendo la diferencia como ganancia.
            </p>
          </div>
        </div>

        {/* Example presets */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setBookingAmount('100'); setHostPlan('FREE'); setAffiliatePlan('FREE'); }}
            className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            Ejemplo: $100 - FREE/FREE
          </button>
          <button
            onClick={() => { setBookingAmount('250'); setHostPlan('FREE'); setAffiliatePlan('FREE'); }}
            className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            Ejemplo: $250 - FREE/FREE
          </button>
          <button
            onClick={() => { setBookingAmount('500'); setHostPlan('FREE'); setAffiliatePlan('FREE'); }}
            className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            Ejemplo: $500 - FREE/FREE
          </button>
          {/* PRO_ELITE_DISABLED: Descomentar presets PRO/ELITE cuando se reactiven planes pagos
          <button onClick={() => { setBookingAmount('100'); setHostPlan('PRO'); setAffiliatePlan('PRO'); }} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors">Ejemplo: $100 - PRO/PRO</button>
          <button onClick={() => { setBookingAmount('250'); setHostPlan('ELITE'); setAffiliatePlan('ELITE'); }} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors">Ejemplo: $250 - ELITE/ELITE</button>
          <button onClick={() => { setBookingAmount('500'); setHostPlan('PRO'); setAffiliatePlan('ELITE'); }} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors">Ejemplo: $500 - PRO/ELITE</button>
          */}
        </div>
      </CardContent>
    </Card>
  );
}
