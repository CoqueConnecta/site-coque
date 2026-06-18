# Copilot Instructions - Site Coque Connecta

Objetivo: reduzir falhas por excesso de contexto e manter continuidade entre sessoes.

## Regras de contexto

- Priorizar respostas curtas e operacionais quando o usuario enviar anexos grandes.
- Nao repetir blocos longos de historico ja confirmados; usar somente delta.
- Quando houver HTML/CSS/JSON muito grande, resumir em ate 10 bullets tecnicos e seguir com execucao.
- Se a entrada for extensa demais, pedir para salvar o dump em arquivo local e referenciar apenas caminho + linhas necessarias.
- Evitar colar conteudo integral de DevTools no chat; extrair apenas:
  - seletor principal
  - cores
  - dimensoes
  - regras de layout essenciais

## Regras de branches

- Nunca commitar diretamente em `main` — a branch e protegida no GitHub.
- Fluxo obrigatorio: criar branch `feature/*` a partir de `main`, abrir PR → `staging`, depois PR → `main`.
- Sempre verificar em qual branch esta antes de commitar: `git branch`.

## Regras de continuidade

- Antes de editar, ler `docs/project-context.md` e `refactor-context.md` e produzir um plano curto.
- `docs/project-context.md` e a fonte principal de verdade tecnica do projeto e deve refletir o estado atual da base.
- Depois de mudancas relevantes:
  - atualizar `docs/project-context.md` se a mudanca alterar arquitetura, fluxo, stack, rotas, convencoes ou comportamento estrutural
  - atualizar `refactor-context.md` com o delta recente e o proximo passo objetivo
- Em casos de risco de perda de contexto, registrar resumo tecnico em no maximo 20 linhas.

## Regras de execucao

- Validar com lint/build apenas quando houver mudanca de codigo.
- Nao alterar arquivos fora do escopo solicitado.
- Se houver erro de requisicao por tamanho (ex.: 413), continuar com plano minimo sem repetir anexos grandes.
