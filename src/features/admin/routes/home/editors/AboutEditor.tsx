import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';

type I18nField = { pt?: string; en?: string };

type AboutEditorProps = {
  data: {
    description?: I18nField;
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
};

export function AboutEditor({ data, isFieldDirty, onFieldChange }: AboutEditorProps) {
  return (
    <div className="space-y-8">
      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'Português (PT)' : 'Inglês (EN)'}>
            <label className="block">
              <span className={adminFieldLabelClass}>Descrição</span>
              <textarea
                value={data.description?.[lang] ?? ''}
                onChange={(e) => onFieldChange(['description', lang], e.target.value)}
                className={getAdminTextareaClass(isFieldDirty(['description', lang]))}
                rows={6}
              />
            </label>
          </AdminEditorCard>
        ))}
      </div>
    </div>
  );
}

