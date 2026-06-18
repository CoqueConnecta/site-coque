import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { Button } from '../../../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };

type AboutEditorProps = {
  data: {
    headline?: I18nField;
    subheadline?: I18nField;
    description?: I18nField;
    subdescription?: I18nField;
    mission?: { title?: I18nField; description?: I18nField };
    vision?: { title?: I18nField; description?: I18nField };
    values?: { title?: I18nField; items?: Array<{ id?: string; label?: I18nField; description?: I18nField }> };
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
};

function I18nRow({ label, pathPt, pathEn, valuePt, valueEn, isFieldDirty, onFieldChange, multiline = false }: {
  label: string;
  pathPt: Array<string | number>;
  pathEn: Array<string | number>;
  valuePt: string;
  valueEn: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  multiline?: boolean;
}) {
  return (
    <div className={adminPanelGridClass}>
      <AdminEditorCard title={`${label} (PT)`} badgeText="Idioma">
        {multiline
          ? <textarea value={valuePt} onChange={(e) => onFieldChange(pathPt, e.target.value)} className={getAdminTextareaClass(isFieldDirty(pathPt))} rows={3} />
          : <input type="text" value={valuePt} onChange={(e) => onFieldChange(pathPt, e.target.value)} className={getAdminInputClass(isFieldDirty(pathPt))} />
        }
      </AdminEditorCard>
      <AdminEditorCard title={`${label} (EN)`} badgeText="Idioma">
        {multiline
          ? <textarea value={valueEn} onChange={(e) => onFieldChange(pathEn, e.target.value)} className={getAdminTextareaClass(isFieldDirty(pathEn))} rows={3} />
          : <input type="text" value={valueEn} onChange={(e) => onFieldChange(pathEn, e.target.value)} className={getAdminInputClass(isFieldDirty(pathEn))} />
        }
      </AdminEditorCard>
    </div>
  );
}

export function AboutEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem }: AboutEditorProps) {
  const valueItems = data.values?.items ?? [];

  return (
    <div className="space-y-6">
      <I18nRow label="Headline" pathPt={['headline','pt']} pathEn={['headline','en']} valuePt={data.headline?.pt ?? ''} valueEn={data.headline?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nRow label="Subheadline" pathPt={['subheadline','pt']} pathEn={['subheadline','en']} valuePt={data.subheadline?.pt ?? ''} valueEn={data.subheadline?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nRow label="Descrição" pathPt={['description','pt']} pathEn={['description','en']} valuePt={data.description?.pt ?? ''} valueEn={data.description?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />
      <I18nRow label="Sub-descrição" pathPt={['subdescription','pt']} pathEn={['subdescription','en']} valuePt={data.subdescription?.pt ?? ''} valueEn={data.subdescription?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />

      <h4 className="font-semibold text-sm text-gray-700 mt-6">Missão</h4>
      <I18nRow label="Título da Missão" pathPt={['mission','title','pt']} pathEn={['mission','title','en']} valuePt={data.mission?.title?.pt ?? ''} valueEn={data.mission?.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nRow label="Descrição da Missão" pathPt={['mission','description','pt']} pathEn={['mission','description','en']} valuePt={data.mission?.description?.pt ?? ''} valueEn={data.mission?.description?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />

      <h4 className="font-semibold text-sm text-gray-700 mt-6">Visão</h4>
      <I18nRow label="Título da Visão" pathPt={['vision','title','pt']} pathEn={['vision','title','en']} valuePt={data.vision?.title?.pt ?? ''} valueEn={data.vision?.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      <I18nRow label="Descrição da Visão" pathPt={['vision','description','pt']} pathEn={['vision','description','en']} valuePt={data.vision?.description?.pt ?? ''} valueEn={data.vision?.description?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />

      <h4 className="font-semibold text-sm text-gray-700 mt-6">Valores</h4>
      <I18nRow label="Título dos Valores" pathPt={['values','title','pt']} pathEn={['values','title','en']} valuePt={data.values?.title?.pt ?? ''} valueEn={data.values?.title?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
      {valueItems.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Valor {index + 1}</span>
            <button type="button" onClick={() => onRemoveArrayItem(['values','items'], index)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
          </div>
          <label className="block">
            <span className={adminFieldLabelClass}>ID</span>
            <input type="text" value={item.id ?? ''} onChange={(e) => onFieldChange(['values','items',index,'id'], e.target.value)} className={getAdminInputClass(isFieldDirty(['values','items',index,'id']))} />
          </label>
          <I18nRow label="Rótulo" pathPt={['values','items',index,'label','pt']} pathEn={['values','items',index,'label','en']} valuePt={item.label?.pt ?? ''} valueEn={item.label?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
          <I18nRow label="Descrição" pathPt={['values','items',index,'description','pt']} pathEn={['values','items',index,'description','en']} valuePt={item.description?.pt ?? ''} valueEn={item.description?.en ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} multiline />
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onAddArrayItem(['values','items'])} className="flex items-center gap-2 text-sm">
        <Plus className="h-4 w-4" /> Adicionar valor
      </Button>
    </div>
  );
}
