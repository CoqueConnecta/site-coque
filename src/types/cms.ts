import type { AboutData, FooterData, GalleryData, HeroData, NewsletterData, StatsData } from '../data/mockData';

export type CmsLanguage = 'pt' | 'en';

export interface CmsNavLink {
  id: string;
  label: string;
  href: string;
}

export interface CmsNavData {
  links: CmsNavLink[];
  cta: {
    label: string;
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
  title: string;
}

export interface CmsAboutMediaData {
  tickerImages: CmsTickerImage[];
  youtubeVideos: CmsYoutubeVideo[];
}

export interface CmsPrivacySection {
  title: string;
  paragraphs: string[];
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
  body: string[];
}

export interface CmsLandingData {
  nav: CmsNavData;
  hero: HeroData;
  about: AboutData;
  aboutMedia: CmsAboutMediaData;
  gallery: GalleryData;
  stats: StatsData;
  newsletter: NewsletterData;
  footer: FooterData;
  privacy: CmsPrivacyData;
  transparency: CmsTransparencyData;
}
