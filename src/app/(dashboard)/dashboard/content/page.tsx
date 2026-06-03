'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMyContent } from '@/features/content/hooks/use-my-content';
import { ContentCard } from '@/features/content/components/content-card';
import { ContentStatusBadge } from '@/features/content/components/content-status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';

export default function MyContentPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useMyContent(page);
  const { t } = useTranslation('content');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{t('myContent.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('myContent.subtitle')}</p>
        </div>
        <Button asChild className="min-h-11 gap-2 bg-[hsl(var(--gydi-primary))] hover:bg-[hsl(252,100%,58%)]">
          <Link href="/dashboard/content/new">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('myContent.newPost')}</span>
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : data?.content.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 sm:py-20">
          <p className="text-sm text-muted-foreground">{t('myContent.noPosts')}</p>
          <Button asChild className="min-h-11">
            <Link href="/dashboard/content/new">{t('myContent.createFirst')}</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.content.map((post) => (
              <div key={post.id} className="relative">
                <div className="absolute left-3 top-3 z-10">
                  <ContentStatusBadge status={post.status} />
                </div>
                <ContentCard post={post} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            {page > 0 && (
              <Button variant="ghost" className="min-h-11" onClick={() => setPage((p) => p - 1)}>
                {t('myContent.previous')}
              </Button>
            )}
            {data && !data.last && (
              <Button variant="outline" className="min-h-11" onClick={() => setPage((p) => p + 1)}>
                {t('myContent.next')}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
