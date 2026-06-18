import { cn } from '../../../lib/cn';
import type { ResolvedGalleryData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { GalleryCard } from './GalleryCard';
import { FadeIn } from '../../ui/FadeIn';

export interface GallerySectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedGalleryData;
}

const CARD_BG_LIGHT = '#f9b778';
const CARD_BG_DARK = '#411409';
const TAG_BG = '#411409';
const TAG_TEXT = '#fef7ee';

export const GallerySection = ({ data, className, ...props }: GallerySectionProps) => {
  return (
    <section
      id="our-work"
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
              color: '#101014',
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
              color: '#3d3d47',
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
            const titleColor = isDark ? '#fef7ee' : '#101014';
            const bodyColor = isDark ? '#fef7ee' : '#101014';
            const quoteColor = isDark ? '#fef7ee' : TAG_BG;
            const authorColor = isDark ? '#fef7ee' : '#101014';
            const tagBg = isDark ? '#f9b778' : TAG_BG;
            const tagText = isDark ? '#411409' : TAG_TEXT;

            return (
              <FadeIn key={card.id} delay={Math.min(index * 80, 240)}>
                <GalleryCard
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

GallerySection.displayName = 'GallerySection';
