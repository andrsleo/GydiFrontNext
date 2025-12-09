'use client';

import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { useSidebarStore } from '@/store/use-sidebar-store';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebarStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex min-h-screen">
                <DashboardSidebar />
                <div className="flex flex-1 flex-col md:pl-64">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div
                className={cn(
                    'flex flex-1 flex-col transition-all duration-300 ease-in-out',
                    isCollapsed ? 'md:pl-20' : 'md:pl-64'
                )}
            >
                {children}
            </div>
        </div>
    );
}
