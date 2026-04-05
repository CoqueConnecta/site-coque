# Refactor Context - Coque Connecta 2.0

Este arquivo registra o contexto vivo da grande refatoracao para evitar perda de informacao entre sessoes.

## Como usar

- Atualizar este arquivo ao fim de cada fase ou bloco relevante.
- Registrar decisoes tecnicas, o que foi concluido e o que falta.
- Manter o roadmap em components-roadmap.md como referencia estrategica.
- Usar este arquivo como diario operacional (estado atual + proximos passos).

## Estado Atual

### Objetivo

Refatorar completamente a landing publica para alta fidelidade desktop ao prototipo Framer, com mobile corrigido como produto.

### Regras-chave

- Storybook com conteudo mockado nesta etapa inicial.
- i18n e Firebase entram apenas no pos-V1.
- Estrutura pragmatica: ui, composites, sections, layouts.

## Progresso por Fase

### Fase 1 - Infra + Storybook + Fundacao de estilo

Status: concluida

Entregas:

- Storybook inicializado e simplificado para foco visual.
- Dependencias de composicao de classes instaladas.
- Tokens e utilitarios globais criados.
- Build e lint validados.

### Fase 2 - UI base

Status: concluida

Entregas:

- Button criado com variantes e stories.
- Typography criada com variantes e stories.
- Input criado com estados e stories.
- Tag criada com variantes e stories.
- Logo criado com variante default/monochrome e stories.
- IconButton criado com tamanhos/variantes e stories.
- SectionContainer criado com controle de largura/espacamento e stories.
- Surface criado com variantes visuais base e stories.
- Warning de CSS import order no Storybook dev resolvido ao mover import de fontes para o topo de src/index.css.

### Fase 3 - Componentes Compostos

Status: concluida

Entregas:

- NavMenu: Componente de navegacao com links, estado ativo e callback de clique.
- HeaderBar: Componente sticky com logo, navegacao desktop, CTA button, e toggle mobile menu.
- MobileMenuOverlay: Overlay full-screen mobile com nav links, CTA button, e secao opcional de newsletter.
- Todas as stories criadas com casos de uso (Default, WithActive, Interactive, FullDemo).
- Validacoes: npm run lint ✅, npm run build ✅ (107 modules), npm run build-storybook ✅ (203 modules).

### Fase 4 - Sections da Landing Page

Status: concluida

Entregas:

- src/data/mockData.ts: Mock consolidado com interfaces tipadas, dados PT/EN e helper getMockData().
- HeroSection: Banner de entrada com headline, subheadline e CTA sobre fundo gradiente orange.
- AboutSection: Quem somos com layout 2 colunas (texto + cards Missao/Visao) + grid de valores.
- GallerySection: Grid 2x2 de projetos com imagem placeholder, tags e hover CTA.
- StatsSection: Faixa laranja com 4 números de impacto em grid.
- HelpSection: CTA centralizado com destaque e botao de acao.
- NewsletterSection: Formulario de email com Surface newsletter e feedback de confirmacao.
- FooterSection: Rodapé 4 colunas (marca, links rapidos, contato, newsletter), bottom bar com copyright.
- Site.tsx refatorado para usar todos os novos componentes com HeaderBar + MobileMenuOverlay integrado.
- Validacoes: npm run lint ✅, npm run build ✅ (129 modules), npm run build-storybook ✅ (todas as stories).

## Decisoes Recentes

- Manter assets do prototipo dentro da pasta framer-coque durante implementacao inicial.
- Evitar reaproveitar HTML exportado do Framer como base estrutural de codigo.
- Usar o prototipo como referencia visual e semantica.
- Imports com caminhos relativos em lugar de aliases @ para melhor compatibilidade com tsc.
- onEmailSubmit em lugar de onSubmit no NewsletterSection (conflito com HTMLAttributes).
- Variante "h4" nao existe no Typography; usar "h3" para headings menores.
- Site.tsx agora usa mockDataPT diretamente (i18n sera integrado pos-V1).

## Backlog Imediato

1. Revisao visual de fidelidade ao prototipo Framer para cada section.
2. Inserir imagens reais de projetos e substituir placeholders.
3. Criar ContactSection nativa (atualmente o footer serve como âncora #contact).
4. Integrar i18n com os mocks PT/EN ja preparados em mockData.ts.
5. Revisao mobile: ajustes responsivos seção a seção.

## Riscos/Atencoes

- Diferencas entre fontes reais do Framer e fallback no navegador podem gerar pequenas variacoes de layout.
- Mobile sera refeito com criterio de produto; nao copiar bugs do prototipo.
- Componentes legados (Banner, Header, WantHelp, etc.) ainda existem mas nao sao mais usados em Site.tsx; remover na fase de limpeza.

## Protocolo Anti-Erro 413 (payload grande)

- Se houver anexos extensos (prints, dumps de DevTools, HTML exportado), nao reenviar tudo no chat.
- Consolidar evidencias em resumo tecnico curto: seletor, cores, dimensoes, posicionamento e diferenca visual.
- Para conteudo grande inevitavel, salvar em arquivo local e compartilhar apenas caminho e trecho necessario.
- Registrar no fim da sessao um handoff de ate 20 linhas com: estado atual, ultima decisao, proximo passo.
- Em caso de falha 413, retomar por plano minimo em 3 passos sem repetir anexos longos.

## Estado Curto da Sprint Atual

- Foco atual: Hero com degradê simples para manter ritmo de entrega.
- Ajuste fino de shader/fidelidade visual fica para etapa posterior.
- Proximo marco: commitar fallback visual e avancar para as proximas secoes.

## Delta Recente

- Ordem da landing ajustada para refletir o prototipo: About vem imediatamente apos o Hero.
- Topo da AboutSection simplificado para bloco branco com o texto "Tudo comecou com uma ideia...".
- Mantida a estrutura restante da About para iteracoes seguintes sem perder conteudo ja construido.
- StatsSection reescrita no estilo Framer: fundo branco, grid 2×2 em desktop, numeros Lato weight-300 72px letter-spacing -0.8px, cor #101014.
- Dados mock atualizados: +2.000 Jovens / +1.000 Familias / +5 Projetos financiados / +5 Territorios transformados.
- GallerySection reescrita como seção "Saiba como Ajudar" (#our-work): 3 cards empilhados, alternancia light/dark (#f9b778 / #f58634), tags escuras #411409, header "Saiba como ajudar".
- Estrutura completa do card: imagem 280x280 border-radius 10px + conteúdo (título/descricao/tags) + blockquote com ícone de aspas, texto lorem ipsum e avatar placeholder circular.
- Imagens reais mapeadas: pessoa-segurando-caixa.jpg / pessoa-recebendo-doacao.jpg / dando-maos-com-luvas.jpg (servidas de /public/).
- GalleryData interface atualizada com campo blockquote opcional (text, authorName, authorAvatar).
- Próximo passo: aprovação visual e commit, depois seguir para as próximas seções.
