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
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/store/use-sidebar-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-layout-mobile-sidebar md:hidden">
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
          'fixed inset-y-0 left-0 z-layout-sidebar transform border-r bg-gray-50 transition-all duration-300 ease-in-out md:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Toggle Button */}
          <div className="absolute -right-3 top-20 hidden md:block">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full border shadow-md"
              onClick={toggleSidebar}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Logo */}
          <div className={cn("flex h-16 items-center border-b transition-all duration-300", isCollapsed ? "justify-center px-0" : "justify-center px-6")}>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="relative flex flex-col items-start space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-2xl font-extrabold leading-none text-transparent">
                    {isCollapsed ? 'G' : 'GYDI'}
                  </span>
                  {!isCollapsed && (
                    <Sparkles className="h-4 w-4 text-primary opacity-0 transition-all duration-300 group-hover:animate-pulse-glow group-hover:opacity-100" />
                  )}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80 transition-colors group-hover:text-primary/80">
                    Properties
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            <TooltipProvider delayDuration={0}>
              {navigation.map((item) => {
                // Check if current path matches the nav item
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && item.href ? pathname.startsWith(item.href + '/') : false);
                const Icon = item.icon;

                return (
                  <div key={item.name}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href as any}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center justify-center rounded-lg py-3 transition-all duration-300',
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] ring-1 ring-primary/50'
                                : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                            )}
                          >
                            <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                            <span className="sr-only">{item.name}</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        href={item.href as any}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </TooltipProvider>
          </nav>

          {/* Logout button */}
          <div className="border-t p-4">
            {isCollapsed ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center rounded-lg py-3 text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="sr-only">Cerrar Sesión</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    Cerrar Sesión
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-overlay-backdrop bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
