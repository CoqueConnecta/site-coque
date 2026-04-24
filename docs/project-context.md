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
- páginas públicas: Home, Nossos Projetos, Privacidade e Transparência.

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
- `/nossos-projetos` -> página de projetos

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
- `cms/v2/projects/pt`
- `cms/v2/projects/en`
- `cms/v2/projects/global` para campos compartilhados de projetos

exemplo JSON:

```JSON
{
  "global": {
    "projects": [
      {
        "id": "projeto-01",
        "image": "/placeholder-image.jpg",
        "location": "Coque, Recife"
      }
    ]
  },
  "pt": {
    "projects": [
      {
        "id": "projeto-01",
        "title": "Alfabetização de Adultos",
        "bodyMd": "Descrição do projeto em **Markdown**..."
      }
    ]
  },
  "en": {
    "projects": [
      {
        "id": "projeto-01",
        "title": "Literacy Program",
        "bodyMd": "Description of the project in **Markdown**..."
      }
    ]
  }
}
```

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
- Nossos Projetos
- Privacy
- Transparency

Base técnica do admin:

- `src/pages/AdminPage.tsx` — orquestra a rota ativa delegando para o componente de rota correto
- `src/features/admin/config/adminRoutes.ts` — declaração de rotas e seções do painel
- `src/features/admin/config/rtdbRouting.ts` — mapa declarativo de estratégias de persistência por `sectionKey`
- `src/features/admin/hooks/useAdminRoute.tsx` — motor de salvamento; constrói payload e chama Firebase `update`
- `src/features/admin/hooks/useAdminData.ts` — carrega e mescla dados de múltiplas coleções RTDB
- `src/features/admin/hooks/useDirtyFields.ts` — rastreamento de campos alterados
- `src/features/admin/routes/` — organização por rota pública (`home/`, `projects/`, `privacy/`, `transparency/`)
- `src/features/admin/shared/` — componentes de formulário reutilizáveis (`ImageField`, `AdminEditorCard`, etc.)
- `src/features/admin/layout/` — casca do painel (`AdminLayout`, `AdminPageHeader`)

Comportamento atual do admin:

- navegação principal por página pública;
- desktop com sidebar fixa;
- mobile com overlay/drawer;
- PT/EN lado a lado no desktop;
- PT/EN em abas no mobile;
- salvar e descartar por rota inteira;
- dirty tracking por campo, com persistência parcial no RTDB.
- na Home, `Carrossel` e `YouTube Videos` são seções separadas no painel (sem aba interna "Mídia").
- na rota de Privacidade, cada seção aceita conteúdo rico em Markdown no campo `bodyMd`, com renderização segura no público e compatibilidade legada com `paragraphs`/`bullets`.
- na rota de Transparência, o conteúdo também migrou para `sections` com `bodyMd` (mesma convenção da Privacidade), com compatibilidade de leitura para payload legado `body[]`.

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
    composites/      # ProjectCard, ProjectGrid, etc.
    icons/
    sections/        # Seções públicas (Hero, About, etc.)
    ui/              # Átomos: Button, FadeIn, Modal, etc.
  data/
  features/
    admin/
      config/        # adminRoutes.ts, rtdbRouting.ts
      hooks/         # useAdminRoute, useAdminData, useDirtyFields
      layout/        # AdminLayout, AdminPageHeader
      routes/        # Pastas por rota pública do admin
        home/
          editors/   # HeroEditor, CarouselEditor, YoutubeEditor, etc.
        projects/
          editors/   # ProjectsEditor
        privacy/
        transparency/
      shared/        # Componentes de formulário reutilizáveis
      types.ts
      utils/
  hooks/             # useCmsLandingData, useCmsProjectsData
  pages/
  services/
  types/
docs/
  project-context.md
  backlog.md
  walkthrough.md
  archive/
firebase.ts
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

- A base atual já opera com CMS v2 e idioma persistido no front público.
- Novas decisões devem evitar reintroduzir dependência de contexto histórico espalhado em múltiplos markdowns.
- Scripts de migração via terminal foram removidos da superfície ativa do projeto; o fluxo preferencial para migrações continua sendo a UI autenticada do admin.
- Backlog detalhado em `docs/backlog.md`.

## Lições Aprendidas: Extensão do Admin e Integrações (CMS v2)

Durante a integração da funcionalidade "Nossos Projetos" (que exigia gravar e ler de uma coleção RTDB separada `cms/v2/projects`, em oposição ao padrão `cms/v2/landing`), consolidadaram-se cinco padrões arquiteturais críticos que devem ser seguidos em futuras evoluções:

