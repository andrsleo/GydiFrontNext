/**
 * ExpirationInfo - Display information about link duration based on user plan
 * Server Component
 */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ExpirationInfoProps {
  userPlan: 'FREE' | 'PRO' | 'ELITE';
}

const PLAN_EXPIRATION_DAYS = {
  FREE: 30,
  PRO: 90,
  ELITE: 365,
} as const;

const PLAN_NAMES = {
  FREE: 'Free',
  PRO: 'Pro',
  ELITE: 'Elite',
} as const;

export function ExpirationInfo({ userPlan }: ExpirationInfoProps) {
  const expirationDays = PLAN_EXPIRATION_DAYS[userPlan];
  const planName = PLAN_NAMES[userPlan];

  const upgradeMessage = {
    FREE: 'Upgrade to Pro for 90-day links or Elite for 1-year links.',
    PRO: 'Upgrade to Elite for 1-year links.',
    ELITE: 'You have the longest link duration available!',
  }[userPlan];

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Link Duration</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          With your <strong>{planName}</strong> plan, your referral links last{' '}
          <strong>
            {expirationDays === 365 ? '1 year' : `${expirationDays} days`}
          </strong>
          .
        </p>
        <p className="text-sm text-muted-foreground">{upgradeMessage}</p>
      </AlertDescription>
    </Alert>
  );
}
