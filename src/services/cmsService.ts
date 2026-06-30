import { get, ref } from 'firebase/database';
import { database } from '../../firebase';
import type {
  CmsLanguage,
  I18nField,
  CmsNavData,
  CmsFooterData,
  CmsNewsletterData,
  CmsHeroData,
  CmsAboutData,
  CmsCarouselData,
  CmsYoutubeData,
  CmsWaysToHelpData,
  CmsStatsData,
  CmsTrustData,
  CmsProjectsData,
  CmsPrivacyData,
  CmsTransparencyData,
  ResolvedNavData,
  ResolvedFooterData,
  ResolvedNewsletterData,
  ResolvedHeroData,
  ResolvedAboutData,
  ResolvedWaysToHelpData,
  ResolvedStatsData,
  ResolvedTrustData,
  ResolvedYoutubeVideo,
  ResolvedProject,
  ResolvedPrivacyData,
  ResolvedTransparencyData,
  CmsWhatWeDoData,
  ResolvedWhatWeDoData,
} from '../types/cms';

const V3 = 'cms/v3';

// ─── Core i18n resolver ──────────────────────────────────────────────────────

/**
 * Picks the correct language string from an I18nField.
 * Falls back to 'pt' if the requested language is missing.
 */
export function pickLang(field: I18nField, language: CmsLanguage): string {
  return field?.[language] ?? field?.pt ?? '';
}

// ─── Firebase helpers ─────────────────────────────────────────────────────────

async function fetchNode<T>(path: string): Promise<T | null> {
  try {
    const snapshot = await get(ref(database, path));
    return snapshot.exists() ? (snapshot.val() as T) : null;
  } catch (err) {
    console.error(`[cmsService] Failed to fetch ${path}`, err);
    return null;
  }
}

// ─── Shared data ─────────────────────────────────────────────────────────────

export async function getCmsNavData(language: CmsLanguage): Promise<ResolvedNavData> {
  const data = await fetchNode<CmsNavData>(`${V3}/shared/nav`);
  if (!data) {
    return {
      links: [],
      cta: { href: 'https://benfeitoria.com/projeto/coqueconnecta', label: 'DOE AGORA' },
    };
  }
  return {
    links: (data.links ?? []).map((l) => ({ id: l.id, href: l.href, label: pickLang(l.labels, language) })),
    cta:   { href: data.cta.href, label: pickLang(data.cta.labels, language) },
  };
}

export async function getCmsFooterData(language: CmsLanguage): Promise<ResolvedFooterData> {
  const data = await fetchNode<CmsFooterData>(`${V3}/shared/footer`);
  if (!data) {
    return { address: '', copyright: '', socialLinks: [], quickLinks: [] };
  }
  return {
    address:     data.address,
    phone:       data.phone,
    email:       data.email,
    copyright:   pickLang(data.copyrights, language),
    socialLinks: data.socialLinks ?? [],
    quickLinks:  (data.quickLinks ?? []).map((q) => ({ href: q.href, label: pickLang(q.labels, language) })),
  };
}

export async function getCmsNewsletterData(language: CmsLanguage): Promise<ResolvedNewsletterData> {
  const data = await fetchNode<CmsNewsletterData>(`${V3}/shared/newsletter`);
  if (!data) {
    return { headlineAccent: 'Coque Connecta!', headline: '', description: '', buttonText: '', placeholderEmail: 'E-mail' };
  }
  return {
    headlineAccent:  data.headlineAccent,
    headline:        pickLang(data.headline, language),
    description:     pickLang(data.description, language),
    buttonText:      pickLang(data.buttonText, language),
    placeholderEmail: pickLang(data.placeholderEmail, language),
  };
}

// ─── Home page ────────────────────────────────────────────────────────────────

export async function getCmsHeroData(language: CmsLanguage): Promise<ResolvedHeroData> {
  const data = await fetchNode<CmsHeroData>(`${V3}/pages/home/hero`);
  if (!data) {
    return { photos: [], headline: '', subheadline: '', ctaText: '', secondaryCtaText: '' };
  }
  return {
    photos:             data.photos ?? [],
    headline:           pickLang(data.headline, language),
    subheadline:        pickLang(data.subheadline, language),
    ctaText:            pickLang(data.ctaText, language),
    ctaHref:            data.ctaHref ? pickLang(data.ctaHref, language) : undefined,
    secondaryCtaText:   data.secondaryCtaText ? pickLang(data.secondaryCtaText, language) : '',
    secondaryCtaHref:   data.secondaryCtaHref ? pickLang(data.secondaryCtaHref, language) : undefined,
  };
}

export async function getCmsAboutData(language: CmsLanguage): Promise<ResolvedAboutData> {
  const data = await fetchNode<CmsAboutData>(`${V3}/pages/home/about`);
  if (!data) {
    return {
      description: '',
    };
  }
  return {
    description: pickLang(data.description, language),
  };
}

