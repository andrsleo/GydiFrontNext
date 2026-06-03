'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import type { GroupedSeason } from '../types';

interface SeasonDeleteDialogProps {
  group: GroupedSeason | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function SeasonDeleteDialog({
  group,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: SeasonDeleteDialogProps) {
  const { t } = useTranslation('seasons');

  const count = group?.seasons.length ?? 1;
  const name  = group?.representative.name ?? '';

  const description =
    count === 1
      ? t('delete.description').replace('{{name}}', name)
      : t('delete.descriptionGroup')
          .replace('{{name}}', name)
          .replace('{{count}}', String(count));

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t('delete.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? t('delete.deleting') : t('delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
