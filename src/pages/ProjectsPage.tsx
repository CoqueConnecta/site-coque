import { useOutletContext } from 'react-router-dom';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { useCmsProjectsData } from '../hooks/useCmsProjectsData';
import type { PublicLayoutContextValue } from './PublicLayout';

export default function ProjectsPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data, isLoading } = useCmsProjectsData(language);

  const pageTitle = language === 'pt' ? 'Nossos Projetos' : 'Our Projects';
  const pageDescription = language === 'pt'
    ? 'Conheça as iniciativas que transformam a realidade da nossa comunidade.'
    : 'Discover the initiatives that transform the reality of our community.';

  return (
    <PageShell>
      <SectionHeader title={pageTitle} description={pageDescription} descriptionClassName="max-w-3xl" />

      {isLoading && data.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--color-tag-bg)] border-t-transparent" />
        </div>
      ) : (
        <ProjectsSection projects={data} language={language} />
      )}
    </PageShell>
  );
}
