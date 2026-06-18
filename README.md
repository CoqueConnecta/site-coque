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

## Deploy

O projeto é deployado pela **Vercel** (conta `coqueconnecta@gmail.com`).

### Staging

A branch `staging` gera um preview automático na Vercel a cada push.

Fluxo recomendado para atualizar staging:

```bash
git switch staging
git pull --ff-only origin staging
git merge --no-ff <branch>
git push origin staging
# → Vercel gera a preview URL automaticamente
```

### Produção

Push na branch `main` dispara deploy automático em produção (`coqueconnecta.ong.br`).

### Regras do Firebase (Realtime Database)

As regras de segurança estão versionadas em [`database.rules.json`](./database.rules.json).

Após editar o arquivo, publique com:

```bash
firebase deploy --only database --account gildorama@gmail.com
```

> O projeto pertence à conta `coqueconnecta@gmail.com`, mas `gildorama@gmail.com` foi adicionado como Editor. Use sempre a flag `--account` para evitar conflito com outros projetos.
