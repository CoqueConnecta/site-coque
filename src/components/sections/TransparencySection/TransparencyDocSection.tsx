import { Typography } from '../../ui/Typography';
import { MarkdownContent } from '../../ui/MarkdownContent';

export interface TransparencyDocSectionProps {
  title: string;
  bodyMd: string;
}

export function TransparencyDocSection({ title, bodyMd }: TransparencyDocSectionProps) {
  return (
    <section className="space-y-4">
      <Typography variant="h2" className="text-2xl font-bold text-[color:var(--color-surface-orange)]">
        {title}
      </Typography>
      <MarkdownContent content={bodyMd} />
    </section>
  );
}

TransparencyDocSection.displayName = 'TransparencyDocSection';
