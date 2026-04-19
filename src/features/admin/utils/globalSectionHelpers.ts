/**
 * Helpers para lidar com conversão entre estruturas por-idioma e globais
 * Facilita uso de editors existentes sem quebras
 */

import type { CmsLandingByLanguage } from '../types';
import type { CmsNavData, CmsStatsData, CmsFooterData } from '../../../types/cms';

/**
 * Converte nav global em estrutura por-idioma para compatibilidade com NavEditor
 */
export function navGlobalToByLanguage(navGlobal: CmsNavData): CmsLandingByLanguage {
  const navByLang = {
    pt: {
      nav: {
        links: navGlobal.links.map((link) => ({
          ...link,
          label: (link.labels as Record<string, string>)['pt'] || (link.labels as Record<string, string>).pt,
        })),
        cta: {
          label: (navGlobal.cta.labels as Record<string, string>)['pt'] || (navGlobal.cta.labels as Record<string, string>).pt,
          href: navGlobal.cta.href,
        },
      },
    },
    en: {
      nav: {
        links: navGlobal.links.map((link) => ({
          ...link,
          label: (link.labels as Record<string, string>)['en'] || (link.labels as Record<string, string>).en,
        })),
        cta: {
          label: (navGlobal.cta.labels as Record<string, string>)['en'] || (navGlobal.cta.labels as Record<string, string>).en,
          href: navGlobal.cta.href,
        },
      },
    },
  };

  return navByLang as unknown as CmsLandingByLanguage;
}

/**
 * Converte edições por-idioma de volta para estrutura global
 */
export function navByLanguageToGlobal(
  navPT: { links: Array<{ id: string; label: string; href: string }>; cta: { label: string; href: string } },
  navEN: { links: Array<{ id: string; label: string; href: string }>; cta: { label: string; href: string } }
): CmsNavData {
  return {
    links: navPT.links.map((link, idx) => ({
      id: link.id,
      labels: {
        pt: link.label,
        en: navEN.links[idx]?.label || link.label,
      },
      href: link.href,
    })),
    cta: {
      labels: {
        pt: navPT.cta.label,
        en: navEN.cta.label,
      },
      href: navPT.cta.href,
    },
  };
}

/**
 * Converte stats global em estrutura por-idioma para compatibilidade com StatEditor
 */
export function statsGlobalToByLanguage(statsGlobal: CmsStatsData): CmsLandingByLanguage {
  const statsByLang = {
    pt: {
      stats: {
        items: statsGlobal.items.map((item) => ({
          value: item.value,
          label: item.labels.pt,
        })),
      },
    },
    en: {
      stats: {
        items: statsGlobal.items.map((item) => ({
          value: item.value,
          label: item.labels.en,
        })),
      },
    },
  };

  return statsByLang as CmsLandingByLanguage;
}

/**
 * Converte edições por-idioma de volta para estrutura global de stats
 */
export function statsByLanguageToGlobal(
  statsPT: { items: Array<{ value: string; label: string }> },
  statsEN: { items: Array<{ value: string; label: string }> }
): CmsStatsData {
  return {
    items: statsPT.items.map((item, idx) => ({
      value: item.value,
      labels: {
        pt: item.label,
        en: statsEN.items[idx]?.label || item.label,
      },
    })),
  };
}

/**
 * Converte footer global em estrutura por-idioma para compatibilidade com FooterEditor
 */
export function footerGlobalToByLanguage(footerGlobal: CmsFooterData): CmsLandingByLanguage {
  const footerByLang = {
    pt: {
      footer: {
        copyright: footerGlobal.copyrights.pt,
        address: footerGlobal.address,
        phone: footerGlobal.phone,
        email: footerGlobal.email,
        socialLinks: footerGlobal.socialLinks,
        quickLinks: footerGlobal.quickLinks.map((link) => ({
          label: link.labels.pt,
          href: link.href,
        })),
      },
    },
    en: {
      footer: {
        copyright: footerGlobal.copyrights.en,
        address: footerGlobal.address,
        phone: footerGlobal.phone,
        email: footerGlobal.email,
        socialLinks: footerGlobal.socialLinks,
        quickLinks: footerGlobal.quickLinks.map((link) => ({
          label: link.labels.en,
          href: link.href,
        })),
      },
    },
  };

  return footerByLang as CmsLandingByLanguage;
}

/**
 * Converte edições por-idioma de volta para estrutura global de footer
 */
export function footerByLanguageToGlobal(
  footerPT: {
    copyright: string;
    address: string;
    phone?: string;
    email?: string;
    socialLinks: Array<{ platform: string; url: string; icon: string }>;
    quickLinks: Array<{ label: string; href: string }>;
  },
  footerEN: {
    copyright: string;
    address: string;
    phone?: string;
    email?: string;
    socialLinks: Array<{ platform: string; url: string; icon: string }>;
    quickLinks: Array<{ label: string; href: string }>;
  }
): CmsFooterData {
  return {
    copyrights: {
      pt: footerPT.copyright,
      en: footerEN.copyright,
    },
    address: footerPT.address,
    phone: footerPT.phone,
    email: footerPT.email,
    socialLinks: footerPT.socialLinks,
    quickLinks: footerPT.quickLinks.map((link, idx) => ({
      labels: {
        pt: link.label,
        en: footerEN.quickLinks[idx]?.label || link.label,
      },
      href: link.href,
    })),
  };
}