export async function getCmsCarouselData(): Promise<CmsCarouselData> {
  const data = await fetchNode<CmsCarouselData>(`${V3}/pages/home/carousel`);
  return data ?? { images: [] };
}

export async function getCmsYoutubeData(language: CmsLanguage): Promise<ResolvedYoutubeVideo[]> {
  const data = await fetchNode<CmsYoutubeData>(`${V3}/pages/home/youtubeVideos`);
  if (!data?.items) return [];
  return data.items.map((v) => ({ id: v.id, title: pickLang(v.title, language) }));
}

export async function getCmsWaysToHelpData(language: CmsLanguage): Promise<ResolvedWaysToHelpData> {
  const data = await fetchNode<CmsWaysToHelpData>(`${V3}/pages/home/waysToHelp`);
  if (!data) return { headline: '', subtitle: '', cards: [] };
  return {
    headline: pickLang(data.headline, language),
    subtitle: pickLang(data.subtitle, language),
    cards: (data.cards ?? []).map((card) => ({
      id:          card.id,
      image:       card.image,
      variant:     card.variant,
      title:       pickLang(card.title, language),
      description: pickLang(card.description, language),
      tags:        (card.tags ?? []).map((tag) => tag[language] ?? tag.pt),
      ctaLabel:    card.ctaLabel ? pickLang(card.ctaLabel, language) : undefined,
      ctaHref:     card.ctaHref  ? pickLang(card.ctaHref,  language) : undefined,
      blockquote:  card.blockquote ? {
        text: pickLang(card.blockquote.text, language),
        authorName: card.blockquote.authorName,
        authorAvatar: card.blockquote.authorAvatar,
      } : undefined,
    })),
  };
}

export async function getCmsStatsData(language: CmsLanguage): Promise<ResolvedStatsData> {
  const data = await fetchNode<CmsStatsData>(`${V3}/pages/home/stats`);
  if (!data) return { items: [] };
  return {
    items: (data.items ?? []).map((item) => ({
      value: item.value,
      label: pickLang(item.label, language),
    })),
  };
}

export async function getCmsTrustData(language: CmsLanguage): Promise<ResolvedTrustData> {
  const data = await fetchNode<CmsTrustData>(`${V3}/pages/home/trust`);
  if (!data) return { headline: '', subtitle: '', pressItems: [], partnerLogos: [] };
  return {
    headline:     pickLang(data.headline, language),
    subtitle:     pickLang(data.subtitle, language),
    pressItems:   data.pressItems ?? [],
    partnerLogos: data.partnerLogos ?? [],
  };
}

export async function getCmsWhatWeDoData(language: CmsLanguage): Promise<ResolvedWhatWeDoData> {
  const data = await fetchNode<CmsWhatWeDoData>(`${V3}/pages/home/whatWeDo`);
  if (!data) return { headline: '', subtitle: '' };
  return {
    headline: pickLang(data.headline, language),
    subtitle: pickLang(data.subtitle, language),
  };
}

// ─── Projects page ────────────────────────────────────────────────────────────

export async function getCmsProjectsData(language: CmsLanguage): Promise<ResolvedProject[]> {
  const data = await fetchNode<CmsProjectsData>(`${V3}/pages/projects`);
  if (!data?.items) return [];
  return data.items.map((p) => ({
    id:          p.id,
    image:       p.image,
    location:    p.location,
    actionHref:  p.actionHref,
    title:       pickLang(p.title, language),
    bodyMd:      pickLang(p.bodyMd, language),
    actionLabel: pickLang(p.actionLabel, language),
  }));
}

// ─── Privacy page ─────────────────────────────────────────────────────────────

export async function getCmsPrivacyData(language: CmsLanguage): Promise<ResolvedPrivacyData> {
  const data = await fetchNode<CmsPrivacyData>(`${V3}/pages/privacy`);
  if (!data) return { title: '', updatedAt: '', intro: '', sections: [] };
  return {
    title:     pickLang(data.title, language),
    updatedAt: pickLang(data.updatedAt, language),
    intro:     pickLang(data.intro, language),
    sections:  (data.sections ?? []).map((s) => ({
      title:  pickLang(s.title, language),
      bodyMd: pickLang(s.bodyMd, language),
    })),
  };
}

// ─── Transparency page ────────────────────────────────────────────────────────

export async function getCmsTransparencyData(language: CmsLanguage): Promise<ResolvedTransparencyData> {
  const data = await fetchNode<CmsTransparencyData>(`${V3}/pages/transparency`);
  if (!data) return { title: '', intro: '', sections: [] };
  return {
    title:    pickLang(data.title, language),
    intro:    pickLang(data.intro, language),
    sections: (data.sections ?? []).map((s) => ({
      title:  pickLang(s.title, language),
      bodyMd: pickLang(s.bodyMd, language),
    })),
  };
}
