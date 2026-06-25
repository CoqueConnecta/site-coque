# AGENTS.md — site-coque

Instruções para o Codex neste projeto.

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
# Criar branch
git switch -c feature/nome-da-feature

# Abrir PR → staging
gh pr create --base staging --title "feat: descrição"

# Mergear em staging + deletar branch (sem proteção, roda imediatamente)
gh pr merge --squash --delete-branch

# Após validar em staging.coqueconnecta.ong.br, abrir PR → main
gh pr create --base main --title "feat: descrição"

# Após aprovação no GitHub, mergear em main
gh pr merge --squash --delete-branch
```

> `--delete-branch` remove a branch local e remota. `--squash` mantém histórico limpo.

## Skills Firebase instaladas

- `firebase-basics` — setup, CLI e fluxos gerais
- `firebase-auth-basics` — autenticação e regras baseadas em `auth`
- `firebase-security-rules-auditor` — auditoria das regras de segurança

Use `/firebase-security-rules-auditor` sempre que alterar `database.rules.json` para validar a segurança das novas regras antes do deploy.
