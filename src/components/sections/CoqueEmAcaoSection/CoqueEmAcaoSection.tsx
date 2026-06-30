import { cn } from '../../../lib/cn';
import type { CmsCarouselImage, CmsLanguage, ResolvedYoutubeVideo } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
import { SectionHeading } from '../../composites/SectionHeading';
import { VideosSection } from '../VideosSection';
import { CarouselSection } from '../CarouselSection';

export interface CoqueEmAcaoSectionProps extends React.HTMLAttributes<HTMLElement> {
  videos?: ResolvedYoutubeVideo[];
  images?: CmsCarouselImage[];
  language: CmsLanguage;
}

// Heading fixo (não-CMS) que une 2 seções de mídia independentes sob 1 narrativa só —
// mesmo motivo do label de Transparência em TrustSection: é moldura editorial, não
// conteúdo dinâmico, não justifica um campo i18n próprio no CMS.
const HEADING: Record<CmsLanguage, { title: string; description: string }> = {
  pt: {
    title: 'Coque em ação',
    description: 'Um retrato em vídeo e fotos do que a comunidade constrói todos os dias.',
  },
  en: {
    title: 'Coque in action',
    description: 'A look in video and photos at what the community builds every day.',
  },
};

export const CoqueEmAcaoSection = ({
  videos,
  images,
  language,
  className,
  ...props
}: CoqueEmAcaoSectionProps) => {
  const copy = HEADING[language];

  return (
    <section
      id="coque-em-acao"
      className={cn('w-full bg-white py-12 sm:py-16', className)}
      {...props}
    >
      <Block>
        <FadeIn className="mb-6">
          <SectionHeading headline={copy.title} subtitle={copy.description} size="sm" />
        </FadeIn>
      </Block>

      <div className="space-y-6 md:space-y-8">
        <VideosSection videos={videos} className="py-0" />
        <CarouselSection images={images} className="py-0" />
      </div>
    </section>
  );
};

CoqueEmAcaoSection.displayName = 'CoqueEmAcaoSection';
