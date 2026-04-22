import { useEffect, useState } from 'react';
import { getCmsProjectsData } from '../services/cmsService';
import type { CmsProjectsData, CmsLanguage } from '../types/cms';

const inMemoryCache: Partial<Record<CmsLanguage, CmsProjectsData>> = {};

function getStorageKey(language: CmsLanguage) {
  return `cms-v2-projects-${language}`;
}

function getCachedFromStorage(language: CmsLanguage): CmsProjectsData | null {
  try {
    const raw = window.sessionStorage.getItem(getStorageKey(language));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CmsProjectsData;
  } catch {
    return null;
  }
}

function setCache(language: CmsLanguage, data: CmsProjectsData) {
  inMemoryCache[language] = data;
  try {
    window.sessionStorage.setItem(getStorageKey(language), JSON.stringify(data));
  } catch {
    // Ignora erros de armazenamento local
  }
}

export function useCmsProjectsData(language: CmsLanguage) {
  const [data, setData] = useState<CmsProjectsData>(() => {
    return inMemoryCache[language] ?? { projects: [] };
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const cached = inMemoryCache[language] ?? getCachedFromStorage(language);
    if (cached && cached.projects.length > 0) {
      setData(cached);
      setIsLoading(false);
    }

    const loadData = async () => {
      if (!cached || cached.projects.length === 0) {
        setIsLoading(true);
      }
      
      const result = await getCmsProjectsData(language);

      if (!isMounted) {
        return;
      }

      setCache(language, result);
      setData(result);
      setIsLoading(false);

      const alternateLanguage: CmsLanguage = language === 'pt' ? 'en' : 'pt';
      if (!inMemoryCache[alternateLanguage]) {
        getCmsProjectsData(alternateLanguage)
          .then((alternateData) => setCache(alternateLanguage, alternateData))
          .catch(() => {
            // Silently ignore prefetch failure
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
