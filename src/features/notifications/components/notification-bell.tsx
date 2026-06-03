'use client';

import { NotificationDropdown } from './notification-dropdown';

/**
 * NotificationBell — top-level export that renders the bell icon + dropdown.
 * Integrate in header: <NotificationBell /> (visible only when authenticated).
 */
export function NotificationBell() {
  return <NotificationDropdown />;
}
