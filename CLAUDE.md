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

## Skills Firebase instaladas

- `firebase-basics` — setup, CLI e fluxos gerais
- `firebase-auth-basics` — autenticação e regras baseadas em `auth`
- `firebase-security-rules-auditor` — auditoria das regras de segurança

Use `/firebase-security-rules-auditor` sempre que alterar `database.rules.json` para validar a segurança das novas regras antes do deploy.
