/**
 * Plan Select Button
 *
 * Client component that handles plan selection persistence
 * and redirects based on authentication status:
 * - Authenticated users: Redirect to dashboard with upgrade modal
 * - Non-authenticated users: Redirect to registration
 */

'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { savePlanSelection, type PlanCode } from '@/lib/utils/plan-selection';
import type { ButtonProps } from '@/components/ui/button';

interface PlanSelectButtonProps extends ButtonProps {
  planCode: PlanCode;
  children: React.ReactNode;
}

export function PlanSelectButton({
  planCode,
  children,
  className,
  ...props
}: PlanSelectButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const handleSelectPlan = () => {
    // Case 1: Authenticated user selecting paid plan (PRO/ELITE)
    // → Redirect to dashboard with upgrade query param to auto-open modal
    if (isAuthenticated && planCode !== 'FREE') {
      router.push(`/dashboard?upgrade=${planCode}`);
      return;
    }

    // Case 2: Non-authenticated user selecting FREE plan
    // → Redirect directly to registration
    if (!isAuthenticated && planCode === 'FREE') {
      router.push('/register');
      return;
    }

    // Case 3: Non-authenticated user selecting paid plan (PRO/ELITE)
    // → Save selection and redirect to registration with plan context
    if (!isAuthenticated && planCode !== 'FREE') {
      // 1. Save to localStorage with 7-day expiration
      savePlanSelection(planCode);

      // 2. Redirect with query param for immediate context
      router.push(`/register?plan=${planCode}`);
      return;
    }

    // Case 4: Authenticated user selecting FREE plan (edge case)
    // → Just redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <Button
      onClick={handleSelectPlan}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}
