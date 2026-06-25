import { useEffect, useState } from 'react';
import type { CmsLanguage, ResolvedPrivacyData } from '../types/cms';
import { getCmsPrivacyData } from '../services/cmsService';

const EMPTY_PRIVACY: ResolvedPrivacyData = { title: '', updatedAt: '', intro: '', sections: [] };

const inMemoryCache: Partial<Record<CmsLanguage, ResolvedPrivacyData>> = {};

export function useCmsPrivacyData(language: CmsLanguage) {
  const [data, setData] = useState<ResolvedPrivacyData>(inMemoryCache[language] ?? EMPTY_PRIVACY);
  const [isLoading, setIsLoading] = useState(!inMemoryCache[language]);

  useEffect(() => {
    let isMounted = true;

    if (inMemoryCache[language]) {
      setData(inMemoryCache[language]!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getCmsPrivacyData(language).then((privacy) => {
      if (!isMounted) return;
      inMemoryCache[language] = privacy;
      setData(privacy);
      setIsLoading(false);
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [language]);

  return { data, isLoading };
}
