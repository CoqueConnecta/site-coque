# Fase 2 + Fase 4 (parcial) — Hero com carrossel de fotos reais (2 CTAs) + Seção "Confiança"

## Contexto

Fase 1 (rename/desacoplar/reorder das seções da home + DOE mobile) está confirmada concluída nesta branch — código e `docs/walkthrough-fase-1.md` batem com o que foi planejado. Esta é a próxima fatia da reformulação de marketing.

"Fase 0" (captação de assets) está parcialmente pronta: 3 fotos reais já subidas na biblioteca de mídia (categoria "Hero"), 4 links de imprensa reais já levantados (Diário de Pernambuco, post no X de um senador, G1, Alma Preta). Logos de parceiros e selos só chegam semana que vem.

Decisão do usuário: não esperar os assets que faltam — implementar agora a **Fase 2** (Hero com carrossel de fotos + CTA duplo Doar/Faça Parte) **e** adiantar a **Fase 4** (bloco de confiança/prova social) já com o que existe (imprensa), deixando o sub-bloco de logos de parceiros pronto no código mas vazio até a semana que vem (sem deploy extra quando os logos chegarem — só entrar no admin e cadastrar).

Decisões já travadas (perguntadas e confirmadas com o usuário, não rediscutir):
1. Escopo desta rodada = Fase 2 completa + Fase 4 com imprensa (logos como placeholder vazio).
2. Hero: substituir o fundo gerado (ShaderGradient/WebGL) **totalmente** pelo carrossel de fotos reais — sem manter o gradiente como camada.
3. Os 2 CTAs do Hero ("Doar" + "Faça Parte") apontam ambos para `#ways-to-help` por enquanto (não existe rota dedicada ainda — isso é Fase 3, futura).
4. Campo `backgroundImage` do Hero (hoje 100% morto — existe no tipo/editor/Firebase mas nunca é lido por nenhum componente) é removido do código **e** do Firebase. As fotos do Hero entram como array CMS editável no admin (mesmo padrão de add/remover/reordenar/duplicar já usado em `CarouselEditor.tsx`), para poder adicionar fotos a qualquer momento sem deploy.

Tudo verificado lendo o código atual (não é suposição): `backgroundImage` realmente não tem nenhum leitor em `HeroSection.tsx`; o save do admin (`cmsAdminService.ts` → `update(ref(database), payload)`) só escreve os campos *dirty* — ou seja, ao remover o campo do editor, o admin simplesmente para de escrever nele, e o valor antigo fica órfão no Firebase sem precisar de migração expand-contract (diferente da Fase 1, que tinha leitores ativos durante a transição).

## Padrões a reutilizar (já existentes no código, seguir exatamente)

