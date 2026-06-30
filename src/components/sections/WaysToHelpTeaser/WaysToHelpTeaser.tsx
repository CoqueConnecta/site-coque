import { cn } from '../../../lib/cn';
import type { CmsLanguage, ResolvedWaysToHelpData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
import { Button } from '../../ui/Button';
import { ROUTES } from '../../../lib/constants';

export interface WaysToHelpTeaserProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedWaysToHelpData;
  language: CmsLanguage;
}

const CTA_LABEL: Record<CmsLanguage, string> = {
  pt: 'Conheça as formas de ajudar →',
  en: 'See how you can help →',
};

export const WaysToHelpTeaser = ({ data, language, className, ...props }: WaysToHelpTeaserProps) => {
  return (
    <section
      id="ways-to-help"
      className={cn('w-full bg-white py-12 sm:py-16', className)}
      {...props}
    >
      <Block>
        <FadeIn className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3
              style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: 'clamp(34px, 4.2vw, 50px)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: '1.1',
                margin: 0,
                letterSpacing: '-0.8px',
                maxWidth: '640px',
                textWrap: 'balance',
              } as React.CSSProperties}
            >
              {data.headline}
            </h3>
            {data.subtitle && (
              <p
                style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: 'clamp(17px, 2vw, 20px)',
                  lineHeight: '1.5',
                  color: 'var(--color-text-secondary)',
                  maxWidth: '60ch',
                  margin: 0,
                }}
              >
                {data.subtitle}
              </p>
            )}
          </div>
          <Button href={ROUTES.waysToHelp} variant="primary" size="lg">
            {CTA_LABEL[language]}
          </Button>
        </FadeIn>
      </Block>
    </section>
  );
};

WaysToHelpTeaser.displayName = 'WaysToHelpTeaser';
