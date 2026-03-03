'use client';

/**
 * Sidebar Navigation Component
 *
 * Main navigation sidebar with role-based menu filtering.
 * Features:
 * - Collapsible sidebar (desktop) with persistent state
 * - Mobile drawer with overlay
 * - Resource usage tracking
 * - Plan badges and tooltips
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MENU_SECTIONS,
  filterSectionsByRole,
  PLAN_LABELS,
  PLAN_COLORS,
} from '@/lib/constants/menu-items';
import { useSidebarStore } from '@/store/sidebar-store';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import {
  menuItemAnimations,
  badgeAnimations,
  getStaggerDelay,
  withReducedMotion,
} from '@/lib/utils/animations';
import { useTranslation } from '@/hooks/use-translation';
import type { MenuItem, Role, SubscriptionPlan } from '@/types/navigation';

interface SidebarProps {
  userRole: Role;
  subscriptionPlan?: SubscriptionPlan;
  className?: string;
}

/**
 * Sidebar Component
 */
export function Sidebar({ userRole, subscriptionPlan = 'FREE', className }: SidebarProps) {
  const {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    toggleMobileMenu,
    closeMobileMenu
  } = useSidebarStore();

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation('common');

  // Map menu item IDs → translated labels
  const menuItemLabels: Record<string, string> = {
    dashboard: t('menu.dashboard'),
    properties: t('menu.properties'),
    'properties-my': t('menu.propertiesMy'),
    'properties-refer': t('menu.propertiesRefer'),
    referrals: t('menu.referrals'),
    'referrals-links': t('menu.referralsLinks'),
    'referrals-stats': t('menu.referralsStats'),
    bookings: t('menu.bookings'),
    earnings: t('menu.earnings'),
    subscription: t('menu.subscription'),
    settings: t('menu.settings'),
    admin: t('menu.admin'),
    'admin-analytics': t('menu.adminAnalytics'),
    'admin-users': t('menu.adminUsers'),
    'admin-properties': t('menu.adminProperties'),
    'admin-bookings': t('menu.adminBookings'),
    'admin-commissions': t('menu.adminCommissions'),
    'admin-plans': t('menu.adminPlans'),
    'admin-config': t('menu.adminConfig'),
  };

  // Map section IDs → translated labels
  const sectionLabels: Record<string, string> = {
    admin: t('menu.adminSection'),
  };

  // Plan labels with i18n
  const planLabels: Record<SubscriptionPlan, string> = {
    FREE: t('plan.free'),
    PRO: t('plan.pro'),
    ELITE: t('plan.elite'),
  };

  // Filter menu sections by user role
  const visibleSections = filterSectionsByRole(MENU_SECTIONS, userRole);

  // Toggle sub-menu expansion
  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Check if a menu item or its children are active
  const isActive = (item: MenuItem): boolean => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.href);
    }
    return false;
  };

  // Render menu item
  const renderMenuItem = (item: MenuItem, level = 0, index = 0) => {
    const active = isActive(item);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.has(item.id);

    const menuItem = (
      <div key={item.id} className="w-full">
        {/* Main Item */}
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
            // Performance-optimized animations
            withReducedMotion(
              'transition-all duration-200 ease-out',
              prefersReducedMotion
            ),
            // Hover animations (GPU-accelerated)
            !prefersReducedMotion && 'hover:scale-[1.01] active:scale-[0.99]',
            level > 0 && !isCollapsed && 'ml-6',
            level > 0 && isCollapsed && 'ml-0',
            active
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            item.highlighted && 'ring-2 ring-primary/20',
            isCollapsed && 'justify-center'
          )}
          style={
            !prefersReducedMotion && level === 0
              ? {
                  animationDelay: `${getStaggerDelay(index)}ms`,
                  animationFillMode: 'both',
                }
              : undefined
          }
        >
          {/* Icon or Expand Button */}
          {hasSubItems && !isCollapsed ? (
            <button
              onClick={() => toggleExpand(item.id)}
              className="flex items-center gap-3 flex-1"
              aria-label={`Toggle ${menuItemLabels[item.id] ?? item.label}`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left truncate">{menuItemLabels[item.id] ?? item.label}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
            </button>
          ) : (
            <Link
              href={item.href as any}
              className={cn(
                'flex items-center gap-3 flex-1',
                isCollapsed && 'justify-center'
              )}
              onClick={() => closeMobileMenu()}
            >
              <item.icon className="h-5 w-5 shrink-0" />

              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{menuItemLabels[item.id] ?? item.label}</span>

                  {/* Badge */}
                  {item.badge && (
                    <Badge
                      variant={item.badge.variant || 'default'}
                      className={cn(
                        'ml-auto shrink-0',
                        !prefersReducedMotion && 'animate-scale-in'
                      )}
                    >
                      {item.badge.label}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )}
        </div>

        {/* Sub-items (only show if expanded AND not collapsed) */}
        {hasSubItems && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.subItems!.map((subItem, subIndex) => renderMenuItem(subItem, level + 1, subIndex))}
          </div>
        )}
      </div>
    );

    // Wrap with tooltip if collapsed
    if (isCollapsed && level === 0) {
      return (
        <Tooltip key={item.id} delayDuration={0}>
          <TooltipTrigger asChild>
            {menuItem}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {menuItemLabels[item.id] ?? item.label}
            {item.badge && (
              <span className="ml-2 text-xs opacity-70">
                {item.badge.label}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return menuItem;
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header with Logo and Toggle */}
      <div className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2',
            isCollapsed && 'lg:justify-center lg:w-full'
          )}
          onClick={() => closeMobileMenu()}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shrink-0">
            G
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold truncate">GYDI</span>
          )}
        </Link>

        {/* Plan Badge (hidden when collapsed) */}
        {subscriptionPlan && !isCollapsed && (
          <Badge
            className={cn('ml-auto shrink-0', PLAN_COLORS[subscriptionPlan])}
            variant="outline"
          >
            {planLabels[subscriptionPlan]}
          </Badge>
        )}

        {/* Collapse Toggle Button (Desktop only) */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'hidden lg:flex shrink-0',
            isCollapsed ? 'ml-0' : 'ml-2'
          )}
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <TooltipProvider>
          {visibleSections.map((section) => (
            <div key={section.id} className="space-y-1">
              {/* Section Label (hidden when collapsed) */}
              {section.label && !isCollapsed && (
                <div className="px-3 pt-4 pb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                    {sectionLabels[section.id] ?? section.label}
                  </h3>
                </div>
              )}

              {/* Section Items */}
              {section.items.map((item, itemIndex) => renderMenuItem(item, 0, itemIndex))}

              {/* Visual Separator (hidden when collapsed) */}
              {!isCollapsed &&
                section.id !== visibleSections[visibleSections.length - 1].id && (
                  <div className="my-4 border-t" />
                )}
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {/*
        DISABLED: Resource Usage Panel
        Los planes ahora solo se diferencian por porcentaje de comisiones.
        Los límites de recursos (propiedades, referidos) ya no aplican.
      */}
      {/* {userRole === 'USER' && !isLoading && !isCollapsed && (
        <div className="border-t p-4 space-y-3">
          ... Panel de Uso de Recursos desactivado ...
        </div>
      )} */}

      {/* Footer (hidden when collapsed) */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground text-center">
            GYDI 2.0 © 2026
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-in fade-in duration-200"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 bg-background border-r transition-all duration-300',
          // Mobile
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop width based on collapse state
          isCollapsed ? 'lg:w-20' : 'w-72',
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for desktop layout */}
      <div className={cn(
        'hidden lg:block transition-all duration-300',
        isCollapsed ? 'lg:w-20' : 'lg:w-72'
      )} />
    </>
  );
}
