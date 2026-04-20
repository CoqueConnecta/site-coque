# Blueprint — Refactoring Visual/Técnico do Admin

> Documento gerado em: 20/04/2026  
> Branch alvo: `novo-site-coque`  
> Baseado em: respostas de alinhamento do usuário + análise do Music-Ed

---

## 1. Decisões de Design

| Tópico | Decisão |
|---|---|
| Navegação | Rota = página pública real (Home, Privacy, Transparency) |
| V1 rotas | Home, Privacy, Transparency |
| PT/EN desktop | Dois painéis lado a lado (PT esquerda, EN direita) |
| PT/EN mobile | Abas (tab switcher) |
| Salvar | "Salvar tudo da rota" (todos os campos dirty da rota ativa) |
| Drawer | Redesenho completo, sidebar fixa no desktop (modelo Music-Ed) |
| Visual | Réplica próxima ao Music-Ed — indigo/violet, cards, layout limpo |

---

## 2. Mapeamento Rota → Seções CMS

```
Home
  ├── nav          (global — sem PT/EN split)
  ├── hero         (bilíngue)
  ├── about        (bilíngue)
  ├── aboutMedia   (global — carousel e youtube)
  ├── gallery      (bilíngue)
  ├── stats        (global)
  ├── newsletter   (bilíngue)
  └── footer       (global)

Privacy
  └── privacy      (bilíngue — title/intro/sections)

Transparency
  └── transparency (bilíngue — title/intro/body)
```

> **Seções globais** (`nav`, `aboutMedia`, `stats`, `footer`) usam um único painel sem split PT/EN.  
> **Seções bilíngues** mostram dois painéis lado a lado no desktop, aba no mobile.

---

## 3. Visual Shell (inspirado no Music-Ed)

### 3.1 Sidebar (desktop, fixa, w-64)

```
┌─────────────────────────────┐
│  [logo]  Coque Connecta     │  ← px-6 py-6 border-b
│          Admin CMS          │
├─────────────────────────────┤
│                             │
│  🏠  Home          •3      │  ← badge com dirty count
│  🔒  Privacidade           │
│  📋  Transparência          │
│                             │
├─────────────────────────────┤
│  [Sair]                     │  ← border-t, botão logout
└─────────────────────────────┘
```

**Cores (idêntico ao Music-Ed):**
- Fundo sidebar: `bg-white`
- Borda: `border-r border-gray-100`
- Item ativo: `bg-indigo-50 text-indigo-700 shadow-sm rounded-xl`
- Item inativo: `text-gray-600 hover:bg-gray-50 hover:text-gray-900`
- Ícone ativo: `text-indigo-600`
- Ícone inativo: `text-gray-400`
- Logo badge: `bg-gradient-to-br from-indigo-500 to-violet-600`

### 3.2 Mobile Header (sticky, blur)

```
┌──────────────────────────────────────────┐
│ [☰]   [logo]  Coque Connecta   [Salvar] │
└──────────────────────────────────────────┘
```

- `sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100`
- Botão salvar visível no mobile header (replace desktop topbar save)
- Drawer de sobreposição ao clicar em ☰ (idêntico ao Music-Ed mobile overlay)

### 3.3 Mobile Sidebar Overlay

- `fixed inset-0 z-40 lg:hidden`
- Backdrop: `bg-black/20 backdrop-blur-sm`
- Sidebar: `fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl`

### 3.4 Conteúdo Principal

```
div.lg:pl-64
  ├── PageHeader (rota + botão Salvar rota + badge dirty)
  ├── [mobile only] Tabs PT / EN
  └── RouteEditor
       ├── SectionCard (nav)
       ├── SectionCard (hero) ← PT | EN side by side
       └── ...
```

### 3.5 SectionCard

Cada seção é um card expandível:

```
┌─────────────────────────────────────────────┐
│ Hero  ●3 campos alterados          [▼]      │  ← card header, badge, toggle
├─────────────────────────────────────────────┤
│  [PT]                    [EN]               │  ← dois painéis desktop
│  Campo: título           Campo: title       │
│  Campo: subtítulo        Campo: subtitle    │
└─────────────────────────────────────────────┘
```

