'use client';

import { useLocaleStore } from '@/store/locale-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LanguageSelector({ className }: { className?: string }) {
  const locale = useLocaleStore((state) => state.locale);
  const hasHydrated = useLocaleStore((state) => state._hasHydrated);
  const setLocale = useLocaleStore((state) => state.setLocale);

  if (!hasHydrated) {
    return (
      <div
        className={cn('h-8 w-[72px] animate-pulse rounded-md bg-muted', className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center rounded-md border border-border bg-muted/30 p-0.5',
        className
      )}
      role="group"
      aria-label="Select language"
    >
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 rounded-sm px-2.5 text-xs font-semibold transition-all duration-200"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        EN
      </Button>
      <Button
        variant={locale === 'es' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 rounded-sm px-2.5 text-xs font-semibold transition-all duration-200"
        onClick={() => setLocale('es')}
        aria-pressed={locale === 'es'}
      >
        ES
      </Button>
    </div>
  );
}
