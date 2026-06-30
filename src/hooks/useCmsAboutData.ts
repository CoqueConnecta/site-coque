import { useEffect, useState } from 'react';
import type { CmsLanguage, ResolvedAboutData } from '../types/cms';
import { getCmsAboutData } from '../services/cmsService';

const EMPTY: ResolvedAboutData = { description: '' };
const inMemoryCache: Partial<Record<CmsLanguage, ResolvedAboutData>> = {};

export function useCmsAboutData(language: CmsLanguage) {
  const [data, setData] = useState<ResolvedAboutData>(inMemoryCache[language] ?? EMPTY);
  const [isLoading, setIsLoading] = useState(!inMemoryCache[language]);

  useEffect(() => {
    let isMounted = true;

    if (inMemoryCache[language]) {
      setData(inMemoryCache[language]!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getCmsAboutData(language).then((resolved) => {
      if (!isMounted) return;
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
