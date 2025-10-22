'use client';

import { useSession } from 'next-auth/react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* User profile */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{session?.user?.name || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email || ''}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
