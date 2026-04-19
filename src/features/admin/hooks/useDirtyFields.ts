import { useMemo, useState } from 'react';
import type { CmsLandingByLanguage } from '../types';
import type { CmsLandingData, CmsLanguage } from '../../types/cms';
import { deepEqual } from '../utils/cmsNormalize';
import { getValueAtPath } from '../utils/editorPath';

export function useDirtyFields(
  originalCmsData: CmsLandingByLanguage | null,
  activeSection: keyof CmsLandingData | '',
  activeAboutMediaMode: 'carousel' | 'youtubeVideos',
) {
  const [dirtyFields, setDirtyFields] = useState<Record<string, true>>({});

  const buildDirtyFieldKey = (
    language: CmsLanguage,
    section: keyof CmsLandingData,
    path: Array<string | number>,
  ) => [language, section, ...path.map(String)].join('.');

  const markDirtyField = (
    language: CmsLanguage,
    section: keyof CmsLandingData,
    path: Array<string | number>,
    nextValue: unknown,
  ) => {
    if (!originalCmsData) {
      return;
    }

    const originalSection = originalCmsData[language][section];
    const originalValue = path.length > 0 ? getValueAtPath(originalSection, path) : originalSection;
    const fieldKey = buildDirtyFieldKey(language, section, path);
    const nextIsDirty = !deepEqual(originalValue, nextValue);

    setDirtyFields((prev) => {
      if (nextIsDirty) {
        if (prev[fieldKey]) {
          return prev;
        }
        return { ...prev, [fieldKey]: true };
      }

      if (!prev[fieldKey]) {
        return prev;
      }

      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const isFieldDirty = (
    language: CmsLanguage,
    path: Array<string | number>,
    sectionOverride?: keyof CmsLandingData,
  ) => {
    const section = sectionOverride ?? activeSection;
    if (!section) {
      return false;
    }
    return Boolean(dirtyFields[buildDirtyFieldKey(language, section, path)]);
  };

  const activeSectionDirtyCount = useMemo(() => {
    if (!activeSection) {
      return 0;
    }

    if (activeSection === 'aboutMedia') {
      const aboutMediaPrefix = activeAboutMediaMode === 'carousel'
        ? 'aboutMedia.tickerImages'
        : 'aboutMedia.youtubeVideos';
      const ptPrefix = `pt.${aboutMediaPrefix}`;
      const enPrefix = `en.${aboutMediaPrefix}`;
      return Object.keys(dirtyFields).filter(
        (k) => k === ptPrefix || k.startsWith(`${ptPrefix}.`) || k === enPrefix || k.startsWith(`${enPrefix}.`),
      ).length;
    }

    const ptPrefix = `pt.${activeSection}`;
    const enPrefix = `en.${activeSection}`;
    return Object.keys(dirtyFields).filter(
      (k) => k === ptPrefix || k.startsWith(`${ptPrefix}.`) || k === enPrefix || k.startsWith(`${enPrefix}.`),
    ).length;
  }, [activeSection, activeAboutMediaMode, dirtyFields]);

  const sectionDirtyCountMap = useMemo(() => {
    const counts: Partial<Record<keyof CmsLandingData, number>> = {};
    Object.keys(dirtyFields).forEach((fieldKey) => {
      const [, sectionPart] = fieldKey.split('.');
      const section = sectionPart as keyof CmsLandingData;
      counts[section] = (counts[section] ?? 0) + 1;
    });
    return counts;
  }, [dirtyFields]);

  const sectionNavDirtyCount = (item: {
    section: keyof CmsLandingData;
    aboutMediaMode?: 'carousel' | 'youtubeVideos';
  }) => {
    if (item.section !== 'aboutMedia' || !item.aboutMediaMode) {
      return sectionDirtyCountMap[item.section] ?? 0;
    }

    const aboutMediaPrefix = item.aboutMediaMode === 'carousel'
      ? 'aboutMedia.tickerImages'
      : 'aboutMedia.youtubeVideos';
    const ptPrefix = `pt.${aboutMediaPrefix}`;
    const enPrefix = `en.${aboutMediaPrefix}`;

    return Object.keys(dirtyFields).filter(
      (k) => k === ptPrefix || k.startsWith(`${ptPrefix}.`) || k === enPrefix || k.startsWith(`${enPrefix}.`),
    ).length;
  };

  return {
    dirtyFields,
    setDirtyFields,
    markDirtyField,
    isFieldDirty,
    activeSectionDirtyCount,
    sectionNavDirtyCount,
  };
}
