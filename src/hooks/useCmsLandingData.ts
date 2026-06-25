import { useEffect, useState } from 'react';
import type { CmsLanguage, ResolvedHeroData, ResolvedAboutData, ResolvedGalleryData, ResolvedStatsData, ResolvedYoutubeVideo } from '../types/cms';
import type { CmsCarouselData } from '../types/cms';
import {
  getCmsHeroData,
  getCmsAboutData,
  getCmsCarouselData,
  getCmsYoutubeData,
  getCmsGalleryData,
  getCmsStatsData,
} from '../services/cmsService';

export interface CmsHomeData {
  hero: ResolvedHeroData;
  about: ResolvedAboutData;
  carousel: CmsCarouselData;
  youtubeVideos: ResolvedYoutubeVideo[];
  gallery: ResolvedGalleryData;
  stats: ResolvedStatsData;
}

const EMPTY_HOME: CmsHomeData = {
  hero:          { backgroundImage: '', headline: '', subheadline: '', ctaText: '' },
  about:         { description: '' },
  carousel:      { images: [] },
  youtubeVideos: [],
  gallery:       { headline: '', subtitle: '', cards: [] },
  stats:         { items: [] },
};

const inMemoryCache: Partial<Record<CmsLanguage, CmsHomeData>> = {};

export function useCmsLandingData(language: CmsLanguage) {
  const [data, setData] = useState<CmsHomeData>(inMemoryCache[language] ?? EMPTY_HOME);
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
      getCmsHeroData(language),
      getCmsAboutData(language),
      getCmsCarouselData(),
      getCmsYoutubeData(language),
      getCmsGalleryData(language),
      getCmsStatsData(language),
    ]).then(([hero, about, carousel, youtubeVideos, gallery, stats]) => {
      if (!isMounted) return;
      const resolved: CmsHomeData = { hero, about, carousel, youtubeVideos, gallery, stats };
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
