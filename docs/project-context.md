# Project Context - Site Coque Connecta

Documento canônico do estado técnico atual do projeto.

Objetivo:

- Dar contexto rápido e confiável para qualquer desenvolvedor ou IA.
- Registrar somente o que está vigente na base atual.
- Servir como fonte principal para arquitetura, fluxo de dados, convenções e decisões ativas.

## Como usar

- Ler este arquivo antes de mudanças estruturais, refactors relevantes ou decisões de arquitetura.
- Atualizar este arquivo sempre que o estado atual do projeto mudar de forma relevante.
- Usar `refactor-context.md` apenas como log operacional curto da sprint atual.
- Tratar documentos em `docs/archive/` como material histórico, não como fonte de verdade.

## Visão geral

O projeto é o site institucional da ONG Coque Connecta, com:

- área pública em React + Vite;
- conteúdo gerenciado via Firebase Realtime Database em `cms/v2`;
- painel `/admin` protegido por autenticação Firebase;
- páginas públicas principais para Home, Privacidade e Transparência.

## Stack atual

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS 4
- React Router 7
- Firebase Auth + Realtime Database
- React Hot Toast
- Radix UI (`dialog` e `tabs`) no admin
- Storybook 10 para componentes visuais

Dependências pesadas e não críticas já isoladas:

- `@shadergradient/react`
- `three`
- `@react-three/fiber`
- `three-stdlib`
- `camera-controls`

## Rotas atuais

Rotas públicas:

- `/` -> Home
- `/privacidade` -> página de privacidade
- `/transparencia` -> página de transparência
- `*` -> fallback 404 dentro do layout público

Rotas internas:

- `/login` -> autenticação
- `/admin` -> painel protegido por `ProtectedRoute`

Referência principal de roteamento: `src/App.tsx`.

## Arquitetura pública

O layout público é centralizado em `src/pages/PublicLayout.tsx`.

Responsabilidades do layout público:

- carregar conteúdo via `useCmsLandingData(language)`;
- persistir idioma em `localStorage`;
- montar `HeaderBar`, `MobileMenuOverlay`, `NewsletterSection` e `FooterSection`;
- expor `content`, `language` e `isLoadingContent` para páginas filhas via `Outlet context`.

Home atual:

- `HeroSection`
- `AboutSection`
- `StatsSection`
- `GallerySection`

Newsletter e Footer ficam fora de `Site.tsx` e são compartilhados no layout público.

## Fonte de dados e fallback

Fonte de verdade atual de conteúdo:

- `cms/v2/landing/pt`
- `cms/v2/landing/en`
- `cms/v2/landing/global` para campos compartilhados

Fluxo atual:

1. o front tenta carregar conteúdo remoto via `src/services/cmsService.ts`;
2. o hook `src/hooks/useCmsLandingData.ts` usa cache em memória + `sessionStorage`;
3. se houver erro ou conteúdo incompleto, o projeto cai para `src/data/cmsFallback.ts`.

Decisões vigentes:

- `locales/*` foi descontinuado (removido do RTDB e sem consumo no front);
- `aboutMedia` já opera com suporte a `global`;
- Firebase permanece no caminho crítico da renderização pública.

## Admin / CMS

O admin atual foi reorganizado por rota pública real, não mais por seção solta.

Rotas do admin:

- Home
- Privacy
- Transparency

Base técnica do admin:

- `src/pages/AdminPage.tsx`
- `src/features/admin/config/adminRoutes.ts`
- `src/features/admin/hooks/useAdminRoute.tsx`
- `src/features/admin/hooks/useAdminData.ts`
- `src/features/admin/hooks/useDirtyFields.ts`
- `src/features/admin/components/AdminLayout.tsx`
- `src/features/admin/components/AdminPageHeader.tsx`
- `src/features/admin/components/SectionCard.tsx`

Comportamento atual do admin:

- navegação principal por página pública;
- desktop com sidebar fixa;
- mobile com overlay/drawer;
- PT/EN lado a lado no desktop;
- PT/EN em abas no mobile;
- salvar e descartar por rota inteira;
- dirty tracking por campo, com persistência parcial no RTDB.
- na Home, `Carrossel` e `YouTube Videos` são seções separadas no painel (sem aba interna "Mídia").

Seções globais continuam tratadas como casos especiais onde aplicável.

## Performance já adotada

Decisões ativas já implementadas:

- Hero visual pesado lazy-loaded com fallback estático imediato;
- carregamento do canvas do Hero em idle time;
- `manualChunks` conservador apenas para dependências não críticas;
- Firebase mantido fora desse particionamento para não atrasar conteúdo inicial;
- lazy loading de rotas não críticas (`/login`, `/admin`, `/privacidade`, `/transparencia`, `404`).

Objetivo dessas decisões:

- preservar a primeira renderização pública;
- tirar dependências pesadas do bundle inicial;
- evitar regressão no fetch do conteúdo principal.

## Estrutura relevante de pastas

```txt
src/
  components/
    composites/
    icons/
    sections/
    ui/
  data/
  features/
    admin/
      components/
      config/
      hooks/
      utils/
  hooks/
  pages/
  services/
  types/
docs/
  project-context.md
  archive/
firebase.ts
refactor-context.md
```

## Comandos principais

- `npm run dev` -> desenvolvimento local
- `npm run build` -> build de produção
- `npm run lint` -> lint
- `npm run preview` -> preview local do build
- `npm run deploy:staging -- <branch>` -> merge assistido em `staging` com confirmação antes do push
- `npm run storybook` -> Storybook em desenvolvimento
- `npm run build-storybook` -> build do Storybook

## Convenções do projeto

- Preferir documentação curta e atual, em vez de diários extensos.
- Registrar arquitetura vigente em `docs/project-context.md`.
- Registrar somente delta operacional em `refactor-context.md`.
- Evitar criar novos markdowns na raiz sem necessidade clara.
- Quando um plano deixar de ser ativo, mover para `docs/archive/`.
- Manter mudanças de documentação consistentes com o estado real do código.
- Migrations operacionais de RTDB devem acontecer pelo fluxo autenticado do admin quando esse caminho já existir; evitar scripts de escrita por terminal como caminho padrão.

## Documentação viva

Documentos ativos:

- `docs/project-context.md` -> estado técnico atual e fonte principal
- `docs/backlog.md` -> backlog de features futuras e decisões adiadas
- `refactor-context.md` -> log operacional curto
- `README.md` -> onboarding rápido e comandos

Documentos históricos:

- `docs/archive/*`

Regra prática de atualização:

- mudou a arquitetura, fluxo de dados, stack, roteamento, convenção ou comportamento estrutural -> atualizar `docs/project-context.md`;
- concluiu um bloco de trabalho ou mudou o foco imediato -> atualizar `refactor-context.md`.

## Pendências e atenção atual

- O bootstrap legado de i18n foi desativado no `main.tsx`; a chave RTDB `locales` deixou de ser dependência ativa da aplicação.
- A base atual já opera com CMS v2 e idioma persistido no front público.
- Novas decisões devem evitar reintroduzir dependência de contexto histórico espalhado em múltiplos markdowns.
- Scripts de migração via terminal foram removidos da superfície ativa do projeto; o fluxo preferencial para migrações continua sendo a UI autenticada do admin.
- Backlog detalhado em `docs/backlog.md`.