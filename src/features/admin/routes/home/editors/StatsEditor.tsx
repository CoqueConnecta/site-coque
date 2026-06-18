import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { Button } from '../../../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };

type StatsEditorProps = {
  data: { items?: Array<{ value?: string; label?: I18nField }> };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
};

export function StatsEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem }: StatsEditorProps) {
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={index} className={`${adminPanelGridClass} border border-gray-200 rounded-lg p-4`}>
          <div className="col-span-full flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Estatística {index + 1}</span>
            <button type="button" onClick={() => onRemoveArrayItem(['items'], index)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {/* Value — global */}
          <div className="col-span-full">
            <label className="block">
              <span className={adminFieldLabelClass}>Valor (global)</span>
              <input
                type="text"
                placeholder="ex: +2.000"
                value={item.value ?? ''}
                onChange={(e) => onFieldChange(['items', index, 'value'], e.target.value)}
                className={getAdminInputClass(isFieldDirty(['items', index, 'value']))}
              />
            </label>
          </div>
          {/* Label — i18n */}
          {(['pt', 'en'] as const).map((lang) => (
            <AdminEditorCard key={lang} title={lang === 'pt' ? 'Rótulo (PT)' : 'Label (EN)'} badgeText="Idioma">
              <label className="block">
                <span className={adminFieldLabelClass}>Rótulo</span>
                <input
                  type="text"
                  value={item.label?.[lang] ?? ''}
                  onChange={(e) => onFieldChange(['items', index, 'label', lang], e.target.value)}
                  className={getAdminInputClass(isFieldDirty(['items', index, 'label', lang]))}
                />
              </label>
            </AdminEditorCard>
          ))}
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onAddArrayItem(['items'])} className="flex items-center gap-2 text-sm">
        <Plus className="h-4 w-4" /> Adicionar estatística
      </Button>
    </div>
  );
}
