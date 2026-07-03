import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
import { slugify, uniqueSlug } from '../../../utils/slugify';
import { useDisclosure } from '../../../hooks/useDisclosure';
import type { CmsLanguage, ResolvedProject } from '../../../../../types/cms';

type I18nField = { pt?: string; en?: string };

type Project = {
  id?: string;
  image?: string;
  location?: string;
  actionHref?: string;
  archived?: boolean;
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

  return (data.items ?? [])
    .filter((project) => !project.archived)
    .map((project) => ({
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
  const { isOpen: archivedOpen, toggle: toggleArchived } = useDisclosure(false);
  const items = Array.isArray(data?.items) ? data.items : [];

  const itemsWithIndex = items.map((p, i) => ({ ...p, _idx: i }));
  const activeItems = itemsWithIndex.filter((p) => !p.archived);
  const archivedItems = itemsWithIndex.filter((p) => p.archived);

  const handleTitlePtChange = (originalIndex: number, value: string) => {
    onFieldChange(['items', originalIndex, 'title', 'pt'], value);
    const siblingIds = items
      .filter((_, i) => i !== originalIndex)
      .map((p) => p.id ?? '')
      .filter(Boolean);
    onFieldChange(['items', originalIndex, 'id'], uniqueSlug(slugify(value), siblingIds));
  };

  const renderProjectItem = (project: Project & { _idx: number }, withinActive: boolean) => {
    const idx = project._idx;
    const prevIsActive = idx > 0 && !items[idx - 1]?.archived;
    const nextIsActive = idx < items.length - 1 && !items[idx + 1]?.archived;

    return (
      <CollapsibleItem
        key={idx}
        label={`Projeto ${idx + 1}`}
        summary={project.title?.pt || ''}
        onRemove={() => onRemoveArrayItem(['items'], idx)}
        onDuplicate={withinActive ? () => onDuplicateArrayItem(['items'], idx) : undefined}
        onMoveUp={withinActive && prevIsActive ? () => onMoveArrayItem(['items'], idx, 'up') : undefined}
        onMoveDown={withinActive && nextIsActive ? () => onMoveArrayItem(['items'], idx, 'down') : undefined}
        onArchive={() => onFieldChange(['items', idx, 'archived'], !project.archived)}
        isArchived={!!project.archived}
      >
        {/* i18n fields */}
        <div className={adminPanelGridClass}>
          {(['pt', 'en'] as const).map((lang) => (
            <AdminEditorCard key={lang} title={lang === 'pt' ? 'Português (PT)' : 'Inglês (EN)'}>
              <AdminInputField
                label="Título"
                required
                path={['items', idx, 'title', lang]}
                value={project.title?.[lang] ?? ''}
                isFieldDirty={isFieldDirty}
                onFieldChange={lang === 'pt' ? (_path, value) => handleTitlePtChange(idx, value as string) : onFieldChange}
              />
              <div className="block">
                <span className={adminFieldLabelClass}>Descrição (Markdown)</span>
                <RichTextEditor
                  value={project.bodyMd?.[lang] ?? ''}
                  onChange={(md) => onFieldChange(['items', idx, 'bodyMd', lang], md)}
                  isDirty={isFieldDirty(['items', idx, 'bodyMd', lang])}
                  ariaLabel={`Descrição (${lang.toUpperCase()})`}
                />
              </div>
              <AdminInputField label="Botão de ação" path={['items', idx, 'actionLabel', lang]} value={project.actionLabel?.[lang] ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
            </AdminEditorCard>
          ))}
        </div>

        <AdminInputField label="URL da ação (actionHref)" path={['items', idx, 'actionHref']} value={project.actionHref ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />

        {/* Global fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInputField
            label="ID"
            disabled
            helpText="Gerado automaticamente a partir do Título (PT)"
            path={['items', idx, 'id']}
            value={project.id ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
          />
          <AdminInputField label="Localização" path={['items', idx, 'location']} value={project.location ?? ''} isFieldDirty={isFieldDirty} onFieldChange={onFieldChange} />
        </div>

        {renderImageField(project.image ?? '', ['items', idx, 'image'], 'Imagem do projeto', '/placeholder-image.png')}
      </CollapsibleItem>
    );
  };

  return (
    <div className="space-y-4">
      {activeItems.length === 0 && archivedItems.length === 0 && (
        <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhum projeto adicionado ainda.</p>
      )}

      {activeItems.map((project) => renderProjectItem(project, true))}

      <AdminAddButton onClick={() => onAddArrayItem(['items'])}>Adicionar projeto</AdminAddButton>

      {/* Archived section */}
      {archivedItems.length > 0 && (
        <div className="rounded-md border border-amber-900/30 bg-amber-950/10 overflow-hidden">
          <button
            type="button"
            onClick={toggleArchived}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-left"
          >
            {archivedOpen
              ? <ChevronUp className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              : <ChevronDown className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              Arquivados ({archivedItems.length})
            </span>
          </button>
          {archivedOpen && (
            <div className="border-t border-amber-900/30 px-4 pt-4 pb-4 space-y-4">
              {archivedItems.map((project) => renderProjectItem(project, false))}
            </div>
          )}
        </div>
      )}

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <ProjectsSection projects={resolvePreviewData(data, previewLang)} language={previewLang} />
      </AdminPreviewPanel>
    </div>
  );
}
