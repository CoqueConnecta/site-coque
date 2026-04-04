import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { Tag } from '../../ui/Tag';
import { SectionContainer } from '../../ui/SectionContainer';
import { Surface } from '../../ui/Surface';
import type { GalleryData } from '../../../data/mockData';

export interface GallerySectionProps extends React.HTMLAttributes<HTMLElement> {
  data: GalleryData;
}

export const GallerySection = ({ data, className, ...props }: GallerySectionProps) => {
  return (
    <section id="projects" className={cn('w-full bg-gray-50', className)} {...props}>
      <SectionContainer spacing="lg" gutter>
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <Tag variant="accent">Projetos</Tag>
            <Typography variant="h2" className="text-4xl sm:text-5xl">
              Nossos Projetos
            </Typography>
            <Typography variant="body" tone="muted" className="max-w-2xl text-lg">
              Conheça as iniciativas que estão transformando vidas e comunidades.
            </Typography>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {data.projects.map((project) => (
              <Surface key={project.id} variant="cardStrong" padding="lg" className="group overflow-hidden">
                {/* Image Placeholder */}
                {project.image && (
                  <div className="mb-4 -mx-4 -mt-4 h-48 overflow-hidden bg-gradient-to-br from-orange-200 to-orange-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3">
                  {/* Title */}
                  <Typography variant="h3" className="text-xl font-bold">
                    {project.title}
                  </Typography>

                  {/* Description */}
                  <Typography variant="bodySm" tone="muted">
                    {project.description}
                  </Typography>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <Tag key={tag} variant="light" className="text-xs">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>

                {/* Hover CTA */}
                <div className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button className="text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors">
                    Saiba mais →
                  </button>
                </div>
              </Surface>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

GallerySection.displayName = 'GallerySection';
