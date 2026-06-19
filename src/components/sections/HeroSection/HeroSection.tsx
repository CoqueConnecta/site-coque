import { lazy, Suspense, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { ROUTE_HASHES } from '../../../lib/constants';
import type { ResolvedHeroData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { Button } from '../../ui/Button';

const LazyHeroCanvas = lazy(async () => {
  const module = await import('./HeroCanvas');
  return { default: module.HeroCanvas };
});

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedHeroData;
}

export const HeroSection = ({ data, className, ...props }: HeroSectionProps) => {
  const [shouldRenderCanvas, setShouldRenderCanvas] = useState(false);

  useEffect(() => {
    const loadCanvas = () => setShouldRenderCanvas(true);

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(loadCanvas, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(loadCanvas, 180);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  return (
    <section
      id="hero"
      className={cn(
        'relative w-full overflow-hidden bg-[#ff6a1a]',
        'flex flex-col justify-center',
        'min-h-[680px]',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#ff6a1a]" aria-hidden="true" />
      {shouldRenderCanvas ? (
        <Suspense fallback={null}>
          <LazyHeroCanvas />
        </Suspense>
      ) : null}

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

          {data.ctaText && (
            <div className="animate-hero-in pt-2" style={{ animationDelay: '240ms' }}>
              <Button
                href={data.ctaHref ?? ROUTE_HASHES.contact}
                variant="unstyled"
                className="bg-[color:var(--color-accent-peach)] text-[color:var(--color-tag-bg)] hover:brightness-95 px-6 py-3 text-base sm:text-lg h-12"
              >
                {data.ctaText}
              </Button>
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
