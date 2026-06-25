import { useState, type ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
} from '../../../components/shared/adminEditorStyles';
import { RichTextEditor } from '../../../components/shared/RichTextEditor';
import { AdminInputField } from '../../../components/form/AdminInputField';
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
  onMoveArrayItem: (path: Array<string | number>, index: number, direction: 'up' | 'down') => void;
  onDuplicateArrayItem: (path: Array<string | number>, index: number) => void;
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

export function ProjectsEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem, renderImageField }: ProjectsEditorProps) {
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
          onDuplicate={() => onDuplicateArrayItem(['items'], index)}
          onMoveUp={index > 0 ? () => onMoveArrayItem(['items'], index, 'up') : undefined}
          onMoveDown={index < items.length - 1 ? () => onMoveArrayItem(['items'], index, 'down') : undefined}
        >
          {/* Global fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInputField label="ID" path={['items', index, 'id']} value={project.id ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
            <AdminInputField label="Localização" path={['items', index, 'location']} value={project.location ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
            <div className="col-span-full">
              <AdminInputField label="URL da ação (actionHref)" path={['items', index, 'actionHref']} value={project.actionHref ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
            </div>
          </div>

          {renderImageField(project.image ?? '', ['items', index, 'image'], 'Imagem do projeto', '/placeholder-image.png')}

          {/* i18n fields */}
          <div className={adminPanelGridClass}>
            {(['pt', 'en'] as const).map((lang) => (
              <AdminEditorCard key={lang} title={lang === 'pt' ? 'Português (PT)' : 'Inglês (EN)'}>
                <AdminInputField label="Título" path={['items', index, 'title', lang]} value={project.title?.[lang] ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
                <div className="block">
                  <span className={adminFieldLabelClass}>Descrição (Markdown)</span>
                  <RichTextEditor
                    value={project.bodyMd?.[lang] ?? ''}
                    onChange={(md) => onFieldChange(['items', index, 'bodyMd', lang], md)}
                    isDirty={isFieldDirty(['items', index, 'bodyMd', lang])}
                    ariaLabel={`Descrição (${lang.toUpperCase()})`}
                  />
                </div>
                <AdminInputField label="Botão de ação" path={['items', index, 'actionLabel', lang]} value={project.actionLabel?.[lang] ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
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
