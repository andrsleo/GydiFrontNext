'use client';

import { useState } from 'react';
import { useUser, useLogout } from '@/features/auth/hooks/use-auth';
import { Bell, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProfileByUserId } from '@/features/auth/hooks/use-profile';

export function DashboardHeader() {
  const user = useUser();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const userId = user?.id ? Number(user.id) : null;
  const { data: profile } = useProfileByUserId(userId!, {
    enabled: !!userId,
  });

  // Get name from profile, fallback to user, then to 'Usuario'
  const displayName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user?.name || 'Usuario'
    : user?.name || 'Usuario';

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-layout-sticky border-b bg-background">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 outline-none">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || ''}
                  </p>
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full bg-primary transition-all duration-200 hover:ring-2 hover:ring-primary hover:ring-offset-2 cursor-pointer">
                  {profile?.coverImageUrl ? (
                    <Image
                      src={profile.coverImageUrl}
                      alt={displayName}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary-foreground">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2">
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/configuracion')}
                className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/10 focus:bg-primary/10"
              >
                <Settings className="mr-3 h-4 w-4 text-primary" />
                <span className="font-medium">Configuración</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-red-50 focus:bg-red-50 text-red-600 dark:hover:bg-red-950/50 dark:focus:bg-red-950/50"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium">Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cerrar sesión? Deberás iniciar sesión nuevamente para acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
