import type { ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };

type GalleryCard = {
  id?: string;
  image?: string;
  variant?: 'light' | 'dark';
  title?: I18nField;
  description?: I18nField;
  tags?: Array<{ pt?: string; en?: string }>;
};

type GalleryEditorProps = {
  data: { headline?: I18nField; subtitle?: I18nField; cards?: GalleryCard[] };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  renderImageField: (value: string, path: Array<string | number>, label: string, placeholder?: string, readOnly?: boolean) => ReactNode;
};

export function GalleryEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, renderImageField }: GalleryEditorProps) {
  const cards = Array.isArray(data?.cards) ? data.cards : [];

  return (
    <div className="space-y-8">
      {/* Section header — i18n */}
      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'Cabeçalho (PT)' : 'Header (EN)'}>
            <label className="block">
              <span className={adminFieldLabelClass}>Headline</span>
              <input type="text" value={data.headline?.[lang] ?? ''} onChange={(e) => onFieldChange(['headline', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['headline', lang]))} />
            </label>
            <label className="block">
              <span className={adminFieldLabelClass}>Subtítulo</span>
              <textarea value={data.subtitle?.[lang] ?? ''} onChange={(e) => onFieldChange(['subtitle', lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty(['subtitle', lang]))} rows={3} />
            </label>
          </AdminEditorCard>
        ))}
      </div>

      {/* Cards */}
      {cards.length === 0 && (
        <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhum card adicionado ainda.</p>
      )}
      {cards.map((card, cardIndex) => (
        <CollapsibleItem
          key={cardIndex}
          label={`Card ${cardIndex + 1}`}
          summary={card.title?.pt || card.id || ''}
          onRemove={() => onRemoveArrayItem(['cards'], cardIndex)}
        >
          {/* Global fields */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={adminFieldLabelClass}>ID</span>
              <input type="text" value={card.id ?? ''} onChange={(e) => onFieldChange(['cards', cardIndex, 'id'], e.target.value)} className={getAdminInputClass(isFieldDirty(['cards', cardIndex, 'id']))} />
            </label>
            <label className="block">
              <span className={adminFieldLabelClass}>Variante</span>
              <select value={card.variant ?? 'light'} onChange={(e) => onFieldChange(['cards', cardIndex, 'variant'], e.target.value)} className={getAdminInputClass(false)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
          {renderImageField(card.image ?? '', ['cards', cardIndex, 'image'], 'Imagem do card')}
          {/* i18n fields */}
          <div className={adminPanelGridClass}>
            {(['pt', 'en'] as const).map((lang) => (
              <AdminEditorCard key={lang} title={lang === 'pt' ? 'PT' : 'EN'}>
                <label className="block">
                  <span className={adminFieldLabelClass}>Título</span>
                  <input type="text" value={card.title?.[lang] ?? ''} onChange={(e) => onFieldChange(['cards', cardIndex, 'title', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['cards', cardIndex, 'title', lang]))} />
                </label>
                <label className="block">
                  <span className={adminFieldLabelClass}>Descrição</span>
                  <textarea value={card.description?.[lang] ?? ''} onChange={(e) => onFieldChange(['cards', cardIndex, 'description', lang], e.target.value)} className={getAdminTextareaClass(isFieldDirty(['cards', cardIndex, 'description', lang]))} rows={4} />
                </label>
              </AdminEditorCard>
            ))}
          </div>
          {/* Tags */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={adminFieldLabelClass}>Tags</span>
              <AdminAddButton size="xs" onClick={() => onAddArrayItem(['cards', cardIndex, 'tags'])}>Tag</AdminAddButton>
            </div>
            {(card.tags ?? []).map((tag, tagIndex) => (
              <div key={tagIndex} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <input type="text" placeholder="PT" value={tag.pt ?? ''} onChange={(e) => onFieldChange(['cards', cardIndex, 'tags', tagIndex, 'pt'], e.target.value)} className={getAdminInputClass(isFieldDirty(['cards', cardIndex, 'tags', tagIndex, 'pt']))} />
                <input type="text" placeholder="EN" value={tag.en ?? ''} onChange={(e) => onFieldChange(['cards', cardIndex, 'tags', tagIndex, 'en'], e.target.value)} className={getAdminInputClass(isFieldDirty(['cards', cardIndex, 'tags', tagIndex, 'en']))} />
                <button type="button" onClick={() => onRemoveArrayItem(['cards', cardIndex, 'tags'], tagIndex)} className="text-rose-500 hover:text-rose-700 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CollapsibleItem>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['cards'])}>Adicionar card</AdminAddButton>
    </div>
  );
}
