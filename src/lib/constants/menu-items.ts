/**
 * Menu Items Configuration
 *
 * Defines the complete menu structure for GYDI 2.0
 * Based on the approved proposal from orchestrator-ai
 */

import {
  LayoutDashboard,
  Building2,
  Share2,
  DollarSign,
  Crown,
  Settings,
  ShieldCheck,
  Users,
  Building,
  BarChart3,
  CreditCard,
  User,
  LogOut,
  Calendar,
  CalendarDays,
  CalendarRange,
  Sparkles,
  Film,
  Rss,
} from 'lucide-react';
import type { MenuItem, MenuSection, Role, SubscriptionPlan } from '@/types/navigation';

/**
 * Main Navigation Menu Items
 */
export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Panel Principal',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Vista general con estadísticas clave (comisiones, referidos, clicks)',
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
  {
    id: 'properties',
    label: 'Propiedades',
    href: '/dashboard/propiedades',
    icon: Building2,
    description: 'Gestión completa del catálogo de propiedades vacacionales',
    roles: ['ADMIN', 'USER', 'CREATOR'],
    subItems: [
      {
        id: 'properties-my',
        label: 'Mis Propiedades',
        href: '/dashboard/propiedades/mis-propiedades',
        icon: Building2,
        description: 'Gestiona tus propiedades en renta',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
      {
        id: 'properties-calendar',
        label: 'Calendario',
        href: '/dashboard/propiedades/calendario',
        icon: CalendarDays,
        description: 'Gestiona el calendario y precios de tus propiedades',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
      {
        id: 'properties-refer',
        label: 'Referir Propiedades',
        href: '/dashboard/propiedades/referir',
        icon: Share2,
        description: 'Refiere propiedades y gana comisiones',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
    ],
  },
  {
    id: 'referrals',
    label: 'Referidos',
    href: '/dashboard/referidos',
    icon: Share2,
    description: 'Sistema de referidos y generación de enlaces de referido',
    roles: ['ADMIN', 'USER', 'CREATOR'],
    subItems: [
      {
        id: 'referrals-links',
        label: 'Mis Enlaces',
        href: '/dashboard/referidos',
        icon: Share2,
        description: 'Lista de enlaces de referido generados',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
      {
        id: 'referrals-stats',
        label: 'Estadísticas',
        href: '/dashboard/referrals',
        icon: BarChart3,
        description: 'Análisis de clicks, conversiones y tasa de conversión',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
    ],
  },
  {
    id: 'bookings',
    label: 'Reservas',
    href: '/dashboard/bookings',
    icon: Calendar,
    description: 'Gestión de reservas (como referido y/o anfitrión)',
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
  {
    id: 'earnings',
    label: 'Comisiones',
    href: '/dashboard/commissions',
    icon: DollarSign,
    description: 'Comisiones ganadas y pagadas',
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
];

/**
 * Creator Section Menu Items (CREATOR + ADMIN)
 */
export const CREATOR_MENU_ITEMS: MenuItem[] = [
  {
    id: 'creator',
    label: 'Creator Dashboard',
    href: '/dashboard/creator',
    icon: Sparkles,
    description: 'Panel de creator: stats, tier, engagement',
    roles: ['ADMIN', 'USER', 'CREATOR'],
    subItems: [
      {
        id: 'creator-analytics',
        label: 'Analytics',
        href: '/dashboard/creator/analytics',
        icon: BarChart3,
        description: 'Performance de tus posts',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
      {
        id: 'creator-earnings',
        label: 'Ganancias',
        href: '/dashboard/creator/earnings',
        icon: DollarSign,
        description: 'Comisiones por contenido',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
    ],
  },
  {
    id: 'content',
    label: 'Mi Contenido',
    href: '/dashboard/content',
    icon: Film,
    description: 'Gestiona tus posts y sube contenido nuevo',
    roles: ['ADMIN', 'USER', 'CREATOR'],
    subItems: [
      {
        id: 'content-list',
        label: 'Mis Posts',
        href: '/dashboard/content',
        icon: Film,
        description: 'Ver y gestionar posts publicados',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
      {
        id: 'content-new',
        label: 'Nuevo Post',
        href: '/dashboard/content/new',
        icon: Film,
        description: 'Publicar foto o video',
        roles: ['ADMIN', 'USER', 'CREATOR'],
      },
    ],
  },
];

/**
 * Management Section Menu Items
 */
export const MANAGEMENT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'subscription',
    label: 'Medios de Pago',
    href: '/dashboard/subscription',
    icon: CreditCard,
    description: 'Administra tus tarjetas de crédito y débito',
    roles: ['ADMIN', 'USER', 'CREATOR'],
    /* PRO_ELITE_DISABLED — remove highlighted when memberships are re-enabled */
    // highlighted: true,
  },
  {
    id: 'settings',
    label: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
    description: 'Ajustes de cuenta, perfil, seguridad y notificaciones',
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
];

/**
 * Admin Panel Menu Items (ADMIN only)
 */
export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    id: 'admin',
    label: 'Administración',
    href: '/admin',
    icon: ShieldCheck,
    description: 'Panel de administración y gestión de la plataforma',
    roles: ['ADMIN'],
    subItems: [
      {
        id: 'admin-analytics',
        label: 'Analíticas Globales',
        href: '/admin/analytics',
        icon: BarChart3,
        description: 'Reportes de ingresos, conversiones, top referidos',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-users',
        label: 'Gestión de Usuarios',
        href: '/admin/usuarios',
        icon: Users,
        description: 'CRUD de usuarios, cambiar roles, suspender cuentas',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-properties',
        label: 'Gestión de Propiedades',
        href: '/admin/propiedades',
        icon: Building,
        description: 'Moderar propiedades, aprobar/rechazar publicaciones',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-bookings',
        label: 'Gestión de Reservas',
        href: '/dashboard/admin/bookings',
        icon: Calendar,
        description: 'Gestión completa de reservas y cambios de estado',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-commissions',
        label: 'Gestión de Comisiones',
        href: '/admin/comisiones',
        icon: DollarSign,
        description: 'Aprobar/rechazar comisiones, procesar pagos',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-plans',
        label: 'Planes y Precios',
        href: '/admin/planes',
        icon: CreditCard,
        description: 'Ajustar precios, comisiones y límites de planes',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-config',
        label: 'Configuración del Sistema',
        href: '/admin/configuracion',
        icon: Settings,
        description: 'Variables del sistema, webhooks, integraciones',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-seasons',
        label: 'Temporadas',
        href: '/admin/temporadas',
        icon: CalendarRange,
        description: 'Configura temporadas alta, media y baja por alcance geográfico',
        roles: ['ADMIN'],
      },
    ],
  },
];

/**
 * User Profile Menu Items (Header Dropdown)
 */
export const USER_MENU_ITEMS: MenuItem[] = [
  {
    id: 'profile',
    label: 'Ver Perfil',
    href: '/dashboard/configuracion',
    icon: User,
    description: 'Ver y editar perfil público',
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
  /* MEMBERSHIPS_DISABLED — re-enable when subscription management is launched
  {
    id: 'my-plan',
    label: 'Mi Plan',
    href: '/dashboard/subscription',
    icon: Crown,
    description: 'Detalles del plan de suscripción',
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
  */
  {
    id: 'settings-profile',
    label: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
    description: 'Ajustes de cuenta',
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
  {
    id: 'logout',
    label: 'Cerrar Sesión',
    href: '/logout', // Special route handled by auth
    icon: LogOut,
    description: 'Terminar sesión',
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
];

/**
 * Complete Menu Sections (for Sidebar)
 */
export const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'main',
    label: undefined,
    items: MAIN_MENU_ITEMS,
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
  {
    id: 'creator',
    label: 'Creator',
    items: CREATOR_MENU_ITEMS,
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
  {
    id: 'management',
    label: undefined,
    items: MANAGEMENT_MENU_ITEMS,
    roles: ['ADMIN', 'USER', 'CREATOR'],
  },
  {
    id: 'admin',
    label: 'Administración',
    items: ADMIN_MENU_ITEMS,
    roles: ['ADMIN'],
  },
];

/**
 * Helper: Filter menu items by user role
 */
export function filterMenuByRole(items: MenuItem[], userRole: Role): MenuItem[] {
  return items
    .filter((item) => item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      subItems: item.subItems
        ? filterMenuByRole(item.subItems, userRole)
        : undefined,
    }));
}

/**
 * Helper: Filter menu sections by user role
 */
export function filterSectionsByRole(
  sections: MenuSection[],
  userRole: Role
): MenuSection[] {
  return sections
    .filter((section) => section.roles.includes(userRole))
    .map((section) => ({
      ...section,
      items: filterMenuByRole(section.items, userRole),
    }))
    .filter((section) => section.items.length > 0); // Remove empty sections
}

/**
 * Subscription Plan Limits
 */
export const PLAN_LIMITS = {
  FREE: {
    properties: 10,
    referrals: 50,
    commission: 0.02, // 2%
  },
  PRO: {
    properties: 50,
    referrals: 200,
    commission: 0.05, // 5%
  },
  ELITE: {
    properties: Infinity,
    referrals: Infinity,
    commission: 0.1, // 10%
  },
} as const;

/**
 * Subscription Plan Labels
 */
export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  FREE: 'Gratis',
  PRO: 'Pro',
  ELITE: 'Elite',
};

/**
 * Subscription Plan Colors (for badges)
 */
export const PLAN_COLORS: Record<SubscriptionPlan, string> = {
  FREE: 'bg-gray-100 text-gray-800 border-gray-300',
  PRO: 'bg-blue-100 text-blue-800 border-blue-300',
  ELITE: 'bg-purple-100 text-purple-800 border-purple-300',
};
