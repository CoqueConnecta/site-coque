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
- Footer atualizado com nova regra de navegação: removidos ícones Web/Twitter/YouTube, adicionado LinkedIn; links ajustados para `#about`, `#our-work`, doação externa na Benfeitoria e nova rota interna `/transparencia`; grid de links passou a dividir automaticamente em duas colunas equilibradas.
- Arquitetura pública de rotas consolidada: criado `PublicLayout` com Header + Newsletter + Footer compartilhados para home, privacidade, transparência e fallback 404; links de âncora globais migrados para formato `/#secao` para funcionar fora da home sem quebrar navegação.
- Planejamento da migração de conteúdo para Firebase CMS v2 documentado em `cms-v2-migration-plan.md`, cobrindo fases de contrato de dados, loader com fallback, toggle de idioma (localStorage), evolução do admin lado a lado PT/EN e migração do legado `locales` para `cms/v2`.
- Escopo confirmado para a primeira entrega do CMS v2: páginas de Privacy e Transparency também entram no modelo editável via admin.
- Decisões de produto para CMS v2 confirmadas: mensagens de sucesso/erro da newsletter permanecem no código (fora do CMS nesta fase), header seguirá CMS + fallback para links críticos e o formato atual de `admins` no RTDB é array de `{ email, isAdmin }`.
- Início da implementação do CMS v2 (Fase 1/2): criado contrato tipado (`src/types/cms.ts`), fallback por idioma (`src/data/cmsFallback.ts`), serviço de leitura com merge + fallback (`src/services/cmsService.ts`) e hook de consumo (`src/hooks/useCmsLandingData.ts`).
- `PublicLayout` e `Site` migrados para consumir conteúdo de `cms/v2/landing/{lang}` com fallback local, incluindo persistência de idioma em `localStorage` e injeção de contexto para páginas filhas.
- `AboutSection`/`YouTubeFeed` adaptados para consumir mídia do CMS (`tickerImages` e `youtubeVideos` por `videoId`, com thumbnail derivada automaticamente).
- `PrivacyPage` e `TransparencyPage` já preparados para ler conteúdo de CMS quando houver dados; em ausência de seções no CMS, `PrivacyPage` mantém fallback local completo.
- Toggle visual de idioma implementado no front público (desktop e mobile) via componente `LanguageToggle`, com persistência da escolha em `localStorage`.
- Estratégia de carregamento de conteúdo otimizada em `useCmsLandingData`: cache em memória + `sessionStorage` e prefetch do idioma alternativo para reduzir latência na troca PT/EN.
- Script de seed criado para popular `cms/v2/landing` automaticamente a partir do fallback atual: `scripts/seed-cms-v2.ts` com comandos `npm run seed:cms-v2:dry` e `npm run seed:cms-v2`.
- Estratégia alternativa adicionada para contornar `permission_denied` no seed: exportação de JSON para importação manual no Firebase Console via `npm run export:cms-v2:json` (arquivos em `arquivos_exemplo/`).
- Migração da rota `/admin` iniciada para o novo CMS: `AdminPage` agora lê/salva `cms/v2/landing` (PT/EN lado a lado por seção), com fallback estrutural e edição em JSON por seção; botão temporário de seed foi removido após import manual no Firebase.
- Início da melhoria de UX do admin para público não técnico: seção `hero` migrada de edição JSON para formulário guiado com campos por idioma (headline, subheadline, ctaText e backgroundImage).
- Estratégia de rollout definida em 2 fases: Fase rápida com formulário para seções prioritárias e Fase completa expandindo para seções com listas/objetos mais complexos, mantendo fallback para modo JSON nas seções ainda não migradas.
- Próximo passo objetivo: migrar a seção `nav` para formulário guiado (links + CTA) e adicionar ações de "restaurar fallback" e "descartar alterações" por seção.
- Admin evoluído para formulário dinâmico nas demais seções: além do `hero` customizado, todas as seções agora são editáveis por campos (objetos, listas e textos) sem exigir edição direta de JSON.
- O editor dinâmico suporta adicionar/remover itens de listas e atualizar campos aninhados preservando a estrutura do `cms/v2/landing` no save.
- Build validado com sucesso após a refatoração completa do AdminPage.
- Etapa premium iniciada: seções `nav` e `gallery` ganharam formulários dedicados com rótulos guiados e controles específicos por domínio (CTA/menu para nav e cards/tags/depoimentos para gallery).
- `gallery` premium inclui CRUD de cards, CRUD de tags por card, toggle de blockquote com preenchimento inicial via fallback e controle de variante visual (`light`/`dark`).
- Build validado com sucesso após a inclusão dos editores premium.
- Fase 1 de mídia implementada no `/admin`: upload de imagens para Firebase Storage + catálogo em `media/library` no RTDB.
- Upload agora aceita metadados opcionais de `title` e `alt` no momento do cadastro da imagem; estes dados ficam salvos na biblioteca para reuso.
- Biblioteca com busca e seleção foi integrada aos campos de imagem (hero, gallery e demais campos de imagem detectados no editor dinâmico), incluindo prévia e opção de aplicar `title/alt` automaticamente em objetos compatíveis.
- Exemplo de regras RTDB atualizado em `arquivos_exemplo/settings_realtime_database.txt` para incluir acesso autenticado a `media/library`.
- Estratégia de mídia revista para manter custo zero: removida a dependência prática de upload/Storage e a biblioteca do admin agora usa um catálogo local de imagens versionadas em `public/`.
- Criado manifesto local `src/data/localImageLibrary.ts` com `url`, `title`, `alt` e `category` para cada asset selecionável no admin.
- Modal de imagem do `/admin` agora atua como biblioteca local com busca e aplicação de metadados (`title`/`alt`) quando o objeto de destino suporta esses campos.
- Biblioteca local evoluída com taxonomia explícita de categorias (`all`, `gallery`, `brand`, `background`) para escalar a curadoria de assets.
- Modal do admin agora possui filtros visuais por categoria, badge de categoria por asset e estado vazio quando a busca/filtro não encontra resultados.
- Próximo passo natural: mapear novas fotos externas por URL, baixá-las para `public/` e cadastrar os itens correspondentes em `src/data/localImageLibrary.ts`.
- Migração das imagens remotas do ticker da About concluída: URLs do `framerusercontent` foram substituídas por arquivos locais em `public/`.
- Sequência local aplicada no projeto: `mulheres-costurando.jpg`, `mulheres-recortando-tecido.jpg`, `mulher-ensinando-estudante.jpg`, `mulheres-estudando.jpg`, `crianca-lavando-as-maos.jpg`, `jovens-no-auditorio.jpg`.
- Catálogo local expandido com categoria `about` para facilitar seleção dessas fotos na biblioteca do admin.
- Limpeza adicional concluída: arquivos de exemplo de import (`arquivos_exemplo/cms-v2-landing-import.json` e `arquivos_exemplo/cms-v2-root-import.json`) também foram atualizados para usar os caminhos locais das novas imagens.
- Scripts legados de bootstrap/manual import do CMS v2 removidos: `scripts/seed-cms-v2.ts` e `scripts/export-cms-v2-json.ts`, junto dos comandos associados no `package.json`.
- Iniciada componentização do admin (Fase 1) sem mudança de comportamento: helpers de edição por path/merge foram extraídos para `src/features/admin/utils/editorPath.ts`.
- Modal da biblioteca de imagens extraído para `src/features/admin/components/ImageLibraryModal.tsx` e campo de imagem reutilizável extraído para `src/features/admin/components/ImageField.tsx`.
- Admin agora possui baseline de dados carregados (`get`) para comparar alterações por campo e manter trilha `dirty` por path.
- Indicador visual de campo alterado implementado nos editores `hero`, `nav`, `gallery`, editor dinâmico e campo de imagem (borda âmbar em campos modificados).
- Estratégia de persistência alterada no `/admin`: botão salva somente a seção ativa com `update` parcial no Realtime Database (sem `set` completo de `cms/v2/landing`).
- Payload parcial é montado a partir dos caminhos sujos da seção ativa (`pt` e `en`), incluindo suporte a remoção de valor com `null` quando necessário.
- Header do admin agora exibe contador de alterações pendentes na seção ativa e o botão foi renomeado para "Salvar seção ativa".
- Build validado com sucesso após a mudança de persistência parcial e indicadores de alteração (`npm run build` ✅).
- Fluxo de descarte da seção ativa agora exige confirmação em modal "Tem certeza?", evitando perda acidental de edições antes do reset para o baseline.
- `AdminPage.tsx` agora atua mais como orquestrador de estado e fluxo, com redução de responsabilidade de UI inline.
- Fase 2 concluída: editores premium extraídos para componentes dedicados em `src/features/admin/components/sections/` (`HeroEditor.tsx`, `NavEditor.tsx`, `GalleryEditor.tsx`).
- Tipos compartilhados de domínio do admin centralizados em `src/features/admin/types.ts` para reduzir duplicação entre page e componentes.
- `AdminPage.tsx` simplificado para orquestrar estado/callbacks e delegar renderização de seções premium aos novos componentes.
- Fase 3 concluída: editor genérico dinâmico também foi extraído para `src/features/admin/components/sections/DynamicSectionEditor.tsx`.
- `AdminPage.tsx` passou a delegar tanto seções premium quanto seção genérica para componentes dedicados, reduzindo acoplamento e melhorando manutenção.
- Refactor mobile do `/admin` iniciado e concluído em primeira etapa: navegação lateral desktop foi complementada com painel móvel de seções (drawer/sheet) para reduzir fricção em telas pequenas.
- Edição PT/EN no mobile ganhou abas (Português/Inglês), com abertura padrão em Português ao trocar de seção, mantendo o layout lado a lado no desktop.
- Barra de ações mobile adicionada no rodapé fixo com "Descartar" e "Salvar seção", preservando o save parcial por seção ativa e os fluxos de confirmação já existentes.
- Header mobile foi simplificado com acesso rápido a seções e saída, além de badge de alterações pendentes por seção na lista mobile/desktop.
- Dependências adicionadas para padrão de UI inspirado no Music-Ed: `@radix-ui/react-dialog` e `@radix-ui/react-tabs`.
- Próximo passo objetivo (pós-refactor mobile atual): planejar modelo de campos globais independentes de idioma (ex.: mídia compartilhada PT/EN) para reduzir duplicidade operacional no admin.
- Refinamento mobile dos editores concluído: redução de densidade visual (padding/gaps), tipografia de títulos ajustada e ações de listas com melhor quebra/área de toque em `HeroEditor`, `NavEditor`, `GalleryEditor` e `DynamicSectionEditor`.
- `ImageField` ajustado para layout responsivo (input + botão empilhados no mobile e em linha no desktop), facilitando uso em telas estreitas.
- Build validado após refinamentos mobile dos editores (`npm run build` ✅).
- Fase 1 de campos globais iniciada: `aboutMedia` agora pode ser lido/escrito em `cms/v2/landing/global/aboutMedia` com retrocompatibilidade para estrutura antiga por idioma.
- Front público foi adaptado para priorizar `global/aboutMedia` no loader, mantendo fallback por idioma quando o nó global não existir.
- Admin foi adaptado para tratar `aboutMedia` como seção global: edições sincronizam PT/EN no estado e o save da seção escreve no caminho global.
- Build validado após a migração compatível de `aboutMedia` para global (`npm run build` ✅).
- `StatsEditor` e `FooterEditor` criados e conectados no `AdminPage`, substituindo o uso do `DynamicSectionEditor` nessas seções para uma UX dedicada.
- Fluxo de migração RTDB adicionado no próprio `/admin` via botão `Migrar campos globais`, aproveitando autenticação da sessão admin para evitar `permission_denied` de scripts externos.
- Tentativa de migração via script Node local retornou `PERMISSION_DENIED` no RTDB; estratégia alterada para migração autenticada no painel.
- Build validado após inclusão dos novos editores e da ação de migração autenticada (`npm run build` ✅).
- Migração executada com sucesso pelo painel admin e botão temporário de migração removido em seguida para manter a interface limpa.
- AboutMedia refatorado no admin com editor dedicado (`AboutMediaEditor`), separando claramente os blocos de `Ticker Images` e `YouTube Videos` para reduzir confusão operacional.
- AboutMedia ajustado para painel único `Global` (sem coluna EN duplicada), e no mobile as abas PT/EN ficam ocultas apenas nessa seção.
- Fluxo editorial de mídia refinado: no admin, `aboutMedia` foi dividido em duas entradas de navegação (`Carrossel` e `YouTube Videos`) para reduzir ambiguidade operacional sem quebrar retrocompatibilidade de schema.
- Vídeos do YouTube agora suportam títulos localizados via `titles.pt` e `titles.en`, mantendo retrocompatibilidade com payload legado (`title` único).
- Front passa a resolver título do vídeo conforme idioma ativo e o loader normaliza automaticamente vídeos legados para o formato com `titles`.
- Script opcional de migração RTDB criado para persistir a normalização de vídeos legados (`title` -> `titles.pt/en`) nos caminhos global e legados por idioma.
- Dry-run validado: 7 itens encontrados e 7 itens planejados para migração (`global/aboutMedia/youtubeVideos`: 3, `pt/aboutMedia/youtubeVideos`: 2, `en/aboutMedia/youtubeVideos`: 2).
- Fluxo de save do `/admin` reforçado para normalizar `aboutMedia.youtubeVideos` no momento da gravação global: ao salvar, vídeos legados passam a persistir no formato novo (`titles.pt/en`) sem depender de escrita via terminal.
