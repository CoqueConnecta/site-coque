import { useEffect, useState } from 'react';
import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import type { HeroData } from '../../../data/mockData';

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: HeroData;
}

export const HeroSection = ({ data, className, ...props }: HeroSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 px-4 py-20 sm:py-32 lg:py-40',
        className
      )}
      {...props}
    >
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 opacity-50" />

      {/* Background image if provided */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          className={cn(
            'space-y-6 transform transition-all duration-1000',
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
        >
          {/* Headline */}
          <Typography
            variant="display"
            tone="onDark"
            className="whitespace-pre-line text-4xl sm:text-5xl lg:text-6xl leading-tight font-bold"
          >
            {data.headline}
          </Typography>

          {/* Subheadline */}
          {data.subheadline && (
            <Typography variant="h3" tone="onDark" className="max-w-2xl text-lg sm:text-xl opacity-90">
              {data.subheadline}
            </Typography>
          )}

          {/* CTA Button */}
          {data.ctaText && (
            <div className="pt-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold tracking-tight transition-all bg-white text-orange-600 hover:bg-gray-100 px-6 py-3 text-base sm:text-lg h-12 shadow-lg hover:shadow-xl"
              >
                {data.ctaText}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -top-6 -left-6 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
