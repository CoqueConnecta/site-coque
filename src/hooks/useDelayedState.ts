import { useCallback, useEffect, useRef, useState } from 'react';

export function useDelayedState<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setNow = useCallback((next: T) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setValue(next);
  }, []);

  const setDelayed = useCallback((next: T, delay: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setValue(next), delay);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [value, setNow, setDelayed] as const;
}
