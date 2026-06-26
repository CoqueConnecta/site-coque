import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { fetchAdminNode } from '../services/cmsAdminService';
import type { CmsAdminState } from '../types';

type UseAdminDataReturn = {
  cmsData: CmsAdminState | null;
  setCmsData: Dispatch<SetStateAction<CmsAdminState | null>>;
  originalCmsData: CmsAdminState | null;
  setOriginalCmsData: Dispatch<SetStateAction<CmsAdminState | null>>;
};

export function useAdminData(): UseAdminDataReturn {
  const [cmsData, setCmsData] = useState<CmsAdminState | null>(null);
  const [originalCmsData, setOriginalCmsData] = useState<CmsAdminState | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shared, home, projects, privacy, transparency] = await Promise.all([
          fetchAdminNode('cms/v3/shared'),
          fetchAdminNode('cms/v3/pages/home'),
          fetchAdminNode('cms/v3/pages/projects'),
          fetchAdminNode('cms/v3/pages/privacy'),
          fetchAdminNode('cms/v3/pages/transparency'),
        ]);

        const state: CmsAdminState = {
          shared: {
            nav:        (shared.nav        as Record<string, unknown>) ?? {},
            footer:     (shared.footer     as Record<string, unknown>) ?? {},
            newsletter: (shared.newsletter as Record<string, unknown>) ?? {},
          },
          pages: {
            home: {
              hero:          (home.hero          as Record<string, unknown>) ?? {},
              about:         (home.about         as Record<string, unknown>) ?? {},
              carousel:      (home.carousel      as Record<string, unknown>) ?? {},
              youtubeVideos: (home.youtubeVideos as Record<string, unknown>) ?? {},
              waysToHelp:    (home.waysToHelp    as Record<string, unknown>) ?? {},
              stats:         (home.stats         as Record<string, unknown>) ?? {},
              trust:         (home.trust         as Record<string, unknown>) ?? {},
            },
            projects,
            privacy,
            transparency,
          },
        };

        setCmsData(state);
        setOriginalCmsData(state);
      } catch (error) {
        toast.error('Falha ao carregar os dados do painel.');
        console.error('Erro ao buscar dados do Firebase:', error);
      }
    };

    fetchData();
  }, []);

  return { cmsData, setCmsData, originalCmsData, setOriginalCmsData };
}
