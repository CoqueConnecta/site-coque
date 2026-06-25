import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { SectionContainer } from '../../ui/SectionContainer';
import { Block } from '../../ui/Block';
import { Button } from '../../ui/Button';
import type { HelpData } from '../../../data/mockData';

export interface HelpSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: HelpData;
}

export const HelpSection = ({ data, className, ...props }: HelpSectionProps) => {
  return (
    <section id="help" className={cn('w-full bg-white', className)} {...props}>
      <SectionContainer spacing="lg" gutter>
        <Block className="space-y-8">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
          {/* Headline */}
          <Typography variant="h1" className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            {data.headline}
          </Typography>

          {/* Description */}
          <Typography variant="body" tone="muted" className="text-lg leading-relaxed">
            {data.description}
          </Typography>

          {/* Highlighted Text */}
          {data.highlightedText && (
            <div className="rounded-lg bg-orange-50 p-6 border-l-4 border-l-orange-600">
              <Typography variant="h3" className="text-2xl text-orange-600 font-semibold">
                {data.highlightedText}
              </Typography>
            </div>
          )}

            {/* CTA Button */}
            {data.ctaText && (
              <div className="flex justify-center pt-4">
                <Button
                  href={data.ctaLink}
                  variant="unstyled"
                  className="bg-orange-600 text-white hover:bg-orange-700 px-8 py-3 text-base sm:text-lg h-12 shadow-lg hover:shadow-xl"
                >
                  {data.ctaText}
                </Button>
              </div>
            )}
          </div>
        </Block>
      </SectionContainer>
    </section>
  );
};

HelpSection.displayName = 'HelpSection';
