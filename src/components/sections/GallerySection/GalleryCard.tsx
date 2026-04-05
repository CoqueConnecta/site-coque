import type { GalleryData } from '../../../data/mockData';

export interface GalleryCardProps {
  card: GalleryData['cards'][number];
  bg: string;
  titleColor: string;
  bodyColor: string;
  quoteColor: string;
  authorColor: string;
  tagBg: string;
  tagText: string;
}

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

export const GalleryCard = ({
  card,
  bg,
  titleColor,
  bodyColor,
  quoteColor,
  authorColor,
  tagBg,
  tagText,
}: GalleryCardProps) => {
  return (
    <div
      key={card.id}
      className="overflow-hidden rounded-[25px]"
      style={{
        backgroundColor: bg,
        boxShadow: card.variant === 'dark' ? 'rgba(16,16,20,0.2) 0px 0px 0px 1px' : 'none',
      }}
    >
      <div className="flex flex-col items-start gap-6 p-5 sm:p-6 lg:flex-row lg:gap-8 lg:p-8">
        {card.image && (
          <div className="h-[240px] w-full shrink-0 overflow-hidden rounded-[10px] sm:h-[260px] lg:h-[280px] lg:w-[280px]">
            <img
              src={card.image}
              alt={card.title}
              className="block h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 lg:gap-4">
          <h4
            className="m-0 text-[24px] font-semibold leading-[1.15] sm:text-[26px] lg:text-[28px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: titleColor,
            }}
          >
            {card.title}
          </h4>

          <p
            className="m-0 text-[15px] leading-[1.6] lg:text-[16px]"
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: bodyColor,
            }}
          >
            {card.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[16px] px-3 py-1 text-[12px] font-medium sm:px-[14px] sm:text-[13px]"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  backgroundColor: tagBg,
                  color: tagText,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {card.blockquote && (
        <div className="flex flex-col gap-4 px-5 pb-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
          <div className="flex items-start gap-3">
            <QuoteIcon color={quoteColor} />
            <p
              className="m-0 text-[15px] italic leading-[1.6] lg:text-[16px]"
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: bodyColor,
              }}
            >
              {card.blockquote.text}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#dbdad9] bg-[#e6e6e6] sm:h-[50px] sm:w-[50px]"
              style={{
                backgroundColor: '#e6e6e6',
              }}
            >
              {card.blockquote.authorAvatar ? (
                <img
                  src={card.blockquote.authorAvatar}
                  alt={card.blockquote.authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              )}
            </div>
            <p
              className="m-0 text-[13px] font-medium sm:text-[14px]"
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: authorColor,
              }}
            >
              {card.blockquote.authorName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

GalleryCard.displayName = 'GalleryCard';