- **Seção CMS completa**: `CmsXData`/`ResolvedXData` em [`src/types/cms.ts`](src/types/cms.ts) → `getCmsXData`/`pickLang` em [`src/services/cmsService.ts`](src/services/cmsService.ts) → agregação em [`src/hooks/useCmsLandingData.ts`](src/hooks/useCmsLandingData.ts) → render em [`src/pages/Site.tsx`](src/pages/Site.tsx).
- **Array editável no admin** (a peça central de ambas as tarefas): [`src/features/admin/routes/home/editors/CarouselEditor.tsx`](src/features/admin/routes/home/editors/CarouselEditor.tsx) — `CollapsibleItem` por item + `renderImageField` para imagem + `AdminInputField` para texto + `AdminAddButton` + os 4 handlers (`onAddArrayItem`/`onRemoveArrayItem`/`onMoveArrayItem`/`onDuplicateArrayItem`, do hook `useArrayFieldActions`, já injetados em todo editor via `AdminPage.tsx`/`HomeRoute.tsx`).
- **Wiring admin de uma seção** (5 camadas, sempre a mesma ordem): [`adminRoutes.ts`](src/features/admin/config/adminRoutes.ts) (chave+label) → [`rtdbRouting.ts`](src/features/admin/config/rtdbRouting.ts) (chave→path Firebase) → [`types.ts`](src/features/admin/types.ts)/[`useAdminData.ts`](src/features/admin/hooks/useAdminData.ts) (carregar node bruto) → [`HomeRoute.tsx`](src/features/admin/routes/home/HomeRoute.tsx) (currying de `sectionKey`) → `editors/XEditor.tsx` (UI). Modelo direto pra seção nova: o bloco `pages.home.waysToHelp` em cada um desses arquivos.
- **Header i18n de seção**: bloco `AdminEditorCard` pt/en em [`WaysToHelpEditor.tsx`](src/features/admin/routes/home/editors/WaysToHelpEditor.tsx).
- **Gradiente de marca já existente** (fallback do Hero sem fotos): a variante `hero` de [`Surface.tsx`](src/components/ui/Surface/Surface.tsx) tem exatamente o gradiente laranja certo (`bg-[radial-gradient(...),linear-gradient(...)]`) — reaproveitar **só o valor CSS** (não o componente `<Surface>`, que força `rounded-xl` e padding, inadequado pra um fundo full-bleed).
- **Botão secundário sobre fundo escuro**: `Button` tem variantes `primary | secondary | ghost | unstyled` ([`Button.tsx`](src/components/ui/Button/Button.tsx)). `ghost` é transparente com texto `--color-text-primary` (pensado pra fundo claro — ficaria ilegível sobre foto+overlay escuro). Usar **`secondary`** pro CTA "Faça Parte" (pill sólido clara com texto escuro — contraste garantido em qualquer fundo).
- Nenhuma lib de carousel/slider está instalada — o carrossel de fotos do Hero é hand-rolled (crossfade via `opacity`/`transition-opacity` + `setInterval`), seguindo o estilo do projeto (`InfiniteImageTicker` também é hand-rolled).

## Tarefa 1 — Hero: carrossel de fotos + 2 CTAs

**Tipos** ([`types/cms.ts`](src/types/cms.ts)): `CmsHeroData`/`ResolvedHeroData` perdem `backgroundImage`, ganham `photos: CmsCarouselImage[]` (reusa o tipo `{src, alt}` já existente, não criar um novo) + `secondaryCtaText: I18nField` + `secondaryCtaHref?: I18nField` (mesmo padrão de opcionalidade do `ctaText`/`ctaHref` atual).

**Carrossel novo** — `src/components/composites/HeroPhotoCarousel/HeroPhotoCarousel.tsx` (+ `index.ts`), ao lado de `InfiniteImageTicker` (é um composite reutilizável, não acoplado à seção):
- Props: `photos: CmsCarouselImage[]`, `intervalMs?: number` (default ~5500ms).
- Todas as fotos renderizadas como `<img>` absolutas (`absolute inset-0`), opacidade trocada por classe (`opacity-100`/`opacity-0` + `transition-opacity`) — evita popular/despopular DOM a cada slide e permite preload de todas de uma vez.
- 0 fotos: não é responsabilidade deste componente — `HeroSection.tsx` decide e usa o fallback de gradiente (ver acima) em vez de montar o carrossel.
- 1 foto: mesmo componente, autoplay nunca dispara (`photos.length > 1` é a condição do `setInterval`) — renderiza estática automaticamente, sem lógica extra.
- `prefers-reduced-motion`: manter o ciclo automático (não é o tipo de movimento contínuo que a media query visa eliminar), mas trocar a transição de fade por corte abrupto (`transition-none`).
- Sem setas/dots — é fundo decorativo, não carrossel de produto. `aria-hidden="true"` no container.
- `loading="eager"` na primeira foto (LCP), `loading="lazy"` nas demais.
- Overlay escuro próprio (`bg-gradient-to-t from-black/60 via-black/20 to-transparent`) entre as fotos e o texto, para legibilidade — substitui o contraste que hoje vem da cor sólida `#ff6a1a`.

