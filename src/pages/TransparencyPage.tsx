import { useEffect, useState } from 'react';
import { Block } from '../components/ui/Block';
import { MarkdownContent } from '../components/ui/MarkdownContent';
import { Typography } from '../components/ui/Typography';
import { useOutletContext } from 'react-router-dom';
import type { PublicLayoutContextValue } from './PublicLayout';
import type { ResolvedTransparencyData } from '../types/cms';
import { getCmsTransparencyData } from '../services/cmsService';

export default function TransparencyPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const [transparency, setTransparency] = useState<ResolvedTransparencyData | null>(null);

  useEffect(() => {
    getCmsTransparencyData(language).then(setTransparency);
  }, [language]);

  if (!transparency) return null;

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-32">
      <Block className="max-w-4xl">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <Typography variant="h1" className="mb-4 text-[color:var(--color-tag-bg)]">
            {transparency.title}
          </Typography>
          <Typography variant="body" className="text-lg text-gray-600">
            {transparency.intro}
          </Typography>
        </div>

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
      </Block>
    </main>
  );
}
