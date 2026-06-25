# Plano de Refatoração do Admin CMS (Atualizado)

Este plano detalha a reestruturação da área administrativa `/admin` para aumentar a reutilização de código (componentização), centralizar configurações e dados de infraestrutura (constantes), isolar a lógica de negócios da UI (hooks) e preparar a interface para testes automatizados com Playwright utilizando apenas atributos de acessibilidade (`aria-label` e textos de rótulo semânticos).

## User Review Required

> [!NOTE]
> Essa refatoração é estrutural e não altera o comportamento visual ou funcional percebido pelo usuário. O design refinado, paddings e cantos arredondados implementados anteriormente serão 100% mantidos.

> [!IMPORTANT]
> Conforme solicitado, **não utilizaremos `data-testid`**. Em vez disso, focaremos em aplicar rótulos de acessibilidade descritivos via `aria-label` e elementos `<label>` semânticos. Isso servirá tanto para leitores de tela quanto para localizadores robustos do Playwright (ex: `page.getByLabel()`, `page.getByRole()`).

## Open Questions

> [!NOTE]
> Não há impedimentos ou dúvidas em aberto. A seguir, detalhamos o design de cada novo elemento da refatoração.

---

## Proposed Changes

### 1. Configurações e Constantes

#### [NEW] [constants.ts](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/config/constants.ts)
Centralizar strings mágicas e constantes globais de configuração do admin:
- `SUPPORTED_LANGUAGES`: array com os idiomas suportados `['pt', 'en']`
- `LANGUAGE_LABELS`: mapeamento dos títulos descritivos dos idiomas (`Português (PT)`, `Inglês (EN)`)
- `DEFAULT_PLACEHOLDERS`: caminhos padrão de imagens (`/hero-bg.jpg`, `/placeholder-image.png`)

---

### 2. Componentes de Formulário Compartilhados

Todos os componentes de entrada receberão propriedades para configurar rótulos acessíveis (`ariaLabel`), gerando atributos `aria-label` correspondentes no DOM.

#### [NEW] [AdminInputField.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/form/AdminInputField.tsx)
Componente para inputs simples de texto, aplicando classes utilitárias e estados dirty nativos do admin:
- Propriedades de estilo: `isDirty`
- Atributo de acessibilidade: `ariaLabel` (mapeado para `aria-label` no `<input>`)

#### [NEW] [AdminTextareaField.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/form/AdminTextareaField.tsx)
Semelhante ao `AdminInputField`, mas gerando tags `<textarea>`.

#### [NEW] [I18nTextField.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/form/I18nTextField.tsx)
Renderiza inputs de Português e Inglês lado a lado.
- Recebe `label` (ex: "Título") e gera automaticamente `aria-label="Título em português"` e `aria-label="Título em inglês"`.

#### [NEW] [I18nTextareaField.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/form/I18nTextareaField.tsx)
Similar ao `I18nTextField`, renderizando textareas i18n lado a lado com `aria-label` automatizados por idioma.

#### [NEW] [I18nRichTextField.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/form/I18nRichTextField.tsx)
Renderiza editores Tiptap (`RichTextEditor`) lado a lado para PT e EN, contendo `aria-label` descritivos no contêiner ou no editor.

---

### 3. Hooks Customizados

#### [NEW] [useAdminController.ts](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/hooks/useAdminController.ts)
Extrair toda a lógica de estado do arquivo `AdminPage.tsx` para um hook centralizado. Ele encapsula:
- Carregamento de dados (`useAdminData`)
- Controle de campos modificados (`useDirtyFields`)
- Roteamento interno (`useAdminRoute`)
- Upload e seleção de imagens (`useImagePicker`)
- Handlers de CRUD de arrays (`handleAddArrayItem`, `handleRemoveArrayItem`, etc.)
- Retorna o objeto `routeProps` de forma limpa para a view principal.

---

### 4. Refatoração e Acessibilidade nas Páginas do Admin

#### [MODIFY] [AdminPage.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/pages/AdminPage.tsx)
Limpar o componente para utilizar o novo `useAdminController` e delegar as responsabilidades. Sua linha de código reduzirá em ~80%.

#### [MODIFY] [CollapsibleItem.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/shared/CollapsibleItem.tsx)
Garantir que todos os botões de ação do item da lista (mover para cima/baixo, duplicar, remover, expandir/colapsar) tenham um `aria-label` específico incluindo o índice ou o sumário do item (ex: `aria-label={`Mover item ${index + 1} para cima`}`).

#### [MODIFY] [AdminAddButton.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/shared/AdminAddButton.tsx)
Garantir a inclusão do atributo `aria-label` descritivo.

#### [MODIFY] [AdminPageHeader.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/layout/AdminPageHeader.tsx)
Adicionar `aria-label="Salvar alterações da página"` e `aria-label="Descartar alterações da página"`.

#### [MODIFY] [AdminLayout.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/layout/AdminLayout.tsx)
Garantir `aria-label` nos links de rotas e toggle de tema.

#### [MODIFY] [AdminUserMenu.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/components/layout/AdminUserMenu.tsx)
Garantir `aria-label` no botão de usuário e de Logout.

#### [MODIFY] Todos os editores de rota:
- [AboutEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/home/editors/AboutEditor.tsx)
- [CarouselEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/home/editors/CarouselEditor.tsx)
- [GalleryEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/home/editors/GalleryEditor.tsx)
- [HeroEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/home/editors/HeroEditor.tsx)
- [StatsEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/home/editors/StatsEditor.tsx)
- [YoutubeEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/home/editors/YoutubeEditor.tsx)
- [ProjectsEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/projects/editors/ProjectsEditor.tsx)
- [PrivacyEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/privacy/editors/PrivacyEditor.tsx)
- [TransparencyEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/transparency/editors/TransparencyEditor.tsx)
- [FooterEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/settings/editors/FooterEditor.tsx)
- [NavEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/settings/editors/NavEditor.tsx)
- [NewsletterEditor.tsx](file:///Users/gildoneto/workspace/personal/site-coque/src/features/admin/routes/settings/editors/NewsletterEditor.tsx)

Substituir blocos repetitivos pelos novos componentes de formulário compartilhados, passando as configurações de acessibilidade (`ariaLabel`) de forma clara.

---

## Verification Plan

### Automated Tests
- Executar `npm run build` para garantir que toda a tipagem do TypeScript está perfeita e o build do Vite não possui erros de importação/tipos.

### Manual Verification
- Acessar o painel administrativo local.
- Navegar por todas as abas e validar que a pré-visualização, upload de imagens e modificações continuam funcionando normalmente.
- Inspecionar a árvore DOM do navegador para assegurar a presença de tags `aria-label` corretas e acessíveis.
