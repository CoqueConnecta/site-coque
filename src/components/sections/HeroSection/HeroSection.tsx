import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import type { HeroData } from '../../../data/mockData';

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: HeroData;
}

export const HeroSection = ({ data, className, ...props }: HeroSectionProps) => {
  return (
    <section
      id="hero"
      className={cn(
        // Framer: height:100vh; min-height:700px; overflow:hidden; padding-bottom:60px
        // Background #f58634 is set as fallback (before WebGL loads)
        'relative w-full overflow-hidden bg-[#f58634]',
        'flex flex-col justify-end',
        'min-h-[700px] h-screen',
        className
      )}
      {...props}
    >
      {/* Temporary fallback background: close to Framer hero colors */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: [
            'radial-gradient(60% 55% at 18% 55%, rgba(255, 70, 20, 0.35) 0%, rgba(255, 70, 20, 0) 70%)',
            'radial-gradient(95% 90% at 98% 2%, rgba(65, 20, 9, 0.78) 0%, rgba(65, 20, 9, 0.2) 55%, rgba(65, 20, 9, 0) 100%)',
            'linear-gradient(130deg, #ff6b1e 0%, #f58634 52%, #d5631f 100%)',
          ].join(','),
        }}
      />

      {/* Content — bottom-left aligned (padding-bottom: 60px from Framer) */}
      <div className="relative z-10 w-full pb-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl space-y-6">
          {/* Headline — Kirang Haerang display font */}
          <Typography
            variant="display"
            tone="onDark"
            className="whitespace-pre-line text-4xl sm:text-5xl lg:text-6xl leading-tight"
          >
            {data.headline}
          </Typography>

          {/* Subheadline */}
          {data.subheadline && (
            <Typography
              variant="body"
              tone="onDark"
              className="max-w-xl text-base sm:text-lg leading-relaxed opacity-90"
            >
              {data.subheadline}
            </Typography>
          )}

          {/* CTA Button — dark pill (matches "DOE AGORA" / "FAÇA PARTE" style) */}
          {data.ctaText && (
            <div className="pt-2">
              <a
                href="#help"
                className="inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold tracking-tight transition-all bg-[#101014] text-white hover:bg-black px-6 py-3 text-base sm:text-lg h-12 shadow-lg"
              >
                {data.ctaText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
