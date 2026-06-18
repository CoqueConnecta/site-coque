import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminPanelGridClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };
type DocSection = { title?: I18nField; bodyMd?: I18nField };

type TransparencyEditorProps = {
  data: { title?: I18nField; intro?: I18nField; sections?: DocSection[] };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
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
        <AdminEditorCard key={lang} title={`${label} (${lang.toUpperCase()})`} badgeText="Idioma">
          {multiline
            ? <textarea value={val as string} onChange={(e) => onFieldChange(path as Array<string|number>, e.target.value)} className={getAdminTextareaClass(isFieldDirty(path as Array<string|number>))} rows={4} />
            : <input type="text" value={val as string} onChange={(e) => onFieldChange(path as Array<string|number>, e.target.value)} className={getAdminInputClass(isFieldDirty(path as Array<string|number>))} />
          }
        </AdminEditorCard>
      ))}
    </div>
  );
}

export function TransparencyEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem }: TransparencyEditorProps) {
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  return (
    <div className="space-y-6">
      <I18nTextField label="Título" pathPt={['title','pt']} pathEn={['title','en']} valuePt={data.title?.pt ?? ''} valueEn={data.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nTextField label="Intro" pathPt={['intro','pt']} pathEn={['intro','en']} valuePt={data.intro?.pt ?? ''} valueEn={data.intro?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />
      <h4 className={adminSectionTitleClass}>Seções</h4>
      {sections.map((section, index) => (
        <div key={index} className={adminSectionItemClass}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-[var(--admin-text-2)]">Seção {index + 1}</span>
            <button type="button" onClick={() => onRemoveArrayItem(['sections'], index)} className="text-rose-500 hover:text-rose-700 transition-colors"><Trash2 className="h-4 w-4" /></button>
          </div>
          <I18nTextField label="Título" pathPt={['sections',index,'title','pt']} pathEn={['sections',index,'title','en']} valuePt={section.title?.pt ?? ''} valueEn={section.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
          <I18nTextField label="Conteúdo" pathPt={['sections',index,'bodyMd','pt']} pathEn={['sections',index,'bodyMd','en']} valuePt={section.bodyMd?.pt ?? ''} valueEn={section.bodyMd?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />
        </div>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['sections'])}>Adicionar seção</AdminAddButton>
    </div>
  );
}
