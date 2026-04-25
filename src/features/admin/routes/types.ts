import type { ReactNode } from 'react';
import type { CmsAdminState } from '../types';

/** Props compartilhadas por todos os Route components do admin v3 */
export type AdminRouteProps = {
  cmsData: CmsAdminState;
  activeSectionKey: string;
  onActiveSectionChange: (key: string) => void;
  isFieldDirty: (path: Array<string | number>, sectionKeyOverride?: string) => boolean;
  onFieldChange: (sectionKey: string, path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (sectionKey: string, path: Array<string | number>) => void;
  onRemoveArrayItem: (sectionKey: string, path: Array<string | number>, index: number) => void;
  renderImageField: (sectionKey: string, value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
  sectionDirtyCount: (sectionKey: string) => number;
};
