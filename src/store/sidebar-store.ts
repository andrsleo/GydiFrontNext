/**
 * Sidebar Store
 *
 * Manages sidebar collapse/expand state with localStorage persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStore {
  /**
   * Whether sidebar is collapsed (desktop only)
   */
  isCollapsed: boolean;

  /**
   * Whether mobile menu is open
   */
  isMobileOpen: boolean;

  /**
   * Toggle collapse state (desktop)
   */
  toggleCollapse: () => void;

  /**
   * Set collapse state explicitly
   */
  setCollapsed: (collapsed: boolean) => void;

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu: () => void;

  /**
   * Close mobile menu
   */
  closeMobileMenu: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,

      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (collapsed) =>
        set({ isCollapsed: collapsed }),

      toggleMobileMenu: () =>
        set((state) => ({ isMobileOpen: !state.isMobileOpen })),

      closeMobileMenu: () =>
        set({ isMobileOpen: false }),
    }),
    {
      name: 'sidebar-store',
      // Only persist collapse state, not mobile state
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
