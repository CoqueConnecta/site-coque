import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../types/cms';
import { isRecord } from '../../utils/editorPath';

type DynamicSectionEditorProps = {
  sectionName: string;
  ptValue: unknown;
  enValue: unknown;
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

export function DynamicSectionEditor({
  sectionName,
  ptValue,
  enValue,
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
          <div className="flex items-center justify-between">
            <span className="block text-sm font-medium text-gray-700">{label}</span>
            <button
              type="button"
              onClick={() => onAddArrayItem(language, path)}
              className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200"
            >
              + Adicionar item
            </button>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            {value.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum item cadastrado.</p>
            ) : null}
            {value.map((item, index) => (
              <div key={`${label}-${index}`} className="rounded-md border border-gray-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Item {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => onRemoveArrayItem(language, path, index)}
                    className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
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
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700">{label}</p>
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
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
      );
    }

    if (typeof value === 'number') {
      return (
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
          <input
            type="number"
            value={value}
            onChange={(e) => onSectionFieldChange(language, path, Number(e.target.value))}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </label>
      );
    }

    const textValue = value === null || value === undefined ? '' : String(value);
    const useTextarea = textValue.includes('\n') || textValue.length > 80;

    if (isImageFieldPath(path)) {
      return renderImageField(language, textValue, path, label);
    }

    return (
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
        {useTextarea ? (
          <textarea
            value={textValue}
            onChange={(e) => onSectionFieldChange(language, path, e.target.value)}
            className="min-h-24 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <input
            type="text"
            value={textValue}
            onChange={(e) => onSectionFieldChange(language, path, e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        )}
      </label>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Português (PT)</h3>
        <p className="mb-3 text-sm text-gray-500">Edite os campos abaixo em formato de formulário.</p>
        {renderField('pt', ptValue, [], formatLabel(sectionName))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Inglês (EN)</h3>
        <p className="mb-3 text-sm text-gray-500">Edite os campos abaixo em formato de formulário.</p>
        {renderField('en', enValue, [], formatLabel(sectionName))}
      </div>
    </div>
  );
}
