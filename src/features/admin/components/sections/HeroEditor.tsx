import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';

type HeroEditorProps = {
  cmsData: CmsLandingByLanguage;
  isFieldDirty: (language: CmsLanguage, path: Array<string | number>) => boolean;
  onHeroFieldChange: (
    language: CmsLanguage,
    field: 'headline' | 'subheadline' | 'ctaText' | 'backgroundImage',
    value: string
  ) => void;
  renderImageField: (
    language: CmsLanguage,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string
  ) => ReactNode;
};

export function HeroEditor({
  cmsData,
  isFieldDirty,
  onHeroFieldChange,
  renderImageField,
}: HeroEditorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:text-xl">Português (PT)</h3>
        <p className="text-sm text-gray-500">Preencha os campos abaixo para editar o Hero sem precisar de JSON.</p>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Headline</span>
          <textarea
            value={cmsData.pt.hero.headline}
            onChange={(e) => onHeroFieldChange('pt', 'headline', e.target.value)}
            className={`min-h-24 w-full rounded-lg border bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty('pt', ['headline'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Subheadline</span>
          <textarea
            value={cmsData.pt.hero.subheadline}
            onChange={(e) => onHeroFieldChange('pt', 'subheadline', e.target.value)}
            className={`min-h-32 w-full rounded-lg border bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty('pt', ['subheadline'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Texto do botão (CTA)</span>
          <input
            type="text"
            value={cmsData.pt.hero.ctaText}
            onChange={(e) => onHeroFieldChange('pt', 'ctaText', e.target.value)}
            className={`h-11 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty('pt', ['ctaText'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </label>

        {renderImageField(
          'pt',
          cmsData.pt.hero.backgroundImage ?? '',
          ['backgroundImage'],
          'Imagem de fundo (opcional)',
          '/assets/banner.jpg'
        )}
      </div>

      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:text-xl">Inglês (EN)</h3>
        <p className="text-sm text-gray-500">Preencha os campos abaixo para editar o Hero sem precisar de JSON.</p>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Headline</span>
          <textarea
            value={cmsData.en.hero.headline}
            onChange={(e) => onHeroFieldChange('en', 'headline', e.target.value)}
            className={`min-h-24 w-full rounded-lg border bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty('en', ['headline'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Subheadline</span>
          <textarea
            value={cmsData.en.hero.subheadline}
            onChange={(e) => onHeroFieldChange('en', 'subheadline', e.target.value)}
            className={`min-h-32 w-full rounded-lg border bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty('en', ['subheadline'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Button text (CTA)</span>
          <input
            type="text"
            value={cmsData.en.hero.ctaText}
            onChange={(e) => onHeroFieldChange('en', 'ctaText', e.target.value)}
            className={`h-11 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isFieldDirty('en', ['ctaText'])
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </label>

        {renderImageField(
          'en',
          cmsData.en.hero.backgroundImage ?? '',
          ['backgroundImage'],
          'Background image (optional)',
          '/assets/banner.jpg'
        )}
      </div>
    </div>
  );
}
