import { useEffect, useState } from 'react';
import type { CmsLanguage, ResolvedTransparencyData } from '../types/cms';
import { getCmsTransparencyData } from '../services/cmsService';

const EMPTY_TRANSPARENCY: ResolvedTransparencyData = { title: '', intro: '', sections: [] };

const inMemoryCache: Partial<Record<CmsLanguage, ResolvedTransparencyData>> = {};

export function useCmsTransparencyData(language: CmsLanguage) {
  const [data, setData] = useState<ResolvedTransparencyData>(inMemoryCache[language] ?? EMPTY_TRANSPARENCY);
  const [isLoading, setIsLoading] = useState(!inMemoryCache[language]);

  useEffect(() => {
    let isMounted = true;

    if (inMemoryCache[language]) {
      setData(inMemoryCache[language]!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getCmsTransparencyData(language).then((transparency) => {
      if (!isMounted) return;
      inMemoryCache[language] = transparency;
      setData(transparency);
      setIsLoading(false);
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [language]);

  return { data, isLoading };
}
