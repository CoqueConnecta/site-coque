import React, { useMemo, useState } from 'react';
import { ref, update } from 'firebase/database';
import toast from 'react-hot-toast';
import { database } from '../../../../firebase';
import { ADMIN_ROUTES } from '../config/adminRoutes';
import type { AdminRouteId } from '../config/adminRoutes';
import { getRtdbPath } from '../config/rtdbRouting';
import type { CmsAdminState } from '../types';
import { getValueAtPath, setValueAtPath } from '../utils/editorPath';

/**
 * v3 save engine.
 *
 * Each dirty field key has the form: "pages.home.hero.headline.pt"
 * The sectionKey is the first two/three dotted segments registered in RTDB_SECTION_PATHS
 * (e.g. "pages.home.hero" or "pages.projects").
 * The remaining segments are the in-section path to write.
 */
export function useAdminRoute(
  cmsData: CmsAdminState | null,
  originalCmsData: CmsAdminState | null,
  setCmsData: React.Dispatch<React.SetStateAction<CmsAdminState | null>>,
  setOriginalCmsData: React.Dispatch<React.SetStateAction<CmsAdminState | null>>,
  dirtyFields: Record<string, true>,
  setDirtyFields: React.Dispatch<React.SetStateAction<Record<string, true>>>,
) {
  const [activeRouteId, setActiveRouteId] = useState<AdminRouteId>('home');
  const [activeSectionKey, setActiveSectionKey] = useState<string>('pages.home.hero');

  const activeRoute = useMemo(
    () => ADMIN_ROUTES.find((r) => r.id === activeRouteId) ?? ADMIN_ROUTES[0],
    [activeRouteId],
  );

  /** All sectionKeys for the active route */
  const activeRouteSectionKeys = activeRoute.sections.map((s) => s.key);

  /** Dirty fields that belong to the active route */
  const routeDirtyKeys = (routeId: AdminRouteId) => {
    const route = ADMIN_ROUTES.find((r) => r.id === routeId);
    if (!route) return [];
    const keys = route.sections.map((s) => s.key);
    return Object.keys(dirtyFields).filter((k) =>
      keys.some((sk) => k === sk || k.startsWith(`${sk}.`))
    );
  };

  const routeDirtyCount = (routeId: AdminRouteId) => routeDirtyKeys(routeId).length;

  /**
   * Navigate into cmsData using a dotted sectionKey path.
   * e.g. "pages.home.hero" → cmsData.pages.home.hero
   */
  function getSectionData(state: CmsAdminState, sectionKey: string): unknown {
    const segments = sectionKey.split('.');
    let node: unknown = state;
    for (const seg of segments) {
      node = (node as Record<string, unknown>)?.[seg];
    }
    return node;
  }

  /** Save all dirty fields of the active route */
  const handleSaveRoute = () => {
    if (!cmsData || !originalCmsData) return;

    const dirtyOfRoute = routeDirtyKeys(activeRouteId);

    if (dirtyOfRoute.length === 0) {
      toast('Nenhuma alteração pendente nesta página.');
      return;
    }

    const partialPayload: Record<string, unknown> = {};

    dirtyOfRoute.forEach((fieldKey) => {
      // Identify which registered sectionKey this fieldKey belongs to
      const matchedSectionKey = activeRouteSectionKeys.find(
        (sk) => fieldKey === sk || fieldKey.startsWith(`${sk}.`)
      );
      if (!matchedSectionKey) return;

      const rtdbBase = getRtdbPath(matchedSectionKey);
      const afterSection = fieldKey.slice(matchedSectionKey.length + 1); // path within the section

      if (!afterSection) {
        // Entire section is dirty — write the full section object
        const sectionData = getSectionData(cmsData, matchedSectionKey);
        partialPayload[rtdbBase] = sectionData ?? null;
      } else {
        // Specific field path within the section
        const sectionData = getSectionData(cmsData, matchedSectionKey);
        const pathSegments = afterSection.split('.').map((s) =>
          /^\d+$/.test(s) ? Number(s) : s
        );
        const value = getValueAtPath(sectionData, pathSegments);
        partialPayload[`${rtdbBase}/${afterSection.replace(/\./g, '/')}`] = value ?? null;
      }
    });

    // Sanitise: remove descendant keys when an ancestor is already being written
    const finalPayload: Record<string, unknown> = {};
    Object.keys(partialPayload).sort().forEach((key) => {
      const isDescendant = Object.keys(finalPayload).some((ancestor) =>
        key.startsWith(`${ancestor}/`)
      );
      if (!isDescendant) finalPayload[key] = partialPayload[key];
    });

    const savePromise = update(ref(database), finalPayload).then(() => {
      setOriginalCmsData(cmsData);
      setDirtyFields((prev) => {
        const next: Record<string, true> = {};
        Object.keys(prev).forEach((k) => {
          const stillDirty = !activeRouteSectionKeys.some(
            (sk) => k === sk || k.startsWith(`${sk}.`)
          );
          if (stillDirty) next[k] = true;
        });
        return next;
      });
    });

    toast.promise(savePromise, {
      loading: 'Salvando página...',
      success: () => <b>Página salva com sucesso!</b>,
      error: () => <b>Erro ao salvar. Tente novamente.</b>,
    });
  };

  /** Discard all dirty fields of the active route */
  const handleDiscardRoute = () => {
    if (!cmsData || !originalCmsData) return;

    const dirtyOfRoute = routeDirtyKeys(activeRouteId);

    if (dirtyOfRoute.length === 0) {
      toast('Nenhuma alteração pendente nesta página.');
      return;
    }

    setCmsData((prev) => {
      if (!prev) return prev;
      // Deep clone and restore each section from originalCmsData
      const next = JSON.parse(JSON.stringify(prev)) as CmsAdminState;
      activeRouteSectionKeys.forEach((sk) => {
        const segments = sk.split('.');
        let origNode: unknown = originalCmsData;
        let prevNode: Record<string, unknown> = next as unknown as Record<string, unknown>;
        for (let i = 0; i < segments.length - 1; i++) {
          origNode = (origNode as Record<string, unknown>)?.[segments[i]];
          prevNode = (prevNode[segments[i]] as Record<string, unknown>);
        }
        const lastSeg = segments[segments.length - 1];
        prevNode[lastSeg] = (origNode as Record<string, unknown>)?.[lastSeg];
      });
      return next;
    });

    setDirtyFields((prev) => {
      const next: Record<string, true> = {};
      Object.keys(prev).forEach((k) => {
        const stillDirty = !activeRouteSectionKeys.some(
          (sk) => k === sk || k.startsWith(`${sk}.`)
        );
        if (stillDirty) next[k] = true;
      });
      return next;
    });

    toast.success('Alterações da página descartadas.');
  };

  return {
    activeRouteId,
    setActiveRouteId,
    activeRoute,
    activeSectionKey,
    setActiveSectionKey,
    routeDirtyCount,
    handleSaveRoute,
    handleDiscardRoute,
  };
}
