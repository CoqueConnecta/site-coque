import { MarkdownContent } from '../components/ui/MarkdownContent';
import { Typography } from '../components/ui/Typography';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useOutletContext } from 'react-router-dom';
import type { PublicLayoutContextValue } from './PublicLayout';
import { useCmsPrivacyData } from '../hooks/useCmsPrivacyData';

export default function PrivacyPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data: privacy, isLoading } = useCmsPrivacyData(language);

  if (isLoading) return null;

  return (
    <PageShell className="max-w-4xl">
      <SectionHeader
        title={privacy.title}
        description={`Última atualização: ${privacy.updatedAt}`}
        divider
      />

      <div className="space-y-10 text-[color:var(--color-text-primary)]">
        <section>
          <Typography variant="body" className="text-lg leading-relaxed">
            {privacy.intro}
          </Typography>
        </section>

        {privacy.sections.map((section, index) => (
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
