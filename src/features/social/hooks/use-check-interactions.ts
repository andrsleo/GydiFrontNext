'use client';

import { useState } from 'react';
import type { InteractionState } from '../types';

/**
 * Tracks optimistic interaction state for a content post.
 * Initial state is false (not liked/saved/following) and updates
 * are applied through the toggle mutation hooks.
 */
export function useCheckInteractions(
  initialState?: Partial<InteractionState>
): [InteractionState, (update: Partial<InteractionState>) => void] {
  const [state, setState] = useState<InteractionState>({
    liked: initialState?.liked ?? false,
    saved: initialState?.saved ?? false,
    following: initialState?.following ?? false,
  });

  const update = (patch: Partial<InteractionState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  return [state, update];
}
