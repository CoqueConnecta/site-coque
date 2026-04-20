# Refactor Context - Site Coque Connecta

Log operacional curto do estado atual.

Este arquivo nao deve mais concentrar a historia completa do projeto.

Fonte principal de contexto tecnico:

- `docs/project-context.md`

Documentos historicos:

- `docs/archive/`

## Como usar

- Ler este arquivo antes de editar para entender o foco imediato.
- Atualizar este arquivo ao final de cada bloco relevante de trabalho.
- Registrar apenas delta recente, pendencias e proximo passo objetivo.
- Se a mudanca alterar arquitetura, fluxo de dados, stack ou convencoes, atualizar tambem `docs/project-context.md`.

## Estado atual

- Site publico em React + Vite, com rotas para Home, Privacidade e Transparencia.
- Conteudo carregado de `cms/v2` no Firebase com fallback local.
- `/admin` protegido, organizado por rota publica real e com save/discard por rota.
- Hero pesado lazy-loaded; Firebase mantido no caminho critico do conteudo publico.
- Documento canonico de contexto agora centralizado em `docs/project-context.md`.

## Delta recente

- Documentacao reorganizada; `docs/project-context.md` criado como fonte de verdade tecnica.
- Scripts de migracao por terminal removidos; `scripts/deploy-staging.sh` criado e exposto via `npm run deploy:staging -- <branch>`.
- Seletor de idioma do desktop removido da capsula do header.
- Substituido por uma utility top bar de largura total (`bg-[#2e3350]`, `h-8`) que nao faz scroll com a pagina (elemento normal no topo do DOM, antes do HeaderBar).
- Top bar exibe label descritivo + botoes PT / EN; texto do label alterna para o idioma oposto ao ativo (convida o usuario a trocar).
- Menu mobile mantem o toggle de idioma dentro do overlay (sem alteracao).
- Admin Home: secao "Midia" foi desmembrada em duas secoes independentes no painel (`Carrossel` e `YouTube Videos`), removendo as abas internas.
- Tipo agregado `CmsAboutMediaData` removido para reduzir ambiguidade; o shape de `aboutMedia` agora usa diretamente `CmsTickerImage[]` e `CmsYoutubeVideo[]`.
- Admin ganhou componente reutilizavel de sessao do usuario (`AdminUserMenu`) com avatar arredondado (fallback por iniciais), nome, e-mail e menu de acoes; integrado na sidebar desktop e no drawer mobile.

## Pendencias imediatas

- Manter o bloco legado de i18n sem mudancas por enquanto.
- Quando houver nova mudanca estrutural, refletir primeiro em `docs/project-context.md`.

## Proximo passo objetivo

- Continuar evolucoes do produto usando `docs/project-context.md` como referencia principal e `refactor-context.md` apenas como acompanhamento curto da sprint.
- Manter novas migracoes ligadas ao fluxo autenticado do admin sempre que esse caminho existir, evitando depender de scripts locais por desenvolvedor.
