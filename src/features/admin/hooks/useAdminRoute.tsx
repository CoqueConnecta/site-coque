import React, { useMemo, useState } from 'react';
import { ref, update } from 'firebase/database';
import toast from 'react-hot-toast';
import { database } from '../../../../firebase';
import { ADMIN_ROUTES } from '../config/adminRoutes';
import type { AdminRouteId } from '../config/adminRoutes';
import type { CmsLandingData, CmsLanguage } from '../../../types/cms';
import type { CmsLandingByLanguage } from '../types';
import { getRtdbConfig } from '../config/rtdbRouting';
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

      const rtdbConfig = getRtdbConfig(section, isGlobalSection(section));
      const { basePath, strategy, splitConfig } = rtdbConfig;
      
      const typedPath = rawPath.map(parsePathSegment);
      const sourceSection = cmsData[language][section];
      const value = typedPath.length > 0 ? getValueAtPath(sourceSection, typedPath) : sourceSection;

      if (strategy === 'split-array' && splitConfig) {
        const fieldName = rawPath[rawPath.length - 1] as string;

        if (rawPath.length === 0) {
           const arrayValue = value as any[];
           const globalItems = arrayValue.map(p => {
             const obj: any = {};
             splitConfig.globalFields.forEach(f => obj[f] = p[f]);
             splitConfig.duplicatedFields?.forEach(f => obj[f] = p[f]);
             return obj;
           });
           
           const extractLocal = (langData: any) => (langData[section] || []).map((p: any) => {
             const obj: any = {};
             splitConfig.localFields.forEach(f => obj[f] = p[f]);
             splitConfig.duplicatedFields?.forEach(f => obj[f] = p[f]);
             return obj;
           });

           partialPayload[`${basePath}/global/${section}`] = globalItems;
           partialPayload[`${basePath}/pt/${section}`] = extractLocal(cmsData.pt);
           partialPayload[`${basePath}/en/${section}`] = extractLocal(cmsData.en);
        } else {
           const index = rawPath[0];
           if (splitConfig.globalFields.includes(fieldName)) {
             partialPayload[`${basePath}/global/${section}/${index}/${fieldName}`] = value ?? null;
           } else if (splitConfig.localFields.includes(fieldName)) {
             partialPayload[`${basePath}/${language}/${section}/${index}/${fieldName}`] = value ?? null;
           } else if (splitConfig.duplicatedFields?.includes(fieldName)) {
             partialPayload[`${basePath}/global/${section}/${index}/${fieldName}`] = value ?? null;
             partialPayload[`${basePath}/pt/${section}/${index}/${fieldName}`] = value ?? null;
             partialPayload[`${basePath}/en/${section}/${index}/${fieldName}`] = value ?? null;
           } else {
             partialPayload[`${basePath}/${language}/${section}/${rawPath.join('/')}`] = value ?? null;
           }
        }
      } else if (strategy === 'standard-global') {
        const currentSection =
          section === 'aboutMedia'
            ? normalizeAboutMedia(cmsData.pt.aboutMedia as any, true)
            : cmsData.pt[section];
        const globalValue = typedPath.length > 0 ? getValueAtPath(currentSection, typedPath) : currentSection;
        partialPayload[`${basePath}/global/${section}/${rawPath.join('/')}`] = globalValue ?? null;
      } else {
        partialPayload[`${basePath}/${language}/${section}/${rawPath.join('/')}`] = value ?? null;
      }
    });

    const finalPayload: Record<string, unknown> = {};
    const sortedKeys = Object.keys(partialPayload).sort();

    sortedKeys.forEach((key) => {
      const isDescendant = Object.keys(finalPayload).some((ancestorKey) =>
        key.startsWith(`${ancestorKey}/`)
      );
      if (!isDescendant) {
        finalPayload[key] = partialPayload[key];
      }
    });

    const savePromise = update(ref(database), finalPayload).then(() => {
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
