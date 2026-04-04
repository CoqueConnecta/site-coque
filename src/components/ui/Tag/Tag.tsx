import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '../../../lib/cn';

const tagVariants = cva(
  'inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-sm font-medium leading-none',
  {
    variants: {
      variant: {
        dark: 'bg-[color:var(--color-tag-bg)] text-[color:var(--color-tag-text)]',
        light: 'bg-white/75 text-[color:var(--color-text-primary)]',
        accent: 'bg-[color:var(--color-surface-accent)] text-[color:var(--color-text-on-dark)]',
      },
    },
    defaultVariants: {
      variant: 'dark',
    },
  },
);

export type TagProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof tagVariants>;

export function Tag({ className, variant, ...props }: TagProps) {
  return <span className={cn(tagVariants({ variant }), className)} {...props} />;
}
