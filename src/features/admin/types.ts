import type { CmsLanguage } from '../../types/cms';

/**
 * Shape do CMS v3 no admin — espelha exatamente a estrutura do Firebase.
 * Todos os campos traduzíveis vivem como { pt: string; en: string }.
 * O admin edita diretamente esse objeto; o serviço público faz o pickLang na hora de renderizar.
 */
export type CmsAdminData = Record<string, unknown>;

/** Estado do admin com os dados brutos de ambas as línguas + global, para edição. */
export type CmsAdminState = {
  shared: {
    nav: CmsAdminData;
    footer: CmsAdminData;
    newsletter: CmsAdminData;
  };
  pages: {
    home: {
      hero: CmsAdminData;
      about: CmsAdminData;
      carousel: CmsAdminData;
      youtubeVideos: CmsAdminData;
      gallery: CmsAdminData;
      stats: CmsAdminData;
    };
    projects: CmsAdminData;
    privacy: CmsAdminData;
    transparency: CmsAdminData;
  };
};

export type MediaAsset = {
  id: string;
  url: string;
  name: string;
  title?: string;
  alt?: string;
  category?: string;
};

export type PickerState = {
  language: CmsLanguage;
  path: Array<string | number>;
  label: string;
  sectionKey: string;
} | null;
