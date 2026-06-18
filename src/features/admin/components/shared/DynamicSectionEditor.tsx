import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

function MarkdownHelpAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-amber-200 bg-amber-50/60">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-amber-100/60 transition-colors"
      >
        <span className="text-xs font-semibold text-amber-900">Mini-guia Markdown</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-amber-700" />
        ) : (
          <ChevronDown className="h-4 w-4 text-amber-700" />
        )}
      </button>

      {open ? (
        <div className="border-t border-amber-200 px-3 py-3 text-xs text-amber-900">
          <p>Use os exemplos abaixo para formatar o conteudo da secao:</p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-white p-2 text-[11px] leading-relaxed text-gray-700">
{`## Subtitulo da secao

- Primeiro item da lista
- Segundo item com **destaque**

Veja mais em [site oficial](https://exemplo.com)`}
          </pre>
        </div>
      ) : null}
    </div>
  );
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
    const useTextarea = isMarkdownFieldPath(path) || textValue.includes('\n') || textValue.length > 80;

    if (isImageFieldPath(path)) {
      return renderImageField(language, textValue, path, label);
    }

    if (useTextarea) {
      return (
        <div className="block">
          <label className="block">
            <span className={adminFieldLabelClass}>{label}</span>
            <textarea
              value={textValue}
              onChange={(e) => onSectionFieldChange(language, path, e.target.value)}
              className={getAdminTextareaClass(isFieldDirty(language, path))}
            />
          </label>
          {isMarkdownFieldPath(path) ? (
            <MarkdownHelpAccordion />
          ) : null}
        </div>
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
        badgeText="Idioma"
      >
        {renderField('pt', ptValue, [], formatLabel(sectionName))}
      </AdminEditorCard>

      <AdminEditorCard
        title="Inglês (EN)"
        description="Edite os campos abaixo em formato de formulário."
        badgeText="Idioma"
      >
        {renderField('en', enValue, [], formatLabel(sectionName))}
      </AdminEditorCard>
    </div>
  );
}
