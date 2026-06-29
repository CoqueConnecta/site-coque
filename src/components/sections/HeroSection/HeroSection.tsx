import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { ROUTE_HASHES } from '../../../lib/constants';
import type { ResolvedHeroData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { Button } from '../../ui/Button';
import { HeroPhotoCarousel } from '../../composites/HeroPhotoCarousel';

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedHeroData;
}

export const HeroSection = ({ data, className, ...props }: HeroSectionProps) => {
  return (
    <section
      id="hero"
      className={cn(
        'relative w-full overflow-hidden',
        'flex flex-col justify-center',
        'min-h-[680px]',
        className
      )}
      {...props}
    >
      {data.photos.length > 0 ? (
        <>
          <HeroPhotoCarousel photos={data.photos} className="z-0" />
          <div
            className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_32%_34%,rgba(255,70,0,0.35),transparent_35%),linear-gradient(130deg,#f8751b_0%,#ff4c0f_45%,#d35500_100%)]"
          aria-hidden="true"
        />
      )}

      <Block className="relative z-10 py-12 pt-[140px]">
        <div className="max-w-3xl space-y-6">
          <h1
            className="animate-hero-in whitespace-pre-line text-[color:var(--color-text-cream)] leading-tight [text-wrap:balance]"
            style={{ textShadow: '0 1px 16px rgba(80,15,0,0.35)' }}
          >
            {data.headline.split('\n').map((line, i) => (
              <span
                key={i}
                className={cn(
                  'block',
                  i === 0
                    ? '[font-family:var(--font-body)] font-extrabold text-[40px] sm:text-[46px] lg:text-[51px] tracking-[-0.03em]'
                    : 'text-[48px] sm:text-[56px] lg:text-[64px] tracking-[-0.01em]'
                )}
                style={i === 1 ? { fontFamily: 'var(--font-display)' } : undefined}
              >
                {i === 1 ? line.replace(/\.+\s*$/, '') : line}
              </span>
            ))}
          </h1>

          {data.subheadline && (
            <p
              className="animate-hero-in max-w-xl text-[color:var(--color-text-cream)] text-base sm:text-lg leading-relaxed font-[var(--font-body)]"
              style={{ animationDelay: '120ms' }}
            >
              {data.subheadline}
            </p>
          )}

          {(data.ctaText || data.secondaryCtaText) && (
            <div className="animate-hero-in flex flex-wrap items-center gap-3 pt-2" style={{ animationDelay: '240ms' }}>
              {data.ctaText && (
                <Button
                  href={data.ctaHref ?? ROUTE_HASHES.waysToHelp}
                  variant="unstyled"
                  className="bg-[color:var(--color-accent-peach)] text-[color:var(--color-tag-bg)] hover:brightness-95 px-6 py-3 text-base sm:text-lg h-12"
                >
                  {data.ctaText}
                </Button>
              )}
              {data.secondaryCtaText && (
                <Button
                  href={data.secondaryCtaHref ?? ROUTE_HASHES.waysToHelp}
                  variant="secondary"
                  size="lg"
                >
                  {data.secondaryCtaText}
                </Button>
              )}
            </div>
          )}
        </div>
      </Block>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2" aria-hidden="true">
        <ChevronDown className="h-5 w-5 text-[color:var(--color-text-cream)]/60 animate-scroll-hint" />
      </div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
