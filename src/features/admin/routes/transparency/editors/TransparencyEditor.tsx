import { useState } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  adminSectionTitleClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { TransparencySection, TransparencyDocSection } from '../../../../../components/sections/TransparencySection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, ResolvedTransparencyData } from '../../../../../types/cms';

type I18nField = { pt?: string; en?: string };
type DocSection = { title?: I18nField; bodyMd?: I18nField };

type TransparencyEditorProps = {
  data: { title?: I18nField; intro?: I18nField; sections?: DocSection[] };
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
  isFieldDirty: (p: Array<string|number>) => boolean;
  onFieldChange: (p: Array<string|number>, v: unknown) => void;
  multiline?: boolean;
}) {
  return (
    <div className={adminPanelGridClass}>
      {([['pt', pathPt, valuePt], ['en', pathEn, valueEn]] as const).map(([lang, path, val]) => (
        <AdminEditorCard key={lang} title={`${label} (${lang.toUpperCase()})`}>
          {multiline
            ? <textarea value={val as string} onChange={(e) => onFieldChange(path as Array<string|number>, e.target.value)} className={getAdminTextareaClass(isFieldDirty(path as Array<string|number>))} rows={4} />
            : <input type="text" value={val as string} onChange={(e) => onFieldChange(path as Array<string|number>, e.target.value)} className={getAdminInputClass(isFieldDirty(path as Array<string|number>))} />
          }
        </AdminEditorCard>
      ))}
    </div>
  );
}

function resolvePreviewData(data: TransparencyEditorProps['data'], language: CmsLanguage): ResolvedTransparencyData {
  const toI18nField = (field?: I18nField): { pt: string; en: string } => ({ pt: field?.pt ?? '', en: field?.en ?? '' });

  return {
    title: pickLang(toI18nField(data.title), language),
    intro: pickLang(toI18nField(data.intro), language),
    sections: (data.sections ?? []).map((section) => ({
      title: pickLang(toI18nField(section.title), language),
      bodyMd: pickLang(toI18nField(section.bodyMd), language),
    })),
  };
}

export function TransparencyEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem }: TransparencyEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  const preview = resolvePreviewData(data, previewLang);
  return (
    <div className="space-y-6">
      <I18nTextField label="Título" pathPt={['title','pt']} pathEn={['title','en']} valuePt={data.title?.pt ?? ''} valueEn={data.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
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
          <I18nTextField label="Conteúdo" pathPt={['sections',index,'bodyMd','pt']} pathEn={['sections',index,'bodyMd','en']} valuePt={section.bodyMd?.pt ?? ''} valueEn={section.bodyMd?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />

          <div className="space-y-2">
            <span className={adminFieldLabelClass}>Pré-visualização desta seção</span>
            <div className="overflow-hidden border border-[var(--admin-border)] bg-[color:var(--color-surface-page)] p-6">
              <TransparencyDocSection title={preview.sections[index].title} bodyMd={preview.sections[index].bodyMd} />
            </div>
          </div>
        </CollapsibleItem>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['sections'])}>Adicionar seção</AdminAddButton>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <TransparencySection data={preview} />
      </AdminPreviewPanel>
    </div>
  );
}
