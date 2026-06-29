import { useState } from 'react';
import { adminSectionTitleClass } from '../../../components/shared/adminEditorStyles';
import { I18nTextField } from '../../../components/form/I18nTextField';
import { I18nRichTextField } from '../../../components/form/I18nRichTextField';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { CollapsiblePreview } from '../../../components/shared/CollapsiblePreview';
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
          <I18nRichTextField label="Conteúdo" pathPt={['sections',index,'bodyMd','pt']} pathEn={['sections',index,'bodyMd','en']} valuePt={section.bodyMd?.pt ?? ''} valueEn={section.bodyMd?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />

          <CollapsiblePreview label="Pré-visualização desta seção">
            <TransparencyDocSection title={preview.sections[index].title} bodyMd={preview.sections[index].bodyMd} />
          </CollapsiblePreview>
        </CollapsibleItem>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['sections'])}>Adicionar seção</AdminAddButton>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <TransparencySection data={preview} />
      </AdminPreviewPanel>
    </div>
  );
}
