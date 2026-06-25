import { useState } from 'react';
import { AdminInputField } from '../../../components/form/AdminInputField';
import { I18nTextField } from '../../../components/form/I18nTextField';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { CollapsibleItem } from '../../../components/shared/CollapsibleItem';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { StatsSection } from '../../../../../components/sections/StatsSection';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, ResolvedStatsData } from '../../../../../types/cms';

type I18nField = { pt?: string; en?: string };

type StatsEditorProps = {
  data: { items?: Array<{ value?: string; label?: I18nField }> };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
  onMoveArrayItem: (path: Array<string | number>, index: number, direction: 'up' | 'down') => void;
  onDuplicateArrayItem: (path: Array<string | number>, index: number) => void;
};

function resolvePreviewData(data: StatsEditorProps['data'], language: CmsLanguage): ResolvedStatsData {
  return {
    items: (data.items ?? []).map((item) => ({
      value: item.value ?? '',
      label: pickLang({ pt: item.label?.pt ?? '', en: item.label?.en ?? '' }, language),
    })),
  };
}

export function StatsEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem }: StatsEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-[var(--admin-text-4)] py-2">Nenhuma estatística adicionada ainda.</p>
      )}
      {items.map((item, index) => (
        <CollapsibleItem
          key={index}
          label={`Estatística ${index + 1}`}
          summary={item.label?.pt || ''}
          onRemove={() => onRemoveArrayItem(['items'], index)}
          onDuplicate={() => onDuplicateArrayItem(['items'], index)}
          onMoveUp={index > 0 ? () => onMoveArrayItem(['items'], index, 'up') : undefined}
          onMoveDown={index < items.length - 1 ? () => onMoveArrayItem(['items'], index, 'down') : undefined}
        >
          <AdminInputField
            label="Valor (global)"
            path={['items', index, 'value']}
            value={item.value ?? ''}
            placeholder="ex: +2.000"
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
          />
          <I18nTextField
            label="Rótulo"
            pathPt={['items', index, 'label', 'pt']}
            pathEn={['items', index, 'label', 'en']}
            valuePt={item.label?.pt ?? ''}
            valueEn={item.label?.en ?? ''}
            isFieldDirty={isFieldDirty}
            onFieldChange={onFieldChange}
          />
        </CollapsibleItem>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['items'])}>Adicionar estatística</AdminAddButton>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <StatsSection data={resolvePreviewData(data, previewLang)} />
      </AdminPreviewPanel>
    </div>
  );
}
