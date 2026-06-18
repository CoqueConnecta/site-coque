import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  adminSectionItemClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };

type YoutubeEditorProps = {
  data: { items?: Array<{ id?: string; title?: I18nField }> };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
};

export function YoutubeEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem }: YoutubeEditorProps) {
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="space-y-4">
      {items.map((video, index) => (
        <div key={index} className={adminSectionItemClass}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-[var(--admin-text-2)]">Vídeo {index + 1}</span>
            <button
              type="button"
              onClick={() => onRemoveArrayItem(['items'], index)}
              className="text-rose-500 hover:text-rose-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <label className="block">
            <span className={adminFieldLabelClass}>YouTube Video ID</span>
            <input
              type="text"
              placeholder="ex: rwniUxBd5OI"
              value={video.id ?? ''}
              onChange={(e) => onFieldChange(['items', index, 'id'], e.target.value)}
              className={getAdminInputClass(isFieldDirty(['items', index, 'id']))}
            />
          </label>
          <div className={adminPanelGridClass}>
            {(['pt', 'en'] as const).map((lang) => (
              <AdminEditorCard key={lang} title={lang === 'pt' ? 'Título (PT)' : 'Title (EN)'} badgeText="Idioma">
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
        </div>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['items'])}>Adicionar vídeo</AdminAddButton>
    </div>
  );
}
