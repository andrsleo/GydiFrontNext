'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseUnsavedChangesReturn {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  handleConfirm: () => void;
}

export function useUnsavedChanges(hasUnsavedChanges: boolean): UseUnsavedChangesReturn {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  const handleConfirm = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
    setShowDialog(false);
  }, [pendingNavigation]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!hasUnsavedChanges) return;

      const target = e.target as HTMLElement;
      const link = target.closest('a, button[data-nav]');

      if (link && link.getAttribute('href')) {
        const href = link.getAttribute('href')!;
        if (!href.includes(window.location.pathname)) {
          e.preventDefault();
          e.stopPropagation();
          setPendingNavigation(() => () => {
            window.location.href = href;
          });
          setShowDialog(true);
        }
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
        setPendingNavigation(() => () => window.history.back());
        setShowDialog(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  return { showDialog, setShowDialog, handleConfirm };
}
