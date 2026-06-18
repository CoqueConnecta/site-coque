import type { ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';

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
  renderImageField: (value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
};

export function HeroEditor({ data, isFieldDirty, onFieldChange, renderImageField }: HeroEditorProps) {
  const langs = [
    { lang: 'pt', label: 'Português (PT)' },
    { lang: 'en', label: 'Inglês (EN)' },
  ] as const;

  return (
    <div className={adminPanelGridClass}>
      {langs.map(({ lang, label }) => (
        <AdminEditorCard key={lang} title={label} badgeText="Idioma">
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
    </div>
  );
}
