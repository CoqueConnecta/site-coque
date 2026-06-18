import { lazy, Suspense, useEffect, useState } from 'react';
import { cn } from '../../../lib/cn';
import type { ResolvedHeroData } from '../../../types/cms';
import { Block } from '../../ui/Block';

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
        'flex flex-col justify-end',
        'min-h-[720px]',
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

      <Block className="relative z-10 pb-16">
        <div className="max-w-3xl space-y-6">
          <h1
            className="animate-hero-in whitespace-pre-line text-[#fef7ee] leading-tight [text-wrap:balance]"
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
              className="animate-hero-in max-w-xl text-[#fef7ee] text-base sm:text-lg leading-relaxed opacity-90 font-[var(--font-body)]"
              style={{ animationDelay: '120ms' }}
            >
              {data.subheadline}
            </p>
          )}

          {data.ctaText && (
            <div className="animate-hero-in pt-2" style={{ animationDelay: '240ms' }}>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold tracking-tight transition-all bg-[#f9b778] text-[#411409] hover:brightness-95 px-6 py-3 text-base sm:text-lg h-12"
              >
                {data.ctaText}
              </a>
            </div>
          )}
        </div>
      </Block>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
