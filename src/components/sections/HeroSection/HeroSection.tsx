import { lazy, Suspense, useEffect, useState } from 'react';
import { cn } from '../../../lib/cn';
import type { HeroData } from '../../../data/mockData';
import { Block } from '../../ui/Block';

const LazyHeroCanvas = lazy(async () => {
  const module = await import('./HeroCanvas');
  return { default: module.HeroCanvas };
});

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: HeroData;
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
        // Framer: height:100vh; min-height:700px; overflow:hidden; padding-bottom:60px
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

      {/* Conteúdo alinhado no canto inferior esquerdo (padding-bottom: 60px do Framer) */}
      <Block className="relative z-10 pb-16">
        <div className="max-w-3xl space-y-6">
          {/* Título: linha 1 em DM Sans bold; linha 2 em Kirang Haerang */}
          <h1 className="whitespace-pre-line text-[#fef7ee] leading-tight">
            {data.headline.split('\n').map((line, i) => (
              <span
                key={i}
                className={cn(
                  'block',
                  i === 0
                    ? '[font-family:var(--font-body)] font-extrabold text-[40px] sm:text-[46px] lg:text-[51px]'
                    : 'text-[48px] sm:text-[56px] lg:text-[64px]'
                )}
                style={i === 1 ? { fontFamily: 'var(--font-display)' } : undefined}
              >
                {i === 1 ? line.replace(/\.+\s*$/, '') : line}
              </span>
            ))}
          </h1>

          {/* Subtítulo */}
          {data.subheadline && (
            <p className="max-w-xl text-[#fef7ee] text-base sm:text-lg leading-relaxed opacity-90 font-[var(--font-body)]">
              {data.subheadline}
            </p>
          )}

          {/* Botão CTA em pílula âmbar, alinhado ao protótipo Framer */}
          {data.ctaText && (
            <div className="pt-2">
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
