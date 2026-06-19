import { Block } from '../components/ui/Block';
import { Typography } from '../components/ui/Typography';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-32">
      <Block className="max-w-4xl">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <Typography variant="h1" className="mb-4 text-[color:var(--color-tag-bg)]">
            Página não encontrada
          </Typography>
          <Typography variant="body" className="text-lg text-gray-600">
            O conteúdo que você tentou acessar não existe ou foi movido.
          </Typography>
        </div>

        <Typography variant="body" className="leading-relaxed text-[color:var(--color-text-primary)]">
          Você pode voltar para a página inicial e navegar pelas seções principais.
          {' '}
          <a href="/" className="text-[color:var(--color-surface-orange)] underline hover:text-[color:var(--color-link-hover)]">
            Ir para a home
          </a>
          .
        </Typography>
      </Block>
    </main>
  );
}
