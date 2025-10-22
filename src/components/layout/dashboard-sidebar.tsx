'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  Share2,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    name: 'Resumen',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Propiedades',
    href: '/dashboard/propiedades',
    icon: Building2,
  },
  {
    name: 'Referidos',
    href: '/dashboard/referidos',
    icon: Share2,
  },
  {
    name: 'Comisiones',
    href: '/dashboard/comisiones',
    icon: DollarSign,
  },
  {
    name: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: Users,
  },
  {
    name: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-gray-50 transition-transform duration-300 ease-in-out md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">GYDI</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
