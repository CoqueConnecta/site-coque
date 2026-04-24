import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../../types/cms';
import type { CmsLandingByLanguage } from '../../../types';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminDangerButtonClass,
  adminFieldLabelClass,
  adminMetaLabelClass,
  adminPrimaryGhostButtonClass,
  adminSectionGroupClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';

type CarouselEditorProps = {
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
  renderImageField: (
    language: CmsLanguage,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string
  ) => ReactNode;
};

export function CarouselEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
}: CarouselEditorProps) {
  const aboutMediaData = cmsData.pt.aboutMedia;

  return (
    <AdminEditorCard
      title="Carrossel"
      description="Mídia global compartilhada entre PT e EN."
      badgeText="Global"
    >
      <div className={adminSectionGroupClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={adminSectionTitleClass}>Ticker Images</p>
          <button
            type="button"
            onClick={() => onAddArrayItem('pt', ['tickerImages'])}
            className={adminPrimaryGhostButtonClass}
          >
            + Adicionar imagem
          </button>
        </div>

        <div className="space-y-4">
          {aboutMediaData.tickerImages.map((image, imageIndex) => (
            <div key={`global-ticker-image-${imageIndex}`} className={adminSectionItemClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={adminMetaLabelClass}>Imagem {imageIndex + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem('pt', ['tickerImages'], imageIndex)}
                  className={adminDangerButtonClass}
                >
                  Remover
                </button>
              </div>

              {renderImageField(
                'pt',
                image.src ?? '',
                ['tickerImages', imageIndex, 'src'],
                'Imagem (src)',
                '/mulheres-costurando.jpg'
              )}

              <label className="block">
                <span className={adminFieldLabelClass}>Alt</span>
                <input
                  type="text"
                  value={image.alt ?? ''}
                  onChange={(e) => onSectionFieldChange('pt', ['tickerImages', imageIndex, 'alt'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty('pt', ['tickerImages', imageIndex, 'alt']))}
                  placeholder="Atividades da Coque Connecta"
                />
              </label>

              <label className="block">
                <span className={adminFieldLabelClass}>Título</span>
                <input
                  type="text"
                  value={image.title ?? ''}
                  onChange={(e) => onSectionFieldChange('pt', ['tickerImages', imageIndex, 'title'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty('pt', ['tickerImages', imageIndex, 'title']))}
                  placeholder="Programa educacional"
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </AdminEditorCard>
  );
}
