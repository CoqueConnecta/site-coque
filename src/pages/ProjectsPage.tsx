import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Block } from '../components/ui/Block';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { ProjectGrid } from '../components/composites/ProjectGrid';
import { ProjectCard } from '../components/composites/ProjectCard';
import { useCmsProjectsData } from '../hooks/useCmsProjectsData';
import type { PublicLayoutContextValue } from './PublicLayout';

import { FadeIn } from '../components/ui/FadeIn';

const INITIAL_ITEMS = 5; // 2 on first row, 3 on second row
const LOAD_MORE_ITEMS = 3;

export default function ProjectsPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data, isLoading } = useCmsProjectsData(language);
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);

  const projects = data.projects;
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_ITEMS);
  };

  const pageTitle = language === 'pt' ? 'Nossos Projetos' : 'Our Projects';
  const pageDescription = language === 'pt'
    ? 'Conheça as iniciativas que transformam a realidade da nossa comunidade.'
    : 'Discover the initiatives that transform the reality of our community.';
  const loadMoreText = language === 'pt' ? 'CARREGAR MAIS' : 'LOAD MORE';

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-34">
      <Block>
        <div className="mb-12">
          <Typography variant="h1" className="mb-4 text-[#411409]">
            {pageTitle}
          </Typography>
          <Typography variant="body" className="max-w-3xl text-lg text-gray-600">
            {pageDescription}
          </Typography>
        </div>

        {isLoading && projects.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--color-tag-bg)] border-t-transparent" />
          </div>
        ) : (
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
        )}
      </Block>
    </main>
  );
}
