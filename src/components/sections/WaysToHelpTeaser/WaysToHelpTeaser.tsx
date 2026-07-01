import { cn } from '../../../lib/cn';
import type { CmsLanguage, ResolvedWaysToHelpData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
import { Button } from '../../ui/Button';
import { SectionHeading } from '../../composites/SectionHeading';
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
      className={cn('w-full bg-[color:var(--color-surface-orange)] py-20 sm:py-28', className)}
      {...props}
    >
      <Block>
        <FadeIn className="flex flex-col items-center gap-6">
          <SectionHeading
            headline={data.headline}
            subtitle={data.subtitle}
            size="lg"
            centered
            tone="on-orange"
          />
          <Button
            href={ROUTES.waysToHelp}
            variant="unstyled"
            size="lg"
            className="bg-[color:var(--color-tag-bg)] text-[color:var(--color-accent-peach)] hover:brightness-110 px-8 py-3 h-12 text-base font-semibold"
          >
            {CTA_LABEL[language]}
          </Button>
        </FadeIn>
      </Block>
    </section>
  );
};

WaysToHelpTeaser.displayName = 'WaysToHelpTeaser';
