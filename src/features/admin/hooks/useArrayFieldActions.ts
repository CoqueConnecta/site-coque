import type React from 'react';
import type { CmsAdminState } from '../types';
import { buildEmptyFromTemplate, getValueAtPath, setValueAtPath } from '../utils/editorPath';

type MarkDirtyField = (
  sectionPath: string,
  path: Array<string | number>,
  nextValue: unknown,
  originalOverride?: unknown,
) => void;

/**
 * CRUD operations for array fields within cmsData (add/remove/move/duplicate items).
 * All four follow the same shape: clone cmsData, navigate to sectionKey, read the
 * array at path, produce a new array, write it back, mark it dirty.
 */
export function useArrayFieldActions(
  setCmsData: React.Dispatch<React.SetStateAction<CmsAdminState | null>>,
  markDirtyField: MarkDirtyField,
) {
  const handleAddArrayItem = (sectionKey: string, path: Array<string | number>) => {
    setCmsData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as CmsAdminState;
      const segments = sectionKey.split('.');
      let node: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (const seg of segments.slice(0, -1)) node = node[seg] as Record<string, unknown>;
      const lastSeg = segments[segments.length - 1];
      const sectionData = node[lastSeg];
      const currentValue = getValueAtPath(sectionData, path);
      if (!Array.isArray(currentValue)) return prev;
      const templateSource = currentValue.length > 0 ? currentValue[0] : '';
      const newItem = buildEmptyFromTemplate(templateSource);
      const updatedArray = [...currentValue, newItem];
      node[lastSeg] = setValueAtPath(sectionData, path, updatedArray);
      markDirtyField(sectionKey, path, updatedArray);
      return next;
    });
  };

  const handleRemoveArrayItem = (
    sectionKey: string,
    path: Array<string | number>,
    index: number,
  ) => {
    setCmsData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as CmsAdminState;
      const segments = sectionKey.split('.');
      let node: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (const seg of segments.slice(0, -1)) node = node[seg] as Record<string, unknown>;
      const lastSeg = segments[segments.length - 1];
      const sectionData = node[lastSeg];
      const currentValue = getValueAtPath(sectionData, path);
      if (!Array.isArray(currentValue)) return prev;
      const updatedArray = currentValue.filter((_, i) => i !== index);
      node[lastSeg] = setValueAtPath(sectionData, path, updatedArray);
      markDirtyField(sectionKey, path, updatedArray);
      return next;
    });
  };

  const handleMoveArrayItem = (
    sectionKey: string,
    path: Array<string | number>,
    index: number,
    direction: 'up' | 'down',
  ) => {
    setCmsData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as CmsAdminState;
      const segments = sectionKey.split('.');
      let node: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (const seg of segments.slice(0, -1)) node = node[seg] as Record<string, unknown>;
      const lastSeg = segments[segments.length - 1];
      const sectionData = node[lastSeg];
      const currentValue = getValueAtPath(sectionData, path);
      if (!Array.isArray(currentValue)) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentValue.length) return prev;
      const updatedArray = [...currentValue];
      [updatedArray[index], updatedArray[targetIndex]] = [updatedArray[targetIndex], updatedArray[index]];
      node[lastSeg] = setValueAtPath(sectionData, path, updatedArray);
      markDirtyField(sectionKey, path, updatedArray);
      return next;
    });
  };

  const handleDuplicateArrayItem = (
    sectionKey: string,
    path: Array<string | number>,
    index: number,
  ) => {
    setCmsData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as CmsAdminState;
      const segments = sectionKey.split('.');
      let node: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (const seg of segments.slice(0, -1)) node = node[seg] as Record<string, unknown>;
      const lastSeg = segments[segments.length - 1];
      const sectionData = node[lastSeg];
      const currentValue = getValueAtPath(sectionData, path);
      if (!Array.isArray(currentValue)) return prev;
      const clone = JSON.parse(JSON.stringify(currentValue[index]));
      const updatedArray = [...currentValue.slice(0, index + 1), clone, ...currentValue.slice(index + 1)];
      node[lastSeg] = setValueAtPath(sectionData, path, updatedArray);
      markDirtyField(sectionKey, path, updatedArray);
      return next;
    });
  };

  return {
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleMoveArrayItem,
    handleDuplicateArrayItem,
  };
}
