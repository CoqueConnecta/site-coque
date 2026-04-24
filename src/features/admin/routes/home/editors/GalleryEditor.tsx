import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../../types/cms';
import type { CmsLandingByLanguage } from '../../../types';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
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
  getAdminSelectClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';

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
        <span className={adminFieldLabelClass}>Título da seção</span>
        <input
          type="text"
          value={galleryData.headline}
          onChange={(e) => onSectionFieldChange(language, ['headline'], e.target.value)}
          className={getAdminInputClass(isFieldDirty(language, ['headline']))}
        />
      </label>

      <label className="block">
        <span className={adminFieldLabelClass}>Subtítulo da seção</span>
        <textarea
          value={galleryData.subtitle}
          onChange={(e) => onSectionFieldChange(language, ['subtitle'], e.target.value)}
          className={getAdminTextareaClass(isFieldDirty(language, ['subtitle']))}
        />
      </label>

      <div className={adminSectionGroupClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={adminSectionTitleClass}>Cards de ajuda</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(language, ['cards'])}
            className={adminPrimaryGhostButtonClass}
          >
            + Adicionar card
          </button>
        </div>

        <div className="space-y-4">
          {galleryData.cards.map((card, cardIndex) => (
            <div key={`${language}-gallery-card-${cardIndex}`} className={adminSectionItemClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={adminMetaLabelClass}>Card {cardIndex + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem(language, ['cards'], cardIndex)}
                  className={adminDangerButtonClass}
                >
                  Remover
                </button>
              </div>

              <label className="block">
                <span className={adminFieldLabelClass}>ID interno</span>
                <input
                  type="text"
                  value={card.id}
                  onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'id'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty(language, ['cards', cardIndex, 'id']))}
                  placeholder="doacoes"
                />
              </label>

              <label className="block">
                <span className={adminFieldLabelClass}>Título</span>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'title'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty(language, ['cards', cardIndex, 'title']))}
                />
              </label>

              <label className="block">
                <span className={adminFieldLabelClass}>Descrição</span>
                <textarea
                  value={card.description}
                  onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'description'], e.target.value)}
                  className={getAdminTextareaClass(isFieldDirty(language, ['cards', cardIndex, 'description']))}
                />
              </label>

              {renderImageField(
                language,
                card.image ?? '',
                ['cards', cardIndex, 'image'],
                'Imagem do card',
                '/pessoa-segurando-caixa.jpg'
              )}

              <div className={adminSectionGroupClass}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={adminSectionTitleClass}>Tags do card</p>
                  <button
                    type="button"
                    onClick={() => onAddArrayItem(language, ['cards', cardIndex, 'tags'])}
                    className={adminPrimaryGhostButtonClass}
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
                        className={getAdminInputClass(isFieldDirty(language, ['cards', cardIndex, 'tags', tagIndex]))}
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveArrayItem(language, ['cards', cardIndex, 'tags'], tagIndex)}
                        className={adminDangerButtonClass}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={adminSectionGroupClass}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={adminSectionTitleClass}>Depoimento (blockquote)</p>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(card.blockquote)}
                      onChange={(e) => onToggleGalleryBlockquote(language, cardIndex, e.target.checked)}
                      className={adminCheckboxClass}
                    />
                    Ativo
                  </label>
                </div>

                {card.blockquote ? (
                  <>
                    <label className="block">
                      <span className={adminFieldLabelClass}>Texto do depoimento</span>
                      <textarea
                        value={card.blockquote.text}
                        onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'blockquote', 'text'], e.target.value)}
                        className={getAdminTextareaClass(isFieldDirty(language, ['cards', cardIndex, 'blockquote', 'text']))}
                      />
                    </label>

                    <label className="block">
                      <span className={adminFieldLabelClass}>Nome do autor</span>
                      <input
                        type="text"
                        value={card.blockquote.authorName}
                        onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'blockquote', 'authorName'], e.target.value)}
                        className={getAdminInputClass(isFieldDirty(language, ['cards', cardIndex, 'blockquote', 'authorName']))}
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
                <span className={adminFieldLabelClass}>Variação visual</span>
                <select
                  value={card.variant}
                  onChange={(e) => onSectionFieldChange(language, ['cards', cardIndex, 'variant'], e.target.value)}
                  className={getAdminSelectClass(isFieldDirty(language, ['cards', cardIndex, 'variant']))}
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
    <div className={adminPanelGridClass}>
      <AdminEditorCard
        title="Português (PT)"
        description="Galeria com cards, tags e depoimentos."
        badgeText="Idioma"
      >
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
      </AdminEditorCard>

      <AdminEditorCard
        title="Inglês (EN)"
        description="Gallery with cards, tags, and blockquotes."
        badgeText="Idioma"
      >
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
      </AdminEditorCard>
    </div>
  );
}
