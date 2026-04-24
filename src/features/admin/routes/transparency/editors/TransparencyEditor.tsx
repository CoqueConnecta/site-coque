import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../../types/cms';
import { DynamicSectionEditor } from '../../../components/shared/DynamicSectionEditor';

type TransparencyEditorProps = {
  ptValue: unknown;
  enValue: unknown;
  isFieldDirty: (language: CmsLanguage, path: Array<string | number>) => boolean;
  onSectionFieldChange: (
    language: CmsLanguage,
    path: Array<string | number>,
    value: unknown
  ) => void;
  onAddArrayItem: (language: CmsLanguage, path: Array<string | number>) => void;
  onRemoveArrayItem: (
    language: CmsLanguage,
    path: Array<string | number>,
    index: number
  ) => void;
  renderImageField: (
    language: CmsLanguage,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string
  ) => ReactNode;
};

export function TransparencyEditor(props: TransparencyEditorProps) {
  return <DynamicSectionEditor sectionName="transparency" {...props} />;
}
