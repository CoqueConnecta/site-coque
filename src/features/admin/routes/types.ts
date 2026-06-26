import type { ReactNode } from 'react';
import type { CmsAdminState } from '../types';
import type { MediaAsset } from '../types';

/** Props compartilhadas por todos os Route components do admin v3 */
export type AdminRouteProps = {
  cmsData: CmsAdminState;
  activeSectionKey: string;
  onActiveSectionChange: (key: string) => void;
  isFieldDirty: (path: Array<string | number>, sectionKeyOverride?: string) => boolean;
  onFieldChange: (sectionKey: string, path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (sectionKey: string, path: Array<string | number>) => void;
  onRemoveArrayItem: (sectionKey: string, path: Array<string | number>, index: number) => void;
  onMoveArrayItem: (sectionKey: string, path: Array<string | number>, index: number, direction: 'up' | 'down') => void;
  onDuplicateArrayItem: (sectionKey: string, path: Array<string | number>, index: number) => void;
  renderImageField: (sectionKey: string, value: string, path: Array<string | number>, label: string, placeholder?: string, readOnly?: boolean) => ReactNode;
  sectionDirtyCount: (sectionKey: string) => number;
};

/** Full Outlet context type passed from AdminPage to all nested sub-routes */
export type AdminOutletContext = AdminRouteProps & {
  mediaAssets: MediaAsset[];
  mediaSearch: string;
  onMediaSearchChange: (value: string) => void;
  categories: { id: string; label: string }[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  filteredAssets: MediaAsset[];
  isUploading: boolean;
  uploadProgress: number;
  onUpload: (file: File, category: string, title?: string, alt?: string) => Promise<void>;
  onDelete: (id: string, url: string) => Promise<void>;
  onCategoryCreate: (label: string) => Promise<string>;
  onUpdateMetadata: (id: string, title: string, alt: string, category?: string) => Promise<void>;
};
