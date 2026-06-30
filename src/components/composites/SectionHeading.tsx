import { cn } from '../../lib/cn';

const fontSizeBySize = {
  sm: 'clamp(26px, 3.2vw, 38px)',
  md: 'clamp(34px, 4.2vw, 50px)',
  lg: 'clamp(38px, 4.8vw, 56px)',
} as const;

export interface SectionHeadingProps {
  headline: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  tone?: 'default' | 'on-orange' | 'on-dark';
  className?: string;
}

export const SectionHeading = ({
  headline,
  subtitle,
  size = 'md',
  centered = false,
  tone = 'default',
  className,
}: SectionHeadingProps) => {
  const headlineColor =
    tone === 'on-orange' ? 'var(--color-tag-bg)'
    : tone === 'on-dark' ? 'var(--color-text-cream)'
    : 'var(--color-text-primary)';
  const subtitleColor =
    tone === 'on-orange' ? 'var(--color-tag-bg)'
    : tone === 'on-dark' ? 'var(--color-text-cream)'
    : 'var(--color-text-secondary)';

  return (
    <div className={cn('flex flex-col gap-4', centered && 'items-center text-center', className)}>
      <h3
        style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: fontSizeBySize[size],
          fontWeight: 700,
          color: headlineColor,
          lineHeight: '1.1',
          margin: centered ? '0 auto' : 0,
          letterSpacing: '-0.8px',
          maxWidth: '640px',
          textWrap: 'balance',
        } as React.CSSProperties}
      >
        {headline}
      </h3>
      {subtitle && (
        <p
          style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: 'clamp(17px, 2vw, 20px)',
            lineHeight: '1.5',
            color: subtitleColor,
            maxWidth: centered ? '55ch' : '60ch',
            margin: centered ? '0 auto' : 0,
            opacity: tone === 'on-orange' ? 0.8 : tone === 'on-dark' ? 0.7 : 1,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

SectionHeading.displayName = 'SectionHeading';
