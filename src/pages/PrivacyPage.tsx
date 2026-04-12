import { Block } from '../components/ui/Block';
import { Typography } from '../components/ui/Typography';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-32">
      <Block className="max-w-4xl">
        {/* Cabeçalho da Política */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <Typography variant="h1" className="mb-4 text-[#411409]">
            Política de Privacidade
          </Typography>
          <Typography variant="body" className="text-lg text-gray-600">
            Última atualização: Abril de 2026
          </Typography>
        </div>

        {/* Conteúdo da Política */}
        <div className="space-y-10 text-[#101014]">
          
          <section>
            <Typography variant="body" className="text-lg leading-relaxed">
              Bem-vindo(a) à <strong>Coque Connecta</strong>. A sua privacidade e a segurança dos seus dados pessoais são muito importantes para nós. 
              Criamos este documento para explicar de forma clara, simples e transparente quais dados nós coletamos, 
              como os utilizamos e quais são os seus direitos, em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
              1. Quais dados pessoais nós coletamos?
            </Typography>
            <Typography variant="body" className="leading-relaxed">
              Nós coletamos apenas as informações estritamente necessárias para manter você conectado com os nossos propósitos. 
              Atualmente, quando você se inscreve em nossa newsletter, solicitamos:
            </Typography>
            <ul className="ml-6 list-disc space-y-2 text-base leading-relaxed [font-family:var(--font-body)] md:text-lg">
              <li><strong>Dados de Identificação:</strong> Nome e Sobrenome.</li>
              <li><strong>Dados de Contato:</strong> Endereço de e-mail.</li>
              <li><strong>Perfil de Relacionamento:</strong> Como você se identifica com a ONG (Voluntário, Doador, Empresa ou Comunidade).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
              2. Para que usamos os seus dados?
            </Typography>
            <Typography variant="body" className="leading-relaxed">
              Utilizamos os seus dados com a finalidade exclusiva de manter nosso relacionamento com você. Isso inclui:
            </Typography>
            <ul className="ml-6 list-disc space-y-2 text-base leading-relaxed [font-family:var(--font-body)] md:text-lg">
              <li>Enviar a nossa newsletter com novidades, histórias de impacto e resultados dos nossos projetos.</li>
              <li>Comunicar sobre eventos, campanhas de doação ou oportunidades de voluntariado.</li>
              <li>Entender melhor o perfil da nossa comunidade para direcionar conteúdos mais relevantes.</li>
            </ul>
            <Typography variant="body" className="leading-relaxed mt-2 italic text-gray-600">
              A base legal que utilizamos para este tratamento é o seu <strong>Consentimento</strong>, fornecido no momento da inscrição.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
              3. Com quem compartilhamos os seus dados?
            </Typography>
            <Typography variant="body" className="leading-relaxed">
              A Coque Connecta <strong>não vende, aluga ou repassa</strong> seus dados pessoais para terceiros para fins publicitários ou comerciais. 
              Nós apenas compartilhamos dados com provedores de tecnologia estritamente necessários para o funcionamento do nosso site e envios de e-mail 
              (como a infraestrutura em nuvem do Google/Firebase), que atuam sob rígidas normas de segurança e confidencialidade.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
              4. Como protegemos as suas informações?
            </Typography>
            <Typography variant="body" className="leading-relaxed">
              Armazenamos seus dados em servidores seguros, adotando medidas técnicas e administrativas para protegê-los 
              contra acessos não autorizados, perdas ou alterações. O acesso ao banco de dados é restrito apenas a membros 
              autorizados da equipe da Coque Connecta.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
              5. Quais são os seus direitos?
            </Typography>
            <Typography variant="body" className="leading-relaxed">
              A LGPD garante a você total controle sobre os seus dados. A qualquer momento, você pode nos solicitar:
            </Typography>
            <ul className="ml-6 list-disc space-y-2 text-base leading-relaxed [font-family:var(--font-body)] md:text-lg">
              <li>A confirmação de que tratamos seus dados e o acesso a eles.</li>
              <li>A correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>A <strong>eliminação (exclusão)</strong> total dos seus dados da nossa base.</li>
              <li>A revogação do consentimento (parar de receber nossos e-mails).</li>
            </ul>
            <Typography variant="body" className="leading-relaxed mt-4 font-semibold">
              Como exercer seus direitos?
            </Typography>
            <Typography variant="body" className="leading-relaxed">
              Basta responder a qualquer e-mail nosso com a palavra <strong>"REMOVER"</strong>, ou enviar um e-mail diretamente para a nossa equipe em: 
              <a href="mailto:privacidade@coqueconnecta.ong.br" className="ml-1 text-[#f58634] underline hover:text-[#c73c00]">
                privacidade@coqueconnecta.ong.br
              </a>. Atenderemos à sua solicitação o mais rápido possível e de forma totalmente gratuita.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography variant="h2" className="text-2xl font-bold text-[#f58634]">
              6. Alterações nesta Política
            </Typography>
            <Typography variant="body" className="leading-relaxed">
              Como a ONG e a tecnologia estão sempre evoluindo, podemos atualizar esta política periodicamente. 
              Sempre que houver alguma alteração significativa, informaremos você através do e-mail cadastrado ou 
              destacaremos a mudança em nosso site.
            </Typography>
          </section>

        </div>
      </Block>
    </main>
  );
}
