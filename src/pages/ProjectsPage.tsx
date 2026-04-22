import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Block } from '../components/ui/Block';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { ProjectGrid } from '../components/composites/ProjectGrid';
import { ProjectCard } from '../components/composites/ProjectCard';
import { useCmsProjectsData } from '../hooks/useCmsProjectsData';
import type { PublicLayoutContextValue } from './PublicLayout';

const ITEMS_PER_PAGE = 4;

export default function ProjectsPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data, isLoading } = useCmsProjectsData(language);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const projects = data.projects;
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
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
            <ProjectGrid>
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ProjectGrid>

            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={handleLoadMore}
                  className="font-semibold uppercase tracking-wider text-[color:var(--color-text-secondary)]"
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
