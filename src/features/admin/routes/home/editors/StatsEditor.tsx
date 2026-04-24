import type { CmsLanguage } from '../../../../../types/cms';
import type { CmsLandingByLanguage } from '../../../types';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminDangerButtonClass,
  adminFieldLabelClass,
  adminMetaLabelClass,
  adminPanelGridClass,
  adminPrimaryGhostButtonClass,
  adminSectionGroupClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';

type StatsEditorProps = {
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

function StatsLanguagePanel({
  language,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: {
  language: CmsLanguage;
  cmsData: CmsLandingByLanguage;
  isFieldDirty: StatsEditorProps['isFieldDirty'];
  onSectionFieldChange: StatsEditorProps['onSectionFieldChange'];
  onAddArrayItem: StatsEditorProps['onAddArrayItem'];
  onRemoveArrayItem: StatsEditorProps['onRemoveArrayItem'];
}) {
  const statsData = cmsData[language].stats;

  return (
    <div className={adminSectionGroupClass}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={adminSectionTitleClass}>Itens de impacto</p>
        <button
          type="button"
          onClick={() => onAddArrayItem(language, ['items'])}
          className={adminPrimaryGhostButtonClass}
        >
          + Adicionar item
        </button>
      </div>

      <div className="space-y-3">
        {statsData.items.map((item, index) => (
          <div key={`${language}-stats-item-${index}`} className={adminSectionItemClass}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className={adminMetaLabelClass}>Item {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveArrayItem(language, ['items'], index)}
                className={adminDangerButtonClass}
              >
                Remover
              </button>
            </div>

            <label className="block">
              <span className={adminFieldLabelClass}>Valor</span>
              <input
                type="text"
                value={item.value}
                onChange={(e) => onSectionFieldChange(language, ['items', index, 'value'], e.target.value)}
                className={getAdminInputClass(isFieldDirty(language, ['items', index, 'value']))}
                placeholder="+2.000"
              />
            </label>

            <label className="block">
              <span className={adminFieldLabelClass}>Rótulo</span>
              <input
                type="text"
                value={item.label}
                onChange={(e) => onSectionFieldChange(language, ['items', index, 'label'], e.target.value)}
                className={getAdminInputClass(isFieldDirty(language, ['items', index, 'label']))}
                placeholder="Jovens impactados"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: StatsEditorProps) {
  return (
    <div className={adminPanelGridClass}>
      <AdminEditorCard
        title="Português (PT)"
        description="Edite os indicadores e seus rótulos."
        badgeText="Idioma"
      >
        <StatsLanguagePanel
          language="pt"
          cmsData={cmsData}
          isFieldDirty={isFieldDirty}
          onSectionFieldChange={onSectionFieldChange}
          onAddArrayItem={onAddArrayItem}
          onRemoveArrayItem={onRemoveArrayItem}
        />
      </AdminEditorCard>

      <AdminEditorCard
        title="Inglês (EN)"
        description="Edit impact indicators and labels."
        badgeText="Idioma"
      >
        <StatsLanguagePanel
          language="en"
          cmsData={cmsData}
          isFieldDirty={isFieldDirty}
          onSectionFieldChange={onSectionFieldChange}
          onAddArrayItem={onAddArrayItem}
          onRemoveArrayItem={onRemoveArrayItem}
        />
      </AdminEditorCard>
    </div>
  );
}
