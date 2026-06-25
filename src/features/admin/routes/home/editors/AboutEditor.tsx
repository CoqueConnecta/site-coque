import { useState } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
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
      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'Português (PT)' : 'Inglês (EN)'}>
            <label className="block">
              <span className={adminFieldLabelClass}>Descrição</span>
              <textarea
                value={data.description?.[lang] ?? ''}
                onChange={(e) => onFieldChange(['description', lang], e.target.value)}
                className={getAdminTextareaClass(isFieldDirty(['description', lang]))}
                rows={6}
              />
            </label>
          </AdminEditorCard>
        ))}
        <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
          <AboutSection data={resolvePreviewData(data, previewLang)} />
        </AdminPreviewPanel>
      </div>
    </div>
  );
}

