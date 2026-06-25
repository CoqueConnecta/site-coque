import { useState } from 'react';
import { Button } from '../../ui/Button';
import { FadeIn } from '../../ui/FadeIn';
import { ProjectGrid } from '../../composites/ProjectGrid';
import { ProjectCard } from '../../composites/ProjectCard';
import type { CmsLanguage, ResolvedProject } from '../../../types/cms';

const INITIAL_ITEMS = 5; // 2 on first row, 3 on second row
const LOAD_MORE_ITEMS = 3;

export interface ProjectsSectionProps {
  projects: ResolvedProject[];
  language: CmsLanguage;
}

export function ProjectsSection({ projects, language }: ProjectsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;
  const loadMoreText = language === 'pt' ? 'CARREGAR MAIS' : 'LOAD MORE';

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_ITEMS);
  };

  return (
    <div className="space-y-12">
      {/* First Row: 2 projects side by side */}
      {visibleProjects.length > 0 && (
        <ProjectGrid>
          {visibleProjects.slice(0, 2).map((project, index) => (
            <FadeIn key={project.id} delay={index * 100}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </ProjectGrid>
      )}

      {/* Subsequent Rows: 3 projects side by side */}
      {visibleProjects.length > 2 && (
        <ProjectGrid className="lg:grid-cols-3">
          {visibleProjects.slice(2).map((project, index) => (
            <FadeIn key={project.id} delay={index * 100}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </ProjectGrid>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={handleLoadMore}
            className="cursor-pointer font-semibold uppercase tracking-wider text-[color:var(--color-text-secondary)]"
          >
            {loadMoreText}
          </Button>
        </div>
      )}
    </div>
  );
}

ProjectsSection.displayName = 'ProjectsSection';
