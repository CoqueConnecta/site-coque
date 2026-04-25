// ─── Core i18n primitive ──────────────────────────────────────────────────────

export type CmsLanguage = 'pt' | 'en';

/** A translatable field. Every localised string in v3 uses this shape. */
export type I18nField = { pt: string; en: string };

// ─── Shared — nav ─────────────────────────────────────────────────────────────

export interface CmsNavLink {
  id: string;
  href: string;
  labels: I18nField;
}

export interface CmsNavData {
  links: CmsNavLink[];
  cta: { href: string; labels: I18nField };
}

// ─── Shared — footer ──────────────────────────────────────────────────────────

export interface CmsSocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface CmsQuickLink {
  href: string;
  labels: I18nField;
}

export interface CmsFooterData {
  address: string;
  phone?: string;
  email?: string;
  copyrights: I18nField;
  socialLinks: CmsSocialLink[];
  quickLinks: CmsQuickLink[];
}

// ─── Shared — newsletter ──────────────────────────────────────────────────────

export interface CmsNewsletterData {
  headlineAccent: string;
  headline: I18nField;
  description: I18nField;
  buttonText: I18nField;
  placeholderEmail: I18nField;
}

// ─── pages/home ───────────────────────────────────────────────────────────────

export interface CmsHeroData {
  backgroundImage: string;
  headline: I18nField;
  subheadline: I18nField;
  ctaText: I18nField;
}

export interface CmsValueItem {
  id: string;
  label: I18nField;
  description: I18nField;
}

export interface CmsAboutData {
  headline: I18nField;
  subheadline: I18nField;
  description: I18nField;
  subdescription: I18nField;
  mission: { title: I18nField; description: I18nField };
  vision:  { title: I18nField; description: I18nField };
  values:  { title: I18nField; items: CmsValueItem[] };
}

export interface CmsCarouselImage {
  src: string;
  alt: string;
}

export interface CmsCarouselData {
  images: CmsCarouselImage[];
}

export interface CmsYoutubeVideo {
  id: string;
  title: I18nField;
}

export interface CmsYoutubeData {
  items: CmsYoutubeVideo[];
}

export interface CmsGalleryTag {
  pt: string;
  en: string;
}

export interface CmsGalleryCard {
  id: string;
  image?: string;
  variant: 'light' | 'dark';
  title: I18nField;
  description: I18nField;
  tags: CmsGalleryTag[];
}

export interface CmsGalleryData {
  headline: I18nField;
  subtitle: I18nField;
  cards: CmsGalleryCard[];
}

export interface CmsStatItem {
  value: string;
  label: I18nField;
}

export interface CmsStatsData {
  items: CmsStatItem[];
}

// ─── pages/projects ───────────────────────────────────────────────────────────

export interface CmsProject {
  id: string;
  image: string;
  location: string;
  actionHref?: string;
  title: I18nField;
  bodyMd: I18nField;
  actionLabel: I18nField;
}

export interface CmsProjectsData {
  items: CmsProject[];
}

// ─── pages/privacy + transparency ─────────────────────────────────────────────

export interface CmsDocSection {
  title: I18nField;
  bodyMd: I18nField;
}

export interface CmsPrivacyData {
  title: I18nField;
  updatedAt: I18nField;
  intro: I18nField;
  sections: CmsDocSection[];
}

export interface CmsTransparencyData {
  title: I18nField;
  intro: I18nField;
  sections: CmsDocSection[];
}

// ─── Resolved (language-specific) types used by public components ─────────────
// These are what the public UI receives — all I18nFields already resolved to strings.

export interface ResolvedNavLink   { id: string; href: string; label: string }
export interface ResolvedNavData   { links: ResolvedNavLink[]; cta: { href: string; label: string } }
export interface ResolvedQuickLink { href: string; label: string }
export interface ResolvedFooterData {
  address: string; phone?: string; email?: string;
  copyright: string;
  socialLinks: CmsSocialLink[];
  quickLinks: ResolvedQuickLink[];
}
export interface ResolvedNewsletterData {
  headlineAccent: string;
  headline: string; description: string; buttonText: string; placeholderEmail: string;
}
export interface ResolvedHeroData    { backgroundImage: string; headline: string; subheadline: string; ctaText: string }
export interface ResolvedAboutData   {
  headline: string; subheadline: string; description: string; subdescription: string;
  mission: { title: string; description: string };
  vision:  { title: string; description: string };
  values:  { title: string; items: Array<{ id: string; label: string; description: string }> };
}
export interface ResolvedGalleryCard { id: string; image?: string; variant: 'light'|'dark'; title: string; description: string; tags: string[] }
export interface ResolvedGalleryData { headline: string; subtitle: string; cards: ResolvedGalleryCard[] }
export interface ResolvedStatItem    { value: string; label: string }
export interface ResolvedStatsData   { items: ResolvedStatItem[] }
export interface ResolvedYoutubeVideo { id: string; title: string }
export interface ResolvedProject {
  id: string; image: string; location: string; actionHref?: string;
  title: string; bodyMd: string; actionLabel: string;
}
export interface ResolvedPrivacyData { title: string; updatedAt: string; intro: string; sections: Array<{ title: string; bodyMd: string }> }
export interface ResolvedTransparencyData { title: string; intro: string; sections: Array<{ title: string; bodyMd: string }> }
