import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import { adminPanelGridClass } from '../../../components/shared/adminEditorStyles';
import { AdminInputField } from '../../../components/form/AdminInputField';
import { AdminTextareaField } from '../../../components/form/AdminTextareaField';

type WhatWeDoEditorProps = {
  data: {
    headline?: { pt?: string; en?: string };
    subtitle?: { pt?: string; en?: string };
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
};

export function WhatWeDoEditor({ data, isFieldDirty, onFieldChange }: WhatWeDoEditorProps) {
  const langs = [
    { lang: 'pt', label: 'Português (PT)' },
    { lang: 'en', label: 'Inglês (EN)' },
  ] as const;

  return (
    <div className={adminPanelGridClass}>
      {langs.map(({ lang, label }) => (
        <AdminEditorCard key={lang} title={label}>
          <AdminInputField
            label="Headline"
            path={['headline', lang]}
            value={data.headline?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
            placeholder="O que Fazemos"
          />
          <AdminTextareaField
            label="Subtítulo"
            path={['subtitle', lang]}
            value={data.subtitle?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
            rows={3}
          />
        </AdminEditorCard>
      ))}
    </div>
  );
}
