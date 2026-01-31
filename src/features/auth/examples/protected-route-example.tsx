/**
 * Protected Route Examples
 *
 * Demonstrates different patterns for protecting routes with authentication.
 * Shows both component-level and page-level protection.
 *
 * AUTHENTICATION WORKS IN BOTH ENVIRONMENTS:
 * - Development: Tokens in localStorage, sent via Authorization header
 * - Production: Tokens in httpOnly cookies, sent automatically
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useCurrentUser } from '../hooks/use-auth';
import { withAuth, withRole } from '../providers/auth-provider';

/**
 * Example 1: Protected Dashboard Component
 *
 * Uses Zustand store to check authentication.
 * Redirects to login if user is not authenticated.
 *
 * @example
 * // In app/(dashboard)/dashboard/page.tsx
 * import { ProtectedDashboard } from '@/features/auth/examples/protected-route-example';
 *
 * export default function DashboardPage() {
 *   return <ProtectedDashboard />;
 * }
 */
export function ProtectedDashboard() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?callbackUrl=/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't render until authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-2 text-xl font-semibold">Bienvenido, {user.name}!</h2>
        <p className="text-muted-foreground">Email: {user.email}</p>
        <p className="text-muted-foreground">Rol: {user.role}</p>
        <p className="text-muted-foreground">Plan: {user.activePlan}</p>
      </div>
    </div>
  );
}

/**
 * Example 2: Using HOC (Higher-Order Component)
 *
 * Wrap component with withAuth to protect it.
 * Cleaner syntax, automatic redirection.
 *
 * @example
 * // In app/(dashboard)/profile/page.tsx
 * import { ProfilePageExample } from '@/features/auth/examples/protected-route-example';
 *
 * export default ProfilePageExample; // Already wrapped with withAuth
 */
function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Mi Perfil</h1>
      <div className="rounded-lg border bg-card p-6">
        <p>Nombre: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Verificado: {user?.accountVerified ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
}

// Export wrapped component
export const ProfilePageExample = withAuth(ProfilePage);

/**
 * Example 3: Role-Based Protection
 *
 * Only users with ADMIN role can access this page.
 *
 * @example
 * // In app/admin/users/page.tsx
 * import { AdminUsersPageExample } from '@/features/auth/examples/protected-route-example';
 *
 * export default AdminUsersPageExample; // Already wrapped with withRole('ADMIN')
 */
function AdminUsersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Gestión de Usuarios</h1>
      <div className="rounded-lg border bg-card p-6">
        <p>Solo los administradores pueden ver esta página.</p>
      </div>
    </div>
  );
}

// Export wrapped component with role check
export const AdminUsersPageExample = withRole('ADMIN')(AdminUsersPage);

/**
 * Example 4: Server Component with Client Verification
 *
 * For use in Server Components (app directory).
 * Wraps the page with AuthProvider to verify on mount.
 *
 * @example
 * // In app/(dashboard)/settings/page.tsx
 * import { ServerProtectedPage } from '@/features/auth/examples/protected-route-example';
 *
 * export default function SettingsPage() {
 *   return <ServerProtectedPage title="Configuración" />;
 * }
 */
export function ServerProtectedPage({ title }: { title: string }) {
  // This component assumes AuthProvider is in the layout
  // and middleware is protecting the route
  const user = useAuthStore((state) => state.user);

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>
      {user && (
        <div className="rounded-lg border bg-card p-6">
          <p>Usuario autenticado: {user.name}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Manual Auth Check with useCurrentUser
 *
 * Fetches fresh user data from backend on mount.
 * Useful when you need to verify authentication state.
 *
 * @example
 * // In any component
 * import { ManualAuthCheck } from '@/features/auth/examples/protected-route-example';
 *
 * export default function SomePage() {
 *   return <ManualAuthCheck />;
 * }
 */
export function ManualAuthCheck() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useCurrentUser();

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || isError) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Verificación Manual</h1>
      <div className="rounded-lg border bg-card p-6">
        <p>Usuario verificado: {user.name}</p>
        <p>Datos frescos del backend</p>
      </div>
    </div>
  );
}

/**
 * Example 6: Conditional Rendering Based on Auth
 *
 * Shows different content for authenticated vs unauthenticated users.
 *
 * @example
 * // In app/page.tsx (public homepage)
 * import { ConditionalContent } from '@/features/auth/examples/protected-route-example';
 *
 * export default function HomePage() {
 *   return (
 *     <div>
 *       <h1>GYDI - Platform</h1>
 *       <ConditionalContent />
 *     </div>
 *   );
 * }
 */
export function ConditionalContent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-2 text-xl font-semibold">Hola, {user.name}!</h2>
        <p className="text-muted-foreground">
          Bienvenido de vuelta a tu cuenta.
        </p>
        <a
          href="/dashboard"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Ir al Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-2 text-xl font-semibold">¡Únete a GYDI!</h2>
      <p className="mb-4 text-muted-foreground">
        Crea una cuenta y comienza a ganar comisiones.
      </p>
      <div className="flex gap-4">
        <a
          href="/register"
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Registrarse
        </a>
        <a
          href="/login"
          className="rounded-md border border-primary px-4 py-2 text-primary hover:bg-primary/10"
        >
          Iniciar Sesión
        </a>
      </div>
    </div>
  );
}

/**
 * Example 7: Logout Button
 *
 * Simple logout button component.
 *
 * @example
 * // In any component
 * import { LogoutButton } from '@/features/auth/examples/protected-route-example';
 *
 * function Header() {
 *   return (
 *     <header>
 *       <nav>
 *         <LogoutButton />
 *       </nav>
 *     </header>
 *   );
 * }
 */
export function LogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      // Call backend logout (use proxy for Safari compatibility)
      const response = await fetch(
        '/api/proxy/api/v1/auth/logout',
        {
          method: 'POST',
          credentials: 'include', // Send cookies
        }
      );

      // Clear localStorage in development
      if (process.env.NODE_ENV === 'development') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }

      // Clear Zustand store
      logout();

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state anyway
      logout();
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-input px-4 py-2 hover:bg-accent"
    >
      Cerrar Sesión
    </button>
  );
}
