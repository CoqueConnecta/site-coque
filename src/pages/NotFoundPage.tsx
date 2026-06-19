import { Typography } from '../components/ui/Typography';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';

export default function NotFoundPage() {
  return (
    <PageShell className="max-w-4xl">
      <SectionHeader
        title="Página não encontrada"
        description="O conteúdo que você tentou acessar não existe ou foi movido."
        divider
      />

      <Typography variant="body" className="leading-relaxed text-[color:var(--color-text-primary)]">
        Você pode voltar para a página inicial e navegar pelas seções principais.
        {' '}
        <a href="/" className="text-[color:var(--color-surface-orange)] underline hover:text-[color:var(--color-link-hover)]">
          Ir para a home
        </a>
        .
      </Typography>
    </PageShell>
  );
}
