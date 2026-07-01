import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../../lib/cn';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-pill)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        solid:
          'bg-[color:var(--color-tag-bg)] text-[color:var(--color-text-on-dark)] hover:brightness-110 focus-visible:ring-[color:var(--color-tag-bg)]',
        soft:
          'bg-black/8 text-[color:var(--color-text-primary)] hover:bg-black/15 focus-visible:ring-black/40',
        ghost:
          'bg-transparent text-[color:var(--color-text-primary)] hover:bg-black/5 focus-visible:ring-black/40',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'soft',
      size: 'md',
    },
  },
);

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants> & {
    icon: ReactNode;
    label: string;
  };

export function IconButton({ className, variant, size, icon, label, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
