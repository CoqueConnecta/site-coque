import { cn } from '../../../lib/cn';
import type { CmsCarouselImage, CmsLanguage, ResolvedYoutubeVideo } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
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
            {copy.title}
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
            {copy.description}
          </p>
        </FadeIn>
      </Block>

      <div className="space-y-10 md:space-y-12">
        <VideosSection videos={videos} className="py-0" />
        <CarouselSection images={images} className="py-0" />
      </div>
    </section>
  );
};

CoqueEmAcaoSection.displayName = 'CoqueEmAcaoSection';
