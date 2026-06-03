'use client';

import { ContentUploadForm } from '@/features/content/components/content-upload-form';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export default function NewContentPage() {
  const router = useRouter();
  const { t } = useTranslation('content');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">{t('newPost.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('newPost.subtitle')}</p>
      </div>

      <div className="max-w-xl">
        <ContentUploadForm
          onSuccess={() => router.push('/dashboard/content')}
        />
      </div>
    </div>
  );
}