**[`HeroSection.tsx`](src/components/sections/HeroSection/HeroSection.tsx)**: remove todo o lazy-load do canvas (`LazyHeroCanvas`/`shouldRenderCanvas`/`requestIdleCallback`) e o `bg-[#ff6a1a]` fixo; renderiza `photos.length > 0 ? <HeroPhotoCarousel photos={data.photos} /> : <div className="absolute inset-0 [gradiente da Surface variant=hero]" />` + overlay + o `<Block>` de texto (mantido). Adiciona o botão secundário "Faça Parte" (`variant="secondary"`) ao lado do CTA primário existente, em container `flex flex-wrap gap-3` (empilha em mobile). Troca o fallback morto `ROUTE_HASHES.contact` por um novo `ROUTE_HASHES.waysToHelp = '#ways-to-help'` em [`lib/constants.ts`](src/lib/constants.ts) — usado pelos dois CTAs (`data.ctaHref ?? ROUTE_HASHES.waysToHelp`). *(`ROUTE_HASHES.contact` continua existindo — ainda é o id real da seção Newsletter, usado por `HeaderBar`/`MobileMenuOverlay`/`PublicLayout`; só o uso morto dentro do Hero é trocado.)*

Deletar `HeroCanvas.tsx`. Remover do `package.json` as 6 dependências exclusivas do shader (confirmado por grep — nenhum outro arquivo as importa): `@shadergradient/react`, `@react-three/fiber`, `@types/three`, `camera-controls`, `three`, `three-stdlib`; remover o bloco `manualChunks`/`vendor-hero-shader` de [`vite.config.ts`](vite.config.ts); rodar `npm install` para atualizar o lockfile.

**Admin** — [`HeroEditor.tsx`](src/features/admin/routes/home/editors/HeroEditor.tsx): remove o campo `backgroundImage`; adiciona bloco de array `photos` (padrão `CarouselEditor.tsx` — `CollapsibleItem` + `renderImageField` + `alt` + `AdminAddButton`); adiciona `ctaHref` (hoje ausente da UI, só existe no tipo) e os 2 campos novos de `secondaryCtaText`/`secondaryCtaHref`, por idioma. [`HomeRoute.tsx`](src/features/admin/routes/home/HomeRoute.tsx): adicionar as 4 props de array no bloco `pages.home.hero` (hoje só tem `isFieldDirty`/`onFieldChange`/`renderImageField` — faltam os 4 handlers, mesmo padrão do bloco `pages.home.carousel`).

**Storybook**: `HeroSection.stories.tsx` hoje depende de `mockDataPT.hero`/`mockDataEN.hero` (shape antigo, com `backgroundImage`). Em vez de editar `mockData.ts` (compartilhado por 7 outras stories, risco desnecessário), inlinar um objeto `ResolvedHeroData` direto no arquivo de stories, no shape novo. Renomear a story `WithoutBackground` → `WithoutPhotos` (testa `photos: []`, valida o fallback de gradiente) e adicionar `WithOnePhoto`.

## Tarefa 2 — Nova seção "Confiança" (`TrustSection`)

id `trust`, label admin "Confiança", chave CMS `pages.home.trust` → `cms/v3/pages/home/trust`. Entra em [`Site.tsx`](src/pages/Site.tsx) logo depois de `<WaysToHelpSection />` (Newsletter/Footer continuam vindo de `PublicLayout.tsx`, fora do `<main>` — não tocar).

**Tipos novos** (`types/cms.ts`):
```
CmsPressItem      { outlet: string; title: string; url: string }   // sem I18nField — manchete real em pt-BR, traduzir desvirtuaria a fonte
CmsPartnerLogo    { src: string; alt: string; url?: string }
CmsTrustData      { headline: I18nField; subtitle: I18nField; pressItems: CmsPressItem[]; partnerLogos: CmsPartnerLogo[] }
ResolvedTrustData { headline: string; subtitle: string; pressItems: CmsPressItem[]; partnerLogos: CmsPartnerLogo[] }
```
O link de Transparência **não** entra no tipo CMS — é fixo (`/transparencia`, já roteada em `App.tsx`), label hardcoded no componente. Ganho de tornar isso CMS-driven é mínimo (rota não muda) frente ao custo de mais um campo i18n por um link estático.

