import { useState, type ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { adminPanelGridClass } from '../../../components/shared/adminEditorStyles';
import { AdminInputField } from '../../../components/form/AdminInputField';
import { AdminTextareaField } from '../../../components/form/AdminTextareaField';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { TrustSection } from '../../../../../components/sections/TrustSection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, I18nField, ResolvedTrustData } from '../../../../../types/cms';

type TrustEditorProps = {
  data: {
    headline?: { pt?: string; en?: string };
    subtitle?: { pt?: string; en?: string };
    pressItems?: Array<{ outlet?: string; title?: string; url?: string }>;
    partnerLogos?: Array<{ src?: string; alt?: string; url?: string }>;
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>, defaultItem?: Record<string, unknown>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  onMoveArrayItem: (path: Array<string | number>, index: number, direction: 'up' | 'down') => void;
  onDuplicateArrayItem: (path: Array<string | number>, index: number) => void;
  renderImageField: (value: string, path: Array<string | number>, label: string, placeholder?: string, readOnly?: boolean) => ReactNode;
};

function resolvePreviewData(data: TrustEditorProps['data'], language: CmsLanguage): ResolvedTrustData {
  const toI18nField = (field?: { pt?: string; en?: string }): I18nField => ({
    pt: field?.pt ?? '',
    en: field?.en ?? '',
  });

  return {
    headline: pickLang(toI18nField(data.headline), language),
    subtitle: pickLang(toI18nField(data.subtitle), language),
    pressItems: (data.pressItems ?? [])
      .filter((item): item is { outlet: string; title: string; url: string } => Boolean(item.outlet && item.title && item.url)),
    partnerLogos: (data.partnerLogos ?? [])
      .filter((logo): logo is { src: string; alt?: string; url?: string } => Boolean(logo.src))
      .map((logo) => ({ src: logo.src, alt: logo.alt ?? '', url: logo.url })),
  };
}

export function TrustEditor({
  data,
  isFieldDirty,
  onFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onMoveArrayItem,
  onDuplicateArrayItem,
  renderImageField,
}: TrustEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');
  const pressItems = Array.isArray(data?.pressItems) ? data.pressItems : [];
  const partnerLogos = Array.isArray(data?.partnerLogos) ? data.partnerLogos : [];

  const langs = [
    { lang: 'pt', label: 'Português (PT)' },
    { lang: 'en', label: 'Inglês (EN)' },
  ] as const;

  return (
    <div className="space-y-8">
      <div className={adminPanelGridClass}>
        {langs.map(({ lang, label }) => (
          <AdminEditorCard key={lang} title={label}>
            <AdminInputField
              label="Headline"
              path={['headline', lang]}
              value={data.headline?.[lang] ?? ''}
              isFieldDirty={isFieldDirty}
              onFieldChange={onFieldChange}
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

      <div className="space-y-4">
        <p className="text-xs text-[var(--admin-text-3)]">
          Menções de imprensa — manchete em português, fiel à fonte original (não traduzir).
        </p>
        {pressItems.length === 0 && (
          <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhuma menção de imprensa adicionada ainda.</p>
        )}
        {pressItems.map((item, index) => (
          <CollapsibleItem
            key={index}
            label={`Imprensa ${index + 1}`}
            summary={item.outlet || ''}
            onRemove={() => onRemoveArrayItem(['pressItems'], index)}
            onDuplicate={() => onDuplicateArrayItem(['pressItems'], index)}
            onMoveUp={index > 0 ? () => onMoveArrayItem(['pressItems'], index, 'up') : undefined}
            onMoveDown={index < pressItems.length - 1 ? () => onMoveArrayItem(['pressItems'], index, 'down') : undefined}
          >
            <AdminInputField
              label="Veículo"
              path={['pressItems', index, 'outlet']}
              value={item.outlet ?? ''}
              isFieldDirty={isFieldDirty}
              onFieldChange={onFieldChange}
              placeholder="G1"
            />
            <AdminInputField
              label="Título / manchete"
              path={['pressItems', index, 'title']}
              value={item.title ?? ''}
              isFieldDirty={isFieldDirty}
              onFieldChange={onFieldChange}
            />
            <AdminInputField
              label="URL"
              path={['pressItems', index, 'url']}
              value={item.url ?? ''}
              isFieldDirty={isFieldDirty}
              onFieldChange={onFieldChange}
              placeholder="https://..."
            />
          </CollapsibleItem>
        ))}
        <AdminAddButton onClick={() => onAddArrayItem(['pressItems'], { outlet: '', title: '', url: '' })}>Adicionar menção de imprensa</AdminAddButton>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-[var(--admin-text-3)]">
          Logos de parceiros/financiadores. Enquanto vazio, esse bloco fica oculto no site.
        </p>
        {partnerLogos.length === 0 && (
          <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhum logo adicionado ainda.</p>
        )}
        {partnerLogos.map((logo, index) => (
          <CollapsibleItem
            key={index}
            label={`Parceiro ${index + 1}`}
            summary={logo.alt || ''}
            onRemove={() => onRemoveArrayItem(['partnerLogos'], index)}
            onDuplicate={() => onDuplicateArrayItem(['partnerLogos'], index)}
            onMoveUp={index > 0 ? () => onMoveArrayItem(['partnerLogos'], index, 'up') : undefined}
            onMoveDown={index < partnerLogos.length - 1 ? () => onMoveArrayItem(['partnerLogos'], index, 'down') : undefined}
          >
            {renderImageField(logo.src ?? '', ['partnerLogos', index, 'src'], 'Logo', undefined, true)}
            <AdminInputField
              label="Alt Text (PT)"
              path={['partnerLogos', index, 'alt']}
              value={logo.alt ?? ''}
              isFieldDirty={isFieldDirty}
              onFieldChange={onFieldChange}
            />
            <AdminInputField
              label="URL (opcional)"
              path={['partnerLogos', index, 'url']}
              value={logo.url ?? ''}
              isFieldDirty={isFieldDirty}
              onFieldChange={onFieldChange}
              placeholder="https://..."
            />
          </CollapsibleItem>
        ))}
        <AdminAddButton onClick={() => onAddArrayItem(['partnerLogos'], { src: '', alt: '', url: '' })}>Adicionar logo</AdminAddButton>
      </div>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <TrustSection data={resolvePreviewData(data, previewLang)} language={previewLang} />
      </AdminPreviewPanel>
    </div>
  );
}
