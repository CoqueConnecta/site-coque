import { Block } from '../components/ui/Block';
import { Typography } from '../components/ui/Typography';

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-32">
      <Block className="max-w-4xl">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <Typography variant="h1" className="mb-4 text-[#411409]">
            Transparência
          </Typography>
          <Typography variant="body" className="text-lg text-gray-600">
            Em breve, publicaremos aqui documentos e indicadores de prestação de contas.
          </Typography>
        </div>

        <div className="space-y-6 text-[#101014]">
          <Typography variant="body" className="leading-relaxed">
            Esta página foi criada para centralizar informações de governança e transparência da Coque Connecta,
            incluindo relatórios, resultados e dados institucionais relevantes.
          </Typography>
          <Typography variant="body" className="leading-relaxed">
            Para solicitações imediatas, entre em contato pelo e-mail contato@coqueconnecta.com.br.
          </Typography>
        </div>
      </Block>
    </main>
  );
}
