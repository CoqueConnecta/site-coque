import type { AboutData, FooterData, GalleryData, HeroData, NewsletterData, StatsData } from '../data/mockData';

export type CmsLanguage = 'pt' | 'en';

export interface CmsNavLink {
  id: string;
  labels: { pt: string; en: string };
  href: string;
}

export interface CmsNavData {
  links: CmsNavLink[];
  cta: {
    labels: { pt: string; en: string };
    href: string;
  };
}

export interface CmsTickerImage {
  src: string;
  alt?: string;
  title?: string;
}

export interface CmsYoutubeVideo {
  id: string;
  // Legacy support: older payloads may still contain a single title.
  title?: string;
  titles?: {
    pt: string;
    en: string;
  };
}

export interface CmsPrivacySection {
  title: string;
  bodyMd?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface CmsPrivacyData {
  title: string;
  updatedAt: string;
  intro: string;
  sections: CmsPrivacySection[];
}

export interface CmsTransparencyData {
  title: string;
  intro: string;
  sections: CmsPrivacySection[];
  // Legacy support: older payloads may still contain a root body array.
  body?: string[];
}

export interface CmsStatItem {
  value: string;
  labels: { pt: string; en: string };
}

export interface CmsStatsData {
  items: CmsStatItem[];
}

export interface CmsSocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface CmsQuickLink {
  labels: { pt: string; en: string };
  href: string;
}

export interface CmsFooterData {
  copyrights: { pt: string; en: string };
  address: string;
  phone?: string;
  email?: string;
  socialLinks: CmsSocialLink[];
  quickLinks: CmsQuickLink[];
}

export interface CmsLandingData {
  nav: CmsNavData;
  hero: HeroData;
  about: AboutData;
  aboutMedia: {
    tickerImages: CmsTickerImage[];
    youtubeVideos: CmsYoutubeVideo[];
  };
  gallery: GalleryData;
  stats: StatsData;
  newsletter: NewsletterData;
  footer: FooterData;
  privacy: CmsPrivacyData;
  transparency: CmsTransparencyData;
}

export interface CmsLandingGlobalData {
  aboutMedia: {
    tickerImages: CmsTickerImage[];
    youtubeVideos: CmsYoutubeVideo[];
  };
  nav: CmsNavData;
  stats: CmsStatsData;
  footer: CmsFooterData;
}
