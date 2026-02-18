/**
 * Authentication Verifier Component
 *
 * SOLUCIÓN AL BUG DE SESIÓN INCONSISTENTE:
 *
 * Problema identificado:
 * - Zustand + localStorage persisten datos de usuario indefinidamente
 * - Cookie gydi_session tiene 24 horas de vida
 * - JWT del backend expira antes (típicamente 1 hora)
 * - Header muestra nombre del usuario aunque el token haya expirado
 *
 * Esta solución:
 * 1. Verifica la sesión una sola vez al montar la app
 * 2. Si el token expiró, limpia TODOS los estados (Zustand, localStorage, cookies)
 * 3. Evita mostrar información de sesión inválida en el Header
 *
 * @see https://github.com/project/issues/session-inconsistency
 */

'use client';

import { useEffect } from 'react';
import { useCurrentUser } from '../hooks/use-auth';
import { useAuthStore, useHasHydrated } from '@/store/auth-store';
import { clearSessionMarker } from '../api/auth.api';

/**
 * AuthVerifier Component
 *
 * Se monta una sola vez en el layout principal.
 * Verifica silenciosamente si el token JWT es válido.
 *
 * Flujo:
 * 1. Espera a que Zustand se hidrate desde localStorage
 * 2. Si hay un usuario en el store, verifica el token con el backend
 * 3. Si el token es válido → actualiza el store con datos frescos
 * 4. Si el token expiró → limpia todo (store + localStorage + cookies)
 *
 * Resultado:
 * - Header siempre muestra el estado real de autenticación
 * - No más nombres de usuarios con tokens expirados
 */
export function AuthVerifier() {
  const hasHydrated = useHasHydrated();
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore((state) => state.setLoading);

  // Detectar si estamos en una página de autenticación
  // En esos casos, no necesitamos verificar
  const isAuthPage =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/login') ||
      window.location.pathname.startsWith('/register') ||
      window.location.pathname.startsWith('/forgot-password') ||
      window.location.pathname.startsWith('/reset-password'));

  // Solo verificar si:
  // 1. Store ya se hidrato desde localStorage
  // 2. Hay un usuario en el store (posiblemente con token expirado)
  // 3. No estamos en una página de autenticación
  const shouldVerify = hasHydrated && isAuthenticated && currentUser && !isAuthPage;

  // ✅ FIX: Establecer loading state ANTES de verificar
  // Esto previene que el Header muestre el usuario antes de la verificación
  useEffect(() => {
    if (shouldVerify) {
      setLoading(true);
    }
  }, [shouldVerify, setLoading]);

  // Hook de React Query para verificar con el backend
  const {
    data: verifiedUser,
    isLoading,
    error,
  } = useCurrentUser({
    enabled: Boolean(shouldVerify), // Solo ejecutar si shouldVerify es true
    retry: false, // No reintentar si falla (token expirado es error esperado)
    staleTime: 0, // Siempre verificar datos frescos
    refetchOnMount: true, // Verificar cada vez que se monta
  });

  // Efecto para manejar el resultado de la verificación
  useEffect(() => {
    if (!hasHydrated) {
      // Aún esperando a que Zustand se hidrate
      return;
    }

    if (isAuthPage) {
      // En páginas de auth, simplemente marca como no cargando
      setLoading(false);
      return;
    }

    if (!shouldVerify) {
      // No hay nada que verificar (no hay usuario en el store)
      setLoading(false);
      return;
    }

    // Si estamos verificando con el backend
    if (isLoading) {
      // Aún verificando... mantener estado de carga
      setLoading(true);
      return;
    }

    // Verificación completada
    if (verifiedUser) {
      // ✅ Token válido - actualizar store con datos frescos del backend
      console.log('[AuthVerifier] ✅ Token válido - sesión actualizada');
      setUser(verifiedUser);
      setLoading(false);
    } else {
      // ❌ Token expirado, inválido, o error de red - LIMPIAR TODO
      // NOTA: authApi.getCurrentUser() retorna null cuando el token expira,
      // no lanza error, por eso usamos 'else' en lugar de 'else if (error)'
      console.warn('[AuthVerifier] ❌ Token inválido o expirado - limpiando sesión');

      if (error) {
        console.warn('[AuthVerifier] Error de verificación:', error.message);
      }

      // 1. Limpiar Zustand store + localStorage
      logout();

      // 2. Limpiar cookie gydi_session
      clearSessionMarker();

      // 3. Limpiar cualquier otro storage legacy
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        // También limpiar el storage de Zustand para evitar datos stale
        localStorage.removeItem('auth-storage');
      }

      setLoading(false);
    }
  }, [
    hasHydrated,
    isAuthPage,
    shouldVerify,
    isLoading,
    verifiedUser,
    error,
    setUser,
    logout,
    setLoading,
  ]);

  // Este componente no renderiza nada (verificación silenciosa)
  return null;
}

/**
 * NOTAS DE IMPLEMENTACIÓN:
 *
 * 1. Este componente debe montarse en el layout principal (app/layout.tsx)
 *    dentro del AuthProvider o Providers
 *
 * 2. Se ejecuta una sola vez al cargar la app, no en cada navegación
 *
 * 3. Es completamente silencioso (no bloquea la UI)
 *
 * 4. Trabaja en conjunto con la sincronización de expiración de cookies
 *    en setSessionMarker() para prevenir el bug
 *
 * 5. El Header ahora siempre mostrará el estado correcto porque:
 *    - Si el token expiró → logout() limpia el user del store
 *    - Header lee useUser() que devuelve null
 *    - Muestra botones de Login/Register en lugar del nombre
 *
 * TESTING MANUAL:
 *
 * Para probar que el bug está resuelto:
 *
 * 1. Login normalmente → deberías ver tu nombre en el Header
 * 2. Simular token expirado:
 *    - Opción A: Esperar 1 hora (expiración real)
 *    - Opción B: Borrar cookies de backend pero dejar localStorage
 * 3. Recargar la página
 * 4. Resultado esperado:
 *    ✅ Header NO muestra tu nombre
 *    ✅ Header muestra botones Login/Register
 *    ✅ Click en cualquier botón funciona correctamente
 *    ✅ No hay redirect inesperado
 */
