import { cn } from '../../../lib/cn';
import type { CmsLanguage, ResolvedWhatWeDoData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
import { Button } from '../../ui/Button';
import { ProjectCard } from '../../composites/ProjectCard';
import { ProjectGrid } from '../../composites/ProjectGrid';
import { ROUTES } from '../../../lib/constants';
import { useCmsProjectsData } from '../../../hooks/useCmsProjectsData';

export interface WhatWeDoSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedWhatWeDoData;
  language: CmsLanguage;
}

const SEE_ALL_LABEL: Record<CmsLanguage, string> = {
  pt: 'Ver todos os projetos →',
  en: 'See all projects →',
};

export const WhatWeDoSection = ({
  data,
  language,
  className,
  ...props
}: WhatWeDoSectionProps) => {
  const { data: projects } = useCmsProjectsData(language);
  const preview = projects.slice(0, 3);

  return (
    <section
      id="what-we-do"
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
            {data.headline || (language === 'pt' ? 'O que Fazemos' : 'What We Do')}
          </h3>
          {data.subtitle && (
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
              {data.subtitle}
            </p>
          )}
        </FadeIn>

        {preview.length > 0 && (
          <FadeIn delay={80}>
            <ProjectGrid>
              {preview.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ProjectGrid>
          </FadeIn>
        )}

        <div className="mt-8">
          <Button href={ROUTES.whatWeDo} variant="primary">
            {SEE_ALL_LABEL[language]}
          </Button>
        </div>
      </Block>
    </section>
  );
};

WhatWeDoSection.displayName = 'WhatWeDoSection';
