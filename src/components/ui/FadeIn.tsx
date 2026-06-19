import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useIntersectionVisibility } from '../../hooks/useIntersectionVisibility';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, className, delay = 0, duration = 700 }: FadeInProps) {
  const { ref, isVisible } = useIntersectionVisibility<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
