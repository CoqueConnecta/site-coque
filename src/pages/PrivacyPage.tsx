import { Block } from '../components/ui/Block';
import { Typography } from '../components/ui/Typography';
import { useOutletContext } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import type { PublicLayoutContextValue } from './PublicLayout';

const markdownComponents: Components = {
  h2: ({ children }) => (
    <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant="body" className="leading-relaxed">
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <ul className="ml-6 list-disc space-y-2 text-base leading-relaxed [font-family:var(--font-body)] md:text-lg">
      {children}
    </ul>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong>{children}</strong>,
  a: ({ href, children }) => {
    const url = href?.trim() ?? '';
    const isRelative = url.startsWith('/') || url.startsWith('#');

    if (!url) {
      return <>{children}</>;
    }

    if (isRelative) {
      return (
        <a href={url} className="text-[#f58634] underline hover:text-[#c73c00]">
          {children}
        </a>
      );
    }

    try {
      const parsedUrl = new URL(url);
      const safeProtocols = new Set(['https:', 'mailto:', 'tel:']);

      if (!safeProtocols.has(parsedUrl.protocol)) {
        return <>{children}</>;
      }

      return (
        <a
          href={url}
          className="text-[#f58634] underline hover:text-[#c73c00]"
          target={parsedUrl.protocol === 'https:' ? '_blank' : undefined}
          rel={parsedUrl.protocol === 'https:' ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    } catch {
      return <>{children}</>;
    }
  },
};

function getSectionMarkdown(section: PublicLayoutContextValue['content']['privacy']['sections'][number]) {
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

export default function PrivacyPage() {
  const { content } = useOutletContext<PublicLayoutContextValue>();
  const privacy = content.privacy;

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-34">
      <Block className="max-w-4xl">
        {/* Cabeçalho da Política */}
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

              <ReactMarkdown components={markdownComponents}>
                {getSectionMarkdown(section)}
              </ReactMarkdown>
            </section>
          ))}
        </div>
      </Block>
    </main>
  );
}
