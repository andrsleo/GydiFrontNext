/**
 * Plan Selection Persistence Utilities
 *
 * Handles saving and retrieving selected plan from localStorage
 * with 7-day expiration for the onboarding flow.
 */

export type PlanCode = 'FREE' | 'PRO' | 'ELITE';

interface StoredPlanSelection {
  planCode: PlanCode;
  timestamp: number;
  expiresIn: number;
}

const STORAGE_KEY = 'gydi_selected_plan';
const EXPIRATION_DAYS = 7;
const EXPIRATION_MS = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Save selected plan to localStorage with expiration
 */
export function savePlanSelection(planCode: PlanCode): void {
  try {
    const data: StoredPlanSelection = {
      planCode,
      timestamp: Date.now(),
      expiresIn: EXPIRATION_MS,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save plan selection:', error);
  }
}

/**
 * Get selected plan from localStorage (if not expired)
 * Returns null if expired or not found
 */
export function getPlanSelection(): PlanCode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const data: StoredPlanSelection = JSON.parse(stored);
    const isExpired = Date.now() - data.timestamp > data.expiresIn;

    if (isExpired) {
      clearPlanSelection();
      return null;
    }

    return data.planCode;
  } catch (error) {
    console.error('Failed to get plan selection:', error);
    return null;
  }
}

/**
 * Clear selected plan from localStorage
 */
export function clearPlanSelection(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear plan selection:', error);
  }
}

/**
 * Check if a plan selection exists and is not expired
 */
export function hasPlanSelection(): boolean {
  return getPlanSelection() !== null;
}
