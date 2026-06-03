'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const VISIT_COUNT_KEY = 'gydi-visits';
const DISMISSED_KEY = 'gydi-pwa-dismissed';
const VISIT_THRESHOLD = 3;

export function PwaInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // SSR safety: localStorage only in browser
    if (typeof window === 'undefined') return;

    // Do not show if already running as PWA (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Do not show on desktop (>= 768px)
    if (window.innerWidth >= 768) return;

    // Do not show if user has dismissed before
    if (localStorage.getItem(DISMISSED_KEY) === 'true') return;

    // Increment visit count
    const raw = localStorage.getItem(VISIT_COUNT_KEY);
    const visits = raw ? parseInt(raw, 10) + 1 : 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(visits));

    if (visits < VISIT_THRESHOLD) return;

    // Listen for the browser's install prompt event
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If the event was already fired before this component mounted (rare), show anyway
    // (The event is only kept alive by the browser if not consumed)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt.current = null;
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="banner"
      aria-label="Instalar aplicación GYDI"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-[hsl(var(--gydi-primary))] px-4 py-3 text-white shadow-lg md:hidden"
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
        <Download className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">
          Instala GYDI en tu teléfono
        </p>
        <p className="text-xs text-white/80 leading-tight mt-0.5">
          Acceso rápido, sin browser
        </p>
      </div>

      {/* Install button */}
      <button
        onClick={handleInstall}
        className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[hsl(var(--gydi-primary))] min-h-[44px] min-w-[44px] transition-opacity hover:opacity-90 active:opacity-75"
        aria-label="Instalar GYDI"
      >
        Instalar
      </button>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="shrink-0 flex h-11 w-11 items-center justify-center rounded-lg text-white/80 hover:text-white transition-colors"
        aria-label="Cerrar banner de instalación"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
