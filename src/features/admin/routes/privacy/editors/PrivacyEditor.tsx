import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { Button } from '../../../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };
type DocSection = { title?: I18nField; bodyMd?: I18nField };

type DocEditorProps = {
  data: { title?: I18nField; updatedAt?: I18nField; intro?: I18nField; sections?: DocSection[] };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
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

export function PrivacyEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem }: DocEditorProps) {
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  return (
    <div className="space-y-6">
      <I18nTextField label="Título" pathPt={['title','pt']} pathEn={['title','en']} valuePt={data.title?.pt ?? ''} valueEn={data.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nTextField label="Atualizado em" pathPt={['updatedAt','pt']} pathEn={['updatedAt','en']} valuePt={data.updatedAt?.pt ?? ''} valueEn={data.updatedAt?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nTextField label="Intro" pathPt={['intro','pt']} pathEn={['intro','en']} valuePt={data.intro?.pt ?? ''} valueEn={data.intro?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />
      <h4 className="text-sm font-semibold text-gray-700">Seções</h4>
      {sections.map((section, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Seção {index + 1}</span>
            <button type="button" onClick={() => onRemoveArrayItem(['sections'], index)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
          </div>
          <I18nTextField label="Título" pathPt={['sections',index,'title','pt']} pathEn={['sections',index,'title','en']} valuePt={section.title?.pt ?? ''} valueEn={section.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
          <I18nTextField label="Conteúdo (Markdown)" pathPt={['sections',index,'bodyMd','pt']} pathEn={['sections',index,'bodyMd','en']} valuePt={section.bodyMd?.pt ?? ''} valueEn={section.bodyMd?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onAddArrayItem(['sections'])} className="flex items-center gap-2 text-sm"><Plus className="h-4 w-4" /> Adicionar seção</Button>
    </div>
  );
}
