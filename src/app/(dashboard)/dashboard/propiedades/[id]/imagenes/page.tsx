import { ImageOrganizer } from '@/features/properties';

interface Props {
  params: { id: string };
}

/**
 * Property Images Organization Page
 * Allows users to reorder images and set cover image
 */
export default function PropertyImagesPage({ params }: Props) {
  // TODO: Fetch property data with Server Component
  // const property = await propertyApi.getById(params.id);

  // Temporary mock data for demonstration
  const mockImages = [
    { id: '1', url: '/placeholder-1.jpg', displayOrder: 0 },
    { id: '2', url: '/placeholder-2.jpg', displayOrder: 1 },
    { id: '3', url: '/placeholder-3.jpg', displayOrder: 2 },
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Images</h1>
        <p className="text-muted-foreground mt-2">
          Organize your property images and set the cover photo
        </p>
      </div>

      <ImageOrganizer
        propertyId={params.id}
        images={mockImages}
        coverImageId="1"
        onSuccess={() => {
          // Optional: Add success callback
          console.log('Images reordered successfully');
        }}
      />
    </div>
  );
}