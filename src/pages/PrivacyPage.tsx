import { useEffect, useState } from 'react';
import { Block } from '../components/ui/Block';
import { MarkdownContent } from '../components/ui/MarkdownContent';
import { Typography } from '../components/ui/Typography';
import { useOutletContext } from 'react-router-dom';
import type { PublicLayoutContextValue } from './PublicLayout';
import type { ResolvedPrivacyData } from '../types/cms';
import { getCmsPrivacyData } from '../services/cmsService';

export default function PrivacyPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const [privacy, setPrivacy] = useState<ResolvedPrivacyData | null>(null);

  useEffect(() => {
    getCmsPrivacyData(language).then(setPrivacy);
  }, [language]);

  if (!privacy) return null;

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-34">
      <Block className="max-w-4xl">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <Typography variant="h1" className="mb-4 text-[#411409]">
            {privacy.title}
          </Typography>
          <Typography variant="body" className="text-lg text-gray-600">
            Última atualização: {privacy.updatedAt}
          </Typography>
        </div>

        <div className="space-y-10 text-[#101014]">
          <section>
            <Typography variant="body" className="text-lg leading-relaxed">
              {privacy.intro}
            </Typography>
          </section>

          {privacy.sections.map((section, index) => (
            <section key={`${section.title}-${index}`} className="space-y-4">
              <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
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
