import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';
import { AdminEditorCard } from '../AdminEditorCard';
import {
  adminDangerButtonClass,
  adminFieldLabelClass,
  adminMetaLabelClass,
  adminPrimaryGhostButtonClass,
  adminSectionGroupClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
} from '../adminEditorStyles';

type AboutMediaEditorProps = {
  mode: 'carousel' | 'youtubeVideos';
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

function AboutMediaGlobalPanel({
  mode,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
}: {
  mode: AboutMediaEditorProps['mode'];
  cmsData: CmsLandingByLanguage;
  isFieldDirty: AboutMediaEditorProps['isFieldDirty'];
  onSectionFieldChange: AboutMediaEditorProps['onSectionFieldChange'];
  onAddArrayItem: AboutMediaEditorProps['onAddArrayItem'];
  onRemoveArrayItem: AboutMediaEditorProps['onRemoveArrayItem'];
  renderImageField: AboutMediaEditorProps['renderImageField'];
}) {
  const aboutMediaData = cmsData.pt.aboutMedia;

  if (mode === 'carousel') {
    return (
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
    );
  }

  return (
    <div className={adminSectionGroupClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={adminSectionTitleClass}>YouTube Videos</p>
          <button
            type="button"
            onClick={() => onAddArrayItem('pt', ['youtubeVideos'])}
            className={adminPrimaryGhostButtonClass}
          >
            + Adicionar vídeo
          </button>
        </div>

        <div className="space-y-4">
          {aboutMediaData.youtubeVideos.map((video, videoIndex) => (
            <div key={`global-youtube-video-${videoIndex}`} className={adminSectionItemClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={adminMetaLabelClass}>Vídeo {videoIndex + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem('pt', ['youtubeVideos'], videoIndex)}
                  className={adminDangerButtonClass}
                >
                  Remover
                </button>
              </div>

              <label className="block">
                <span className={adminFieldLabelClass}>YouTube ID</span>
                <input
                  type="text"
                  value={video.id}
                  onChange={(e) => onSectionFieldChange('pt', ['youtubeVideos', videoIndex, 'id'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty('pt', ['youtubeVideos', videoIndex, 'id']))}
                  placeholder="rwniUxBd5OI"
                />
              </label>

              <label className="block">
                <span className={adminFieldLabelClass}>Título PT</span>
                <input
                  type="text"
                  value={video.titles?.pt ?? video.title ?? ''}
                  onChange={(e) => onSectionFieldChange('pt', ['youtubeVideos', videoIndex, 'titles', 'pt'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty('pt', ['youtubeVideos', videoIndex, 'titles', 'pt']))}
                  placeholder="Vídeo institucional"
                />
              </label>

              <label className="block">
                <span className={adminFieldLabelClass}>Título EN</span>
                <input
                  type="text"
                  value={video.titles?.en ?? video.title ?? ''}
                  onChange={(e) => onSectionFieldChange('pt', ['youtubeVideos', videoIndex, 'titles', 'en'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty('pt', ['youtubeVideos', videoIndex, 'titles', 'en']))}
                  placeholder="Institutional video"
                />
              </label>
            </div>
          ))}
        </div>
    </div>
  );
}

export function AboutMediaEditor({
  mode,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
}: AboutMediaEditorProps) {
  return (
    <AdminEditorCard
      title={mode === 'carousel' ? 'Carrossel' : 'YouTube Videos'}
      description={mode === 'carousel'
        ? 'Mídia global compartilhada entre PT e EN.'
        : 'ID global por vídeo e títulos localizados por idioma.'}
      badgeText="Global"
    >
      <AboutMediaGlobalPanel
        mode={mode}
        cmsData={cmsData}
        isFieldDirty={isFieldDirty}
        onSectionFieldChange={onSectionFieldChange}
        onAddArrayItem={onAddArrayItem}
        onRemoveArrayItem={onRemoveArrayItem}
        renderImageField={renderImageField}
      />
    </AdminEditorCard>
  );
}
