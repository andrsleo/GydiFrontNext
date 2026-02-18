'use client';

/**
 * User Menu Component (Header Dropdown)
 *
 * Displays user profile menu in the header with:
 * - User avatar, name, and email
 * - Subscription plan badge
 * - Role-based menu options (profile, plan, settings, logout)
 *
 * Uses Zustand store for user data and React Query for logout mutation.
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  USER_MENU_ITEMS,
  filterMenuByRole,
  PLAN_LABELS,
  PLAN_COLORS,
} from '@/lib/constants/menu-items';
import { useUser } from '@/features/auth/hooks/use-auth';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { normalizeRole } from '@/lib/utils/role';
import type { SubscriptionPlan } from '@/types/navigation';

interface UserMenuProps {
  className?: string;
}

/**
 * User Menu Component
 *
 * Dropdown menu in header showing user info and actions.
 */
export function UserMenu({ className }: UserMenuProps) {
  const router = useRouter();
  const user = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // If no user, show nothing (middleware should redirect)
  if (!user) {
    return null;
  }

  // Normalize role: Remove 'ROLE_' prefix if present (backend returns 'ROLE_USER', frontend expects 'USER')
  const userRole = normalizeRole(user.role);

  // Filter menu items by user role
  const visibleItems = filterMenuByRole(
    USER_MENU_ITEMS,
    userRole
  );

  // Get user initials for avatar fallback
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Handle logout action
  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'relative flex items-center gap-3 px-3 py-2 h-auto',
            className
          )}
        >
          {/* Avatar */}
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={undefined}
              alt={user.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          {/* User Info (hidden on mobile) */}
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-medium leading-none">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>

          {/* Chevron Icon */}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Info Header */}
        <DropdownMenuLabel className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{user.name}</span>
            {/* Subscription Plan Badge */}
            <Badge
              className={cn(
                'text-xs',
                PLAN_COLORS[user.activePlan as SubscriptionPlan]
              )}
              variant="outline"
            >
              {PLAN_LABELS[user.activePlan as SubscriptionPlan]}
            </Badge>
          </div>
          <span className="text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items (filtered by role) */}
        {visibleItems.map((item) => {
          const Icon = item.icon;

          // Special handling for logout
          if (item.id === 'logout') {
            return (
              <DropdownMenuItem
                key={item.id}
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                {isLoggingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="mr-2 h-4 w-4" />
                )}
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          }

          // Regular menu items (link to route)
          return (
            <DropdownMenuItem key={item.id} asChild>
              <Link href={item.href as any} className="cursor-pointer">
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
