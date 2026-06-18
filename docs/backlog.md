# Backlog - Site Coque Connecta

Backlog de funcionalidades futuras.

Este arquivo concentra ideias e fluxos planejados que ainda nao foram implementados.



## FEATURE DESPRIORIZADA - Biblioteca de imagens no Admin (sem Firebase Storage no plano Spark)

Contexto:

- O projeto nao pode usar Firebase Storage no plano atual (Spark).
- O fluxo de upload de arquivo binario direto pelo admin fica limitado sem backend dedicado.

### Opcao 1 - Fluxo manual assistido por issue (recomendada no curto prazo)

Resumo:

- O admin coleta metadados da imagem (`title`, `alt`, `category`).
- O sistema cria/abre issue no GitHub com instrucoes.
- A imagem e anexada manualmente na issue.
- Depois, a equipe aplica no repositorio:
  - adiciona o arquivo em `public/`
  - adiciona o item em `src/data/localImageLibrary.ts`

Vantagens:

- Sem backend novo.
- Sem token sensivel no frontend.
- Baixo custo operacional.

### Opcao 2 - Issue pre-preenchida via Admin + checklist padrao

Resumo:

- O admin gera issue com payload completo e checklist tecnico.
- O anexo da imagem continua manual na issue.
- A execucao tecnica segue manual (arquivo + `localImageLibrary.ts`).

Vantagens:

- Processo mais guiado para o usuario final.
- Menor risco de esquecer informacoes obrigatorias.
- Ainda sem custo de infraestrutura adicional.

## Template padrao de issue

Template operacional da feature em `.github/ISSUE_TEMPLATE/image-library-request.md`.

Uso:

- Selecionar o template ao abrir issue no repositorio.
- Preencher campos e anexar imagem diretamente na issue.

