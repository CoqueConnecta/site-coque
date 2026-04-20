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

- A documentacao foi reorganizada para separar contexto vigente de historico.
- Criado `docs/project-context.md` como fonte de verdade tecnica.
- `refactor-context.md` foi reduzido para log operacional curto.
- Scripts de migracao por terminal foram removidos da superficie ativa do projeto.
- Criado `scripts/deploy-staging.sh` e exposto `npm run deploy:staging -- <branch>` para padronizar o fluxo de staging fora de configuracoes locais da shell.

## Pendencias imediatas

- Manter o bloco legado de i18n sem mudancas por enquanto.
- Quando houver nova mudanca estrutural, refletir primeiro em `docs/project-context.md`.

## Proximo passo objetivo

- Continuar evolucoes do produto usando `docs/project-context.md` como referencia principal e `refactor-context.md` apenas como acompanhamento curto da sprint.
- Manter novas migracoes ligadas ao fluxo autenticado do admin sempre que esse caminho existir, evitando depender de scripts locais por desenvolvedor.
