import { cn } from '../../../lib/cn';
import type { GalleryData } from '../../../data/mockData';

export interface GallerySectionProps extends React.HTMLAttributes<HTMLElement> {
  data: GalleryData;
}

const CARD_BG_LIGHT = '#f9b778';
const CARD_BG_DARK = '#f58634';
const TAG_BG = '#411409';
const TAG_TEXT = '#fef7ee';

// Quote icon SVG inline (Bootstrap quote-left-fill)
const QuoteIcon = ({ color }: { color: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill={color}
    style={{ flexShrink: 0 }}
    aria-hidden="true"
  >
    <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z" />
  </svg>
);

export const GallerySection = ({ data, className, ...props }: GallerySectionProps) => {
  return (
    <section
      id="our-work"
      className={cn('w-full bg-white py-16 sm:py-24', className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1360px] px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h3
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(28px, 3vw, 42px)',
              fontWeight: 500,
              color: '#101014',
              margin: 0,
              letterSpacing: '-0.4px',
            }}
          >
            {data.headline}
          </h3>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '18px',
              color: '#3d3d47',
              maxWidth: '600px',
              margin: 0,
            }}
          >
            {data.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-10">
          {data.cards.map((card) => {
            const bg = card.variant === 'dark' ? CARD_BG_DARK : CARD_BG_LIGHT;
            const titleColor = card.variant === 'dark' ? '#411409' : '#101014';
            const bodyColor = card.variant === 'dark' ? '#fff' : '#101014';
            const quoteColor = card.variant === 'dark' ? '#fff' : TAG_BG;
            const authorColor = card.variant === 'dark' ? '#fff' : '#101014';

            return (
              <div
                key={card.id}
                style={{
                  backgroundColor: bg,
                  borderRadius: '25px',
                  boxShadow: card.variant === 'dark' ? 'rgba(16,16,20,0.2) 0px 0px 0px 1px' : 'none',
                  overflow: 'hidden',
                }}
              >
                {/* Top: image + content */}
                <div
                  style={{
                    display: 'flex',
                    gap: '32px',
                    alignItems: 'flex-start',
                    padding: '32px',
                  }}
                >
                  {/* Image */}
                  {card.image && (
                    <div
                      style={{
                        flexShrink: 0,
                        width: '280px',
                        height: '280px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '28px',
                        fontWeight: 600,
                        color: titleColor,
                        margin: 0,
                      }}
                    >
                      {card.title}
                    </h4>

                    <p
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: bodyColor,
                        margin: 0,
                      }}
                    >
                      {card.description}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            backgroundColor: TAG_BG,
                            color: TAG_TEXT,
                            borderRadius: '16px',
                            padding: '4px 14px',
                            fontSize: '13px',
                            fontWeight: 500,
                            fontFamily: "'Manrope', sans-serif",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Blockquote section */}
                {card.blockquote && (
                  <div
                    style={{
                      padding: '24px 32px 32px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {/* Quote text */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <QuoteIcon color={quoteColor} />
                      <p
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: '16px',
                          fontStyle: 'italic',
                          lineHeight: '1.6',
                          color: bodyColor,
                          margin: 0,
                        }}
                      >
                        {card.blockquote.text}
                      </p>
                    </div>

                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Avatar placeholder */}
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '999px',
                          border: '1px solid #dbdad9',
                          backgroundColor: '#e6e6e6',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        {card.blockquote.authorAvatar ? (
                          <img
                            src={card.blockquote.authorAvatar}
                            alt={card.blockquote.authorName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa" aria-hidden="true">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                          </svg>
                        )}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: '14px',
                          fontWeight: 500,
                          color: authorColor,
                          margin: 0,
                        }}
                      >
                        {card.blockquote.authorName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

GallerySection.displayName = 'GallerySection';
