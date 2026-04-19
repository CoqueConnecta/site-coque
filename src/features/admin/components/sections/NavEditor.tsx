import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';

type NavEditorProps = {
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

function NavLanguagePanel({
  language,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: {
  language: CmsLanguage;
  cmsData: CmsLandingByLanguage;
  isFieldDirty: NavEditorProps['isFieldDirty'];
  onSectionFieldChange: NavEditorProps['onSectionFieldChange'];
  onAddArrayItem: NavEditorProps['onAddArrayItem'];
  onRemoveArrayItem: NavEditorProps['onRemoveArrayItem'];
}) {
  const navData = cmsData[language].nav;

  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-700">Links do menu</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(language, ['links'])}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
          >
            + Adicionar link
          </button>
        </div>

        <div className="space-y-3">
          {navData.links.map((link, index) => (
            <div key={`${language}-nav-link-${index}`} className="space-y-3 rounded-md border border-gray-200 bg-white p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Link {index + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem(language, ['links'], index)}
                  className="rounded-md bg-red-100 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                >
                  Remover
                </button>
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Identificador interno</span>
                <input
                  type="text"
                  value={link.id}
                  onChange={(e) => onSectionFieldChange(language, ['links', index, 'id'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty(language, ['links', index, 'id'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="about"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Texto exibido</span>
                <input
                  type="text"
                  value={(link as any).labels?.[language] || ''}
                  onChange={(e) => onSectionFieldChange(language, ['links', index, 'labels', language], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty(language, ['links', index, 'labels', language])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Quem Somos"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Link (href)</span>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => onSectionFieldChange(language, ['links', index, 'href'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty(language, ['links', index, 'href'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="/#about"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <p className="text-sm font-semibold text-gray-700">Botão principal (CTA)</p>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Texto do botão</span>
          <input
            type="text"
            value={(navData.cta as any).labels?.[language] || ''}
            onChange={(e) => onSectionFieldChange(language, ['cta', 'labels', language], e.target.value)}
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty(language, ['cta', 'labels', language])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="DOE AGORA"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Link do botão</span>
          <input
            type="text"
            value={navData.cta.href}
            onChange={(e) => onSectionFieldChange(language, ['cta', 'href'], e.target.value)}
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty(language, ['cta', 'href'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="https://..."
          />
        </label>
      </div>
    </div>
  );
}

export function NavEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: NavEditorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:mb-6 lg:text-xl">Português (PT)</h3>
        <p className="mb-3 text-sm text-gray-500">Editor premium de navegação com campos guiados.</p>
        <NavLanguagePanel
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
        <p className="mb-3 text-sm text-gray-500">Premium navigation editor with guided fields.</p>
        <NavLanguagePanel
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
