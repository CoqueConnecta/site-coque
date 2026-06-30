import { useState, type ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { adminPanelGridClass, adminFieldLabelClass, getAdminSelectClass } from '../../../components/shared/adminEditorStyles';
import { AdminInputField } from '../../../components/form/AdminInputField';
import { AdminTextareaField } from '../../../components/form/AdminTextareaField';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { HeroSection } from '../../../../../components/sections/HeroSection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, I18nField, ResolvedHeroData } from '../../../../../types/cms';

type HeroEditorProps = {
  data: {
    headline?: { pt?: string; en?: string };
    subheadline?: { pt?: string; en?: string };
    ctaText?: { pt?: string; en?: string };
    ctaHref?: { pt?: string; en?: string };
    secondaryCtaText?: { pt?: string; en?: string };
    secondaryCtaHref?: { pt?: string; en?: string };
    photos?: Array<{ src?: string; alt?: string; objectPosition?: string }>;
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

function resolvePreviewData(data: HeroEditorProps['data'], language: CmsLanguage): ResolvedHeroData {
  const toI18nField = (field?: { pt?: string; en?: string }): I18nField => ({
    pt: field?.pt ?? '',
    en: field?.en ?? '',
  });

  return {
    photos: (data.photos ?? [])
      .filter((photo): photo is { src: string; alt?: string; objectPosition?: string } => Boolean(photo.src))
      .map((photo) => ({ src: photo.src, alt: photo.alt ?? '', objectPosition: photo.objectPosition })),
    headline: pickLang(toI18nField(data.headline), language),
    subheadline: pickLang(toI18nField(data.subheadline), language),
    ctaText: pickLang(toI18nField(data.ctaText), language),
    ctaHref: data.ctaHref ? pickLang(toI18nField(data.ctaHref), language) : undefined,
    secondaryCtaText: pickLang(toI18nField(data.secondaryCtaText), language),
    secondaryCtaHref: data.secondaryCtaHref ? pickLang(toI18nField(data.secondaryCtaHref), language) : undefined,
  };
}

export function HeroEditor({
  data,
  isFieldDirty,
  onFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onMoveArrayItem,
  onDuplicateArrayItem,
  renderImageField,
}: HeroEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');

  const langs = [
    { lang: 'pt', label: 'Português (PT)' },
    { lang: 'en', label: 'Inglês (EN)' },
  ] as const;

  const photos = Array.isArray(data?.photos) ? data.photos : [];

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
            label="CTA Text (primário — Doar)"
            path={['ctaText', lang]}
            value={data.ctaText?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
          />
          <AdminInputField
            label="CTA Href (primário)"
            path={['ctaHref', lang]}
            value={data.ctaHref?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
            placeholder="#ways-to-help"
          />
          <AdminInputField
            label="CTA Text (secundário — Faça Parte)"
            path={['secondaryCtaText', lang]}
            value={data.secondaryCtaText?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
          />
          <AdminInputField
            label="CTA Href (secundário)"
            path={['secondaryCtaHref', lang]}
            value={data.secondaryCtaHref?.[lang] ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
            placeholder="#ways-to-help"
          />
        </AdminEditorCard>
      ))}

      <div className="col-span-full space-y-6">
        <p className="text-xs text-[var(--admin-text-3)]">
          Fotos do carrossel do Hero. Alt text em português — não é exibido para o usuário, serve apenas para acessibilidade.
        </p>
        {photos.length === 0 && (
          <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhuma foto adicionada ainda — o Hero mostra um fundo de gradiente.</p>
        )}
        {photos.map((photo, index) => (
          <CollapsibleItem
            key={index}
            label={`Foto ${index + 1}`}
            summary={photo.alt || ''}
            onRemove={() => onRemoveArrayItem(['photos'], index)}
            onDuplicate={() => onDuplicateArrayItem(['photos'], index)}
            onMoveUp={index > 0 ? () => onMoveArrayItem(['photos'], index, 'up') : undefined}
            onMoveDown={index < photos.length - 1 ? () => onMoveArrayItem(['photos'], index, 'down') : undefined}
          >
            {renderImageField(photo.src ?? '', ['photos', index, 'src'], 'Foto', undefined, true)}
            <AdminInputField
              label="Alt Text (PT)"
              path={['photos', index, 'alt']}
              value={photo.alt ?? ''}
              isFieldDirty={isFieldDirty}
              onFieldChange={onFieldChange}
            />
            <label className="block">
              <span className={adminFieldLabelClass}>Ponto focal (recorte)</span>
              <select
                value={photo.objectPosition ?? ''}
                onChange={(e) => onFieldChange(['photos', index, 'objectPosition'], e.target.value || undefined)}
                className={getAdminSelectClass(isFieldDirty(['photos', index, 'objectPosition']))}
              >
                <option value="">Centro (padrão)</option>
                <option value="top">Topo</option>
                <option value="bottom">Baixo</option>
                <option value="center 25%">Centro superior</option>
                <option value="center 75%">Centro inferior</option>
                <option value="left top">Esquerda superior</option>
                <option value="right top">Direita superior</option>
              </select>
            </label>
          </CollapsibleItem>
        ))}
        <AdminAddButton onClick={() => onAddArrayItem(['photos'], { src: '', alt: '', objectPosition: '' })}>Adicionar foto</AdminAddButton>
      </div>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <HeroSection data={resolvePreviewData(data, previewLang)} />
      </AdminPreviewPanel>
    </div>
  );
}
