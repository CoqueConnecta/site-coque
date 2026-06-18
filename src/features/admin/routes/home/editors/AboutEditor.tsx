import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { Trash2 } from 'lucide-react';

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

export function AboutEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem }: AboutEditorProps) {
  const valueItems = data.values?.items ?? [];

  return (
    <div className="space-y-8">
      {/* Campos principais */}
      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'Português (PT)' : 'Inglês (EN)'} badgeText="Idioma">
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

      {/* Missão */}
      <div>
        <h4 className={`${adminSectionTitleClass} mb-3`}>Missão</h4>
        <div className={adminPanelGridClass}>
          {(['pt', 'en'] as const).map((lang) => (
            <AdminEditorCard key={lang} title={lang === 'pt' ? 'PT' : 'EN'} badgeText="Idioma">
              <label className="block">
                <span className={adminFieldLabelClass}>Título</span>
                <input type="text" value={data.mission?.title?.[lang] ?? ''} onChange={(e) => onFieldChange(['mission', 'title', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['mission', 'title', lang]))} />
              </label>
              <label className="block">
                <span className={adminFieldLabelClass}>Descrição</span>
                <textarea value={data.mission?.description?.[lang] ?? ''} onChange={(e) => onFieldChange(['mission', 'description', lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty(['mission', 'description', lang]))} rows={3} />
              </label>
            </AdminEditorCard>
          ))}
        </div>
      </div>

      {/* Visão */}
      <div>
        <h4 className={`${adminSectionTitleClass} mb-3`}>Visão</h4>
        <div className={adminPanelGridClass}>
          {(['pt', 'en'] as const).map((lang) => (
            <AdminEditorCard key={lang} title={lang === 'pt' ? 'PT' : 'EN'} badgeText="Idioma">
              <label className="block">
                <span className={adminFieldLabelClass}>Título</span>
                <input type="text" value={data.vision?.title?.[lang] ?? ''} onChange={(e) => onFieldChange(['vision', 'title', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['vision', 'title', lang]))} />
              </label>
              <label className="block">
                <span className={adminFieldLabelClass}>Descrição</span>
                <textarea value={data.vision?.description?.[lang] ?? ''} onChange={(e) => onFieldChange(['vision', 'description', lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty(['vision', 'description', lang]))} rows={3} />
              </label>
            </AdminEditorCard>
          ))}
        </div>
      </div>

      {/* Valores */}
      <div>
        <h4 className={`${adminSectionTitleClass} mb-3`}>Valores</h4>
        <div className={`${adminPanelGridClass} mb-4`}>
          {(['pt', 'en'] as const).map((lang) => (
            <AdminEditorCard key={lang} title={lang === 'pt' ? 'PT' : 'EN'} badgeText="Idioma">
              <label className="block">
                <span className={adminFieldLabelClass}>Título dos Valores</span>
                <input type="text" value={data.values?.title?.[lang] ?? ''} onChange={(e) => onFieldChange(['values', 'title', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['values', 'title', lang]))} />
              </label>
            </AdminEditorCard>
          ))}
        </div>

        <div className="space-y-3">
          {valueItems.map((item, index) => (
            <div key={index} className={adminSectionItemClass}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[var(--admin-text-2)]">Valor {index + 1}</span>
                <button type="button" onClick={() => onRemoveArrayItem(['values', 'items'], index)} className="text-rose-500 hover:text-rose-700 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <label className="block">
                <span className={adminFieldLabelClass}>ID</span>
                <input type="text" value={item.id ?? ''} onChange={(e) => onFieldChange(['values', 'items', index, 'id'], e.target.value)} className={getAdminInputClass(isFieldDirty(['values', 'items', index, 'id']))} />
              </label>
              <div className={adminPanelGridClass}>
                {(['pt', 'en'] as const).map((lang) => (
                  <AdminEditorCard key={lang} title={lang === 'pt' ? 'PT' : 'EN'} badgeText="Idioma">
                    <label className="block">
                      <span className={adminFieldLabelClass}>Rótulo</span>
                      <input type="text" value={item.label?.[lang] ?? ''} onChange={(e) => onFieldChange(['values', 'items', index, 'label', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['values', 'items', index, 'label', lang]))} />
                    </label>
                    <label className="block">
                      <span className={adminFieldLabelClass}>Descrição</span>
                      <textarea value={item.description?.[lang] ?? ''} onChange={(e) => onFieldChange(['values', 'items', index, 'description', lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty(['values', 'items', index, 'description', lang]))} rows={3} />
                    </label>
                  </AdminEditorCard>
                ))}
              </div>
            </div>
          ))}
        </div>
        <AdminAddButton onClick={() => onAddArrayItem(['values', 'items'])}>Adicionar valor</AdminAddButton>
      </div>
    </div>
  );
}
