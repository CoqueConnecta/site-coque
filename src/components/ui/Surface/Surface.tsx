import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '../../../lib/cn';

const surfaceVariants = cva('rounded-[var(--radius-xl)]', {
  variants: {
    variant: {
      hero:
        'bg-[radial-gradient(circle_at_32%_34%,rgba(255,70,0,0.35),transparent_35%),linear-gradient(130deg,#f8751b_0%,#ff4c0f_45%,#d35500_100%)] text-[color:var(--color-text-on-dark)]',
      cardLight: 'bg-[color:var(--color-surface-card)] text-[color:var(--color-text-primary)]',
      cardStrong: 'bg-[color:var(--color-surface-card-strong)] text-[color:var(--color-text-on-dark)]',
      newsletter: 'bg-[color:var(--color-surface-card-strong)] text-[color:var(--color-text-on-dark)]',
      panel: 'bg-white text-[color:var(--color-text-primary)]',
    },
    shadow: {
      none: '',
      soft: 'shadow-[var(--shadow-soft)]',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8 md:p-10',
    },
  },
  defaultVariants: {
    variant: 'panel',
    shadow: 'none',
    padding: 'md',
  },
});

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof surfaceVariants>;

export function Surface({ className, variant, shadow, padding, ...props }: SurfaceProps) {
  return <div className={cn(surfaceVariants({ variant, shadow, padding }), className)} {...props} />;
}
