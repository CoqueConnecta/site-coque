# CLAUDE.md — site-coque

Instruções para o Claude Code neste projeto.

## Contas Firebase

Este projeto usa **duas contas Google**:

- `coqueconnecta@gmail.com` — proprietária do projeto Firebase `site-coque`
- `gildorama@gmail.com` — Editor (conta do desenvolvedor, usada localmente)

Sempre use a flag `--account gildorama@gmail.com` em todos os comandos `firebase` neste projeto.

## Deploy das regras do Firebase

Após editar regras, use o comando correspondente:

```bash
# Realtime Database
firebase deploy --only database --account gildorama@gmail.com

# Firebase Storage
firebase deploy --only storage --account gildorama@gmail.com

# Ambos de uma vez
firebase deploy --only database,storage --account gildorama@gmail.com
```

Nunca edite as regras diretamente pelo console do Firebase — edite os arquivos (`database.rules.json`, `storage.rules`) e faça deploy via CLI para manter o versionamento.

## Deploy (Vercel)

O projeto está na Vercel sob a conta `coqueconnecta@gmail.com`.

- **Produção**: PR aprovado mergeado na `main` → deploy automático em `coqueconnecta.ong.br`
- **Staging**: push na branch `staging` → preview automático (URL gerada pela Vercel)

Não há scripts de deploy locais — tudo é gerenciado por git push.

## Workflow de branches

A branch `main` é protegida: **nunca commitar diretamente**. Sempre usar feature branch + PR.

Fluxo obrigatório:

```
feature/nome-da-feature
    ↓  PR → staging    (validar no preview Vercel)
staging
    ↓  PR → main       (deploy em produção, requer aprovação)
main
```

Comandos CLI completos:

```bash
# Criar branch (sempre a partir de origin/staging para evitar divergência)
git fetch origin
git switch -c feature/nome-da-feature origin/staging

# Abrir PR → staging
gh pr create --base staging --title "feat: descrição"

# Mergear em staging + deletar branch (sem proteção, roda imediatamente)
gh pr merge --squash --delete-branch

# Após validar em staging.coqueconnecta.ong.br, abrir PR → main
gh pr create --base main --title "feat: descrição"

# Após aprovação no GitHub, mergear em main — merge normal, NUNCA squash (ver nota abaixo)
gh pr merge --merge
```

> `--delete-branch` remove a branch local e remota — só faz sentido no merge para `staging` (branch de feature descartável). **Nunca usar `--delete-branch` no merge para `main`**: a branch de origem ali é a própria `staging`, que é permanente.
>
> **Por que `main` usa `--merge` e nunca `--squash`**: squash em `staging → main` cria um commit novo (SHA diferente) com o mesmo conteúdo que já existe na `staging`. Depois da primeira vez, `main` e `staging` deixam de compartilhar um ancestral comum real, e toda promoção seguinte gera conflitos "fantasma" — o Git tenta reaplicar mudanças que já estão lá, mesmo com o conteúdo já sincronizado (foi exatamente o que travou a PR #30 em 2026-06-25). Merge normal preserva a ancestralidade e elimina esse problema de vez. Squash em `feature → staging` continua seguro — a feature branch é descartada, então a quebra de ancestralidade ali não tem efeito.
>
> Se ainda aparecer conflito numa promoção `staging → main` (ex.: resíduo de squash antigo, de antes dessa correção): NÃO resolva direto na PR. Localmente, faça merge da `main` *dentro da* `staging` (`git checkout staging && git merge origin/main`) — não o contrário. Confirme antes com `git diff --stat origin/main origin/staging` que o conteúdo da `staging` já cobre tudo que está na `main` (se cobrir, é seguro manter o lado da `staging` em todo conflito). Resolva cada arquivo com `git checkout --ours <arquivo> && git add <arquivo>`; para `package-lock.json`, não edite os marcadores — delete o arquivo e regenere com `npm install --package-lock-only` depois que `package.json` já estiver resolvido. Dê push na `staging` e a PR fica mergeável.
## Skills Firebase instaladas

- `firebase-basics` — setup, CLI e fluxos gerais
- `firebase-auth-basics` — autenticação e regras baseadas em `auth`
- `firebase-security-rules-auditor` — auditoria das regras de segurança

Use `/firebase-security-rules-auditor` sempre que alterar `database.rules.json` para validar a segurança das novas regras antes do deploy.
