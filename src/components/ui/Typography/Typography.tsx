import { cva, type VariantProps } from 'class-variance-authority';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../../lib/cn';

const typographyVariants = cva('text-[color:var(--color-text-primary)]', {
  variants: {
    variant: {
      display: 'font-[var(--font-display)] text-5xl md:text-7xl leading-[0.95]',
      h1: 'font-[var(--font-body)] text-4xl md:text-6xl font-bold leading-tight',
      h2: 'font-[var(--font-body)] text-3xl md:text-5xl font-bold leading-tight',
      h3: 'font-[var(--font-body)] text-2xl md:text-4xl font-semibold leading-snug',
      body: 'font-[var(--font-body)] text-base md:text-lg leading-relaxed',
      bodySm: 'font-[var(--font-body)] text-sm md:text-base leading-relaxed',
      stat: 'font-[var(--font-support)] text-5xl md:text-7xl font-light leading-none',
    },
    tone: {
      default: 'text-[color:var(--color-text-primary)]',
      muted: 'text-[color:var(--color-text-secondary)]',
      onDark: 'text-[color:var(--color-text-on-dark)]',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'default',
  },
});

type TypographyProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: ElementType;
    children: ReactNode;
  };

export function Typography({
  as,
  className,
  variant,
  tone,
  children,
  ...props
}: TypographyProps) {
  const Tag = as ?? (variant === 'display' ? 'h1' : 'p');

  return (
    <Tag className={cn(typographyVariants({ variant, tone }), className)} {...props}>
      {children}
    </Tag>
  );
}
