import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
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

export function AboutEditor({ data, isFieldDirty, onFieldChange }: AboutEditorProps) {
  return (
    <div className="space-y-8">
      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'Português (PT)' : 'Inglês (EN)'}>
            <label className="block">
              <span className={adminFieldLabelClass}>Headline</span>
              <input type="text" value={data.headline?.[lang] ?? ''} onChange={(e) => onFieldChange(['headline', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['headline', lang]))} />
            </label>
            <label className="block">
              <span className={adminFieldLabelClass}>Subheadline</span>
              <input type="text" value={data.subheadline?.[lang] ?? ''} onChange={(e) => onFieldChange(['subheadline', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['subheadline', lang]))} />
            </label>
            <label className="block">
              <span className={adminFieldLabelClass}>Descrição</span>
              <textarea value={data.description?.[lang] ?? ''} onChange={(e) => onFieldChange(['description', lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty(['description', lang]))} rows={3} />
            </label>
            <label className="block">
              <span className={adminFieldLabelClass}>Sub-descrição</span>
              <textarea value={data.subdescription?.[lang] ?? ''} onChange={(e) => onFieldChange(['subdescription', lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty(['subdescription', lang]))} rows={3} />
            </label>
          </AdminEditorCard>
        ))}
      </div>

      {/* Missão, Visão e Valores — não usados no site no momento */}
    </div>
  );
}
