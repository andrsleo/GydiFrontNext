/**
 * Z-Index Scale - Sistema centralizado de capas de apilamiento
 *
 * Principios:
 * 1. Escala de 10 en 10 para permitir valores intermedios
 * 2. Categorías semánticas en lugar de valores arbitrarios
 * 3. Valores crecientes = mayor prioridad visual
 * 4. Documentado para facilitar mantenimiento
 *
 * @see https://www.smashingmagazine.com/2021/02/css-z-index-large-projects/
 */

export const Z_INDEX = {
  /**
   * BASE LAYER (0-10)
   * Elementos del flujo normal del documento
   */
  base: 0,

  /**
   * LAYOUT LAYER (10-50)
   * Elementos estructurales del layout
   */
  layoutContent: 10,           // Contenido principal
  layoutSticky: 20,            // Headers sticky
  layoutSidebar: 30,           // Sidebar (desktop)
  layoutMobileSidebar: 40,     // Sidebar (mobile, debe estar sobre content)

  /**
   * OVERLAY LAYER (50-100)
   * Overlays y fondos de modals/drawers
   */
  overlayBackdrop: 50,         // Backdrop de modals/drawers

  /**
   * FLOATING LAYER (100-500)
   * Elementos flotantes (tooltips, dropdowns, selects)
   */
  floatingTooltip: 100,        // Tooltips (menor prioridad)
  floatingDropdown: 200,       // Dropdown menus
  floatingSelect: 300,         // Select menus
  floatingPopover: 400,        // Popovers genéricos

  /**
   * MODAL LAYER (500-1000)
   * Modals, dialogs, alerts (bloquean interacción)
   */
  modalOverlay: 500,           // Overlay de modals
  modalContent: 600,           // Contenido del modal

  /**
   * NOTIFICATION LAYER (1000-1500)
   * Notificaciones, toasts, alerts no bloqueantes
   */
  notification: 1000,          // Toasts, snackbars

  /**
   * PRIORITY LAYER (1500+)
   * Elementos de máxima prioridad
   */
  tooltip: 1500,               // Tooltips que deben estar sobre todo
  loadingOverlay: 2000,        // Loading overlays globales

  /**
   * DEBUG LAYER (9999)
   * Solo para desarrollo/debug
   */
  debug: 9999,
} as const;

/**
 * Type helper para autocompletado
 */
export type ZIndexKey = keyof typeof Z_INDEX;

/**
 * Helpers para casos especiales
 */
export const zIndexHelpers = {
  /**
   * Obtener z-index para un elemento que debe estar justo encima de otro
   */
  above: (base: number) => base + 1,

  /**
   * Obtener z-index para un elemento que debe estar justo debajo de otro
   */
  below: (base: number) => base - 1,
} as const;

/**
 * GUÍA DE USO:
 *
 * 1. Importar en tus componentes:
 *    import { Z_INDEX } from '@/lib/constants/z-index';
 *
 * 2. Usar en Tailwind (className):
 *    className={cn("fixed", `z-[${Z_INDEX.modalOverlay}]`)}
 *
 * 3. Usar en CSS-in-JS:
 *    style={{ zIndex: Z_INDEX.modalOverlay }}
 *
 * 4. Usar en Tailwind config (siguiente paso):
 *    Extender theme.zIndex en tailwind.config.ts
 */
