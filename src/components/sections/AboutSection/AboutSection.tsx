import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { InfiniteImageTicker } from '../../composites/InfiniteImageTicker';
import { Block } from '../../ui/Block';
import { YouTubeFeed } from '../../ui/YouTubeFeed';
import { FadeIn } from '../../ui/FadeIn';
import type { ResolvedAboutData, CmsCarouselImage, ResolvedYoutubeVideo } from '../../../types/cms';

export interface AboutSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedAboutData;
  tickerImages?: CmsCarouselImage[];
  youtubeVideos?: ResolvedYoutubeVideo[];
}

const aboutTickerImages = [
  '/mulheres-costurando.jpg',
  '/mulheres-recortando-tecido.jpg',
  '/mulher-ensinando-estudante.jpg',
  '/mulheres-estudando.jpg',
  '/crianca-lavando-as-maos.jpg',
  '/jovens-no-auditorio.jpg',
];

export const AboutSection = ({
  data,
  tickerImages,
  youtubeVideos,
  className,
  ...props
}: AboutSectionProps) => {
  const images = (tickerImages && tickerImages.length > 0
    ? tickerImages.map((image) => image.src)
    : aboutTickerImages);

  return (
    <section id="about" className={cn('w-full bg-white py-16 md:py-24', className)} {...props}>
      <Block>
        <div className="space-y-12 md:space-y-16">
          <FadeIn>
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12 lg:gap-16">
              <div className="mx-auto flex-shrink-0 md:mx-0">
                <img
                  src="/coque-logo.svg"
                  alt="Coque Connecta"
                  className="w-32 sm:w-36 md:w-44 lg:w-52"
                  width="208"
                  height="208"
                  loading="eager"
                />
              </div>
              <div className="min-w-0">
                <Typography
                  variant="body"
                  tone="muted"
                  className="text-[18px] leading-relaxed sm:text-[20px] lg:text-[22px]"
                >
                  {data.description}
                </Typography>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <YouTubeFeed videos={youtubeVideos} />
          </FadeIn>
        </div>
      </Block>

      <Block inset="full" className="mt-12 md:mt-16">
        <InfiniteImageTicker
          images={images}
          imageAlt="Atividades da Coque Connecta"
        />
      </Block>
    </section>
  );
};

AboutSection.displayName = 'AboutSection';
