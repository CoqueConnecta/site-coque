import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';

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
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-700">Ticker Images</p>
          <button
            type="button"
            onClick={() => onAddArrayItem('pt', ['tickerImages'])}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
          >
            + Adicionar imagem
          </button>
        </div>

        <div className="space-y-4">
          {aboutMediaData.tickerImages.map((image, imageIndex) => (
            <div key={`global-ticker-image-${imageIndex}`} className="space-y-3 rounded-md border border-gray-200 bg-white p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Imagem {imageIndex + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem('pt', ['tickerImages'], imageIndex)}
                  className="rounded-md bg-red-100 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
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
                <span className="block text-sm font-medium text-gray-700 mb-2">Alt</span>
                <input
                  type="text"
                  value={image.alt ?? ''}
                  onChange={(e) => onSectionFieldChange('pt', ['tickerImages', imageIndex, 'alt'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty('pt', ['tickerImages', imageIndex, 'alt'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Atividades da Coque Connecta"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Título</span>
                <input
                  type="text"
                  value={image.title ?? ''}
                  onChange={(e) => onSectionFieldChange('pt', ['tickerImages', imageIndex, 'title'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty('pt', ['tickerImages', imageIndex, 'title'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
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
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-700">YouTube Videos</p>
          <button
            type="button"
            onClick={() => onAddArrayItem('pt', ['youtubeVideos'])}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
          >
            + Adicionar vídeo
          </button>
        </div>

        <div className="space-y-4">
          {aboutMediaData.youtubeVideos.map((video, videoIndex) => (
            <div key={`global-youtube-video-${videoIndex}`} className="space-y-3 rounded-md border border-gray-200 bg-white p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Vídeo {videoIndex + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem('pt', ['youtubeVideos'], videoIndex)}
                  className="rounded-md bg-red-100 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                >
                  Remover
                </button>
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">YouTube ID</span>
                <input
                  type="text"
                  value={video.id}
                  onChange={(e) => onSectionFieldChange('pt', ['youtubeVideos', videoIndex, 'id'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty('pt', ['youtubeVideos', videoIndex, 'id'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="rwniUxBd5OI"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Título PT</span>
                <input
                  type="text"
                  value={video.titles?.pt ?? video.title ?? ''}
                  onChange={(e) => onSectionFieldChange('pt', ['youtubeVideos', videoIndex, 'titles', 'pt'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty('pt', ['youtubeVideos', videoIndex, 'titles', 'pt'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Vídeo institucional"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Título EN</span>
                <input
                  type="text"
                  value={video.titles?.en ?? video.title ?? ''}
                  onChange={(e) => onSectionFieldChange('pt', ['youtubeVideos', videoIndex, 'titles', 'en'], e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    isFieldDirty('pt', ['youtubeVideos', videoIndex, 'titles', 'en'])
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
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
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <h3 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-800 sm:pb-4 lg:mb-6 lg:text-xl">
        {mode === 'carousel' ? 'Carrossel' : 'YouTube Videos'}
      </h3>
      <p className="mb-3 text-sm text-gray-500">
        {mode === 'carousel'
          ? 'Mídia global compartilhada entre PT e EN.'
          : 'ID global por vídeo e títulos localizados por idioma.'}
      </p>
      <AboutMediaGlobalPanel
        mode={mode}
        cmsData={cmsData}
        isFieldDirty={isFieldDirty}
        onSectionFieldChange={onSectionFieldChange}
        onAddArrayItem={onAddArrayItem}
        onRemoveArrayItem={onRemoveArrayItem}
        renderImageField={renderImageField}
      />
    </div>
  );
}
