'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useUpgradeToCreator } from '../hooks/use-upgrade-to-creator';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

interface CreatorUpgradeModalProps {
  trigger?: React.ReactNode;
}

export function CreatorUpgradeModal({ trigger }: CreatorUpgradeModalProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpgradeToCreator();
  const router = useRouter();
  const { t } = useTranslation('creator');

  const PERKS = [
    t('upgrade.perks.publish'),
    t('upgrade.perks.audience'),
    t('upgrade.perks.earn'),
    t('upgrade.perks.analytics'),
  ];

  const handleUpgrade = () => {
    mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        router.push('/dashboard/creator');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 bg-[hsl(var(--gydi-primary))] hover:bg-[hsl(252,100%,58%)]">
            <Sparkles className="h-4 w-4" />
            {t('upgrade.title')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[hsl(var(--gydi-primary))]" />
            {t('upgrade.title')}
          </DialogTitle>
          <DialogDescription>{t('upgrade.description')}</DialogDescription>
        </DialogHeader>

        <ul className="my-2 space-y-2">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--gydi-teal))] text-[10px] text-white">
                ✓
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => setOpen(false)} className="min-h-11 w-full sm:w-auto">
            {t('upgrade.cancel')}
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={isPending}
            className="min-h-11 w-full bg-[hsl(var(--gydi-primary))] hover:bg-[hsl(252,100%,58%)] sm:w-auto"
          >
            {isPending ? t('upgrade.activating') : t('upgrade.activate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
