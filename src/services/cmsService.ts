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
    const snapshot = await get(ref(database, `${CMS_BASE_PATH}/${language}`));
    if (!snapshot.exists()) {
      return fallback;
    }

    const data = snapshot.val();
    return mergeWithFallback(fallback, data);
  } catch (error) {
    console.error('Erro ao carregar cms/v2/landing, usando fallback local.', error);
    return fallback;
  }
}
