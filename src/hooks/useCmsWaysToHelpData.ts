import { useEffect, useState } from 'react';
import type { CmsLanguage, ResolvedWaysToHelpData } from '../types/cms';
import { getCmsWaysToHelpData } from '../services/cmsService';

const EMPTY: ResolvedWaysToHelpData = { headline: '', subtitle: '', cards: [] };
const inMemoryCache: Partial<Record<CmsLanguage, ResolvedWaysToHelpData>> = {};

export function useCmsWaysToHelpData(language: CmsLanguage) {
  const [data, setData] = useState<ResolvedWaysToHelpData>(inMemoryCache[language] ?? EMPTY);
  const [isLoading, setIsLoading] = useState(!inMemoryCache[language]);

  useEffect(() => {
    let isMounted = true;

    if (inMemoryCache[language]) {
      setData(inMemoryCache[language]!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getCmsWaysToHelpData(language).then((resolved) => {
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
