import { useState, type ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { adminPanelGridClass } from '../../../components/shared/adminEditorStyles';
import { AdminInputField } from '../../../components/form/AdminInputField';
import { AdminTextareaField } from '../../../components/form/AdminTextareaField';
import { HeroSection } from '../../../../../components/sections/HeroSection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, I18nField, ResolvedHeroData } from '../../../../../types/cms';

type HeroEditorProps = {
  data: {
    headline?: { pt?: string; en?: string };
    subheadline?: { pt?: string; en?: string };
    ctaText?: { pt?: string; en?: string };
    backgroundImage?: string;
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  renderImageField: (value: string, path: Array<string | number>, label: string, placeholder?: string, readOnly?: boolean) => ReactNode;
};

function resolvePreviewData(data: HeroEditorProps['data'], language: CmsLanguage): ResolvedHeroData {
  const toI18nField = (field?: { pt?: string; en?: string }): I18nField => ({
    pt: field?.pt ?? '',
    en: field?.en ?? '',
  });

  return {
    backgroundImage: data.backgroundImage ?? '',
    headline: pickLang(toI18nField(data.headline), language),
    subheadline: pickLang(toI18nField(data.subheadline), language),
    ctaText: pickLang(toI18nField(data.ctaText), language),
  };
}

export function HeroEditor({ data, isFieldDirty, onFieldChange, renderImageField }: HeroEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');

  const langs = [
    { lang: 'pt', label: 'Português (PT)' },
    { lang: 'en', label: 'Inglês (EN)' },
  ] as const;

  return (
    <div className={adminPanelGridClass}>
      {langs.map(({ lang, label }) => (
        <AdminEditorCard key={lang} title={label}>
          <AdminTextareaField
            label="Headline"
            path={['headline', lang]}
            value={data.headline?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
            rows={2}
          />
          <AdminTextareaField
            label="Subheadline"
            path={['subheadline', lang]}
            value={data.subheadline?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
            rows={4}
          />
          <AdminInputField
            label="CTA Text"
            path={['ctaText', lang]}
            value={data.ctaText?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
          />
        </AdminEditorCard>
      ))}
      <div className="col-span-full">
        {renderImageField(data.backgroundImage ?? '', ['backgroundImage'], 'Background Image', '/hero-bg.jpg')}
      </div>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <HeroSection data={resolvePreviewData(data, previewLang)} />
      </AdminPreviewPanel>
    </div>
  );
}
