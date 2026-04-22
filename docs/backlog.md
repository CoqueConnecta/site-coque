# Backlog - Site Coque Connecta

Backlog de funcionalidades futuras.

Este arquivo concentra ideias e fluxos planejados que ainda nao foram implementados.

## FEATURE PRIORITÁRIA - Nova página /nossos-projetos

### Rotas:
Adicionar /nossos-projetos à lista de rotas públicas.

### Arquitetura de Dados (CMS):
A chave `cms/v2/projects` segue o padrão multi-idioma (pt/en/global).

### Convenção:

Cada item de projeto deve conter: title, location, image (URL do asset local), e bodyMd (para conteúdo rico via MarkdownContent).

### Componentização:

- Criar componente `ProjectGrid` para listagem.
- Criar componente `ProjectCard` como unidade visual.

### Payload Sugerido para o Firebase (JSON)

A estrutura no Realtime Database sob cms/v2/projects deve seguir este padrão

```JSON
{
  "global": {
    "projects": [
      {
        "id": "projeto-01",
        "image": "/placeholder-image.jpg",
        "location": "Coque, Recife"
      }
    ]
  },
  "pt": {
    "projects": [
      {
        "id": "projeto-01",
        "title": "Alfabetização de Adultos",
        "bodyMd": "Descrição do projeto em **Markdown**..."
      }
    ]
  },
  "en": {
    "projects": [
      {
        "id": "projeto-01",
        "title": "Literacy Program",
        "bodyMd": "Description of the project in **Markdown**..."
      }
    ]
  }
}
```

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

## FEATURE FUTURA - Abstração de Roteamento RTDB no Admin

### Contexto
Atualmente, o arquivo `src/features/admin/hooks/useAdminRoute.tsx` (na função `handleSaveRoute`) intercepta manualmente se a seção salva é `projects` ou não usando um bloco `if/else`. Se tivermos que adicionar novas coleções de RTDB no futuro (ex: `events`, `blog`), esse arquivo crescerá desproporcionalmente, tornando o roteamento de salvamento frágil e muito acoplado.

### Plano de Refatoração Proposto
1. **Dicionário de Mapeamento**: Criar um arquivo ou expandir `adminRoutes.ts` para conter metadados declarativos sobre qual caminho base RTDB cada `sectionKey` utiliza. 
   - Exemplo de definição: `projects -> { collectionPath: 'cms/v2/projects', strategy: 'split-language-global' }`.
   - Default fallback: `cms/v2/landing`.
2. **Desacoplamento do hook**: `useAdminRoute.tsx` deve passar a ler esse mapa dinamicamente, gerando o payload (`partialPayload`) calculando a URL final baseado no dicionário, sem ifs hardcoded.
3. Isso garante que a adição de qualquer seção futura seja feita **exclusivamente através de configurações de dados**, sem precisar tocar nas lógicas pesadas de processamento dos hooks.
