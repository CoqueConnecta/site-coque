import { cn } from '../../../lib/cn';
import { Block } from '../../ui/Block';
import { InfiniteImageTicker } from '../../composites/InfiniteImageTicker';
import type { CmsCarouselImage } from '../../../types/cms';

export interface CarouselSectionProps extends React.HTMLAttributes<HTMLElement> {
  images?: CmsCarouselImage[];
}

const defaultTickerImages = [
  '/mulheres-costurando.jpg',
  '/mulheres-recortando-tecido.jpg',
  '/mulher-ensinando-estudante.jpg',
  '/mulheres-estudando.jpg',
  '/crianca-lavando-as-maos.jpg',
  '/jovens-no-auditorio.jpg',
];

export const CarouselSection = ({
  images,
  className,
  ...props
}: CarouselSectionProps) => {
  const tickerImages = (images && images.length > 0
    ? images.map((image) => image.src)
    : defaultTickerImages);

  return (
    <section
      id="photos"
      className={cn('w-full bg-white pt-12 pb-16 md:pt-16 md:pb-24', className)}
      {...props}
    >
      <Block inset="full">
        <InfiniteImageTicker
          images={tickerImages}
          imageAlt="Atividades da Coque Connecta"
        />
      </Block>
    </section>
  );
};

CarouselSection.displayName = 'CarouselSection';
