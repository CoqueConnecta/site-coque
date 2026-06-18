# Site Coque Connecta

Repositório do site institucional da ONG Coque Connecta.

## Links

- Produção: [https://coqueconnecta.ong.br/](https://coqueconnecta.ong.br/)
- Staging: preview automático da branch `staging` via Vercel

## Documentação principal

- Contexto técnico atual: `docs/project-context.md`
- Log operacional curto: `refactor-context.md`
- Documentos históricos: `docs/archive/`

Se você precisa entender o estado real do projeto antes de editar, comece por `docs/project-context.md`.

## Stack atual

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS 4
- React Router 7
- Firebase Auth + Realtime Database
- Storybook 10

## Comandos principais

- `npm run dev` -> desenvolvimento local
- `npm run build` -> build de produção
- `npm run lint` -> lint
- `npm run preview` -> preview do build
- `npm run storybook` -> ambiente Storybook
- `npm run build-storybook` -> build do Storybook

## Configuração local

Copie o arquivo de exemplo e preencha com as credenciais do projeto Firebase:

```bash
cp .env.example .env.local
```

As credenciais estão em: **Firebase Console → Project Settings → General → Your apps → SDK setup and configuration**

> `.env.local` está no `.gitignore` e nunca deve ser commitado.

## Execução local

Com Node.js 22 instalado:

```bash
npm install
npm run dev
```

## Workflow de branches

- `main` → produção. **Protegida**: apenas via PR aprovado. Nunca commitar diretamente.
- `staging` → homologação. Push gera preview automático na Vercel.
- `feature/*` ou `fix/*` → branches de trabalho, criadas a partir de `main`.

Fluxo completo via CLI:

```bash
# 1. Criar branch a partir de main
git switch -c feature/nome-da-feature

# 2. Trabalhar, commitar normalmente

# 3. Abrir PR → staging
gh pr create --base staging --title "feat: descrição"

# 4. Mergear em staging e deletar a branch (staging não tem proteção)
gh pr merge --squash --delete-branch

# 5. Validar em staging.coqueconnecta.ong.br

# 6. Abrir PR → main (requer aprovação na UI do GitHub)
gh pr create --base main --title "feat: descrição"

# 7. Após aprovação, mergear em main
gh pr merge --squash --delete-branch
```

> `--squash` condensa os commits da branch em um único commit limpo no histórico.
> `--delete-branch` remove a branch local e remota automaticamente após o merge.

## Deploy

O projeto é deployado pela **Vercel** (conta `coqueconnecta@gmail.com`).

- **Staging**: push na branch `staging` → preview automático (URL gerada pela Vercel)
- **Produção**: merge de PR aprovado na `main` → deploy automático em `coqueconnecta.ong.br`

### Regras do Firebase (Realtime Database)

As regras de segurança estão versionadas em [`database.rules.json`](./database.rules.json).

Após editar o arquivo, publique com:

```bash
firebase deploy --only database --account gildorama@gmail.com
```

> O projeto pertence à conta `coqueconnecta@gmail.com`, mas `gildorama@gmail.com` foi adicionado como Editor. Use sempre a flag `--account` para evitar conflito com outros projetos.
