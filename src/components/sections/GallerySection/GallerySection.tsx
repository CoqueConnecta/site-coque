import { cn } from '../../../lib/cn';
import type { GalleryData } from '../../../data/mockData';
import { GalleryCard } from './GalleryCard';

export interface GallerySectionProps extends React.HTMLAttributes<HTMLElement> {
  data: GalleryData;
}

const CARD_BG_LIGHT = '#f9b778';
const CARD_BG_DARK = '#f58634';
const TAG_BG = '#411409';
const TAG_TEXT = '#fef7ee';

export const GallerySection = ({ data, className, ...props }: GallerySectionProps) => {
  return (
    <section
      id="our-work"
      className={cn('w-full bg-white py-12 sm:py-16', className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h3
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(34px, 4.2vw, 50px)',
              fontWeight: 700,
              color: '#101014',
              lineHeight: '1.1',
              margin: 0,
              letterSpacing: '-0.8px',
              maxWidth: '640px',
              width: '100%',
            }}
          >
            {data.headline}
          </h3>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(17px, 2vw, 20px)',
              lineHeight: '1.3',
              color: '#3d3d47',
              maxWidth: '640px',
              margin: 0,
            }}
          >
            {data.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-8">
          {data.cards.map((card) => {
            const bg = card.variant === 'dark' ? CARD_BG_DARK : CARD_BG_LIGHT;
            const titleColor = card.variant === 'dark' ? '#411409' : '#101014';
            const bodyColor = card.variant === 'dark' ? '#fff' : '#101014';
            const quoteColor = card.variant === 'dark' ? '#fff' : TAG_BG;
            const authorColor = card.variant === 'dark' ? '#fff' : '#101014';

            return (
              <GalleryCard
                key={card.id}
                card={card}
                bg={bg}
                titleColor={titleColor}
                bodyColor={bodyColor}
                quoteColor={quoteColor}
                authorColor={authorColor}
                tagBg={TAG_BG}
                tagText={TAG_TEXT}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

GallerySection.displayName = 'GallerySection';
