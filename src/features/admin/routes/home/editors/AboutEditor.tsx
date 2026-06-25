import { useState } from 'react';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { I18nTextField } from '../../../components/form/I18nTextField';
import { AboutSection } from '../../../../../components/sections/AboutSection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, ResolvedAboutData } from '../../../../../types/cms';

type I18nField = { pt?: string; en?: string };

type AboutEditorProps = {
  data: {
    description?: I18nField;
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
};

function resolvePreviewData(data: AboutEditorProps['data'], language: CmsLanguage): ResolvedAboutData {
  return {
    description: pickLang({ pt: data.description?.pt ?? '', en: data.description?.en ?? '' }, language),
  };
}

export function AboutEditor({ data, isFieldDirty, onFieldChange }: AboutEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');

  return (
    <div className="space-y-8">
      <I18nTextField
        label="Descrição"
        pathPt={['description', 'pt']}
        pathEn={['description', 'en']}
        valuePt={data.description?.pt ?? ''}
        valueEn={data.description?.en ?? ''}
        isFieldDirty={isFieldDirty}
        onFieldChange={onFieldChange}
        multiline
        rows={6}
      />
      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <AboutSection data={resolvePreviewData(data, previewLang)} />
      </AdminPreviewPanel>
    </div>
  );
}

