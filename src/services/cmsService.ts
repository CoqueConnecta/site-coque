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

function normalizeLegacyTransparency(landing: Record<string, unknown>) {
  const transparency = landing.transparency;
  if (!isPlainObject(transparency)) {
    return;
  }

  const sections = transparency.sections;
  const body = transparency.body;
  const hasSections = Array.isArray(sections) && sections.length > 0;

  if (hasSections || !Array.isArray(body) || body.length === 0) {
    return;
  }

  transparency.sections = body.map((paragraph, index) => ({
    title: `Seção ${index + 1}`,
    bodyMd: String(paragraph ?? '').trim(),
  }));
}

export async function getCmsLandingData(language: CmsLanguage): Promise<CmsLandingData> {
  const fallback = cmsFallbackByLanguage[language] ?? cmsFallbackByLanguage.pt;

  try {
    const [languageSnapshot, globalSnapshot] = await Promise.all([
      get(ref(database, `${CMS_BASE_PATH}/${language}`)),
      get(ref(database, `${CMS_BASE_PATH}/global`)),
    ]);

    const languageData = languageSnapshot.exists() ? languageSnapshot.val() : {};
    if (isPlainObject(languageData)) {
      normalizeLegacyTransparency(languageData);
    }
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

export async function getCmsProjectsData(language: CmsLanguage): Promise<{ projects: import('../types/cms').CmsProject[] }> {
  try {
    const [languageSnapshot, globalSnapshot] = await Promise.all([
      get(ref(database, `cms/v2/projects/${language}`)),
      get(ref(database, `cms/v2/projects/global`)),
    ]);

    const languageData = languageSnapshot.exists() ? languageSnapshot.val() : { projects: [] };
    const globalData = globalSnapshot.exists() ? globalSnapshot.val() : { projects: [] };

    const globalProjects = Array.isArray(globalData.projects) ? globalData.projects : [];
    const languageProjects = Array.isArray(languageData.projects) ? languageData.projects : [];

    // Merge by id
    const mergedProjects = languageProjects.map((langProj: any) => {
      const globProj = globalProjects.find((gp: any) => gp.id === langProj.id);
      return {
        ...globProj,
        ...langProj,
      };
    });

    return { projects: mergedProjects as import('../types/cms').CmsProject[] };
  } catch (error) {
    console.error('Erro ao carregar cms/v2/projects.', error);
    return { projects: [] };
  }
}
