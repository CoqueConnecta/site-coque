import { cn } from '../../../lib/cn';

export interface InfiniteImageTickerProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  imageAlt?: string;
}

export const InfiniteImageTicker = ({
  images,
  imageAlt = 'Imagem do carrossel',
  className,
  ...props
}: InfiniteImageTickerProps) => {
  return (
    <div className={cn('group relative flex w-full overflow-hidden pb-4', className)} {...props}>
      {/* Lista duplicada para efeito de loop contínuo */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <ul className="m-0 flex min-w-max list-none gap-4 p-0 pr-4 md:gap-6 md:pr-6 lg:gap-8 lg:pr-8">
          {images.map((imageUrl, index) => (
            <TickerItem key={`img-1-${index}`} imageUrl={imageUrl} imageAlt={imageAlt} />
          ))}
        </ul>

        <ul
          className="m-0 flex min-w-max list-none gap-4 p-0 pr-4 md:gap-6 md:pr-6 lg:gap-8 lg:pr-8"
          aria-hidden="true"
        >
          {images.map((imageUrl, index) => (
            <TickerItem key={`img-2-${index}`} imageUrl={imageUrl} imageAlt={imageAlt} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const TickerItem = ({ imageUrl, imageAlt }: { imageUrl: string; imageAlt: string }) => (
  <li className="h-[300px] w-[240px] shrink-0 md:h-[420px] md:w-[320px] lg:h-[500px] lg:w-[400px]">
    <div className="h-full w-full overflow-hidden rounded-[40px] bg-white md:rounded-[50px] lg:rounded-[60px]">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  </li>
);

InfiniteImageTicker.displayName = 'InfiniteImageTicker';
