import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';

type GalleryEditorProps = {
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
  onToggleGalleryBlockquote: (
    language: CmsLanguage,
    cardIndex: number,
    enabled: boolean
  ) => void;
  renderImageField: (
    language: CmsLanguage,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string
  ) => ReactNode;
};

function GalleryLanguagePanel({
  language,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onToggleGalleryBlockquote,
  renderImageField,
}: {
  language: CmsLanguage;
  cmsData: CmsLandingByLanguage;
  isFieldDirty: GalleryEditorProps['isFieldDirty'];
  onSectionFieldChange: GalleryEditorProps['onSectionFieldChange'];
  onAddArrayItem: GalleryEditorProps['onAddArrayItem'];
  onRemoveArrayItem: GalleryEditorProps['onRemoveArrayItem'];
  onToggleGalleryBlockquote: GalleryEditorProps['onToggleGalleryBlockquote'];
  renderImageField: GalleryEditorProps['renderImageField'];
}) {
  const galleryData = cmsData[language].gallery;

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-2">Título da seção</span>
        <input
          type="text"
          value={galleryData.headline}
          onChange={(e) => onSectionFieldChange(language, ['headline'], e.target.value)}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
            isFieldDirty(language, ['headline'])
              ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-2">Subtítulo da seção</span>
        <textarea
          value={galleryData.subtitle}
          onChange={(e) => onSectionFieldChange(language, ['subtitle'], e.target.value)}
          className={`min-h-24 w-full rounded-lg border bg-white p-3 text-sm text-gray-800 outline-none focus:ring-2 ${
            isFieldDirty(language, ['subtitle'])
              ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
      </label>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-700">Cards de ajuda</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(language, ['cards'])}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
          >
            + Adicionar card
          </button>
        </div>

        <div className="space-y-4">
          {galleryData.cards.map((card, cardIndex) => (
            <div key={`${language}-gallery-card-${cardIndex}`} className="space-y-4 rounded-md border border-gray-200 bg-white p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Card {cardIndex + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem(language, ['cards'], cardIndex)}
                  className="rounded-md bg-red-100 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                >
                  Remover
                </button>
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">ID interno</span>
                <input
                  type="text"
                  value={card.id}
                  onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'id'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty(language, ['cards', cardIndex, 'id'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="doacoes"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Título</span>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'title'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty(language, ['cards', cardIndex, 'title'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Descrição</span>
                <textarea
                  value={card.description}
                  onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'description'], e.target.value)}
                  className={`min-h-24 w-full rounded-lg border bg-white p-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty(language, ['cards', cardIndex, 'description'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </label>

              {renderImageField(
                language,
                card.image ?? '',
                ['cards', cardIndex, 'image'],
                'Imagem do card',
                '/pessoa-segurando-caixa.jpg'
              )}

              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-700">Tags do card</p>
                  <button
                    type="button"
                    onClick={() => onAddArrayItem(language, ['cards', cardIndex, 'tags'])}
                    className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                  >
                    + Tag
                  </button>
                </div>
                <div className="space-y-2">
                  {card.tags.map((tag, tagIndex) => (
                    <div key={`${language}-gallery-card-${cardIndex}-tag-${tagIndex}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'tags', tagIndex], e.target.value)}
                        className={`h-10 flex-1 rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                          isFieldDirty(language, ['cards', cardIndex, 'tags', tagIndex])
                            ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveArrayItem(language, ['cards', cardIndex, 'tags'], tagIndex)}
                        className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-700">Depoimento (blockquote)</p>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(card.blockquote)}
                      onChange={(e) => onToggleGalleryBlockquote(language, cardIndex, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Ativo
                  </label>
                </div>

                {card.blockquote ? (
                  <>
                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700 mb-2">Texto do depoimento</span>
                      <textarea
                        value={card.blockquote.text}
                        onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'blockquote', 'text'], e.target.value)}
                        className={`min-h-24 w-full rounded-lg border bg-white p-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                          isFieldDirty(language, ['cards', cardIndex, 'blockquote', 'text'])
                            ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700 mb-2">Nome do autor</span>
                      <input
                        type="text"
                        value={card.blockquote.authorName}
                        onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'blockquote', 'authorName'], e.target.value)}
                        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                          isFieldDirty(language, ['cards', cardIndex, 'blockquote', 'authorName'])
                            ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                    </label>

                    {renderImageField(
                      language,
                      card.blockquote.authorAvatar ?? '',
                      ['cards', cardIndex, 'blockquote', 'authorAvatar'],
                      'Avatar do autor',
                      '/avatar.jpg'
                    )}
                  </>
                ) : null}
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Variação visual</span>
                <select
                  value={card.variant}
                  onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'variant'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty(language, ['cards', cardIndex, 'variant'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                >
                  <option value="light">Claro (light)</option>
                  <option value="dark">Escuro (dark)</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GalleryEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onToggleGalleryBlockquote,
  renderImageField,
}: GalleryEditorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:mb-6 lg:text-xl">Português (PT)</h3>
        <p className="mb-3 text-sm text-gray-500">Editor premium da galeria com cards, tags e depoimentos.</p>
        <GalleryLanguagePanel
          language="pt"
          cmsData={cmsData}
          isFieldDirty={isFieldDirty}
          onSectionFieldChange={onSectionFieldChange}
          onAddArrayItem={onAddArrayItem}
          onRemoveArrayItem={onRemoveArrayItem}
          onToggleGalleryBlockquote={onToggleGalleryBlockquote}
          renderImageField={renderImageField}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:mb-6 lg:text-xl">Inglês (EN)</h3>
        <p className="mb-3 text-sm text-gray-500">Premium gallery editor with cards, tags, and blockquotes.</p>
        <GalleryLanguagePanel
          language="en"
          cmsData={cmsData}
          isFieldDirty={isFieldDirty}
          onSectionFieldChange={onSectionFieldChange}
          onAddArrayItem={onAddArrayItem}
          onRemoveArrayItem={onRemoveArrayItem}
          onToggleGalleryBlockquote={onToggleGalleryBlockquote}
          renderImageField={renderImageField}
        />
      </div>
    </div>
  );
}
