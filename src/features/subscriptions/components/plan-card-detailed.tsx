/**
 * PlanCardDetailed Component
 *
 * Displays subscription plan with role-specific benefits (AFFILIATE & HOST).
 * Shows commission rates with CORRECT semantics:
 * - AFFILIATE: RECEIVES commission FROM platform
 * - HOST: PAYS commission TO platform
 */

'use client';

import { Check, TrendingUp, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLAN_FEATURES } from '@/lib/constants/plans';
import { useCurrencyStore, selectCurrency } from '@/store/currency-store';
import { formatCurrency } from '@/lib/utils/format';
import { useTranslation } from '@/hooks/use-translation';
import type { SubscriptionPlan } from '@/types/user';

interface PlanCardDetailedProps {
  plan: SubscriptionPlan;
  currentPlan?: SubscriptionPlan;
  onSelect?: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
  className?: string;
}

export function PlanCardDetailed({
  plan,
  currentPlan,
  onSelect,
  isLoading = false,
  className,
}: PlanCardDetailedProps) {
  const planDetails = PLAN_FEATURES[plan];
  const isCurrentPlan = currentPlan === plan;
  const isPopular = planDetails.popular;
  const currency = useCurrencyStore(selectCurrency);
  const { t } = useTranslation('subscription');

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all duration-300',
        isPopular && 'border-primary shadow-lg scale-105',
        isCurrentPlan && 'bg-muted/50',
        className
      )}
    >
      {/* Badge */}
      {planDetails.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className={cn(
            'px-4 py-1',
            isPopular ? 'bg-primary' : 'bg-purple-500'
          )}>
            {planDetails.badge}
          </Badge>
        </div>
      )}

      {/* Header */}
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{planDetails.name}</CardTitle>
        <CardDescription className="text-sm">{planDetails.tagline}</CardDescription>

        {/* Price */}
        <div className="mt-4">
          <div className="text-4xl font-bold">
            {plan === 'FREE' ? (
              t('planCardDetailed.free')
            ) : (
              <>
                <span className="text-4xl">{formatCurrency(planDetails.price, currency)}</span>
                <span className="text-base font-normal text-muted-foreground">{t('planCardDetailed.perMonth')}</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content: Role-specific benefits */}
      <CardContent className="flex-1 space-y-6">
        {/* AFFILIATE Benefits (what you RECEIVE) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-emerald-700">
                {t('planCardDetailed.asAffiliate')}
              </h4>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {t('planCardDetailed.youEarn')} {planDetails.affiliate.commissionDisplay}
            </Badge>
          </div>

          <ul className="space-y-2.5 ml-2">
            {planDetails.affiliate.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="text-muted-foreground leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* HOST Benefits (what you PAY) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-orange-600" />
              </div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-orange-700">
                {t('planCardDetailed.asHost')}
              </h4>
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {t('planCardDetailed.youPay')} {planDetails.host.platformFeeDisplay}
            </Badge>
          </div>

          <ul className="space-y-2.5 ml-2">
            {planDetails.host.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 mt-0.5 text-orange-600" />
                <span className="text-muted-foreground leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Point */}
        <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg p-4 border border-blue-100/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">💡 Clave:</span> {planDetails.key}
          </p>
        </div>
      </CardContent>

      {/* Footer: CTA */}
      <CardFooter className="pt-4">
        {isCurrentPlan ? (
          <Button
            className="w-full"
            variant="outline"
            disabled
          >
            {t('planCardDetailed.currentPlan')}
          </Button>
        ) : (
          <Button
            className={cn(
              'w-full transition-all',
              isPopular && 'bg-primary hover:bg-primary/90'
            )}
            onClick={() => onSelect?.(plan)}
            disabled={isLoading}
          >
            {isLoading ? t('planCardDetailed.processing') : planDetails.cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
