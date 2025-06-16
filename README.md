# Site Coque Connecta

Este é o repositório da ONG Coque Connecta.

URL de produção: [https://coqueconnecta.ong.br/](https://coqueconnecta.ong.br/)

URL de staging: [https://site-coque-staging.onrender.com/](https://site-coque-staging.onrender.com/)

## Tecnologias

- React 19
- Node 22 LTS Version
- Github Pages
- Render.com [Logar com a conta do github da CoqueConnecta]

## Libs

- i18next -> Internacionalização do projeto

## Como rodar o projeto localmente?

Com o node.js 22 instalado rode o comando: `npm run dev`

## Como deployar o projeto em staging?

O projeto atualmente está conectado ao render.com através da branch `staging`.
A qualquer commit na branch `staging`, a pipeline será acionada automaticamente e atualizará a url: [https://site-coque-staging.onrender.com/](https://site-coque-staging.onrender.com/).

## Como deployar o projeto em produção?

- Commit e push do trabalho na branch `main`
- Certifique-se que a branch esteja clean `git status`
- rode o comando: `npm run deploy`.

Este comando irá buildar o projeto com o código atual salvo na sua máquina, por isso tenha certeza de estar com a branch tree limpa.
