import type { CmsLanguage } from '../../../../../types/cms';
import type { CmsLandingByLanguage } from '../../../types';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminDangerButtonClass,
  adminFieldLabelClass,
  adminMetaLabelClass,
  adminPrimaryGhostButtonClass,
  adminSectionGroupClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import type { ReactNode } from 'react';

type ProjectsEditorProps = {
  cmsData: CmsLandingByLanguage;
  isFieldDirty: (language: CmsLanguage, path: Array<string | number>) => boolean;
  onSectionFieldChange: (
    language: CmsLanguage,
    path: Array<string | number>,
    value: unknown
  ) => void;
  onAddArrayItem: (language: CmsLanguage, path: Array<string | number>) => void;
  onRemoveArrayItem: (
    language: CmsLanguage,
    path: Array<string | number>,
    index: number
  ) => void;
  renderImageField: (
    language: CmsLanguage,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string
  ) => ReactNode;
};

function ProjectsGlobalPanel({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
}: ProjectsEditorProps) {
  // Use PT as the source of truth for the array length and global fields
  const projects = cmsData.pt.projects || [];
  const enProjects = cmsData.en.projects || [];

  const handleAddProject = () => {
    onAddArrayItem('pt', []);
    onAddArrayItem('en', []);
  };

  const handleRemoveProject = (index: number) => {
    onRemoveArrayItem('pt', [], index);
    onRemoveArrayItem('en', [], index);
  };

  const handleGlobalFieldChange = (index: number, field: string, value: unknown) => {
    onSectionFieldChange('pt', [index, field], value);
    onSectionFieldChange('en', [index, field], value);
  };

  return (
    <div className={adminSectionGroupClass}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={adminSectionTitleClass}>Lista de Projetos</p>
        <button
          type="button"
          onClick={handleAddProject}
          className={adminPrimaryGhostButtonClass}
        >
          + Adicionar projeto
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => {
          const enProject = enProjects[index] || {};

          return (
            <div key={`global-project-${index}`} className={adminSectionItemClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={adminMetaLabelClass}>Projeto {index + 1}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className={adminDangerButtonClass}
                >
                  Remover
                </button>
              </div>

              {/* GLOBAL FIELDS */}
              <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                <label className="block">
                  <span className={adminFieldLabelClass}>ID interno (Global)</span>
                  <input
                    type="text"
                    value={project.id || ''}
                    onChange={(e) => handleGlobalFieldChange(index, 'id', e.target.value)}
                    className={getAdminInputClass(isFieldDirty('pt', [index, 'id']))}
                    placeholder="ex: horta-comunitaria"
                  />
                </label>

                {renderImageField(
                  'pt',
                  project.image || '',
                  [index, 'image'],
                  'Imagem (Global)',
                  '/placeholder-image.png'
                )}

                <label className="block">
                  <span className={adminFieldLabelClass}>Localização (Global)</span>
                  <input
                    type="text"
                    value={project.location || ''}
                    onChange={(e) => handleGlobalFieldChange(index, 'location', e.target.value)}
                    className={getAdminInputClass(isFieldDirty('pt', [index, 'location']))}
                  />
                </label>

                <label className="block">
                  <span className={adminFieldLabelClass}>Link do Botão (Global)</span>
                  <input
                    type="text"
                    value={project.actionHref || ''}
                    onChange={(e) => handleGlobalFieldChange(index, 'actionHref', e.target.value)}
                    className={getAdminInputClass(isFieldDirty('pt', [index, 'actionHref']))}
                  />
                </label>
              </div>

              {/* LOCALIZED FIELDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PT COLUMN */}
                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded w-max">Português (PT)</p>

                  <label className="block">
                    <span className={adminFieldLabelClass}>Título</span>
                    <input
                      type="text"
                      value={project.title || ''}
                      onChange={(e) => onSectionFieldChange('pt', [index, 'title'], e.target.value)}
                      className={getAdminInputClass(isFieldDirty('pt', [index, 'title']))}
                    />
                  </label>

                  <label className="block">
                    <span className={adminFieldLabelClass}>Descrição (Markdown)</span>
                    <textarea
                      value={project.bodyMd || ''}
                      onChange={(e) => onSectionFieldChange('pt', [index, 'bodyMd'], e.target.value)}
                      className={getAdminTextareaClass(isFieldDirty('pt', [index, 'bodyMd']))}
                      rows={5}
                    />
                  </label>

                  <label className="block">
                    <span className={adminFieldLabelClass}>Texto do Botão</span>
                    <input
                      type="text"
                      value={project.actionLabel || ''}
                      onChange={(e) => onSectionFieldChange('pt', [index, 'actionLabel'], e.target.value)}
                      className={getAdminInputClass(isFieldDirty('pt', [index, 'actionLabel']))}
                    />
                  </label>
                </div>

                {/* EN COLUMN */}
                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded w-max">Inglês (EN)</p>

                  <label className="block">
                    <span className={adminFieldLabelClass}>Título</span>
                    <input
                      type="text"
                      value={enProject.title || ''}
                      onChange={(e) => onSectionFieldChange('en', [index, 'title'], e.target.value)}
                      className={getAdminInputClass(isFieldDirty('en', [index, 'title']))}
                    />
                  </label>

                  <label className="block">
                    <span className={adminFieldLabelClass}>Descrição (Markdown)</span>
                    <textarea
                      value={enProject.bodyMd || ''}
                      onChange={(e) => onSectionFieldChange('en', [index, 'bodyMd'], e.target.value)}
                      className={getAdminTextareaClass(isFieldDirty('en', [index, 'bodyMd']))}
                      rows={5}
                    />
                  </label>

                  <label className="block">
                    <span className={adminFieldLabelClass}>Texto do Botão</span>
                    <input
                      type="text"
                      value={enProject.actionLabel || ''}
                      onChange={(e) => onSectionFieldChange('en', [index, 'actionLabel'], e.target.value)}
                      className={getAdminInputClass(isFieldDirty('en', [index, 'actionLabel']))}
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectsEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
}: ProjectsEditorProps) {
  return (
    <AdminEditorCard
      title="Projetos"
      description="Gerencie a lista de projetos. Os campos globais (ID, Imagem, Localização, Link) são compartilhados, enquanto os títulos e descrições são traduzidos."
      badgeText="Global"
    >
      <ProjectsGlobalPanel
        cmsData={cmsData}
        isFieldDirty={isFieldDirty}
        onSectionFieldChange={onSectionFieldChange}
        onAddArrayItem={onAddArrayItem}
        onRemoveArrayItem={onRemoveArrayItem}
        renderImageField={renderImageField}
      />
    </AdminEditorCard>
  );
}
