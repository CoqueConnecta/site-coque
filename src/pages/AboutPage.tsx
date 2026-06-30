import { useOutletContext } from 'react-router-dom';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';
import { AboutSection } from '../components/sections/AboutSection';
import type { PublicLayoutContextValue } from './PublicLayout';
import { useCmsAboutData } from '../hooks/useCmsAboutData';

const TITLE: Record<string, string> = { pt: 'Quem Somos', en: 'Who We Are' };

export default function AboutPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data, isLoading } = useCmsAboutData(language);

  if (isLoading) return null;

  return (
    <PageShell>
      <SectionHeader title={TITLE[language] ?? TITLE.pt} />
      <AboutSection data={data} />
    </PageShell>
  );
}
