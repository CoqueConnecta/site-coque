import { MarkdownContent } from '../components/ui/MarkdownContent';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Typography } from '../components/ui/Typography';
import { useOutletContext } from 'react-router-dom';
import type { PublicLayoutContextValue } from './PublicLayout';
import { useCmsTransparencyData } from '../hooks/useCmsTransparencyData';

export default function TransparencyPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data: transparency, isLoading } = useCmsTransparencyData(language);

  if (isLoading) return null;

  return (
    <PageShell className="max-w-4xl">
      <SectionHeader title={transparency.title} description={transparency.intro} divider />

      <div className="space-y-10 text-[color:var(--color-text-primary)]">
        {transparency.sections.map((section, index) => (
          <section key={`${section.title}-${index}`} className="space-y-4">
            <Typography variant="h2" className="text-2xl font-bold text-[color:var(--color-surface-orange)]">
              {section.title}
            </Typography>
            <MarkdownContent content={section.bodyMd ?? ''} />
          </section>
        ))}
      </div>
    </PageShell>
  );
}
