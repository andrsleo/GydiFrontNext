'use client';

import { useTranslation } from '@/hooks/use-translation';
import type { CreatorProfile } from '../types';
import { CreatorProfileCard } from './creator-profile-card';

interface CreatorGridProps {
  creators: CreatorProfile[];
}

export function CreatorGrid({ creators }: CreatorGridProps) {
  const { t } = useTranslation('creator');

  if (!creators.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">{t('browse.empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {creators.map((c) => (
        <CreatorProfileCard key={c.userId} profile={c} />
      ))}
    </div>
  );
}
