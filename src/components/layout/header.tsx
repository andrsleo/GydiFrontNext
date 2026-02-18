'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@/features/auth/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { UserMenu } from './user-menu';

export function Header() {
  const user = useUser();
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasCompletedInitialVerification, setHasCompletedInitialVerification] = useState(false);

  // ✅ FIX: Track when initial verification completes
  // This prevents showing user before AuthVerifier validates the session
  useEffect(() => {
    if (hasHydrated && !isLoading) {
      // Only set this once after the initial hydration + verification cycle
      if (!hasCompletedInitialVerification) {
        setHasCompletedInitialVerification(true);
      }
    }
  }, [hasHydrated, isLoading, hasCompletedInitialVerification]);

  // Don't show user until:
  // 1. Store has hydrated from localStorage
  // 2. Initial auth verification is complete (prevents showing stale user)
  // 3. User exists in store
  // 4. Not currently loading
  // This prevents showing stale data from localStorage while checking if token is valid
  const showUser = hasHydrated && hasCompletedInitialVerification && user && isAuthenticated && !isLoading;

  // Show loading state while verifying
  const showLoading = !hasHydrated || isLoading || (isAuthenticated && !hasCompletedInitialVerification);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-background via-background/98 to-primary/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      {/* Animated gradient line */}
      <div className="absolute inset-x-0 top-0 h-0.5 animate-gradient bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-[length:200%_100%]" />

      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group relative flex items-center gap-2 transition-all hover:scale-105">
          <div className="absolute -inset-2 rounded-lg bg-primary/10 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />
          <div className="relative flex flex-col items-start space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-2xl font-extrabold leading-none text-transparent">
                GYDI
              </span>
              <Sparkles className="h-4 w-4 text-primary opacity-0 transition-all duration-300 group-hover:animate-pulse-glow group-hover:opacity-100" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80 transition-colors group-hover:text-primary/80">
              Properties
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 md:flex">
          <Link
            href="/propiedades"
            className="group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 transition-colors group-hover:text-primary">
              Propiedades
            </span>
            <div className="absolute inset-0 -z-0 bg-primary/5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
          <Link
            href="/#como-funciona"
            className="group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 transition-colors group-hover:text-blue-600">
              Cómo Funciona
            </span>
            <div className="absolute inset-0 -z-0 bg-blue-500/5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
          <Link
            href="/#precios"
            className="group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 transition-colors group-hover:text-purple-600">
              Precios
            </span>
            <div className="absolute inset-0 -z-0 bg-purple-500/5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-purple-500 to-primary transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center space-x-3 md:flex">
          {showLoading ? (
            /* Loading skeleton while verifying session */
            <>
              <div className="h-9 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-9 w-28 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            </>
          ) : showUser ? (
            <>
              {/* Dashboard Button */}
              <Button asChild variant="ghost" className="group relative overflow-hidden transition-all duration-300 hover:scale-105">
                <Link href="/dashboard" className="relative">
                  <span className="relative z-10 font-semibold">Dashboard</span>
                  <div className="absolute inset-0 -z-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </Button>
              {/* User Menu Dropdown */}
              <UserMenu />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="group relative overflow-hidden transition-all duration-300 hover:scale-105">
                <Link href="/login" className="relative">
                  <span className="relative z-10 font-semibold">Iniciar Sesión</span>
                  <div className="absolute inset-0 -z-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </Button>
              <Button asChild className="group relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-purple-600 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                <Link href="/register" className="relative">
                  <span className="relative z-10 font-semibold">Registrarse</span>
                  <div className="absolute inset-0 -z-0 animate-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-primary bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="group relative overflow-hidden rounded-lg bg-primary/5 p-2 transition-all duration-300 hover:scale-110 hover:bg-primary/10 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {mobileMenuOpen ? (
            <X className="relative h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <Menu className="relative h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="animate-fade-in-down border-t border-border/40 bg-gradient-to-b from-background/95 to-background/98 backdrop-blur-xl md:hidden">
          <div className="container mx-auto space-y-3 px-4 py-6">
            <Link
              href="/propiedades"
              className="group relative block overflow-hidden rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-primary/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="relative z-10 transition-colors group-hover:text-primary">Propiedades</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            <Link
              href="/#como-funciona"
              className="group relative block overflow-hidden rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-500/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="relative z-10 transition-colors group-hover:text-blue-600">Cómo Funciona</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            <Link
              href="/#precios"
              className="group relative block overflow-hidden rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-purple-500/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="relative z-10 transition-colors group-hover:text-purple-600">Precios</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-purple-500 to-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>

            <div className="space-y-3 border-t border-border/40 pt-4">
              {showLoading ? (
                /* Loading skeleton for mobile */
                <>
                  <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                </>
              ) : showUser ? (
                <>
                  {/* User Menu for Mobile */}
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 px-4 py-3">
                    <span className="text-sm font-semibold text-foreground">
                      <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{user?.name}</span>
                    </span>
                    <UserMenu />
                  </div>
                  <Button asChild className="w-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/5">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-primary via-blue-600 to-purple-600 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                    <Link href="/register">Registrarse</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
