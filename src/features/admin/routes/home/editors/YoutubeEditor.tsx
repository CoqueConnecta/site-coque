import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { Button } from '../../../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };

type YoutubeEditorProps = {
  data: { items?: Array<{ id?: string; title?: I18nField }> };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
};

export function YoutubeEditor({
  data,
  isFieldDirty,
  onFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: YoutubeEditorProps) {
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="space-y-6">
      {items.map((video, index) => (
        <div key={index} className={`${adminPanelGridClass} relative border border-gray-200 rounded-lg p-4`}>
          <div className="col-span-full flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Vídeo {index + 1}</span>
            <button
              type="button"
              onClick={() => onRemoveArrayItem(['items'], index)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {/* Video ID — global */}
          <div className="col-span-full">
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
          </div>
          {/* Title — i18n */}
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
      ))}
      <Button type="button" variant="ghost" onClick={() => onAddArrayItem(['items'])} className="flex items-center gap-2 text-sm">
        <Plus className="h-4 w-4" /> Adicionar vídeo
      </Button>
    </div>
  );
}
