import { SectionHeader } from '../../ui/SectionHeader';
import { Typography } from '../../ui/Typography';
import { MarkdownContent } from '../../ui/MarkdownContent';
import type { ResolvedPrivacyData } from '../../../types/cms';

export interface PrivacySectionProps {
  data: ResolvedPrivacyData;
}

export function PrivacySection({ data }: PrivacySectionProps) {
  return (
    <>
      <SectionHeader
        title={data.title}
        description={`Última atualização: ${data.updatedAt}`}
        divider
      />

      <div className="space-y-10 text-[color:var(--color-text-primary)]">
        <section>
          <Typography variant="body" className="text-lg leading-relaxed">
            {data.intro}
          </Typography>
        </section>

        {data.sections.map((section, index) => (
          <section key={`${section.title}-${index}`} className="space-y-4">
            <Typography variant="h2" className="text-2xl font-bold text-[color:var(--color-surface-orange)]">
              {section.title}
            </Typography>
            <MarkdownContent content={section.bodyMd ?? ''} />
          </section>
        ))}
      </div>
    </>
  );
}

PrivacySection.displayName = 'PrivacySection';
