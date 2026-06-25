import { type ReactNode } from 'react';
import { RichTextEditor } from './RichTextEditor';
import type { CmsLanguage } from '../../../../types/cms';
import { isRecord } from '../../utils/editorPath';
import { AdminEditorCard } from './AdminEditorCard';
import {
  adminCheckboxClass,
  adminDangerButtonClass,
  adminFieldLabelClass,
  adminMetaLabelClass,
  adminPanelGridClass,
  adminPrimaryGhostButtonClass,
  adminSectionGroupClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from './adminEditorStyles';

type DynamicSectionEditorProps = {
  sectionName: string;
  ptValue: unknown;
  enValue: unknown;
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

function formatLabel(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function isImageFieldPath(path: Array<string | number>) {
  const key = path[path.length - 1];
  if (typeof key !== 'string') {
    return false;
  }

  return ['image', 'backgroundimage', 'src', 'avatar', 'authoravatar'].includes(key.toLowerCase());
}

function isMarkdownFieldPath(path: Array<string | number>) {
  const key = path[path.length - 1];
  return typeof key === 'string' && key.toLowerCase() === 'bodymd';
}



export function DynamicSectionEditor({
  sectionName,
  ptValue,
  enValue,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
}: DynamicSectionEditorProps) {
  const renderField = (
    language: CmsLanguage,
    value: unknown,
    path: Array<string | number>,
    label: string
  ): ReactNode => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={adminSectionTitleClass}>{label}</span>
            <button
              type="button"
              onClick={() => onAddArrayItem(language, path)}
              className={adminPrimaryGhostButtonClass}
            >
              + Adicionar item
            </button>
          </div>
          <div className={adminSectionGroupClass}>
            {value.length === 0 ? (
              <p className="text-sm text-[var(--admin-text-3)]">Nenhum item cadastrado.</p>
            ) : null}
            {value.map((item, index) => (
              <div key={`${label}-${index}`} className={adminSectionItemClass}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className={adminMetaLabelClass}>Item {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => onRemoveArrayItem(language, path, index)}
                    className={adminDangerButtonClass}
                  >
                    Remover
                  </button>
                </div>
                {renderField(language, item, [...path, index], `${label} ${index + 1}`)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isRecord(value)) {
      return (
        <div className={adminSectionGroupClass}>
          <p className={adminSectionTitleClass}>{label}</p>
          {Object.entries(value).map(([key, nestedValue]) => (
            <div key={`${path.join('-')}-${key}`}>
              {renderField(language, nestedValue, [...path, key], formatLabel(key))}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onSectionFieldChange(language, path, e.target.checked)}
            className={adminCheckboxClass}
          />
          <span className="text-sm font-medium text-[var(--admin-text-2)]">{label}</span>
        </label>
      );
    }

    if (typeof value === 'number') {
      return (
        <label className="block">
          <span className={adminFieldLabelClass}>{label}</span>
          <input
            type="number"
            value={value}
            onChange={(e) => onSectionFieldChange(language, path, Number(e.target.value))}
            className={getAdminInputClass(isFieldDirty(language, path))}
          />
        </label>
      );
    }

    const textValue = value === null || value === undefined ? '' : String(value);
    const useTextarea = textValue.includes('\n') || textValue.length > 80;

    if (isImageFieldPath(path)) {
      return renderImageField(language, textValue, path, label);
    }

    if (isMarkdownFieldPath(path)) {
      return (
        <div className="block">
          <span className={adminFieldLabelClass}>{label}</span>
          <RichTextEditor
            value={textValue}
            onChange={(md) => onSectionFieldChange(language, path, md)}
            isDirty={isFieldDirty(language, path)}
          />
        </div>
      );
    }

    if (useTextarea) {
      return (
        <label className="block">
          <span className={adminFieldLabelClass}>{label}</span>
          <textarea
            value={textValue}
            onChange={(e) => onSectionFieldChange(language, path, e.target.value)}
            className={getAdminTextareaClass(isFieldDirty(language, path))}
          />
        </label>
      );
    }

    return (
      <label className="block">
        <span className={adminFieldLabelClass}>{label}</span>
        <input
          type="text"
          value={textValue}
          onChange={(e) => onSectionFieldChange(language, path, e.target.value)}
          className={getAdminInputClass(isFieldDirty(language, path))}
        />
      </label>
    );
  };

  return (
    <div className={adminPanelGridClass}>
      <AdminEditorCard
        title="Português (PT)"
        description="Edite os campos abaixo em formato de formulário."
      >
        {renderField('pt', ptValue, [], formatLabel(sectionName))}
      </AdminEditorCard>

      <AdminEditorCard
        title="Inglês (EN)"
        description="Edite os campos abaixo em formato de formulário."
      >
        {renderField('en', enValue, [], formatLabel(sectionName))}
      </AdminEditorCard>
    </div>
  );
}
