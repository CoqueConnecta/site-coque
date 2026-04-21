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
- Feature futura documentada: biblioteca de imagens no admin sem uso de Storage (plano Spark), com foco nas opcoes 1 e 2 baseadas em issue no GitHub e anexo manual da imagem.
- Backlog movido para arquivo dedicado (`docs/backlog.md`) e template padrao de issue criado em `.github/ISSUE_TEMPLATE/image-library-request.md`.
- Bootstrap legado de i18n desativado no `src/main.tsx` (removido `import './i18n'`), eliminando dependencia ativa de `locales` no RTDB.
- Limpeza completa do legado de i18n: arquivo `src/i18n.ts` removido e `locales` considerado descontinuado no contexto tecnico.
- Evolucao da rota de Privacidade iniciada com plano registrado neste documento antes da implementacao.
- Suporte a conteudo rico em Markdown aplicado em `privacy.sections` via campo `bodyMd`, com renderizacao segura no front.
- Compatibilidade legada mantida: quando `bodyMd` nao existe, o front compoe markdown a partir de `paragraphs` + `bullets`.
- Links no Markdown agora passam por validacao de protocolo (permitidos: `https`, `mailto`, `tel`, alem de caminhos relativos/hash).
- Dependencia `react-markdown` adicionada para renderizacao do conteudo.

## Pendencias imediatas

- Quando houver nova mudanca estrutural, refletir primeiro em `docs/project-context.md`.

## Proximo passo objetivo

- Continuar evolucoes do produto usando `docs/project-context.md` como referencia principal e `refactor-context.md` apenas como acompanhamento curto da sprint.
- Manter novas migracoes ligadas ao fluxo autenticado do admin sempre que esse caminho existir, evitando depender de scripts locais por desenvolvedor.
- Ajustar os registros de privacidade no RTDB gradualmente para usar `bodyMd` como formato preferencial.

## Plano ativo - Privacidade com conteudo rico

Objetivo:

- Permitir conteudo rico na pagina de privacidade consumindo dados do Firebase sem adotar editor complexo agora.

Passos:

- Adicionar suporte a Markdown em `privacy.sections` via campo `bodyMd` (mantendo compatibilidade com `paragraphs` + `bullets`).
- Renderizar Markdown na pagina de privacidade com mapeamento para componentes/estilos atuais.
- Restringir links a protocolos seguros (`https:`, `mailto:`, `tel:`) e bloquear protocolos inseguros.
- Manter fallback atual quando nao houver secoes no CMS.
- Atualizar contexto tecnico em `docs/project-context.md` para registrar a convencao de conteudo da pagina de privacidade.
