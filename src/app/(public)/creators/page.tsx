'use client';

import { useState } from 'react';
import { useBrowseCreators } from '@/features/creator/hooks/use-browse-creators';
import { CreatorGrid } from '@/features/creator/components/creator-grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

export default function CreatorsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useBrowseCreators(page);
  const { t } = useTranslation('creator');

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('browse.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {t('browse.subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl sm:h-72" />
          ))}
        </div>
      ) : (
        <CreatorGrid creators={data?.content ?? []} />
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center">
        {data && !data.first && (
          <Button
            variant="ghost"
            onClick={() => setPage((p) => p - 1)}
            className="min-h-11 w-full sm:w-auto"
          >
            {t('browse.previous')}
          </Button>
        )}
        {data && !data.last && (
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            className="min-h-11 w-full sm:w-auto"
          >
            {t('browse.loadMore')}
          </Button>
        )}
      </div>
    </div>
  );
}
