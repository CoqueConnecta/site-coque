# Migração RTDB v2 → v3

## Objetivo

Substituir a arquitetura de split por idioma (`landing/pt`, `landing/en`) pelo paradigma de **i18n por campo** (`{ pt: "...", en: "..." }` inline), com separação clara entre `shared/` (componentes globais do site) e `pages/` (conteúdo por página).

---

## O que muda na estrutura do banco

| v2 | v3 |
|---|---|
| `cms/v2/landing/pt/hero` + `cms/v2/landing/en/hero` | `cms/v3/pages/home/hero` com `headline: {pt, en}` |
| `cms/v2/landing/global/nav` + duplicatas em pt/en | `cms/v3/shared/nav` — único nó |
| `cms/v2/landing/global/footer` + duplicatas | `cms/v3/shared/footer` — único nó |
| `cms/v2/landing/pt/newsletter` + en | `cms/v3/shared/newsletter` com campos `{pt, en}` |
| `cms/v2/landing/global/aboutMedia` (carousel + youtube juntos) | `cms/v3/pages/home/carousel` e `cms/v3/pages/home/youtubeVideos` separados |
| `cms/v2/landing/pt/privacy` + en | `cms/v3/pages/privacy` com campos `{pt, en}` |
| `cms/v2/projects/pt` + `global` + `en` (3 nós) | `cms/v3/pages/projects/items` (1 nó, campos globais e `{pt,en}` inline) |

---

## Passo 0 — Importar o JSON no Firebase (você faz isso)

