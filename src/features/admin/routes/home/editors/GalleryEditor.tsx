import type { ReactNode } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../../../components/shared/adminEditorStyles';
import { Button } from '../../../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

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
  renderImageField: (value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
};

export function GalleryEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, renderImageField }: GalleryEditorProps) {
  const cards = Array.isArray(data?.cards) ? data.cards : [];

  return (
    <div className="space-y-8">
      {/* Section header — i18n */}
      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'Cabeçalho (PT)' : 'Header (EN)'} badgeText="Idioma">
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
      {cards.map((card, cardIndex) => (
        <div key={cardIndex} className="border border-[var(--admin-border-sub)] bg-[var(--admin-surface-2)] rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-[var(--admin-text-2)]">Card {cardIndex + 1}</span>
            <button type="button" onClick={() => onRemoveArrayItem(['cards'], cardIndex)} className="text-rose-500 hover:text-rose-700 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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
              <AdminEditorCard key={lang} title={lang === 'pt' ? 'PT' : 'EN'} badgeText="Idioma">
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
              <button type="button" onClick={() => onAddArrayItem(['cards', cardIndex, 'tags'])} className="text-[var(--admin-accent)] hover:opacity-80 text-xs flex items-center gap-1 transition-opacity">
                <Plus className="h-3 w-3" /> Tag
              </button>
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
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onAddArrayItem(['cards'])} className="flex items-center gap-2 text-sm">
        <Plus className="h-4 w-4" /> Adicionar card
      </Button>
    </div>
  );
}
