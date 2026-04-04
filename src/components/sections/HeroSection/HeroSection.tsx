import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import type { HeroData } from '../../../data/mockData';
import { HeroCanvas } from './HeroCanvas';

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
      {/* Three.js animated canvas background */}
      <HeroCanvas className="z-0" />

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
