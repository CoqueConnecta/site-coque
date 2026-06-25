import { useState } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { NewsletterSection } from '../../../../../components/sections/NewsletterSection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, ResolvedNewsletterData } from '../../../../../types/cms';

type I18nField = { pt?: string; en?: string };

type NewsletterEditorProps = {
  data: {
    headlineAccent?: string;
    headline?: I18nField;
    description?: I18nField;
    buttonText?: I18nField;
    placeholderEmail?: I18nField;
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
};

function resolvePreviewData(data: NewsletterEditorProps['data'], language: CmsLanguage): ResolvedNewsletterData {
  const toI18nField = (field?: I18nField): { pt: string; en: string } => ({ pt: field?.pt ?? '', en: field?.en ?? '' });

  return {
    headlineAccent: data.headlineAccent ?? '',
    headline: pickLang(toI18nField(data.headline), language),
    description: pickLang(toI18nField(data.description), language),
    buttonText: pickLang(toI18nField(data.buttonText), language),
    placeholderEmail: pickLang(toI18nField(data.placeholderEmail), language),
  };
}

export function NewsletterEditor({ data, isFieldDirty, onFieldChange }: NewsletterEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');
  return (
    <div className="space-y-6">
      {/* Global accent */}
      <label className="block">
        <span className={adminFieldLabelClass}>Headline Accent (global)</span>
        <input type="text" value={data.headlineAccent ?? ''} onChange={(e) => onFieldChange(['headlineAccent'], e.target.value)} className={getAdminInputClass(isFieldDirty(['headlineAccent']))} />
      </label>

      {/* i18n fields */}
      {(['headline', 'description', 'buttonText', 'placeholderEmail'] as const).map((field) => (
        <div key={field} className={adminPanelGridClass}>
          {(['pt', 'en'] as const).map((lang) => (
            <AdminEditorCard key={lang} title={`${field} (${lang.toUpperCase()})`}>
              <label className="block">
                <span className={adminFieldLabelClass}>{field}</span>
                {field === 'description'
                  ? <textarea value={data[field]?.[lang] ?? ''} onChange={(e) => onFieldChange([field, lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty([field, lang]))} rows={3} />
                  : <input type="text" value={data[field]?.[lang] ?? ''} onChange={(e) => onFieldChange([field, lang], e.target.value)} className={getAdminInputClass(isFieldDirty([field, lang]))} />
                }
              </label>
            </AdminEditorCard>
          ))}
        </div>
      ))}

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <NewsletterSection data={resolvePreviewData(data, previewLang)} previewMode />
      </AdminPreviewPanel>
    </div>
  );
}
