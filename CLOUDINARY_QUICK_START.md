# 🚀 Cloudinary Direct Upload - Quick Start

## 5-Minute Setup

### 1. Set Environment Variable

```bash
# .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### 2. Import and Use

**Option A: Use the Hook**
```typescript
import { useCloudinaryDirectUpload } from '@/features/properties';

function MyComponent() {
  const { uploadImagesAsync, isUploading, progress, overallProgress } =
    useCloudinaryDirectUpload();

  const handleUpload = async (files: File[]) => {
    await uploadImagesAsync({ propertyId: 'prop-123', files });
  };

  return (
    <div>
      <input type="file" multiple onChange={(e) => handleUpload(Array.from(e.target.files || []))} />
      {isUploading && <p>Progress: {overallProgress}%</p>}
    </div>
  );
}
```

**Option B: Use the Pre-built Component**
```typescript
import { CloudinaryImageUploader } from '@/features/properties/components';

function MyComponent() {
  return (
    <CloudinaryImageUploader
      propertyId="prop-123"
      onUploadComplete={(images) => console.log('Done!', images)}
    />
  );
}
```

### 3. Done! ✅

---

## Hook API Reference

```typescript
const {
  uploadImagesAsync,    // Function to trigger upload
  isUploading,          // Boolean - upload in progress
  progress,             // Object - { 'file1.jpg': 45, 'file2.jpg': 78 }
  overallProgress,      // Number - overall progress (0-100)
  error,                // Error object if upload failed
  reset,                // Function to reset state
} = useCloudinaryDirectUpload({
  maxConcurrent: 6,     // Max parallel uploads (default: 6)
  timeout: 300000,      // Timeout per file in ms (default: 5 min)
  maxRetries: 2,        // Max retries on network error (default: 2)
});
```

---

## Component API Reference

```typescript
<CloudinaryImageUploader
  propertyId="prop-123"              // Required - Property ID
  maxFiles={20}                      // Optional - Max files (default: 20)
  disabled={false}                   // Optional - Disable uploader
  onUploadComplete={(images) => {}}  // Optional - Callback when done
  className="my-custom-class"        // Optional - Custom CSS class
/>
```

---

## File Validation Rules

| Rule | Limit | Error Message |
|------|-------|---------------|
| **Max files** | 20 | "Maximum 20 images allowed" |
| **File size** | 10MB | "Image {name} exceeds 10MB limit" |
| **File types** | JPG, PNG, WEBP, HEIC | "Invalid file type for {name}" |

---

## Backend Endpoints (Already Implemented)

### 1. Get Upload Signature
```
POST /api/properties/{propertyId}/media/upload-signatures
```

**Response:**
```json
{
  "signature": "abc123...",
  "timestamp": 1706543210,
  "apiKey": "123456789",
  "cloudName": "your-cloud",
  "folder": "gydi/properties/prop-123"
}
```

### 2. Save Uploaded URLs
```
POST /api/properties/{propertyId}/media/images/save-urls
```

**Request:**
```json
{
  "urls": ["https://res.cloudinary.com/.../image1.jpg"]
}
```

**Response:**
```json
[
  {
    "id": "img-1",
    "url": "https://res.cloudinary.com/.../image1.jpg",
    "displayOrder": 0,
    "uploadedAt": "2025-01-29T10:30:00Z"
  }
]
```

---

## Progress Tracking Example

```typescript
import { useCloudinaryDirectUpload } from '@/features/properties';
import { Progress } from '@/components/ui/progress';

function UploadWithProgress() {
  const { uploadImagesAsync, progress, overallProgress } = useCloudinaryDirectUpload();

  return (
    <div>
      {/* Per-file progress */}
      {Object.entries(progress).map(([fileName, percent]) => (
        <div key={fileName}>
          <span>{fileName}: {percent}%</span>
          <Progress value={percent} />
        </div>
      ))}

      {/* Overall progress */}
      <div>
        <span>Overall: {overallProgress}%</span>
        <Progress value={overallProgress} />
      </div>
    </div>
  );
}
```

---

## Error Handling

```typescript
import { useCloudinaryDirectUpload } from '@/features/properties';
import { toast } from 'sonner';

function UploadWithErrorHandling() {
  const { uploadImagesAsync, error } = useCloudinaryDirectUpload();

  const handleUpload = async (files: File[]) => {
    try {
      await uploadImagesAsync({ propertyId: 'prop-123', files });
      toast.success('Images uploaded successfully!');
    } catch (error) {
      toast.error('Upload failed', {
        description: error.message,
      });
    }
  };

  return <button onClick={() => handleUpload(files)}>Upload</button>;
}
```

---

## Performance Tips

✅ **Use parallel uploads** (default: 6 concurrent)
✅ **Compress large images** before upload (use `browser-image-compression` if needed)
✅ **Show progress** to users (better UX)
✅ **Validate files** before upload (type, size, count)
✅ **Handle errors gracefully** (network issues, timeouts)

---

## Common Issues

### "Signature invalid"
- Check `CLOUDINARY_API_SECRET` in backend
- Verify system clock is synchronized
- Ensure signature used within 1 hour

### "Upload timeout"
- Check network connection
- Increase timeout: `useCloudinaryDirectUpload({ timeout: 600000 })`
- Compress large files

### "Failed to save URLs"
- Verify user owns property
- Check authentication
- Verify URLs are from Cloudinary domain

---

## Full Documentation

For complete documentation, see:
- `CLOUDINARY_DIRECT_UPLOAD.md` - Technical details
- `MIGRATION_UPLOAD_EXAMPLE.md` - Migration guide
- `UPLOAD_IMPLEMENTATION_SUMMARY.md` - Implementation summary

---

**That's it! You're ready to use direct Cloudinary uploads! 🎉**
