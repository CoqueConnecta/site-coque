import { MapPin } from 'lucide-react';
import { Typography } from '../ui/Typography';
import { MarkdownContent } from '../ui/MarkdownContent';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import type { ResolvedProject } from '../../types/cms';

export interface ProjectCardProps {
  project: ResolvedProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const hasAction = project.actionLabel || project.actionHref;

  let imgSrc = project.image || '/placeholder-image.png';
  // Fallback provisório para corrigir o mock do banco de dados que aponta para .jpg em vez de .png
  if (imgSrc === '/placeholder-image.jpg' || imgSrc === '/assets/placeholder-image.jpg') {
    imgSrc = '/placeholder-image.png';
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-white shadow-[var(--shadow-soft)]">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Location Badge */}
        {project.location && (
          <div className="absolute bottom-3 left-3">
            <Tag variant="light" className="gap-1.5 px-2.5 py-1.5 shadow-sm">
              <MapPin className="h-3.5 w-3.5" />
              <span>{project.location}</span>
            </Tag>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="mb-4">
          <Typography variant="h3" className="mb-3 text-[22px] md:text-[24px]">
            {project.title}
          </Typography>
          <div className="text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            <MarkdownContent content={project.bodyMd} />
          </div>
        </div>

        {/* Action Button */}
        {hasAction && (
          <div className="mt-auto pt-6">
            <Button
              href={project.actionHref || '#'}
              variant="primary"
              className="h-9 px-6 py-2 text-[11px] font-bold tracking-wider"
            >
              {project.actionLabel || 'Saiba mais'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
