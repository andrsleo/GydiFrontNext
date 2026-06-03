'use client';

import { useQuery } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FollowerListProps {
  userId: number;
  mode?: 'followers' | 'following';
}

export function FollowerList({ userId, mode = 'followers' }: FollowerListProps) {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['social', mode, userId, page],
    queryFn: () =>
      mode === 'followers'
        ? socialApi.getFollowers(userId, page, 20)
        : socialApi.getFollowing(userId, page, 20),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {mode === 'followers' ? 'Sin seguidores aún.' : 'No sigue a nadie aún.'}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data.content.map((item) => (
          <div key={item.userId} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm">U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Usuario #{item.userId}</p>
              <p className="text-xs text-muted-foreground">
                {mode === 'followers' ? 'Te sigue' : 'Siguiendo'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={data.first}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </Button>
        <span className="text-xs text-muted-foreground">
          Pág. {data.number + 1} / {data.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={data.last}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
