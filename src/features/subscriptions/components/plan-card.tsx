/**
 * Plan Card Component
 *
 * Displays a subscription plan with pricing, features, and CTA button.
 */

'use client';

import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCurrencyStore, selectCurrency } from '@/store/currency-store';
import { formatCurrency } from '@/lib/utils/format';
import { useTranslation } from '@/hooks/use-translation';
import type { PlanResponse } from '../types';

interface PlanCardProps {
  plan: PlanResponse;
  currentPlanCode?: string;
  onSelect?: (planCode: string) => void;
  isLoading?: boolean;
  recommended?: boolean;
}

export function PlanCard({
  plan,
  currentPlanCode,
  onSelect,
  isLoading = false,
  recommended = false,
}: PlanCardProps) {
  const isCurrentPlan = currentPlanCode === plan.planCode;
  const isFree = plan.monthlyPrice === 0;
  const currency = useCurrencyStore(selectCurrency);
  const { t } = useTranslation('subscription');

  // Parse features from JSON
  let features: string[] = [];
  try {
    const parsed = JSON.parse(plan.featuresJson || '[]');
    features = Array.isArray(parsed) ? parsed : [];
  } catch {
    features = [];
  }

  const handleSelect = () => {
    if (onSelect && !isCurrentPlan) {
      onSelect(plan.planCode);
    }
  };

  return (
    <Card
      className={cn(
        'relative flex flex-col',
        recommended && 'border-2 border-primary shadow-lg',
        isCurrentPlan && 'border-2 border-green-500'
      )}
    >
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge className="bg-primary text-primary-foreground">
            <Star className="mr-1 h-3 w-3" />
            {t('planCard.recommended')}
          </Badge>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-500 text-white">
            <Check className="mr-1 h-3 w-3" />
            {t('planCard.currentPlan')}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-8 pt-6">
        <CardTitle className="text-2xl font-bold">{plan.planName}</CardTitle>
        <CardDescription className="text-sm mt-2">
          {plan.description}
        </CardDescription>

        {/* Pricing */}
        <div className="mt-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold">
              {formatCurrency(plan.monthlyPrice, currency)}
            </span>
            {!isFree && (
              <span className="text-muted-foreground text-sm">{t('planCard.perMonth')}</span>
            )}
          </div>

          {/* Commission Rate */}
          <div className="mt-3">
            <Badge variant="outline" className="text-base px-3 py-1">
              {(plan.commissionRate * 100).toFixed(0)}% Commission
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Features List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">
              {t('planCard.upToProperties', { count: String(plan.maxProperties) })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">
              {plan.maxReferralsPerMonth === -1
                ? t('planCard.unlimited')
                : t('planCard.referralsPerMonth', { count: String(plan.maxReferralsPerMonth) })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">{t('planCard.support', { level: plan.supportLevel })}</span>
          </div>

          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSelect}
          disabled={isCurrentPlan || isLoading}
          variant={recommended ? 'default' : 'outline'}
        >
          {isCurrentPlan
            ? t('planCard.currentPlan')
            : isFree
            ? t('planCard.getStarted')
            : t('planCard.upgradeTo', { name: plan.planName })}
        </Button>
      </CardFooter>
    </Card>
  );
}
