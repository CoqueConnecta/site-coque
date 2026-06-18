import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '../../../lib/cn';

const sectionContainerVariants = cva('w-full mx-auto', {
  variants: {
    width: {
      default: 'max-w-[1200px]',
      wide: 'max-w-[1320px]',
      narrow: 'max-w-[980px]',
      full: 'max-w-none',
    },
    spacing: {
      none: '',
      sm: 'py-8 md:py-12',
      md: 'py-12 md:py-16',
      lg: 'py-16 md:py-24',
    },
    gutter: {
      true: 'px-4 md:px-8',
      false: '',
    },
  },
  defaultVariants: {
    width: 'default',
    spacing: 'md',
    gutter: true,
  },
});

export type SectionContainerProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionContainerVariants> & {
    as?: 'section' | 'div' | 'article' | 'header' | 'footer' | 'main';
  };

export function SectionContainer({
  as = 'section',
  className,
  width,
  spacing,
  gutter,
  ...props
}: SectionContainerProps) {
  const Component = as;
  return <Component className={cn(sectionContainerVariants({ width, spacing, gutter }), className)} {...props} />;
}
