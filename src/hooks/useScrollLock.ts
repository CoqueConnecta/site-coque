import { useEffect } from 'react';

export function useScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [enabled]);
}
