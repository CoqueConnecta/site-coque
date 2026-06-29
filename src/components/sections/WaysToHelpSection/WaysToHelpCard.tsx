import { cn } from '../../../lib/cn';
import type { ResolvedWaysToHelpCard } from '../../../types/cms';
import { QuoteIcon, UserAvatarPlaceholderIcon } from '../../icons';

export interface WaysToHelpCardProps {
  card: ResolvedWaysToHelpCard;
  bg: string;
  titleColor: string;
  bodyColor: string;
  quoteColor: string;
  authorColor: string;
  tagBg: string;
  tagText: string;
  imageRight?: boolean;
}

export const WaysToHelpCard = ({
  card,
  bg,
  titleColor,
  bodyColor,
  quoteColor,
  authorColor,
  tagBg,
  tagText,
  imageRight = false,
}: WaysToHelpCardProps) => {
  return (
    <div
      key={card.id}
      className="overflow-hidden rounded-2xl transition-transform duration-300 ease-out hover:-translate-y-1"
      style={{ backgroundColor: bg }}
    >
      <div
        className={cn(
          'flex flex-col items-start gap-6 p-5 sm:p-6 lg:gap-8 lg:p-8',
          imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'
        )}
      >
        {card.image && (
          <div className="h-[240px] w-full shrink-0 overflow-hidden rounded-[10px] sm:h-[260px] lg:h-[280px] lg:w-[280px]">
            <img
              src={card.image}
              alt={card.title}
              className="block h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4">
          <h4
            className="m-0 text-[24px] font-semibold leading-[1.15] sm:text-[26px] lg:text-[28px]"
            style={{
              fontFamily: "'Figtree', sans-serif",
              color: titleColor,
            }}
          >
            {card.title}
          </h4>

          <p
            className="m-0 text-[15px] leading-[1.6] lg:text-[16px]"
            style={{
              fontFamily: "'Figtree', sans-serif",
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
                  fontFamily: "'Figtree', sans-serif",
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
                fontFamily: "'Figtree', sans-serif",
                color: bodyColor,
              }}
            >
              {card.blockquote.text}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--color-border-subtle)] bg-[#e6e6e6] sm:h-[50px] sm:w-[50px]">
              {card.blockquote.authorAvatar ? (
                <img
                  src={card.blockquote.authorAvatar}
                  alt={card.blockquote.authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserAvatarPlaceholderIcon />
              )}
            </div>
            <p
              className="m-0 text-[13px] font-medium sm:text-[14px]"
              style={{
                fontFamily: "'Figtree', sans-serif",
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

WaysToHelpCard.displayName = 'WaysToHelpCard';
