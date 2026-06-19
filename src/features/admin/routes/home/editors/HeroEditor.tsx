import { useState, type ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
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
          <label className="block">
            <span className={adminFieldLabelClass}>Headline</span>
            <textarea
              value={data.headline?.[lang] ?? ''}
              onChange={(e) => onFieldChange(['headline', lang], e.target.value)}
              className={getAdminTextareaClass(isFieldDirty(['headline', lang]))}
            />
          </label>
          <label className="block">
            <span className={adminFieldLabelClass}>Subheadline</span>
            <textarea
              value={data.subheadline?.[lang] ?? ''}
              onChange={(e) => onFieldChange(['subheadline', lang], e.target.value)}
              className={getAdminTextareaClass(isFieldDirty(['subheadline', lang]))}
              rows={4}
            />
          </label>
          <label className="block">
            <span className={adminFieldLabelClass}>CTA Text</span>
            <input
              type="text"
              value={data.ctaText?.[lang] ?? ''}
              onChange={(e) => onFieldChange(['ctaText', lang], e.target.value)}
              className={getAdminInputClass(isFieldDirty(['ctaText', lang]))}
            />
          </label>
        </AdminEditorCard>
      ))}
      <div className="col-span-full">
        {renderImageField(data.backgroundImage ?? '', ['backgroundImage'], 'Background Image', '/hero-bg.jpg')}
      </div>

      <div className="col-span-full space-y-3">
        <div className="flex items-center justify-between">
          <span className={adminFieldLabelClass}>Pré-visualização</span>
          <div className="inline-flex rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-1">
            {langs.map(({ lang, label }) => (
              <button
                key={lang}
                type="button"
                onClick={() => setPreviewLang(lang)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  previewLang === lang
                    ? 'bg-[var(--admin-active-bg)] text-[var(--admin-active-text)]'
                    : 'text-[var(--admin-text-3)] hover:text-[var(--admin-text-1)]'
                }`}
                aria-pressed={previewLang === lang}
              >
                {label.replace(/^.*\(([A-Z]+)\)$/, '$1')}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-[var(--admin-border)]">
          <HeroSection data={resolvePreviewData(data, previewLang)} />
        </div>
      </div>
    </div>
  );
}
