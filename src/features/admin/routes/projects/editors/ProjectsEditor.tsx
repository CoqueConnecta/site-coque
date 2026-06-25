import { useState, type ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { ProjectsSection } from '../../../../../components/sections/ProjectsSection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, ResolvedProject } from '../../../../../types/cms';

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

function resolvePreviewData(data: ProjectsEditorProps['data'], language: CmsLanguage): ResolvedProject[] {
  const toI18nField = (field?: I18nField): { pt: string; en: string } => ({ pt: field?.pt ?? '', en: field?.en ?? '' });

  return (data.items ?? []).map((project) => ({
    id: project.id ?? '',
    image: project.image ?? '',
    location: project.location ?? '',
    actionHref: project.actionHref,
    title: pickLang(toI18nField(project.title), language),
    bodyMd: pickLang(toI18nField(project.bodyMd), language),
    actionLabel: pickLang(toI18nField(project.actionLabel), language),
  }));
}

export function ProjectsEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, renderImageField }: ProjectsEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhum projeto adicionado ainda.</p>
      )}
      {items.map((project, index) => (
        <CollapsibleItem
          key={project.id ?? index}
          label={`Projeto ${index + 1}`}
          summary={project.title?.pt || ''}
          onRemove={() => onRemoveArrayItem(['items'], index)}
        >
          {/* Global fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {renderImageField(project.image ?? '', ['items', index, 'image'], 'Imagem do projeto', '/placeholder-image.png')}

          {/* i18n fields */}
          <div className={adminPanelGridClass}>
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
        </CollapsibleItem>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['items'])}>Adicionar projeto</AdminAddButton>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <ProjectsSection projects={resolvePreviewData(data, previewLang)} language={previewLang} />
      </AdminPreviewPanel>
    </div>
  );
}
