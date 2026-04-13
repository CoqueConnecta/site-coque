import { useEffect, useState } from 'react';
import { getCmsLandingData } from '../services/cmsService';
import { cmsFallbackByLanguage } from '../data/cmsFallback';
import type { CmsLandingData, CmsLanguage } from '../types/cms';

const inMemoryCache: Partial<Record<CmsLanguage, CmsLandingData>> = {};

function getStorageKey(language: CmsLanguage) {
  return `cms-v2-landing-${language}`;
}

function getCachedFromStorage(language: CmsLanguage): CmsLandingData | null {
  try {
    const raw = window.sessionStorage.getItem(getStorageKey(language));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CmsLandingData;
  } catch {
    return null;
  }
}

function setCache(language: CmsLanguage, data: CmsLandingData) {
  inMemoryCache[language] = data;
  try {
    window.sessionStorage.setItem(getStorageKey(language), JSON.stringify(data));
  } catch {
    // Ignora erros de armazenamento local (quota/permissoes)
  }
}

export function useCmsLandingData(language: CmsLanguage) {
  const [data, setData] = useState<CmsLandingData>(() => {
    return inMemoryCache[language] ?? cmsFallbackByLanguage[language];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const cached = inMemoryCache[language] ?? getCachedFromStorage(language);
    if (cached) {
      setData(cached);
      setIsLoading(false);
    }

    const loadData = async () => {
      if (!cached) {
        setIsLoading(true);
      }
      const result = await getCmsLandingData(language);

      if (!isMounted) {
        return;
      }

      setCache(language, result);
      setData(result);
      setIsLoading(false);

      const alternateLanguage: CmsLanguage = language === 'pt' ? 'en' : 'pt';
      if (!inMemoryCache[alternateLanguage]) {
        getCmsLandingData(alternateLanguage)
          .then((alternateData) => setCache(alternateLanguage, alternateData))
          .catch(() => {
            // Mantem fallback atual se o prefetch falhar
          });
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [language]);

  return { data, isLoading };
}
