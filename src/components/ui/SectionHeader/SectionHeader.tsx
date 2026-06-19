import type { ReactNode } from 'react';
import { Typography } from '../Typography';
import { cn } from '../../../lib/cn';

export interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Linha divisória abaixo do header (border-b + padding extra). */
  divider?: boolean;
  className?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  title,
  description,
  divider = false,
  className,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12', divider && 'border-b border-gray-200 pb-8', className)}>
      <Typography variant="h1" className="mb-4 text-[color:var(--color-tag-bg)]">
        {title}
      </Typography>
      {description ? (
        <Typography variant="body" className={cn('text-lg text-gray-600', descriptionClassName)}>
          {description}
        </Typography>
      ) : null}
    </div>
  );
}
