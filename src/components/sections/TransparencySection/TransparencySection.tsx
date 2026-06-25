import { SectionHeader } from '../../ui/SectionHeader';
import { Typography } from '../../ui/Typography';
import { MarkdownContent } from '../../ui/MarkdownContent';
import type { ResolvedTransparencyData } from '../../../types/cms';

export interface TransparencySectionProps {
  data: ResolvedTransparencyData;
}

export function TransparencySection({ data }: TransparencySectionProps) {
  return (
    <>
      <SectionHeader title={data.title} description={data.intro} divider />

      <div className="space-y-10 text-[color:var(--color-text-primary)]">
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

TransparencySection.displayName = 'TransparencySection';
