import { useState } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { extractYouTubeId } from '../../../utils/youtube';
import { VideosSection } from '../../../../../components/sections/VideosSection';
import type { ResolvedYoutubeVideo } from '../../../../../types/cms';

type I18nField = { pt?: string; en?: string };

type YoutubeEditorProps = {
  data: { items?: Array<{ id?: string; title?: I18nField }> };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  onMoveArrayItem: (path: Array<string | number>, index: number, direction: 'up' | 'down') => void;
  onDuplicateArrayItem: (path: Array<string | number>, index: number) => void;
};

function resolvePreviewVideos(data: YoutubeEditorProps['data']): ResolvedYoutubeVideo[] {
  return (data.items ?? [])
    .filter((item): item is { id: string; title?: I18nField } => Boolean(item.id))
    .map((item) => ({ id: item.id, title: item.title?.pt ?? '' }));
}

type VideoItemProps = {
  video: { id?: string; title?: I18nField };
  index: number;
  isLast: boolean;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  onMoveArrayItem: (path: Array<string | number>, index: number, direction: 'up' | 'down') => void;
  onDuplicateArrayItem: (path: Array<string | number>, index: number) => void;
};

function VideoItem({ video, index, isLast, isFieldDirty, onFieldChange, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem }: VideoItemProps) {
  const [draft, setDraft] = useState(video.id ?? '');
  const extractedId = extractYouTubeId(draft) ?? (video.id || null);

  const handleChange = (raw: string) => {
    setDraft(raw);
    const id = extractYouTubeId(raw);
    if (id) {
      onFieldChange(['items', index, 'id'], id);
    } else if (!raw.trim()) {
      onFieldChange(['items', index, 'id'], '');
    }
  };

  const handleBlur = () => {
    if (video.id) setDraft(video.id);
  };

  return (
    <CollapsibleItem
      label={`Vídeo ${index + 1}`}
      summary={video.title?.pt || video.id || ''}
      onRemove={() => onRemoveArrayItem(['items'], index)}
      onDuplicate={() => onDuplicateArrayItem(['items'], index)}
      onMoveUp={index > 0 ? () => onMoveArrayItem(['items'], index, 'up') : undefined}
      onMoveDown={!isLast ? () => onMoveArrayItem(['items'], index, 'down') : undefined}
    >

      <label className="block">
        <span className={adminFieldLabelClass}>Link ou ID do vídeo</span>
        <input
          type="text"
          placeholder="ex: https://youtu.be/rwniUxBd5OI ou rwniUxBd5OI"
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={getAdminInputClass(isFieldDirty(['items', index, 'id']))}
        />
      </label>

      {extractedId && (
        <div className="flex items-center gap-3">
          <img
            src={`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`}
            alt="Thumbnail"
            className="h-16 w-28 flex-shrink-0 rounded-lg object-cover border border-[var(--admin-border-sub)]"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <p className="text-xs text-[var(--admin-text-3)]">
            ID: <span className="font-mono font-semibold text-[var(--admin-text-2)]">{extractedId}</span>
          </p>
        </div>
      )}

      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'Título (PT)' : 'Title (EN)'}>
            <label className="block">
              <span className={adminFieldLabelClass}>Título</span>
              <input
                type="text"
                value={video.title?.[lang] ?? ''}
                onChange={(e) => onFieldChange(['items', index, 'title', lang], e.target.value)}
                className={getAdminInputClass(isFieldDirty(['items', index, 'title', lang]))}
              />
            </label>
          </AdminEditorCard>
        ))}
      </div>
    </CollapsibleItem>
  );
}

export function YoutubeEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem }: YoutubeEditorProps) {
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhum vídeo adicionado ainda.</p>
      )}
      {items.map((video, index) => (
        <VideoItem
          key={index}
          video={video}
          index={index}
          isLast={index === items.length - 1}
          isFieldDirty={isFieldDirty}
          onFieldChange={onFieldChange}
          onRemoveArrayItem={onRemoveArrayItem}
          onMoveArrayItem={onMoveArrayItem}
          onDuplicateArrayItem={onDuplicateArrayItem}
        />
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['items'])}>Adicionar vídeo</AdminAddButton>

      <AdminPreviewPanel>
        <VideosSection videos={resolvePreviewVideos(data)} />
      </AdminPreviewPanel>
    </div>
  );
}
