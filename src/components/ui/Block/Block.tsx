import type { HTMLAttributes } from 'react';

import { cn } from '../../../lib/cn';

export interface BlockProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main';
  inset?: 'default' | 'full';
}

const insetClasses: Record<NonNullable<BlockProps['inset']>, string> = {
  default: 'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10',
  full: 'w-full max-w-none px-0',
};

export function Block({ as = 'div', inset = 'default', className, ...props }: BlockProps) {
  const Component = as;
  return <Component className={cn(insetClasses[inset], className)} {...props} />;
}
