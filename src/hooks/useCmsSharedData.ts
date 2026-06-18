import { useEffect, useState } from 'react';
import type { CmsLanguage } from '../types/cms';
import type {
  ResolvedNavData,
  ResolvedFooterData,
  ResolvedNewsletterData,
} from '../types/cms';
import { getCmsNavData, getCmsFooterData, getCmsNewsletterData } from '../services/cmsService';

export interface CmsSharedData {
  nav: ResolvedNavData;
  footer: ResolvedFooterData;
  newsletter: ResolvedNewsletterData;
}

const EMPTY_SHARED: CmsSharedData = {
  nav: { links: [], cta: { href: '', label: '' } },
  footer: { address: '', copyright: '', socialLinks: [], quickLinks: [] },
  newsletter: { headlineAccent: 'Coque Connecta!', headline: '', description: '', buttonText: '', placeholderEmail: 'E-mail' },
};

const inMemoryCache: Partial<Record<CmsLanguage, CmsSharedData>> = {};

export function useCmsSharedData(language: CmsLanguage) {
  const [data, setData] = useState<CmsSharedData>(inMemoryCache[language] ?? EMPTY_SHARED);
  const [isLoading, setIsLoading] = useState(!inMemoryCache[language]);

  useEffect(() => {
    let isMounted = true;

    if (inMemoryCache[language]) {
      setData(inMemoryCache[language]!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    Promise.all([
      getCmsNavData(language),
      getCmsFooterData(language),
      getCmsNewsletterData(language),
    ]).then(([nav, footer, newsletter]) => {
      if (!isMounted) return;
      const resolved: CmsSharedData = { nav, footer, newsletter };
      inMemoryCache[language] = resolved;
      setData(resolved);
      setIsLoading(false);
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [language]);

  return { data, isLoading };
}