**`src/services/cmsService.ts`**: nova `getCmsTrustData(language)`, modelo direto de `getCmsWaysToHelpData` (header i18n + arrays) — `pressItems`/`partnerLogos` não passam por `pickLang` (já são string pura). Fetch em `${V3}/pages/home/trust`, fallback `{ headline: '', subtitle: '', pressItems: [], partnerLogos: [] }`.

**`useCmsLandingData.ts`**: adicionar `trust: ResolvedTrustData` em `CmsHomeData`, no `Promise.all` e no fallback `EMPTY_HOME`.

**Componente** — `src/components/sections/TrustSection/TrustSection.tsx` (+ `index.ts`):
- Header i18n (`headline`/`subtitle`), mesmo padrão tipográfico de `WaysToHelpSection.tsx` (clamp + `FadeIn`).
- **Imprensa**: grid/lista dos `pressItems` — `outlet` em destaque + `title` (citação factual, só o título) + link externo (`target="_blank" rel="noopener noreferrer"`, ícone `ExternalLink` do `lucide-react`, já usado no projeto). Sem logos dos veículos (são artigos de terceiros, sem direito de uso de marca). Renderiza só se `pressItems.length > 0`.
- **Logos de parceiros**: grid de `partnerLogos`. **Oculta o sub-bloco inteiro se `partnerLogos.length === 0`** — é o estado real até semana que vem; evita uma seção com cara de incompleta em produção. Diferente do Hero (que sempre precisa de *algum* fundo), aqui a seção continua coerente sem esse sub-bloco porque imprensa + transparência já sustentam o conteúdo.
- **Atalho Transparência**: link fixo para `/transparencia`. Texto fixo por idioma — como não é CMS, e nenhuma seção pública hoje recebe `language` como prop direta (tudo já vem resolvido do CMS), `TrustSection` recebe `language` via prop extra só pra esse texto (pego de `useOutletContext` em `Site.tsx`, que já tem o valor) — pequena excepcionalidade documentada com comentário no componente.
- Depoimentos ("em breve"): **fora desta entrega** — não criar nem placeholder, evita retrabalho quando essa fase chegar de verdade.

**Admin** — réplica do wiring de 5 camadas (modelo: bloco `pages.home.waysToHelp` em cada arquivo):
- [`adminRoutes.ts`](src/features/admin/config/adminRoutes.ts): `{ key: 'pages.home.trust', label: 'Confiança' }`.
- [`rtdbRouting.ts`](src/features/admin/config/rtdbRouting.ts): `'pages.home.trust': 'cms/v3/pages/home/trust'`.
- [`types.ts`](src/features/admin/types.ts) + [`useAdminData.ts`](src/features/admin/hooks/useAdminData.ts): `trust: CmsAdminData`.
- [`HomeRoute.tsx`](src/features/admin/routes/home/HomeRoute.tsx): entrada em `SECTIONS` + bloco `key === 'pages.home.trust'` renderizando `TrustEditor` com os 4 handlers de array (2 arrays: `pressItems` e `partnerLogos`) + `renderImageField`.
- `editors/TrustEditor.tsx` (novo): header i18n (modelo `WaysToHelpEditor.tsx`) + bloco array `pressItems` (3 `AdminInputField` simples — `outlet`/`title`/`url`, sem i18n) + bloco array `partnerLogos` (modelo `CarouselEditor.tsx` — `renderImageField` + `alt` + `url` opcional). Preview precisa passar `language={previewLang}` além de `data` (única seção cujo preview depende de mais que `data`, por causa do link fixo de Transparência).

