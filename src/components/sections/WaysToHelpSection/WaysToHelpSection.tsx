import { cn } from '../../../lib/cn';
import type { ResolvedWaysToHelpData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { WaysToHelpCard } from './WaysToHelpCard';
import { FadeIn } from '../../ui/FadeIn';

export interface WaysToHelpSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedWaysToHelpData;
}

const CARD_BG_LIGHT = 'var(--color-accent-peach)';
const CARD_BG_DARK = 'var(--color-tag-bg)';
const TAG_BG = 'var(--color-tag-bg)';
const TAG_TEXT = 'var(--color-text-cream)';

export const WaysToHelpSection = ({ data, className, ...props }: WaysToHelpSectionProps) => {
  return (
    <section
      id="ways-to-help"
      className={cn('w-full bg-white py-12 sm:py-16', className)}
      {...props}
    >
      <Block>
        {/* Header — left-aligned */}
        <FadeIn className="mb-10 flex flex-col gap-4">
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
        </FadeIn>

        {/* Cards */}
        <div className="flex flex-col gap-8">
          {data.cards.map((card, index) => {
            const isDark = card.variant === 'dark';
            const bg = isDark ? CARD_BG_DARK : CARD_BG_LIGHT;
            const titleColor = isDark ? 'var(--color-text-cream)' : 'var(--color-text-primary)';
            const bodyColor = isDark ? 'var(--color-text-cream)' : 'var(--color-text-primary)';
            const quoteColor = isDark ? 'var(--color-text-cream)' : TAG_BG;
            const authorColor = isDark ? 'var(--color-text-cream)' : 'var(--color-text-primary)';
            const tagBg = isDark ? 'var(--color-accent-peach)' : TAG_BG;
            const tagText = isDark ? 'var(--color-tag-bg)' : TAG_TEXT;

            return (
              <FadeIn key={card.id} delay={Math.min(index * 80, 240)}>
                <WaysToHelpCard
                  card={card}
                  bg={bg}
                  titleColor={titleColor}
                  bodyColor={bodyColor}
                  quoteColor={quoteColor}
                  authorColor={authorColor}
                  tagBg={tagBg}
                  tagText={tagText}
                  imageRight={index % 2 !== 0}
                />
              </FadeIn>
            );
          })}
        </div>
      </Block>
    </section>
  );
};

WaysToHelpSection.displayName = 'WaysToHelpSection';
