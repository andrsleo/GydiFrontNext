# Migration Example: Old Upload → Direct Cloudinary Upload

## Before (Old Proxy Upload)

```typescript
// src/app/(dashboard)/dashboard/propiedades/nueva/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadImages } from '@/features/properties';
import { Button } from '@/components/ui/button';

export default function NewPropertyPage() {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState<string>('prop-123');
  const [images, setImages] = useState<File[]>([]);

  const uploadImages = useUploadImages();

  const handleUploadImages = async () => {
    if (!propertyId || images.length === 0) return;

    try {
      // OLD: Upload through backend proxy
      await uploadImages.mutateAsync({ propertyId, files: images });

      // Navigate to next step
      router.push(`/dashboard/propiedades/${propertyId}/editar`);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files || []))}
      />

      <Button onClick={handleUploadImages} disabled={uploadImages.isPending}>
        {uploadImages.isPending ? 'Uploading...' : 'Upload Images'}
      </Button>
    </div>
  );
}
```

## After (Direct Cloudinary Upload)

```typescript
// src/app/(dashboard)/dashboard/propiedades/nueva/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCloudinaryDirectUpload } from '@/features/properties';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function NewPropertyPage() {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState<string>('prop-123');
  const [images, setImages] = useState<File[]>([]);

  // NEW: Use direct upload hook with progress tracking
  const { uploadImagesAsync, isUploading, progress, overallProgress } =
    useCloudinaryDirectUpload({
      maxConcurrent: 6,    // Upload 6 files in parallel
      timeout: 300000,     // 5 minutes per file
      maxRetries: 2,       // Retry failed uploads
    });

  const handleUploadImages = async () => {
    if (!propertyId || images.length === 0) return;

    try {
      // NEW: Upload directly to Cloudinary with progress tracking
      await uploadImagesAsync({ propertyId, files: images });

      // Navigate to next step
      router.push(`/dashboard/propiedades/${propertyId}/editar`);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files || []))}
      />

      {/* NEW: Show progress for each file */}
      {isUploading && (
        <div className="space-y-2 mb-4">
          {Object.entries(progress).map(([fileName, percent]) => (
            <div key={fileName} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{fileName}</span>
                <span>{percent}%</span>
              </div>
              <Progress value={percent} />
            </div>
          ))}

          {/* NEW: Overall progress */}
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      )}

      <Button onClick={handleUploadImages} disabled={isUploading}>
        {isUploading ? `Uploading... ${overallProgress}%` : 'Upload Images'}
      </Button>
    </div>
  );
}
```

## Or Use the Pre-built Component

```typescript
// src/app/(dashboard)/dashboard/propiedades/nueva/page.tsx
'use client';

import { CloudinaryImageUploader } from '@/features/properties/components';

export default function NewPropertyPage() {
  const handleUploadComplete = (images) => {
    console.log('Uploaded images:', images);
    // Navigate or update UI
  };

  return (
    <CloudinaryImageUploader
      propertyId="prop-123"
      maxFiles={20}
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

## Key Differences

| Feature | Old Upload | Direct Upload |
|---------|-----------|---------------|
| **Upload Path** | Browser → Backend → Cloudinary | Browser → Cloudinary (direct) |
| **Backend Load** | High (proxies all files) | Low (only signatures & URLs) |
| **Speed** | Slower (sequential) | Faster (parallel, max 6) |
| **Progress** | No per-file progress | Per-file + overall progress |
| **Retries** | No automatic retries | Automatic retry on network errors |
| **Timeout** | 30 seconds (axios default) | 5 minutes per file (configurable) |
| **Bandwidth** | 2x (to backend + to Cloudinary) | 1x (direct to Cloudinary) |

## Performance Comparison

### Old Upload (10 images, 5MB each)
```
Image 1: Browser → Backend (5MB, 3s) → Cloudinary (5MB, 3s) = 6s
Image 2: Browser → Backend (5MB, 3s) → Cloudinary (5MB, 3s) = 6s
...
Total: 60 seconds (sequential)
Backend bandwidth: 100MB in + 100MB out = 200MB
```

### Direct Upload (10 images, 5MB each)
```
Image 1-6: Browser → Cloudinary (parallel, 3s each) = 3s
Image 7-10: Browser → Cloudinary (parallel, 3s each) = 3s
Total: 6 seconds (2 batches of 6)
Backend bandwidth: ~1KB (only URLs)
```

**Result: 10x faster, 99.5% less backend bandwidth!**

## Migration Checklist

- [ ] Replace `useUploadImages` with `useCloudinaryDirectUpload`
- [ ] Update imports
- [ ] Update method call from `mutateAsync` to `uploadImagesAsync`
- [ ] Add progress tracking UI (optional but recommended)
- [ ] Test with multiple files (1, 5, 10, 20)
- [ ] Test error handling (disconnect network)
- [ ] Test with large files (near 10MB limit)
- [ ] Verify uploaded images appear in property gallery
- [ ] Verify backend saves URLs correctly
- [ ] Test in production environment

## Rollback Plan (if needed)

If you encounter issues, you can quickly rollback:

1. Change import back to `useUploadImages`
2. Revert method call to `mutateAsync`
3. Remove progress tracking code
4. Deploy

The old endpoint (`POST /api/properties/{propertyId}/media/images`) is still available and working.
