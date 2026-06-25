import { SectionHeader } from '../../ui/SectionHeader';
import { TransparencyDocSection } from './TransparencyDocSection';
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
          <TransparencyDocSection key={`${section.title}-${index}`} title={section.title} bodyMd={section.bodyMd ?? ''} />
        ))}
      </div>
    </>
  );
}

TransparencySection.displayName = 'TransparencySection';
