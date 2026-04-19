import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';

type StatsEditorProps = {
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
};

function StatsLanguagePanel({
  language,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: {
  language: CmsLanguage;
  cmsData: CmsLandingByLanguage;
  isFieldDirty: StatsEditorProps['isFieldDirty'];
  onSectionFieldChange: StatsEditorProps['onSectionFieldChange'];
  onAddArrayItem: StatsEditorProps['onAddArrayItem'];
  onRemoveArrayItem: StatsEditorProps['onRemoveArrayItem'];
}) {
  const statsData = cmsData[language].stats;

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-700">Itens de impacto</p>
        <button
          type="button"
          onClick={() => onAddArrayItem(language, ['items'])}
          className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
        >
          + Adicionar item
        </button>
      </div>

      <div className="space-y-3">
        {statsData.items.map((item, index) => (
          <div key={`${language}-stats-item-${index}`} className="space-y-3 rounded-md border border-gray-200 bg-white p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Item {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveArrayItem(language, ['items'], index)}
                className="rounded-md bg-red-100 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
              >
                Remover
              </button>
            </div>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">Valor</span>
              <input
                type="text"
                value={item.value}
                onChange={(e) => onSectionFieldChange(language, ['items', index, 'value'], e.target.value)}
                className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                  isFieldDirty(language, ['items', index, 'value'])
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="+2.000"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">Rótulo</span>
              <input
                type="text"
                value={item.label}
                onChange={(e) => onSectionFieldChange(language, ['items', index, 'label'], e.target.value)}
                className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                  isFieldDirty(language, ['items', index, 'label'])
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Jovens impactados"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: StatsEditorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:mb-6 lg:text-xl">Português (PT)</h3>
        <p className="mb-3 text-sm text-gray-500">Edite os indicadores e seus rótulos.</p>
        <StatsLanguagePanel
          language="pt"
          cmsData={cmsData}
          isFieldDirty={isFieldDirty}
          onSectionFieldChange={onSectionFieldChange}
          onAddArrayItem={onAddArrayItem}
          onRemoveArrayItem={onRemoveArrayItem}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:mb-6 lg:text-xl">Inglês (EN)</h3>
        <p className="mb-3 text-sm text-gray-500">Edit impact indicators and labels.</p>
        <StatsLanguagePanel
          language="en"
          cmsData={cmsData}
          isFieldDirty={isFieldDirty}
          onSectionFieldChange={onSectionFieldChange}
          onAddArrayItem={onAddArrayItem}
          onRemoveArrayItem={onRemoveArrayItem}
        />
      </div>
    </div>
  );
}