### 1. Adicionando seções apontando para novas coleções RTDB
Não limite o hook de dados a um único endpoint. Quando uma nova seção exigir uma nova árvore no Firebase:
- **Fetch Concorrente:** Atualize `useAdminData.ts` para disparar `Promise.all` em ambas as coleções (`landing` e a nova).
- **Merge no Estado:** Incorpore os dados da nova coleção nas árvores unificadas `pt` e `en` na memória do formulário (`cmsData`). O formulário do React não precisa saber que a origem dos dados são duas coleções diferentes.
- **Save Particionado via Dicionário Declarativo:** O arquivo `useAdminRoute.tsx` não contém lógicas acopladas (`ifs` manuais). O roteamento é estritamente definido no arquivo de configuração `rtdbRouting.ts`. Para adicionar um novo módulo que salve em uma coleção distinta, basta adicionar a `sectionKey` e sua respectiva estratégia de persistência (como `split-array` ou `standard-local`) no mapa `RTDB_MAPPINGS`. O hook montará o payload com o caminho RTDB correto de forma autônoma.

### 2. Escalando o ImagePicker para novas seções
A biblioteca de imagens local usa um modal global (`ImageLibraryModal`). Para que ela funcione nativamente com novos componentes e seções recém-criadas, o gerenciador de estado (`useImagePicker.ts`) deve obrigatoriamente armazenar a `sectionKey` no momento da abertura do modal. 
- Anteriormente, o picker tentava adivinhar a seção baseando-se em variáveis de aba ativa (o que falha em rotas independentes).
- A regra de ouro é: Ao acionar `openImagePicker(sectionKey, language, path, label)`, assegure-se de que o estado guarde quem pediu a imagem para poder injetar a resposta no campo correto com exatidão, sem vazamento de estado.

### 3. Padrão "Painel Global Único" para arrays multilíngues
Ao criar listas (arrays) onde os itens possuem campos globais (ex: Imagem, ID) e campos localizados (PT e EN), **nunca renderize duas abas separadas (PT e EN) que gerenciem a estrutura do array independentemente**. Isso causa descompasso: o usuário adiciona um item em PT e esquece do EN, corrompendo a contagem e causando bugs de dados incompletos.
- **A Solução:** Crie um **Painel Global Unificado** (`ProjectsGlobalPanel`).
- Itere sobre a lista de um idioma principal (ex: `cmsData.pt.projects`) para ditar a estrutura e a quantidade de cartões.
- Quando o usuário clicar em "Adicionar" ou "Remover", o componente deve disparar as ações para `pt` e `en` _simultaneamente_.
- Renderize os campos globais apenas uma vez no card. Qualquer mudança neles dispara atualizações para os arrays em memória de `pt` e `en`.
- Logo abaixo, renderize os inputs localizados (ex: Título PT vs Título EN) lado a lado, direcionando cada mudança para sua respectiva linguagem no array. Isso garante sincronia estrutural absoluta com uma experiência de uso excepcional.

### 4. Sanitização de payload antes do Firebase `update` (ancestor path conflict)
O Firebase RTDB lança `validateFirebaseMergePaths` se o payload passado ao `update()` contiver ao mesmo tempo um caminho pai e um caminho filho (ex: `/projects` e `/projects/8/actionLabel`). Isso ocorre tipicamente ao adicionar um novo item a um array: o item inteiro e os campos individualmente ficam ambos como "dirty".
- **A Solução (já implementada em `useAdminRoute.tsx`):** Antes de chamar `update`, ordene as chaves do payload e filtre quaisquer chaves que sejam descendentes de outra chave já presente no payload. O caminho pai engloba o filho; mantenha somente o pai.
- **Regra:** Sempre que o hook montar um payload que possa incluir uma lista inteira e campos individuais dessa lista, aplique esse filtro.

### 5. Grid assimétrico com paginação coerente (layout `2+3`)
Ao implementar layouts onde a primeira linha tem N colunas e as seguintes têm M colunas, a lógica de paginação inicial e de carregamento incremental deve respeitar essa assimetria.
- **Regra atual (ProjectsPage):** `INITIAL_ITEMS = 5` (preenche a primeira linha com 2 e a segunda com 3) e `LOAD_MORE_ITEMS = 3` (carrega sempre em múltiplos de 3 para manter o grid inferior alinhado).
- Qualquer alteração no número de colunas de qualquer grid deve revisitar essas constantes para evitar linhas incompletas ou espaços em branco indesejados.
- Os dois grupos de projetos são renderizados em `<ProjectGrid>` separados com classes distintas (`grid-cols-2` e `lg:grid-cols-3`).