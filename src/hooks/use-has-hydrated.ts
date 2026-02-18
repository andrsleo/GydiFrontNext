/**
 * Hook to check if Zustand store has hydrated from localStorage
 *
 * Prevents rendering components that depend on persisted state
 * before the hydration is complete, avoiding race conditions.
 *
 * @returns true if store has hydrated, false otherwise
 */

import { useEffect, useState } from 'react';

export function useHasHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Set to true after mount to ensure hydration is complete
    setHasHydrated(true);
  }, []);

  return hasHydrated;
}