**CSS**: adicionar `#trust` à lista de `scroll-margin-top` em [`src/index.css`](src/index.css:35) (hoje: `#hero, #about, #ways-to-help, #contact, #impact, #videos, #photos`).

## Sequência de execução

1. **Tipos + serviço de dados** — `types/cms.ts`, `cmsService.ts`, `useCmsLandingData.ts` (Hero novo shape + Trust novo). `tsc` vai ficar vermelho até o passo 3 (esperado — Hero/admin antigos ainda referenciam o shape velho).
2. **Hero público** — `ROUTE_HASHES.waysToHelp`, `HeroPhotoCarousel`, `HeroSection.tsx`, deletar `HeroCanvas.tsx`, ajustar stories.
3. **Hero admin** — `HeroEditor.tsx` + wiring em `HomeRoute.tsx`. Checkpoint: `tsc --noEmit` limpo (público + admin do Hero).
4. **Confiança público** — `TrustSection.tsx`, render em `Site.tsx`, `#trust` no `index.css`.
5. **Confiança admin** — as 5 camadas de wiring + `TrustEditor.tsx`. Checkpoint: `tsc --noEmit` + `npm run build` limpos; `npm run dev` e navegar até a Home/admin sem erro de runtime.
6. **Limpeza de dependências** — remover as 6 entradas do `package.json` + bloco `manualChunks` do `vite.config.ts` + `npm install`. Checkpoint final: build limpo e confirmar (no relatório do build) que o chunk `vendor-hero-shader` não existe mais.
7. **GATED (destrutivo, só com confirmação explícita do usuário, depois de tudo acima validado em staging)** — remover o nó órfão `cms/v3/pages/home/hero/backgroundImage` do Firebase via CLI (`--account gildorama@gmail.com`, conforme `CLAUDE.md`). Seguro porque, a essa altura, nenhum código (em nenhum ambiente já promovido) lê ou escreve esse campo.

## Fora de escopo

- Logos de parceiros reais (sub-bloco já existe no código, fica vazio/oculto até a semana que vem — só cadastrar via admin, sem deploy).
- Depoimentos ("em breve").
- Rotas dedicadas "Como Ajudar"/"O que Fazemos" (Fase 3) — por isso os 2 CTAs do Hero apontam pra `#ways-to-help` por enquanto.
- Selos de transparência dedicados (o atalho aponta pra rota `/transparencia` já existente, que já tem seu próprio conteúdo).

## Verificação

**Build**: `npx tsc --noEmit` e `npm run build` limpos; confirmar no output do build que `vendor-hero-shader` não aparece mais como chunk.

**Admin**: no editor Hero, adicionar as 3 fotos reais (biblioteca, categoria "Hero") via seletor de imagem, reordenar, duplicar, remover — preview ao vivo deve refletir em tempo real; preencher `secondaryCtaText`/`secondaryCtaHref`; salvar e recarregar pra confirmar persistência. No editor Confiança, cadastrar os 4 itens reais de imprensa; confirmar que com `partnerLogos` vazio o preview não mostra bloco quebrado; salvar e recarregar.

**Site público**: Hero cicla as 3 fotos (~5-6s, crossfade) com overlay legível; os 2 CTAs rolam até `#ways-to-help`; com `prefers-reduced-motion` emulado, troca de slide é abrupta mas continua ciclando; com 0 fotos (testar esvaziando temporariamente), cai no fallback de gradiente sem erro; com 1 foto, fica estática. Seção Confiança aparece após "Como Ajudar": imprensa com links funcionais, bloco de parceiros ausente (não aparece vazio/quebrado), atalho de Transparência funciona. Mobile (360-390px): Hero com 2 CTAs sem overflow; Confiança em coluna única sem corte de texto.

**Pós-passo gated**: admin Hero sem erro de runtime depois da remoção do `backgroundImage` órfão no Firebase.
