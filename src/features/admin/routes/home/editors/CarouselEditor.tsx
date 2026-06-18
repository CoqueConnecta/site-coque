import type { ReactNode } from 'react';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { Button } from '../../../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

type CarouselEditorProps = {
  data: { images?: Array<{ src?: string; alt?: string }> };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  renderImageField: (value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
};

export function CarouselEditor({
  data,
  isFieldDirty,
  onFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
}: CarouselEditorProps) {
  const images = Array.isArray(data?.images) ? data.images : [];

  return (
    <div className="space-y-6">
      <p className="text-xs text-[var(--admin-text-3)]">
        Alt text em português — não é exibido para o usuário, serve apenas para acessibilidade.
      </p>
      {images.map((image, index) => (
        <div key={index} className={`${adminPanelGridClass} border border-[var(--admin-border-sub)] bg-[var(--admin-surface-2)] rounded-xl p-4`}>
          <div className="col-span-full flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[var(--admin-text-2)]">Imagem {index + 1}</span>
            <button
              type="button"
              onClick={() => onRemoveArrayItem(['images'], index)}
              className="text-rose-500 hover:text-rose-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="col-span-full">
            {renderImageField(image.src ?? '', ['images', index, 'src'], 'Imagem')}
          </div>
          <div className="col-span-full">
            <label className="block">
              <span className={adminFieldLabelClass}>Alt Text (PT)</span>
              <input
                type="text"
                value={image.alt ?? ''}
                onChange={(e) => onFieldChange(['images', index, 'alt'], e.target.value)}
                className={getAdminInputClass(isFieldDirty(['images', index, 'alt']))}
              />
            </label>
          </div>
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onAddArrayItem(['images'])} className="flex items-center gap-2 text-sm">
        <Plus className="h-4 w-4" /> Adicionar imagem
      </Button>
    </div>
  );
}
