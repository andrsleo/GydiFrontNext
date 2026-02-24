/**
 * Dashboard feature — centralized analytics bounded context
 *
 * Exports individual hooks for reuse across pages:
 *   useDashboardReferralStats  → /referidos page
 *   useDashboardEarnings       → /ganancias page
 *   useDashboardBookingStats   → /reservas page
 *   useDashboardCommissionStats → /ganancias page
 *
 * Exports composite hook for the overview page:
 *   useAffiliateDashboard → /dashboard page (all data in parallel)
 */
export * from './hooks/use-dashboard-stats';
export * from './types';
