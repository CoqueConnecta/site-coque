# Site Coque Connecta

Repositório do site institucional da ONG Coque Connecta.

## Links

- Produção: [https://coqueconnecta.ong.br/](https://coqueconnecta.ong.br/)
- Staging: [https://site-coque-staging.onrender.com/](https://site-coque-staging.onrender.com/)

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
- `npm run deploy:staging -- <branch>` -> merge local em `staging` e push opcional para o Render
- `npm run storybook` -> ambiente Storybook
- `npm run build-storybook` -> build do Storybook

## Execução local

Com Node.js 22 instalado:

```bash
npm install
npm run dev
```

## Deploy

### Staging

O projeto está conectado ao Render através da branch `staging`. Novos commits nessa branch disparam deploy automático.

Fluxo recomendado:

```bash
npm run deploy:staging -- novo-site-coque
```

O script:

- valida se a working tree está limpa;
- atualiza `staging` com `origin/staging`;
- faz merge da branch informada em `staging`;
- pede confirmação antes do push.

### Produção

1. Garanta que a branch de trabalho esteja no estado correto.
2. Confirme que não há alterações locais indevidas.
3. Rode `npm run deploy`.

O comando faz build local e publica o conteúdo de `dist`.

### Regras do Firebase (Realtime Database)

As regras de segurança estão versionadas em [`database.rules.json`](./database.rules.json).

Após editar o arquivo, publique com:

```bash
firebase deploy --only database --account gildorama@gmail.com
```

> O projeto pertence à conta `coqueconnecta@gmail.com`, mas `gildorama@gmail.com` foi adicionado como Editor. Use sempre a flag `--account` para evitar conflito com outros projetos.
