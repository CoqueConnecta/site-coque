import { useState } from 'react';
import { AdminInputField } from '../../../components/form/AdminInputField';
import { I18nTextField } from '../../../components/form/I18nTextField';
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
      <AdminInputField
        label="Headline Accent (global)"
        path={['headlineAccent']}
        value={data.headlineAccent ?? ''}
        isFieldDirty={isFieldDirty}
        onFieldChange={onFieldChange}
      />

      {/* i18n fields */}
      {(['headline', 'description', 'buttonText', 'placeholderEmail'] as const).map((field) => (
        <I18nTextField
          key={field}
          label={field}
          pathPt={[field, 'pt']}
          pathEn={[field, 'en']}
          valuePt={data[field]?.pt ?? ''}
          valueEn={data[field]?.en ?? ''}
          isFieldDirty={isFieldDirty}
          onFieldChange={onFieldChange}
          multiline={field === 'description'}
          rows={3}
        />
      ))}

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <NewsletterSection data={resolvePreviewData(data, previewLang)} previewMode />
      </AdminPreviewPanel>
    </div>
  );
}
