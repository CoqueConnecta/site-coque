import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Typography } from './Typography';

function renderSafeLink(href: string, children: React.ReactNode) {
  const url = href.trim();
  const isRelative = url.startsWith('/') || url.startsWith('#');

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
}

export const defaultMarkdownComponents: Components = {
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

    if (!url) {
      return <>{children}</>;
    }

    return renderSafeLink(url, children);
  },
};

type MarkdownContentProps = {
  content: string;
  components?: Components;
};

export function MarkdownContent({ content, components }: MarkdownContentProps) {
  return <ReactMarkdown components={components ?? defaultMarkdownComponents}>{content}</ReactMarkdown>;
}
