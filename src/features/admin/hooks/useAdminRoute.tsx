import React, { useMemo, useState } from 'react';
import { ref, update } from 'firebase/database';
import toast from 'react-hot-toast';
import { database } from '../../../../firebase';
import { ADMIN_ROUTES } from '../config/adminRoutes';
import type { AdminRouteId } from '../config/adminRoutes';
import type { CmsLandingData, CmsLanguage } from '../../../types/cms';
import type { CmsLandingByLanguage } from '../types';
import { isGlobalSection, normalizeAboutMedia, parsePathSegment } from '../utils/cmsNormalize';
import { getValueAtPath } from '../utils/editorPath';

export function useAdminRoute(
  cmsData: CmsLandingByLanguage | null,
  originalCmsData: CmsLandingByLanguage | null,
  setCmsData: React.Dispatch<React.SetStateAction<CmsLandingByLanguage | null>>,
  setOriginalCmsData: React.Dispatch<React.SetStateAction<CmsLandingByLanguage | null>>,
  dirtyFields: Record<string, true>,
  setDirtyFields: React.Dispatch<React.SetStateAction<Record<string, true>>>,
) {
  const [activeRouteId, setActiveRouteId] = useState<AdminRouteId>('home');
  const [activeSection, setActiveSection] = useState<keyof CmsLandingData | ''>('hero');
  const [activeAboutMediaMode, setActiveAboutMediaMode] = useState<'carousel' | 'youtubeVideos'>('carousel');

  const activeRoute = useMemo(
    () => ADMIN_ROUTES.find((r) => r.id === activeRouteId) ?? ADMIN_ROUTES[0],
    [activeRouteId],
  );

  /** Number of dirty fields in a given route */
  const routeDirtyCount = (routeId: AdminRouteId) => {
    const route = ADMIN_ROUTES.find((r) => r.id === routeId);
    if (!route) return 0;
    const keys = route.sections.map((s) => s.key as string);
    return Object.keys(dirtyFields).filter((k) => {
      const [, sectionPart] = k.split('.');
      return keys.includes(sectionPart);
    }).length;
  };

  /** Save all dirty fields of the active route */
  const handleSaveRoute = () => {
    if (!cmsData || !originalCmsData) return;

    const sectionKeys = activeRoute.sections.map((s) => s.key as string);
    const routeDirtyKeys = Object.keys(dirtyFields).filter((k) => {
      const [, sectionPart] = k.split('.');
      return sectionKeys.includes(sectionPart);
    });

    if (routeDirtyKeys.length === 0) {
      toast('Nenhuma alteração pendente nesta página.');
      return;
    }

    const partialPayload: Record<string, unknown> = {};

    routeDirtyKeys.forEach((fieldKey) => {
      const [languagePart, sectionPart, ...rawPath] = fieldKey.split('.');
      const language = languagePart as CmsLanguage;
      const section = sectionPart as keyof CmsLandingData;

      if (isGlobalSection(section)) {
        // Global sections are stored under /global/{section}
        const currentSection =
          section === 'aboutMedia'
            ? normalizeAboutMedia(cmsData.pt.aboutMedia, true)
            : cmsData.pt[section];
        const typedPath = rawPath.map(parsePathSegment);
        const value = typedPath.length > 0 ? getValueAtPath(currentSection, typedPath) : currentSection;
        partialPayload[`cms/v2/landing/global/${section}/${rawPath.join('/')}`] = value ?? null;
      } else {
        const typedPath = rawPath.map(parsePathSegment);
        const sourceSection = cmsData[language][section];
        const value = typedPath.length > 0 ? getValueAtPath(sourceSection, typedPath) : sourceSection;
        partialPayload[`cms/v2/landing/${language}/${section}/${rawPath.join('/')}`] = value ?? null;
      }
    });

    const savePromise = update(ref(database), partialPayload).then(() => {
      setOriginalCmsData(cmsData);
      setDirtyFields((prev) => {
        const next: Record<string, true> = {};
        Object.keys(prev).forEach((k) => {
          const [, sectionPart] = k.split('.');
          if (!sectionKeys.includes(sectionPart)) next[k] = true;
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

    const sectionKeys = activeRoute.sections.map((s) => s.key as string);
    const routeDirtyKeys = Object.keys(dirtyFields).filter((k) => {
      const [, sectionPart] = k.split('.');
      return sectionKeys.includes(sectionPart);
    });

    if (routeDirtyKeys.length === 0) {
      toast('Nenhuma alteração pendente nesta página.');
      return;
    }

    setCmsData((prev) => {
      if (!prev) return prev;
      const next = { ...prev, pt: { ...prev.pt }, en: { ...prev.en } };
      activeRoute.sections.forEach((s) => {
        const key = s.key as keyof CmsLandingData;
        (next.pt[key] as unknown) = originalCmsData.pt[key];
        (next.en[key] as unknown) = originalCmsData.en[key];
      });
      return next;
    });

    setDirtyFields((prev) => {
      const next: Record<string, true> = {};
      Object.keys(prev).forEach((k) => {
        const [, sectionPart] = k.split('.');
        if (!sectionKeys.includes(sectionPart)) next[k] = true;
      });
      return next;
    });

    toast.success('Alterações da página descartadas.');
  };

  return {
    activeRouteId,
    setActiveRouteId,
    activeRoute,
    activeSection,
    setActiveSection,
    activeAboutMediaMode,
    setActiveAboutMediaMode,
    routeDirtyCount,
    handleSaveRoute,
    handleDiscardRoute,
  };
}
