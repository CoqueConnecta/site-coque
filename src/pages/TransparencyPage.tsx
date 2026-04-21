import { Block } from '../components/ui/Block';
import { MarkdownContent } from '../components/ui/MarkdownContent';
import { Typography } from '../components/ui/Typography';
import { useOutletContext } from 'react-router-dom';
import type { PublicLayoutContextValue } from './PublicLayout';

function getSectionMarkdown(section: PublicLayoutContextValue['content']['transparency']['sections'][number]) {
  if (section.bodyMd?.trim()) {
    return section.bodyMd;
  }

  const paragraphBlock = (section.paragraphs ?? [])
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join('\n\n');

  const bulletBlock = (section.bullets ?? [])
    .map((bullet) => bullet.trim())
    .filter(Boolean)
    .map((bullet) => `- ${bullet}`)
    .join('\n');

  return [paragraphBlock, bulletBlock].filter(Boolean).join('\n\n');
}

function getTransparencySections(transparency: PublicLayoutContextValue['content']['transparency']) {
  if (Array.isArray(transparency.sections) && transparency.sections.length > 0) {
    return transparency.sections;
  }

  if (Array.isArray(transparency.body) && transparency.body.length > 0) {
    return transparency.body.map((paragraph, index) => ({
      title: `Seção ${index + 1}`,
      bodyMd: paragraph,
    }));
  }

  return [];
}

export default function TransparencyPage() {
  const { content } = useOutletContext<PublicLayoutContextValue>();
  const transparency = content.transparency;
  const sections = getTransparencySections(transparency);

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-32">
      <Block className="max-w-4xl">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <Typography variant="h1" className="mb-4 text-[#411409]">
            {transparency.title}
          </Typography>
          <Typography variant="body" className="text-lg text-gray-600">
            {transparency.intro}
          </Typography>
        </div>

        <div className="space-y-10 text-[#101014]">
          {sections.map((section, index) => (
            <section key={`${section.title}-${index}`} className="space-y-4">
              <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
                {section.title}
              </Typography>
              <MarkdownContent content={getSectionMarkdown(section)} />
            </section>
          ))}
        </div>
      </Block>
    </main>
  );
}
