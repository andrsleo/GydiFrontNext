'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

export function FeedEmpty() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 text-center px-8">
      <Film className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Sin contenido todavía</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Sé el primero en subir contenido de propiedades.
      </p>
      <Button asChild>
        <Link href="/dashboard/content/new">Subir contenido</Link>
      </Button>
    </div>
  );
}
