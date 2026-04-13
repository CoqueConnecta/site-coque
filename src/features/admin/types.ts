import type { CmsLandingData, CmsLanguage } from '../../types/cms';

export type CmsLandingByLanguage = {
  pt: CmsLandingData;
  en: CmsLandingData;
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
} | null;
