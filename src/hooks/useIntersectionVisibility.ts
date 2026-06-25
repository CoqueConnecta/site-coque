import { useEffect, useRef, useState } from 'react';

interface UseIntersectionVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionVisibility<T extends Element>(
  options: UseIntersectionVisibilityOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = options;

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const [isVisible, setIsVisible] = useState(prefersReduced);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [prefersReduced, threshold, rootMargin]);

  return { ref, isVisible };
}
