import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { ref, get } from 'firebase/database';
import toast from 'react-hot-toast';
import { database } from '../../../../firebase';
import { cmsFallbackByLanguage } from '../../../data/cmsFallback';
import { mergeWithFallback } from '../utils/editorPath';
import { normalizeAboutMedia } from '../utils/cmsNormalize';
import type { CmsLanguage } from '../../../types/cms';
import type { CmsLandingByLanguage } from '../types';

type UseAdminDataReturn = {
  cmsData: CmsLandingByLanguage | null;
  setCmsData: Dispatch<SetStateAction<CmsLandingByLanguage | null>>;
  originalCmsData: CmsLandingByLanguage | null;
  setOriginalCmsData: Dispatch<SetStateAction<CmsLandingByLanguage | null>>;
  mobileLanguage: CmsLanguage;
  setMobileLanguage: Dispatch<SetStateAction<CmsLanguage>>;
};

export function useAdminData(): UseAdminDataReturn {
  const [cmsData, setCmsData] = useState<CmsLandingByLanguage | null>(null);
  const [originalCmsData, setOriginalCmsData] = useState<CmsLandingByLanguage | null>(null);
  const [mobileLanguage, setMobileLanguage] = useState<CmsLanguage>('pt');

  useEffect(() => {
    const fetchData = async () => {
      const cmsRef = ref(database, 'cms/v2/landing');
      try {
        const snapshot = await get(cmsRef);
        const incoming = snapshot.exists() ? snapshot.val() : {};

        const normalized: CmsLandingByLanguage = {
          pt: mergeWithFallback(cmsFallbackByLanguage.pt, incoming.pt),
          en: mergeWithFallback(cmsFallbackByLanguage.en, incoming.en),
        };

        const mergedGlobalAboutMedia = mergeWithFallback(
          cmsFallbackByLanguage.pt.aboutMedia,
          incoming.global?.aboutMedia,
        );
        const normalizedAboutMedia = normalizeAboutMedia(mergedGlobalAboutMedia);
        normalized.pt.aboutMedia = normalizedAboutMedia;
        normalized.en.aboutMedia = normalizedAboutMedia;

        const mergedGlobalNav = mergeWithFallback(
          cmsFallbackByLanguage.pt.nav,
          incoming.global?.nav,
        );
        normalized.pt.nav = mergedGlobalNav;
        normalized.en.nav = mergedGlobalNav;

        const mergedGlobalStats = mergeWithFallback(
          cmsFallbackByLanguage.pt.stats,
          incoming.global?.stats,
        );
        normalized.pt.stats = mergedGlobalStats;
        normalized.en.stats = mergedGlobalStats;

        const mergedGlobalFooter = mergeWithFallback(
          cmsFallbackByLanguage.pt.footer,
          incoming.global?.footer,
        );
        normalized.pt.footer = mergedGlobalFooter;
        normalized.en.footer = mergedGlobalFooter;

        setCmsData(normalized);
        setOriginalCmsData(normalized);

      } catch (error) {
        toast.error('Falha ao carregar os dados do painel.');
        console.error('Erro ao buscar dados do Firebase:', error);
      }
    };

    fetchData();
  }, []);

  return {
    cmsData,
    setCmsData,
    originalCmsData,
    setOriginalCmsData,
    mobileLanguage,
    setMobileLanguage,
  };
}
