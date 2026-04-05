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

## Regras de continuidade

- Antes de editar, ler o estado atual em refactor-context.md e produzir um plano curto.
- Depois de mudancas relevantes, atualizar refactor-context.md com:
  - o que mudou
  - o que falta
  - proximo passo objetivo
- Em casos de risco de perda de contexto, registrar resumo tecnico em no maximo 20 linhas.

## Regras de execucao

- Validar com lint/build apenas quando houver mudanca de codigo.
- Nao alterar arquivos fora do escopo solicitado.
- Se houver erro de requisicao por tamanho (ex.: 413), continuar com plano minimo sem repetir anexos grandes.
