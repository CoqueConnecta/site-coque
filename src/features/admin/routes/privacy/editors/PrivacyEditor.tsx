import { useState } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminPanelGridClass,
  adminSectionTitleClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { RichTextEditor } from '../../../components/shared/RichTextEditor';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { PrivacySection } from '../../../../../components/sections/PrivacySection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, ResolvedPrivacyData } from '../../../../../types/cms';

type I18nField = { pt?: string; en?: string };
type DocSection = { title?: I18nField; bodyMd?: I18nField };

type DocEditorProps = {
  data: { title?: I18nField; updatedAt?: I18nField; intro?: I18nField; sections?: DocSection[] };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  onMoveArrayItem: (path: Array<string | number>, index: number, direction: 'up' | 'down') => void;
  onDuplicateArrayItem: (path: Array<string | number>, index: number) => void;
};

function I18nTextField({ label, pathPt, pathEn, valuePt, valueEn, isFieldDirty, onFieldChange, multiline = false }: {
  label: string; pathPt: Array<string|number>; pathEn: Array<string|number>;
  valuePt: string; valueEn: string;
  isFieldDirty: (path: Array<string|number>) => boolean;
  onFieldChange: (path: Array<string|number>, value: unknown) => void;
  multiline?: boolean;
}) {
  return (
    <div className={adminPanelGridClass}>
      {([['pt', pathPt, valuePt], ['en', pathEn, valueEn]] as const).map(([lang, path, val]) => (
        <AdminEditorCard key={lang} title={`${label} (${lang.toUpperCase()})`}>
          {multiline
            ? <textarea value={val as string} onChange={(e) => onFieldChange(path as Array<string|number>, e.target.value)} className="w-full rounded-xl border border-[var(--admin-input-bd)] bg-[var(--admin-input-bg)] p-3.5 text-sm text-[var(--admin-text-1)] min-h-24 outline-none transition focus:border-[var(--admin-accent)] focus:ring-4 focus:ring-[var(--admin-focus)]/20" rows={4} />
            : <input type="text" value={val as string} onChange={(e) => onFieldChange(path as Array<string|number>, e.target.value)} className={getAdminInputClass(isFieldDirty(path as Array<string|number>))} />
          }
        </AdminEditorCard>
      ))}
    </div>
  );
}

function I18nRichTextField({ label, pathPt, pathEn, valuePt, valueEn, isFieldDirty, onFieldChange }: {
  label: string; pathPt: Array<string|number>; pathEn: Array<string|number>;
  valuePt: string; valueEn: string;
  isFieldDirty: (path: Array<string|number>) => boolean;
  onFieldChange: (path: Array<string|number>, value: unknown) => void;
}) {
  return (
    <div className={adminPanelGridClass}>
      {([['pt', pathPt, valuePt], ['en', pathEn, valueEn]] as const).map(([lang, path, val]) => (
        <AdminEditorCard key={lang} title={`${label} (${lang.toUpperCase()})`}>
          <RichTextEditor
            value={val as string}
            onChange={(md) => onFieldChange(path as Array<string|number>, md)}
            isDirty={isFieldDirty(path as Array<string|number>)}
          />
        </AdminEditorCard>
      ))}
    </div>
  );
}

function resolvePreviewData(data: DocEditorProps['data'], language: CmsLanguage): ResolvedPrivacyData {
  const toI18nField = (field?: I18nField): { pt: string; en: string } => ({ pt: field?.pt ?? '', en: field?.en ?? '' });

  return {
    title: pickLang(toI18nField(data.title), language),
    updatedAt: pickLang(toI18nField(data.updatedAt), language),
    intro: pickLang(toI18nField(data.intro), language),
    sections: (data.sections ?? []).map((section) => ({
      title: pickLang(toI18nField(section.title), language),
      bodyMd: pickLang(toI18nField(section.bodyMd), language),
    })),
  };
}

export function PrivacyEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem }: DocEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  return (
    <div className="space-y-6">
      <I18nTextField label="Título" pathPt={['title','pt']} pathEn={['title','en']} valuePt={data.title?.pt ?? ''} valueEn={data.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nTextField label="Atualizado em" pathPt={['updatedAt','pt']} pathEn={['updatedAt','en']} valuePt={data.updatedAt?.pt ?? ''} valueEn={data.updatedAt?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nTextField label="Intro" pathPt={['intro','pt']} pathEn={['intro','en']} valuePt={data.intro?.pt ?? ''} valueEn={data.intro?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />
      <h4 className={adminSectionTitleClass}>Seções</h4>
      {sections.map((section, index) => (
        <CollapsibleItem
          key={index}
          label={`Seção ${index + 1}`}
          summary={section.title?.pt || ''}
          onRemove={() => onRemoveArrayItem(['sections'], index)}
          onDuplicate={() => onDuplicateArrayItem(['sections'], index)}
          onMoveUp={index > 0 ? () => onMoveArrayItem(['sections'], index, 'up') : undefined}
          onMoveDown={index < sections.length - 1 ? () => onMoveArrayItem(['sections'], index, 'down') : undefined}
        >
          <I18nTextField label="Título" pathPt={['sections',index,'title','pt']} pathEn={['sections',index,'title','en']} valuePt={section.title?.pt ?? ''} valueEn={section.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
          <I18nRichTextField label="Conteúdo" pathPt={['sections',index,'bodyMd','pt']} pathEn={['sections',index,'bodyMd','en']} valuePt={section.bodyMd?.pt ?? ''} valueEn={section.bodyMd?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
        </CollapsibleItem>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['sections'])}>Adicionar seção</AdminAddButton>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <PrivacySection data={resolvePreviewData(data, previewLang)} />
      </AdminPreviewPanel>
    </div>
  );
}
