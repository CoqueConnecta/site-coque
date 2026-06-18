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

Fluxo:

```bash
# 1. Criar branch a partir de main
git switch -c feature/nome-da-feature

# 2. Trabalhar, commitar normalmente
# 3. Abrir PR → staging no GitHub para validar no preview da Vercel
# 4. Após validação, abrir PR → main
```

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