- Card: `bg-white rounded-2xl shadow-sm border border-gray-100`
- Header: `px-6 py-4 flex items-center justify-between`
- Badge dirty: `bg-orange-100 text-orange-700 text-xs rounded-full px-2 py-0.5`
- Divisão PT/EN: `grid grid-cols-2 gap-6 px-6 pb-6`
- Label coluna: `text-xs uppercase tracking-widest text-gray-400 mb-2`

### 3.6 Page Header (dentro do main)

```
┌──────────────────────────────────────────────────┐
│  Home                                            │
│  Edite o conteúdo da página principal            │
│                              [Descartar] [Salvar]│
└──────────────────────────────────────────────────┘
```

---

## 4. Arquitetura de Componentes

### 4.1 Novos arquivos a criar

```
src/features/admin/
  config/
    adminRoutes.ts          ← registro central de rotas + seções
  components/
    AdminLayout.tsx          ← shell Music-Ed (sidebar + mobile header + overlay)
    AdminPageHeader.tsx      ← header interno da rota (título + save/discard)
    SectionCard.tsx          ← card expansível por seção
    LanguageColumns.tsx      ← wrapper PT|EN side-by-side / mobile tabs
  hooks/
    useAdminRoute.ts         ← rota ativa, seções da rota, save-all-route
```

### 4.2 Arquivos modificados

```
src/pages/AdminPage.tsx      ← usa AdminLayout + useAdminRoute, remove AdminHeader
src/features/admin/components/AdminNavShell.tsx  ← deletar após migração
src/features/admin/hooks/useAdminData.ts         ← adaptar: trocar activeSection por activeRoute
```

### 4.3 Arquivos sem mudança

```
src/features/admin/hooks/useDirtyFields.ts       ← mantém como está
src/features/admin/hooks/useImagePicker.ts       ← mantém como está
src/features/admin/utils/cmsNormalize.ts         ← mantém como está
src/features/admin/components/sections/*.tsx     ← mantém como está
src/features/admin/components/AdminDiscardModal.tsx  ← mantém como está
```

---

## 5. Config Central de Rotas (`adminRoutes.ts`)

```ts
import { Home, Lock, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CmsLandingData } from '../../../types/cms';

export interface AdminSectionConfig {
  key: keyof CmsLandingData;
  label: string;
  isGlobal: boolean; // true = sem split PT/EN
  subSections?: Array<{ key: string; label: string }>; // para aboutMedia
}

export interface AdminRouteConfig {
  id: 'home' | 'privacy' | 'transparency';
  label: string;
  description: string;
  icon: LucideIcon;
  sections: AdminSectionConfig[];
}

export const ADMIN_ROUTES: AdminRouteConfig[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Página principal do site',
    icon: Home,
    sections: [
      { key: 'nav',          label: 'Navegação',    isGlobal: true },
      { key: 'hero',         label: 'Hero',         isGlobal: false },
      { key: 'about',        label: 'Quem Somos',   isGlobal: false },
      { key: 'aboutMedia',   label: 'Mídia',        isGlobal: true,
        subSections: [
          { key: 'carousel',       label: 'Carrossel' },
          { key: 'youtubeVideos',  label: 'YouTube' },
        ],
      },
      { key: 'gallery',     label: 'Galeria',      isGlobal: false },
      { key: 'stats',       label: 'Estatísticas', isGlobal: true },
      { key: 'newsletter',  label: 'Newsletter',   isGlobal: false },
      { key: 'footer',      label: 'Rodapé',       isGlobal: true },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacidade',
    description: 'Política de privacidade',
    icon: Lock,
    sections: [
      { key: 'privacy', label: 'Privacidade', isGlobal: false },
    ],
  },
  {
    id: 'transparency',
    label: 'Transparência',
    description: 'Página de transparência',
    icon: FileText,
    sections: [
      { key: 'transparency', label: 'Transparência', isGlobal: false },
    ],
  },
];
```

---

## 6. Lógica de Salvar (Save All Route)

A função `handleSave` atualizada percorre **todas as seções da rota ativa** e envia um único `update()` para o Firebase com todos os campos dirty.

