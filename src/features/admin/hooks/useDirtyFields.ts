import { useMemo, useState } from 'react';
import type { CmsAdminState } from '../types';
import type { CmsLanguage } from '../../../types/cms';
import { deepEqual } from '../utils/cmsNormalize';
import { getValueAtPath } from '../utils/editorPath';

export function useDirtyFields(
  originalCmsData: CmsAdminState | null,
  activeSectionPath: string,
) {
  const [dirtyFields, setDirtyFields] = useState<Record<string, true>>({});

  /**
   * Builds a unique key for a dirty field.
   * format: "<sectionPath>.<field...>" e.g. "pages.home.hero.headline.pt"
   */
  const buildDirtyFieldKey = (
    sectionPath: string,
    path: Array<string | number>,
  ) => [sectionPath, ...path.map(String)].join('.');

  const markDirtyField = (
    sectionPath: string,
    path: Array<string | number>,
    nextValue: unknown,
    originalOverride?: unknown,
  ) => {
    if (!originalCmsData && originalOverride === undefined) return;

    let originalValue: unknown;
    if (originalOverride !== undefined) {
      originalValue = originalOverride;
    } else {
      // Navigate into originalCmsData using sectionPath segments
      const segments = sectionPath.split('.');
      let node: unknown = originalCmsData;
      for (const seg of segments) {
        node = (node as Record<string, unknown>)?.[seg];
      }
      originalValue = path.length > 0 ? getValueAtPath(node, path) : node;
    }

    const fieldKey = buildDirtyFieldKey(sectionPath, path);
    const nextIsDirty = !deepEqual(originalValue, nextValue);

    setDirtyFields((prev) => {
      if (nextIsDirty) {
        if (prev[fieldKey]) return prev;
        return { ...prev, [fieldKey]: true };
      }
      if (!prev[fieldKey]) return prev;
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const isFieldDirty = (
    path: Array<string | number>,
    sectionPathOverride?: string,
  ) => {
    const sp = sectionPathOverride ?? activeSectionPath;
    if (!sp) return false;
    return Boolean(dirtyFields[buildDirtyFieldKey(sp, path)]);
  };

  const activeSectionDirtyCount = useMemo(() => {
    if (!activeSectionPath) return 0;
    return Object.keys(dirtyFields).filter(
      (k) => k === activeSectionPath || k.startsWith(`${activeSectionPath}.`),
    ).length;
  }, [activeSectionPath, dirtyFields]);

  const sectionDirtyCount = (sectionPath: string) => {
    return Object.keys(dirtyFields).filter(
      (k) => k === sectionPath || k.startsWith(`${sectionPath}.`),
    ).length;
  };

  return {
    dirtyFields,
    setDirtyFields,
    markDirtyField,
    isFieldDirty,
    activeSectionDirtyCount,
    sectionDirtyCount,
  };
}
