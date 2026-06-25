import type { ReactNode } from 'react';
import {
  adminFieldLabelClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { CarouselSection } from '../../../../../components/sections/CarouselSection';
import type { CmsCarouselImage } from '../../../../../types/cms';

type CarouselEditorProps = {
  data: { images?: Array<{ src?: string; alt?: string }> };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  onMoveArrayItem: (path: Array<string | number>, index: number, direction: 'up' | 'down') => void;
  onDuplicateArrayItem: (path: Array<string | number>, index: number) => void;
  renderImageField: (value: string, path: Array<string | number>, label: string, placeholder?: string, readOnly?: boolean) => ReactNode;
};

function resolvePreviewImages(data: CarouselEditorProps['data']): CmsCarouselImage[] {
  return (data.images ?? [])
    .filter((image): image is { src: string; alt?: string } => Boolean(image.src))
    .map((image) => ({ src: image.src, alt: image.alt ?? '' }));
}

export function CarouselEditor({
  data,
  isFieldDirty,
  onFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onMoveArrayItem,
  onDuplicateArrayItem,
  renderImageField,
}: CarouselEditorProps) {
  const images = Array.isArray(data?.images) ? data.images : [];

  return (
    <div className="space-y-6">
      <p className="text-xs text-[var(--admin-text-3)]">
        Alt text em português — não é exibido para o usuário, serve apenas para acessibilidade.
      </p>
      {images.length === 0 && (
        <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhuma imagem adicionada ainda.</p>
      )}
      {images.map((image, index) => (
        <CollapsibleItem
          key={index}
          label={`Imagem ${index + 1}`}
          summary={image.alt || ''}
          onRemove={() => onRemoveArrayItem(['images'], index)}
          onDuplicate={() => onDuplicateArrayItem(['images'], index)}
          onMoveUp={index > 0 ? () => onMoveArrayItem(['images'], index, 'up') : undefined}
          onMoveDown={index < images.length - 1 ? () => onMoveArrayItem(['images'], index, 'down') : undefined}
        >
          {renderImageField(image.src ?? '', ['images', index, 'src'], 'Imagem', undefined, true)}
          <label className="block">
            <span className={adminFieldLabelClass}>Alt Text (PT)</span>
            <input
              type="text"
              value={image.alt ?? ''}
              onChange={(e) => onFieldChange(['images', index, 'alt'], e.target.value)}
              className={getAdminInputClass(isFieldDirty(['images', index, 'alt']))}
            />
          </label>
        </CollapsibleItem>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['images'])}>Adicionar imagem</AdminAddButton>

      <AdminPreviewPanel>
        <CarouselSection images={resolvePreviewImages(data)} />
      </AdminPreviewPanel>
    </div>
  );
}
