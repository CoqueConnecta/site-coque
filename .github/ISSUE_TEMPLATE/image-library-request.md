---
name: Solicitar imagem para biblioteca
description: Solicita adicao de nova imagem na biblioteca local usada pelo admin
title: "[Image Library] Adicionar imagem: <nome-da-imagem>"
labels: ["content", "image-library", "admin"]
assignees: []
---

## Objetivo

Adicionar uma nova imagem para uso no CMS/Admin, com metadados completos.

## Branch alvo

- `staging`

## Arquivos esperados

- `public/<nome-do-arquivo>`
- `src/data/localImageLibrary.ts`

## Metadados da imagem

- Nome do arquivo: 
- URL esperada (relativa): 
- ID sugerido: 
- Categoria: `about` | `gallery` | `brand` | `background`
- Title: 
- Alt: 

## Checklist de execução

- [ ] Imagem anexada nesta issue
- [ ] Arquivo adicionado em `public/`
- [ ] Entrada adicionada em `src/data/localImageLibrary.ts`
- [ ] `id` unico validado
- [ ] `category` valida (`about`, `gallery`, `brand`, `background`)
- [ ] `title` e `alt` preenchidos
- [ ] Build local validado (`npm run build`)
- [ ] PR aberto para `staging`

## Anexo da imagem

Anexar aqui a imagem final aprovada (drag and drop do arquivo).

## Observacoes

Campo livre para contexto adicional.