1. Acesse o [Firebase Console](https://console.firebase.google.com) → Realtime Database → **Importar JSON**
2. Use o arquivo gerado: `rtdb_v3_export.json`
3. **Atenção:** a importação **não apaga** o nó `cms/v2` nem `newsletter` nem `admins` — ela apenas adiciona `cms/v3`. O corte limpo do v2 pode ser feito depois, quando o código v3 estiver em produção.

---

## Fase 1 — Tipos TypeScript

#### [MODIFY] `src/types/cms.ts`

Reescrever completamente. A nova convenção é:
- Campos globais (sem tradução): tipo primitivo direto (`string`, `number`)
- Campos localizáveis: tipo `I18nField = { pt: string; en: string }`

```ts
export type CmsLanguage = 'pt' | 'en';
export type I18nField = { pt: string; en: string };

// shared/nav
export interface CmsNavLink { id: string; href: string; labels: I18nField; }
export interface CmsNavData  { links: CmsNavLink[]; cta: { href: string; labels: I18nField }; }

// shared/footer
export interface CmsQuickLink  { href: string; labels: I18nField; }
export interface CmsSocialLink { platform: string; url: string; icon: string; }
export interface CmsFooterData { address: string; phone: string; email: string; copyrights: I18nField; socialLinks: CmsSocialLink[]; quickLinks: CmsQuickLink[]; }

// shared/newsletter
export interface CmsNewsletterData { headlineAccent: string; headline: I18nField; description: I18nField; buttonText: I18nField; placeholderEmail: I18nField; }

// pages/home/hero
export interface CmsHeroData { backgroundImage: string; headline: I18nField; subheadline: I18nField; ctaText: I18nField; }

// pages/home/about (resumido — ver tipos completos no arquivo)
export interface CmsAboutData { headline: I18nField; ... values: { title: I18nField; items: CmsValueItem[] }; }

// pages/home/carousel
export interface CmsCarouselImage { src: string; alt: string; }
export interface CmsCarouselData  { images: CmsCarouselImage[]; }

// pages/home/youtubeVideos
export interface CmsYoutubeVideoV3 { id: string; title: I18nField; }
export interface CmsYoutubeData    { items: CmsYoutubeVideoV3[]; }

// pages/home/gallery
export interface CmsGalleryTag  { pt: string; en: string; }
export interface CmsGalleryCard { id: string; image: string; variant: 'light' | 'dark'; title: I18nField; description: I18nField; tags: CmsGalleryTag[]; }
export interface CmsGalleryData { headline: I18nField; subtitle: I18nField; cards: CmsGalleryCard[]; }

// pages/home/stats
export interface CmsStatItem  { value: string; label: I18nField; }
export interface CmsStatsData { items: CmsStatItem[]; }

// pages/projects
export interface CmsProjectV3 { id: string; image: string; location: string; actionHref: string; title: I18nField; bodyMd: I18nField; actionLabel: I18nField; }
export interface CmsProjectsData { items: CmsProjectV3[]; }

// pages/privacy + transparency
export interface CmsDocSection { title: I18nField; bodyMd: I18nField; }
export interface CmsPrivacyData      { title: I18nField; updatedAt: I18nField; intro: I18nField; sections: CmsDocSection[]; }
export interface CmsTransparencyData { title: I18nField; intro: I18nField; sections: CmsDocSection[]; }
```

---

## Fase 2 — Serviço de dados

#### [MODIFY] `src/services/cmsService.ts`

Introduzir um helper universal `pickLang` e simplificar radicalmente o serviço:

```ts
const V3_BASE = 'cms/v3';

/** Extrai o valor de um campo i18n pelo idioma solicitado */
export function pickLang<T>(field: I18nField | T, language: CmsLanguage): T {
  if (field && typeof field === 'object' && ('pt' in field || 'en' in field)) {
    return ((field as I18nField)[language] ?? (field as I18nField).pt) as T;
  }
  return field as T;
}

/** Aplica pickLang recursivamente em toda a árvore de dados */
export function resolveI18n<T>(data: unknown, language: CmsLanguage): T { ... }

export async function getCmsSharedData(language: CmsLanguage) { ... } // busca shared/nav, shared/footer, shared/newsletter
export async function getCmsHomeData(language: CmsLanguage)   { ... } // busca pages/home/*
export async function getCmsProjectsData(language: CmsLanguage) { ... } // busca pages/projects/items
export async function getCmsPrivacyData(language: CmsLanguage) { ... }
export async function getCmsTransparencyData(language: CmsLanguage) { ... }
```

---

## Fase 3 — Hooks do lado público

#### [MODIFY] `src/hooks/useCmsLandingData.ts`
Reescrever para chamar `getCmsSharedData` + `getCmsHomeData` e retornar estrutura resolvida por idioma.

#### [MODIFY] `src/hooks/useCmsProjectsData.ts`
Reescrever para chamar `getCmsProjectsData` — simples, sem merge de três nós.

#### [NEW] `src/hooks/useCmsSharedData.ts`
Hook dedicado para `nav`, `footer` e `newsletter` — compartilhado entre todas as páginas via `PublicLayout`.

---

## Fase 4 — Admin: tipos, routing e rotas

#### [MODIFY] `src/features/admin/config/adminRoutes.ts`
- Adicionar rota `'settings'` (Configurações Globais) com seções `nav`, `footer`, `newsletter`
- `AdminRouteId` passa a incluir `'settings'`

#### [MODIFY] `src/features/admin/config/rtdbRouting.ts`
- Reescrever todos os `basePath` para apontar para `cms/v3/...`
- Estratégia v3: `standard-i18n-field` (novo tipo) substitui `standard-local` e `standard-global`
- `projects` passa de `split-array` para `single-array` (um único nó, sem split)

#### [MODIFY] `src/features/admin/hooks/useAdminData.ts`
Buscar `cms/v3/shared` e `cms/v3/pages` em `Promise.all`.

#### [MODIFY] `src/features/admin/hooks/useAdminRoute.tsx`
Adaptar `handleSaveRoute` para o novo paradigma — o payload sempre escreve no path do campo diretamente, sem precisar diferenciar "global" vs "local".

#### [NEW] `src/features/admin/routes/settings/`
Nova rota com `SettingsRoute.tsx` + editors: `NavEditor.tsx`, `FooterEditor.tsx`, `NewsletterEditor.tsx`

---

## Fase 5 — Componentes públicos

Os componentes públicos (`HeaderBar`, `FooterSection`, `NewsletterSection`, `HeroSection`, etc.) já recebem dados prontos via props — nenhuma mudança de lógica interna é esperada, apenas os tipos de props se alinham com os novos tipos v3.

---

## Verificação

### Banco de dados
- [ ] `cms/v3/shared/nav` existe e tem `links` + `cta`
- [ ] `cms/v3/shared/footer` existe com `copyrights: {pt, en}`
- [ ] `cms/v3/pages/home/carousel` e `pages/home/youtubeVideos` são nós separados
- [ ] `cms/v3/pages/projects/items` tem campos `title: {pt, en}` inline

### Lado público
- [ ] Home carrega em PT e EN sem erros no console
- [ ] `/nossos-projetos` mostra projetos com títulos corretos por idioma
- [ ] `/privacidade` e `/transparencia` renderizam seções com `bodyMd`
- [ ] Nav e footer aparecem iguais em todas as rotas

### Admin
- [ ] Nova rota "Configurações" aparece na sidebar
- [ ] NavEditor, FooterEditor, NewsletterEditor salvam corretamente
- [ ] ProjectsEditor salva o array unificado sem erro de ancestor path

---

## Ordem de execução recomendada

```
Passo 0 (você) → Fase 1 → Fase 2 → Fase 3 → testes do lado público
→ Fase 4 → Fase 5 → testes do admin → remover cms/v2
```
