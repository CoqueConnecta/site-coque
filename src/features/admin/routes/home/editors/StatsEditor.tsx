import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  adminSectionItemClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { Trash2 } from 'lucide-react';

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
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhuma estatística adicionada ainda.</p>
      )}
      {items.map((item, index) => (
        <div key={index} className={adminSectionItemClass}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-[var(--admin-text-2)]">Estatística {index + 1}</span>
            <button type="button" onClick={() => onRemoveArrayItem(['items'], index)} className="text-rose-500 hover:text-rose-700 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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
          <div className={adminPanelGridClass}>
            {(['pt', 'en'] as const).map((lang) => (
              <AdminEditorCard key={lang} title={lang === 'pt' ? 'Rótulo (PT)' : 'Label (EN)'}>
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
        </div>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['items'])}>Adicionar estatística</AdminAddButton>
    </div>
  );
}
