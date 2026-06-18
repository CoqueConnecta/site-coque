import type { ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
  adminDangerButtonClass,
  adminPrimaryGhostButtonClass,
  adminSectionGroupClass,
  adminSectionItemClass,
  adminSectionTitleClass,
} from '../../../components/shared/adminEditorStyles';
import { Button } from '../../../../../components/ui/Button';
import { Plus } from 'lucide-react';

type I18nField = { pt?: string; en?: string };

type Project = {
  id?: string;
  image?: string;
  location?: string;
  actionHref?: string;
  title?: I18nField;
  bodyMd?: I18nField;
  actionLabel?: I18nField;
};

type ProjectsEditorProps = {
  data: { items?: Project[] };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  renderImageField: (value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
};

export function ProjectsEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, renderImageField }: ProjectsEditorProps) {
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className={adminSectionGroupClass}>
      {items.map((project, index) => (
        <div key={project.id ?? index} className={adminSectionItemClass}>
          <div className="flex justify-between items-start gap-4">
            <h4 className={adminSectionTitleClass}>
              Projeto {index + 1}
              {project.title?.pt && <span className="ml-2 font-normal text-gray-500">— {project.title.pt}</span>}
            </h4>
            <button
              type="button"
              onClick={() => onRemoveArrayItem(['items'], index)}
              className={adminDangerButtonClass}
            >
              Remover
            </button>
          </div>

          {/* Global fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className={adminFieldLabelClass}>ID</span>
              <input type="text" value={project.id ?? ''} onChange={(e) => onFieldChange(['items', index, 'id'], e.target.value)} className={getAdminInputClass(isFieldDirty(['items', index, 'id']))} />
            </label>
            <label className="block">
              <span className={adminFieldLabelClass}>Localização</span>
              <input type="text" value={project.location ?? ''} onChange={(e) => onFieldChange(['items', index, 'location'], e.target.value)} className={getAdminInputClass(isFieldDirty(['items', index, 'location']))} />
            </label>
            <label className="block col-span-full">
              <span className={adminFieldLabelClass}>URL da ação (actionHref)</span>
              <input type="text" value={project.actionHref ?? ''} onChange={(e) => onFieldChange(['items', index, 'actionHref'], e.target.value)} className={getAdminInputClass(isFieldDirty(['items', index, 'actionHref']))} />
            </label>
          </div>

          <div className="mt-3">
            {renderImageField(project.image ?? '', ['items', index, 'image'], 'Imagem do projeto', '/placeholder-image.png')}
          </div>

          {/* i18n fields */}
          <div className={`${adminPanelGridClass} mt-4`}>
            {(['pt', 'en'] as const).map((lang) => (
              <AdminEditorCard key={lang} title={lang === 'pt' ? 'Português (PT)' : 'Inglês (EN)'}>
                <label className="block">
                  <span className={adminFieldLabelClass}>Título</span>
                  <input type="text" value={project.title?.[lang] ?? ''} onChange={(e) => onFieldChange(['items', index, 'title', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['items', index, 'title', lang]))} />
                </label>
                <label className="block">
                  <span className={adminFieldLabelClass}>Descrição (Markdown)</span>
                  <textarea value={project.bodyMd?.[lang] ?? ''} onChange={(e) => onFieldChange(['items', index, 'bodyMd', lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty(['items', index, 'bodyMd', lang]))} rows={4} />
                </label>
                <label className="block">
                  <span className={adminFieldLabelClass}>Botão de ação</span>
                  <input type="text" value={project.actionLabel?.[lang] ?? ''} onChange={(e) => onFieldChange(['items', index, 'actionLabel', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['items', index, 'actionLabel', lang]))} />
                </label>
              </AdminEditorCard>
            ))}
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onAddArrayItem(['items'])}
        className={adminPrimaryGhostButtonClass}
      >
        <Plus className="h-4 w-4 mr-2" /> Adicionar projeto
      </Button>
    </div>
  );
}
