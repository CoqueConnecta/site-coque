import { useEffect, useState } from 'react';
import type { CmsLanguage, ResolvedProject } from '../types/cms';
import { getCmsProjectsData } from '../services/cmsService';

const inMemoryCache: Partial<Record<CmsLanguage, ResolvedProject[]>> = {};

export function useCmsProjectsData(language: CmsLanguage) {
  const [data, setData] = useState<ResolvedProject[]>(inMemoryCache[language] ?? []);
  const [isLoading, setIsLoading] = useState(!inMemoryCache[language]);

  useEffect(() => {
    let isMounted = true;

    if (inMemoryCache[language]) {
      setData(inMemoryCache[language]!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getCmsProjectsData(language).then((projects) => {
      if (!isMounted) return;
      inMemoryCache[language] = projects;
      setData(projects);
      setIsLoading(false);
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [language]);

  return { data, isLoading };
}
