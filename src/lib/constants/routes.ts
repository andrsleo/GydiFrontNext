export const ROUTES = {
  // Public
  HOME: '/',
  PROPERTIES: '/propiedades',
  PROPERTY_DETAIL: (id: string) => `/propiedades/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_REFERRALS: '/dashboard/referidos',
  DASHBOARD_COMMISSIONS: '/dashboard/comisiones',
  DASHBOARD_SETTINGS: '/dashboard/configuracion',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/usuarios',
  ADMIN_PROPERTIES: '/admin/propiedades',
  ADMIN_TRANSACTIONS: '/admin/transacciones',

  // API
  API_PROPERTIES: '/api/properties',
  API_REFERRALS: '/api/referrals',
  API_COMMISSIONS: '/api/commissions',
} as const;
