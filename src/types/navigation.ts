/**
 * Navigation Types
 *
 * TypeScript types for the GYDI 2.0 menu structure
 */

import { LucideIcon } from 'lucide-react';

/**
 * User roles in the system
 */
export type Role = 'ADMIN' | 'USER';

/**
 * Subscription plan types
 */
export type SubscriptionPlan = 'FREE' | 'PRO' | 'ELITE';

/**
 * Menu item definition
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;

  /** Display label (Spanish) */
  label: string;

  /** Route path */
  href: string;

  /** Lucide icon component */
  icon: LucideIcon;

  /** Description of the menu item's purpose */
  description: string;

  /** Roles that can access this menu item */
  roles: Role[];

  /** Sub-menu items (optional) */
  subItems?: MenuItem[];

  /** Badge to display (optional) - for notifications, counts, etc. */
  badge?: {
    label: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  };

  /** Whether this item should be highlighted (e.g., upgrade CTA) */
  highlighted?: boolean;

  /** Whether this item requires a specific subscription plan */
  requiredPlan?: SubscriptionPlan;
}

/**
 * Menu section definition (for visual grouping)
 */
export interface MenuSection {
  /** Section identifier */
  id: string;

  /** Section label (optional - for visual separation) */
  label?: string;

  /** Menu items in this section */
  items: MenuItem[];

  /** Roles that can see this entire section */
  roles: Role[];
}

/**
 * User navigation context
 */
export interface NavigationContext {
  /** Current user role */
  userRole: Role;

  /** Current subscription plan */
  subscriptionPlan: SubscriptionPlan;

  /** Usage limits (for badges) */
  limits?: {
    properties: {
      used: number;
      limit: number;
    };
    referrals: {
      used: number;
      limit: number;
    };
  };

  /** Pending notifications */
  notifications?: {
    pendingCommissions?: number;
    pendingApprovals?: number;
  };
}
