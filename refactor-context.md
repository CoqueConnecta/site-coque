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
- Comentarios no codigo devem ser escritos em portugues brasileiro.

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
- NewsletterSection reescrita para maior fidelidade ao Framer: card centralizado com cantos arredondados, fundo com textura da marca (`/public/background-coque-laranja.png`), heading em duas linhas, texto central e divisória antes do formulário.
- Form da newsletter ajustado para proporções do protótipo: input pill + botão pill com paleta #fafafa / #f9b778 / #792b15.
- Âncora `#contact` reposicionada para a NewsletterSection (footer não carrega mais o id).
- Commit/push realizado para versão inicial da newsletter: `30197c5`.
- FooterSection refeito para o layout Framer: bloco laranja com `rounded-t-[10px]`, logo no canto esquerdo, ícones sociais em círculos escuros, links em duas colunas e faixa inferior com divisor e copyright.
- Conteúdo do footer atualizado no mockData (PT/EN): e-mail, telefone, links e ano de copyright alinhados ao protótipo.
- Criado logotipo SVG reutilizável para uso global: `/public/coque-logotipo.svg` e versão clara `/public/coque-logotipo-light.svg`; `Logo.tsx` atualizado para suportar variantes `default`, `monochrome`, `footerLight` e `icon`.
- SVGs ajustados para os originais do protótipo enviados pelo time: `SocialIcon` agora usa os paths reais de Instagram, YouTube, Twitter e Web; dimensões nativas dos ícones preservadas no footer.
- Ajuste adicional solicitado: ícone de Web trocado para o novo SVG circular (18x18) e ícone de YouTube atualizado para o novo SVG (18x13), mantendo sequência do protótipo: Instagram, Web, Twitter, YouTube.
- Links sociais do footer ajustados para o padrão visual do protótipo: cada ícone agora renderiza dentro de círculo 32x32 com fundo escuro semitransparente e hover levemente mais intenso.
- Ajuste fino de opacidade aplicado nos círculos sociais para aproximar ainda mais do Framer: estado base `bg-black/15` e hover `bg-black/25`.
- Seção "Quer ajudar" removida do fluxo da landing para alinhar ao protótipo atual; navegação/CTAs de "Faça Parte" e "DOE AGORA" redirecionados para `#contact`.
- Wrapper externo da NewsletterSection ajustado para fundo branco (`#fff`), removendo o aspecto cinza ao redor do card laranja.
- Assets de marca substituídos pelo logo vetorial original completo em `/public/coque-logotipo.svg` e `/public/coque-logotipo-light.svg` para evitar simplificações visuais divergentes.
- Próximo passo: ajuste fino pixel-perfect de espaçamentos/tipografia do footer e validação visual desktop/mobile.
- Limpeza de componentes legados realizada: removidos `Banner/`, `Contacts/`, `Header/`, `LanguageToggle/`, `MissionVisionValues/`, `Projects/`, `WantHelp/`, `WhoWeAre/` de `src/components/`. Estes eram da versão anterior (sem Storybook) e não estavam sendo importados em lugar nenhum.
- Mantido: `ProtectedRoute/` (ainda importado em `App.tsx` para proteção de rotas admin), `ui/`, `composites/`, `sections/` (estrutura nova).
- HeaderBar ajustado para fidelidade ao protótipo: não fica mais fixo por padrão (prop `isFixed` opcional), permanece transparente sem trocar de cor no scroll, logo colorida no estado transparente.
- Header e HeroSection agora compartilham o mesmo fundo: o gradiente foi movido para um wrapper pai em `Site.tsx` que envolve ambos; `HeroSection` não aplica mais background próprio.
- Botão "DOE AGORA" alinhado ao protótipo: fundo `#fafafa`, texto `#f58634`, `backdrop-blur-[10px]`, `border-radius: 50px`, padding simétrico `px-5` para centralização correta do texto.
- Decisão de abordagem: não é necessário replicar 100% o código de estilos do Framer (ex.: classes proprietárias, tokens CSS do Framer). Usar Tailwind de forma simples e direta é preferível, desde que o resultado visual final seja equivalente ao protótipo.
- Header ajustado para alinhamento vertical mais consistente no desktop: logo e bloco de navegação/CTA centralizados no eixo Y dentro do container, com `Logo` em `display: block` para evitar desalinhamento óptico.
- AboutSection: texto introdutório ajustado para escala mais próxima do protótipo (desktop em torno de 22px).
- Carrossel da About refatorado para componente reutilizável `InfiniteImageTicker` em `src/components/composites/InfiniteImageTicker/InfiniteImageTicker.tsx`.
- `TickerItem` foi extraído para dentro do componente reutilizável, reduzindo complexidade do `AboutSection` e facilitando reuso em outras seções.
- Storybook adicionado para o novo componente: `InfiniteImageTicker.stories.tsx` com cenários `Default` e `InsideWhiteSection`.
- Animação global `animate-marquee` mantida em `src/index.css` nesta etapa para preservar simplicidade e continuidade da implementação.
- Commit/push realizado para a refatoração do About + ticker reutilizável: `32ba41a`.
- StatsSection ajustada para mobile em coluna única (`grid-cols-1`), mantendo 2 colunas em `sm` e 4 colunas em `lg`.
- Tipografia de Stats refinada com escala responsiva: valores em Lato (até 72px no desktop) e labels em 20px no desktop.
- Correção de fonte em Tailwind: substituído uso incorreto de `font-[var(--font-support)]` por `[font-family:var(--font-support)]` no value.
- Label da Stats com fonte explícita para evitar herança indesejada: `[font-family:var(--font-body)]`.
- Header da Gallery alinhado ao protótipo: título com DM Sans até 50px e subtítulo com DM Sans até 20px na cor #3d3d47.
- GalleryCard extraído para arquivo dedicado em `src/components/sections/GallerySection/GalleryCard.tsx`, mantendo renderização atual com props de estilo e conteúdo.
- Storybook do card criado em `GalleryCard.stories.tsx` com cenários: Light, Dark, WithoutBlockquote e WithAuthorAvatar.
- GalleryCard refinado visualmente com foco em tipografia, espaçamento interno e responsividade (stack no mobile, lado a lado no desktop).
- Padronização de container lateral aplicada em About, Stats, Gallery, Newsletter e Footer com base comum `max-w-[1440px] px-4 sm:px-6 lg:px-10`.
- Espaçamentos verticais entre Gallery, Newsletter e Footer reduzidos; footer ajustado com `pb-0` para eliminar faixa branca na base desktop.
- NavMenu refinado para o estilo do protótipo: itens em DM Sans 18px, tracking mais fechado, espaçamento entre links ajustado e estado ativo simplificado no header sobre fundo laranja.
- Commits realizados nesta etapa: `27d3958`, `37fe96a` e `40fa848`.
- Próximo passo (sessão seguinte): integrar conteúdo via API/Firebase (substituir mocks por requisição) e adicionar ação no topo para alternância de idioma PT/EN.
- Organização de SVGs iniciada com pasta única `src/components/icons/` para reduzir ícones inline espalhados.
- `CoqueConnectaWordmark` foi extraído de `HeaderBar` para `src/components/icons/CoqueConnectaWordmark.tsx`.
- Ícones de menu/fechar foram centralizados (`MenuIcon` e `CloseIcon`) e aplicados em `HeaderBar` e `MobileMenuOverlay`.
- Ícones de quote e avatar placeholder do `GalleryCard` foram extraídos para `QuoteIcon` e `UserAvatarPlaceholderIcon`.
- Mantidos fora desta etapa: `SocialIcon` (já centralizado em componente próprio) e SVGs de stories.
- `SocialIcon` migrado para `src/components/icons/SocialIcon.tsx`; `src/components/ui/SocialIcon/SocialIcon.tsx` agora reexporta (compatibilidade retroativa de imports).
- Footer alinhado ao protótipo no desktop: bloco esquerdo (logo/ícones/endereço) mantido à esquerda, bloco de 6 links agrupado em 2 colunas e ancorado ao extremo direito (mantendo text-left), com divisória e copyright alinhados ao mesmo eixo horizontal do container.
- Newsletter e Privacy alinhados ao design system de tipografia: removidas classes de fonte fora do padrão (`Manrope` hardcoded) e adotado `--font-body` nos inputs/select/checkbox/botão e listas com bullet points da Política de Privacidade.
