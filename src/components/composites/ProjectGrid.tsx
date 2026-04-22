import { type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface ProjectGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ProjectGrid({ children, className, ...props }: ProjectGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
