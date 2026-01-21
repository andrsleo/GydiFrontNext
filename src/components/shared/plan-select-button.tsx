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
import { useIsAuthenticated } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';
import type { PlanCode } from '@/lib/utils/plan-selection';
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
  const isAuthenticated = useIsAuthenticated();

  const handleSelectPlan = () => {
    // Case 1: Authenticated user selecting paid plan (PRO/ELITE)
    // → Redirect to dashboard with upgrade query param to auto-open modal
    if (isAuthenticated && planCode !== 'FREE') {
      router.push(`/dashboard?upgrade=${planCode}`);
      return;
    }

    // Case 2: Non-authenticated user selecting FREE plan
    // → Redirect to registration with query param only
    if (!isAuthenticated && planCode === 'FREE') {
      // Redirect with query param for explicit FREE plan context
      router.push('/register?plan=FREE');
      return;
    }

    // Case 3: Non-authenticated user selecting paid plan (PRO/ELITE)
    // → Redirect to registration with query param only
    if (!isAuthenticated && planCode !== 'FREE') {
      // Redirect with query param
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
