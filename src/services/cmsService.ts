import { get, ref } from 'firebase/database';
import { database } from '../../firebase';
import { cmsFallbackByLanguage } from '../data/cmsFallback';
import type { CmsLandingData, CmsLanguage } from '../types/cms';

const CMS_BASE_PATH = 'cms/v2/landing';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeWithFallback<T>(fallback: T, incoming: unknown): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(incoming) ? incoming : fallback) as T;
  }

  if (isPlainObject(fallback)) {
    if (!isPlainObject(incoming)) {
      return fallback;
    }

    const result: Record<string, unknown> = { ...fallback };
    for (const key of Object.keys(fallback)) {
      result[key] = mergeWithFallback(
        (fallback as Record<string, unknown>)[key],
        incoming[key]
      );
    }
    return result as T;
  }

  return (incoming === undefined || incoming === null ? fallback : incoming) as T;
}

export async function getCmsLandingData(language: CmsLanguage): Promise<CmsLandingData> {
  const fallback = cmsFallbackByLanguage[language] ?? cmsFallbackByLanguage.pt;

  try {
    const [languageSnapshot, globalSnapshot] = await Promise.all([
      get(ref(database, `${CMS_BASE_PATH}/${language}`)),
      get(ref(database, `${CMS_BASE_PATH}/global`)),
    ]);

    const languageData = languageSnapshot.exists() ? languageSnapshot.val() : {};
    const mergedByLanguage = mergeWithFallback(fallback, languageData);

    const globalData = globalSnapshot.exists() ? globalSnapshot.val() : {};
    const mergedGlobalAboutMedia = mergeWithFallback(
      fallback.aboutMedia,
      isPlainObject(globalData) ? globalData.aboutMedia : undefined
    );

    const normalizedYoutubeVideos = mergedGlobalAboutMedia.youtubeVideos.map((video) => ({
      ...video,
      titles: video.titles ?? {
        pt: video.title ?? '',
        en: video.title ?? '',
      },
    }));

    return {
      ...mergedByLanguage,
      // Retrocompatibilidade: prioriza global/aboutMedia, mas preserva fallback antigo por idioma.
      aboutMedia: {
        ...mergedGlobalAboutMedia,
        youtubeVideos: normalizedYoutubeVideos,
      },
    };
  } catch (error) {
    console.error('Erro ao carregar cms/v2/landing, usando fallback local.', error);
    return fallback;
  }
}
