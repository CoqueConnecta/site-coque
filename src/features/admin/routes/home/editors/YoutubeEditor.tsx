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

type YoutubeEditorProps = {
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

export function YoutubeEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: YoutubeEditorProps) {
  const aboutMediaData = cmsData.pt.aboutMedia;

  return (
    <AdminEditorCard
      title="YouTube Videos"
      description="ID global por vídeo e títulos localizados por idioma."
      badgeText="Global"
    >
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
    </AdminEditorCard>
  );
}
