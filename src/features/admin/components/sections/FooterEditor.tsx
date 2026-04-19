import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';

type FooterEditorProps = {
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

function FooterLanguagePanel({
  language,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: {
  language: CmsLanguage;
  cmsData: CmsLandingByLanguage;
  isFieldDirty: FooterEditorProps['isFieldDirty'];
  onSectionFieldChange: FooterEditorProps['onSectionFieldChange'];
  onAddArrayItem: FooterEditorProps['onAddArrayItem'];
  onRemoveArrayItem: FooterEditorProps['onRemoveArrayItem'];
}) {
  const footerData = cmsData[language].footer;

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-2">Copyright</span>
        <input
          type="text"
          value={footerData.copyright}
          onChange={(e) => onSectionFieldChange(language, ['copyright'], e.target.value)}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
            isFieldDirty(language, ['copyright'])
              ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-2">Endereço</span>
        <textarea
          value={footerData.address}
          onChange={(e) => onSectionFieldChange(language, ['address'], e.target.value)}
          className={`min-h-20 w-full rounded-lg border bg-white p-3 text-sm text-gray-800 outline-none focus:ring-2 ${
            isFieldDirty(language, ['address'])
              ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Telefone</span>
          <input
            type="text"
            value={footerData.phone ?? ''}
            onChange={(e) => onSectionFieldChange(language, ['phone'], e.target.value)}
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty(language, ['phone'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Email</span>
          <input
            type="text"
            value={footerData.email ?? ''}
            onChange={(e) => onSectionFieldChange(language, ['email'], e.target.value)}
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty(language, ['email'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </label>
      </div>

      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-700">Links sociais</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(language, ['socialLinks'])}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
          >
            + Adicionar link social
          </button>
        </div>

        {footerData.socialLinks.map((link, index) => (
          <div key={`${language}-social-${index}`} className="space-y-3 rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Social {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveArrayItem(language, ['socialLinks'], index)}
                className="rounded-md bg-red-100 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
              >
                Remover
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => onSectionFieldChange(language, ['socialLinks', index, 'platform'], e.target.value)}
                className={`h-11 rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                  isFieldDirty(language, ['socialLinks', index, 'platform'])
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="instagram"
              />
              <input
                type="text"
                value={link.icon}
                onChange={(e) => onSectionFieldChange(language, ['socialLinks', index, 'icon'], e.target.value)}
                className={`h-11 rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                  isFieldDirty(language, ['socialLinks', index, 'icon'])
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="instagram"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => onSectionFieldChange(language, ['socialLinks', index, 'url'], e.target.value)}
                className={`h-11 rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                  isFieldDirty(language, ['socialLinks', index, 'url'])
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-700">Links rápidos</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(language, ['quickLinks'])}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
          >
            + Adicionar link rápido
          </button>
        </div>

        {footerData.quickLinks.map((link, index) => (
          <div key={`${language}-quick-${index}`} className="space-y-3 rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Link {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveArrayItem(language, ['quickLinks'], index)}
                className="rounded-md bg-red-100 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
              >
                Remover
              </button>
            </div>

            <input
              type="text"
              value={link.label}
              onChange={(e) => onSectionFieldChange(language, ['quickLinks', index, 'label'], e.target.value)}
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                isFieldDirty(language, ['quickLinks', index, 'label'])
                  ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Sobre nós"
            />

            <input
              type="text"
              value={link.href}
              onChange={(e) => onSectionFieldChange(language, ['quickLinks', index, 'href'], e.target.value)}
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                isFieldDirty(language, ['quickLinks', index, 'href'])
                  ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="/#about"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FooterEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: FooterEditorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:mb-6 lg:text-xl">Português (PT)</h3>
        <p className="mb-3 text-sm text-gray-500">Edite dados institucionais, sociais e links rápidos.</p>
        <FooterLanguagePanel
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
        <p className="mb-3 text-sm text-gray-500">Edit institutional content, social links, and quick links.</p>
        <FooterLanguagePanel
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
