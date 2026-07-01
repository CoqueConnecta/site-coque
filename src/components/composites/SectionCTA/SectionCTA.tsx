import { Link } from 'react-router-dom';
import { cn } from '../../../lib/cn';

export interface SectionCTAProps {
  label: string;
  href: string;
  tone?: 'on-light' | 'on-dark' | 'on-orange';
  className?: string;
}

const toneClasses: Record<NonNullable<SectionCTAProps['tone']>, string> = {
  'on-light':
    'bg-[color:var(--color-tag-bg)] text-[color:var(--color-text-on-dark)] hover:brightness-110',
  'on-dark':
    'bg-[color:var(--color-accent-peach)] text-[color:var(--color-tag-bg)] hover:brightness-95',
  'on-orange':
    'bg-white/95 text-[color:var(--color-tag-bg)] hover:bg-white',
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

export const SectionCTA = ({ label, href, tone = 'on-light', className }: SectionCTAProps) => {
  const classes = cn(
    'inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-5 h-9 text-sm font-semibold tracking-tight transition-all',
    toneClasses[tone],
    className
  );

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {label} →
      </a>
    );
  }

  return (
    <Link to={href} className={classes}>
      {label} →
    </Link>
  );
};
