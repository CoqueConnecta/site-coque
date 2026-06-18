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

- Site publico em React + Vite deployado na Vercel (substituiu GitHub Pages + Render em jun/2026).
- Conteudo carregado de `cms/v3` no Firebase Realtime Database com fallback local em `src/data/cmsFallback.ts`.
- Imagens armazenadas no Firebase Storage (`images/`); `media/library` no RTDB indexa os metadados.
- `/admin` protegido por Firebase Auth, organizado por rota publica real com save/discard por rota.
- Branch `main` protegida no GitHub: apenas via PR aprovado. Fluxo: `feature/* → staging → main`.

## Delta recente (jun/2026)

- Migracao CMS v2 → v3 concluida; `cms/v2` sem dependencia ativa no front.
- Firebase Storage ativado (plano Blaze); 13 imagens locais migradas para Storage via painel admin.
- Upload de imagens disponivel diretamente no painel: modal de biblioteca le de `media/library` em tempo real.
- Deploy migrado do GitHub Pages (producao) + Render (staging) para Vercel.
- `vercel.json` adicionado com rewrite catch-all para SPA routing (`/admin` sem 404).
- Regras do Firebase versionadas: `database.rules.json` e `storage.rules`, deploy via Firebase CLI.
- Branch `main` protegida no GitHub (requer PR aprovado); branches obsoletas removidas.
- `staging` recriada a partir de `main`; `staging.coqueconnecta.ong.br` configurado na Vercel.
- Script `deploy:staging` removido; workflow passa a ser inteiramente por PRs via GitHub.
- Documentacao sincronizada com estado atual; `docs/backlog.md` e issue template de imagens atualizados.

## Pendencias imediatas

(sem pendencias ativas)

## Proximo passo objetivo

- Iniciar novas features via branches `feature/*` abertas a partir de `main`, com PR → staging → main.
- Manter `docs/project-context.md` como fonte de verdade tecnica apos mudancas estruturais.