```
handleSaveRoute(activeRouteId):
  1. Pegar todas as section.key da rota ativa
  2. Para cada section, pegar todos os dirtyFields que começam com `pt.{section}` ou `en.{section}`
  3. Montar partialPayload com todos eles
  4. firebase update(partialPayload)
  5. On success: setOriginalCmsData(cmsData), limpar dirtyFields das seções da rota
```

---

## 7. Hook `useAdminRoute`

```ts
// Responsabilidades:
// - activeRoute (id da rota ativa)
// - setActiveRoute
// - activeSections (seções da rota ativa via ADMIN_ROUTES)
// - routeDirtyCount(routeId): número de campos dirty na rota
// - handleSaveRoute(): salva todos os dirty da rota ativa
// - handleDiscardRoute(): descarta todos os dirty da rota ativa
```

---

## 8. Ordem de Implementação

### Fase 1 — Config e hook de rota
- [ ] Criar `src/features/admin/config/adminRoutes.ts`
- [ ] Criar `src/features/admin/hooks/useAdminRoute.ts`

### Fase 2 — Shell visual (AdminLayout)
- [ ] Criar `src/features/admin/components/AdminLayout.tsx`
  - Sidebar desktop (Music-Ed style)
  - Mobile overlay
  - Mobile sticky header

### Fase 3 — Componentes de conteúdo
- [ ] Criar `src/features/admin/components/AdminPageHeader.tsx`
- [ ] Criar `src/features/admin/components/LanguageColumns.tsx` (PT|EN wrapper)
- [ ] Criar `src/features/admin/components/SectionCard.tsx`

### Fase 4 — Integração em AdminPage
- [ ] Refatorar `src/pages/AdminPage.tsx` para usar AdminLayout + useAdminRoute
- [ ] Adaptar `handleSave` → `handleSaveRoute`
- [ ] Adaptar `handleDiscard` → `handleDiscardRoute`

### Fase 5 — Limpeza
- [ ] Deletar `AdminNavShell.tsx`
- [ ] Remover `activeSection`/`setActiveSection` de `useAdminData.ts` (migrado para useAdminRoute)
- [ ] Commit + push

---

## 9. Cores e Tokens (para manter consistência com Music-Ed)

```
Fundo app:       bg-gray-50/50
Sidebar bg:      bg-white
Border sidebar:  border-r border-gray-100
Ativo nav:       bg-indigo-50 text-indigo-700
Hover nav:       hover:bg-gray-50 hover:text-gray-900
Logo gradient:   from-indigo-500 to-violet-600
Badge dirty:     bg-orange-100 text-orange-700
Botão save:      bg-indigo-600 hover:bg-indigo-700 text-white
Botão discard:   border border-gray-300 text-gray-700 hover:bg-gray-50
Card section:    bg-white rounded-2xl shadow-sm border border-gray-100
```

---

## 10. Perguntas em Aberto (respondidas)

| # | Pergunta | Resposta |
|---|---|---|
| 1 | Quais rotas no menu v1? | Home, Privacy, Transparency |
| 2 | PT/EN layout? | Lado a lado desktop, aba mobile |
| 3 | Granularidade de salvar? | Salvar tudo da rota |
| 4 | Drawer base: manter ou redesenhar? | Redesenho completo |
| 5 | Fidelidade visual? | Réplica próxima ao Music-Ed |

---

## 11. Suposições Técnicas

- `nav` pertence à rota **Home** (é uma seção da página principal)
- Seções globais (`nav`, `stats`, `footer`, `aboutMedia`) não têm split PT/EN — renderizam um único painel com label "Global (ambos os idiomas)"
- `newsletter` pertence à rota **Home**
- Os editores de seção existentes (`HeroEditor`, `NavEditor`, etc.) são **reutilizados sem alteração** — apenas o contexto de layout muda
- A rota `activeRoute` substitui o conceito de `activeSection` como nível de navegação principal; o `activeSection` passa a ser um estado local do SectionCard (collapse/expand)

---

*Atualizar este documento após cada fase concluída.*
