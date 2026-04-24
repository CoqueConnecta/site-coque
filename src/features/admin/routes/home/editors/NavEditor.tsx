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

type NavEditorProps = {
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

function NavLanguagePanel({
  language,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: {
  language: CmsLanguage;
  cmsData: CmsLandingByLanguage;
  isFieldDirty: NavEditorProps['isFieldDirty'];
  onSectionFieldChange: NavEditorProps['onSectionFieldChange'];
  onAddArrayItem: NavEditorProps['onAddArrayItem'];
  onRemoveArrayItem: NavEditorProps['onRemoveArrayItem'];
}) {
  const navData = cmsData[language].nav;

  return (
    <div className="space-y-5">
      <div className={adminSectionGroupClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={adminSectionTitleClass}>Links do menu</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(language, ['links'])}
            className={adminPrimaryGhostButtonClass}
          >
            + Adicionar link
          </button>
        </div>

        <div className="space-y-3">
          {navData.links.map((link, index) => (
            <div key={`${language}-nav-link-${index}`} className={adminSectionItemClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={adminMetaLabelClass}>Link {index + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem(language, ['links'], index)}
                  className={adminDangerButtonClass}
                >
                  Remover
                </button>
              </div>

              <label className="block">
                <span className={adminFieldLabelClass}>Identificador interno</span>
                <input
                  type="text"
                  value={link.id}
                  onChange={(e) => onSectionFieldChange(language, ['links', index, 'id'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty(language, ['links', index, 'id']))}
                  placeholder="about"
                />
              </label>

              <label className="block">
                <span className={adminFieldLabelClass}>Texto exibido</span>
                <input
                  type="text"
                  value={(link as any).labels?.[language] || ''}
                  onChange={(e) => onSectionFieldChange(language, ['links', index, 'labels', language], e.target.value)}
                  className={getAdminInputClass(isFieldDirty(language, ['links', index, 'labels', language]))}
                  placeholder="Quem Somos"
                />
              </label>

              <label className="block">
                <span className={adminFieldLabelClass}>Link (href)</span>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => onSectionFieldChange(language, ['links', index, 'href'], e.target.value)}
                  className={getAdminInputClass(isFieldDirty(language, ['links', index, 'href']))}
                  placeholder="/#about"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={adminSectionGroupClass}>
        <p className={adminSectionTitleClass}>Botão principal (CTA)</p>

        <label className="block">
          <span className={adminFieldLabelClass}>Texto do botão</span>
          <input
            type="text"
            value={(navData.cta as any).labels?.[language] || ''}
            onChange={(e) => onSectionFieldChange(language, ['cta', 'labels', language], e.target.value)}
            className={getAdminInputClass(isFieldDirty(language, ['cta', 'labels', language]))}
            placeholder="DOE AGORA"
          />
        </label>

        <label className="block">
          <span className={adminFieldLabelClass}>Link do botão</span>
          <input
            type="text"
            value={navData.cta.href}
            onChange={(e) => onSectionFieldChange(language, ['cta', 'href'], e.target.value)}
            className={getAdminInputClass(isFieldDirty(language, ['cta', 'href']))}
            placeholder="https://..."
          />
        </label>
      </div>
    </div>
  );
}

export function NavEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: NavEditorProps) {
  return (
    <div className={adminPanelGridClass}>
      <AdminEditorCard
        title="Português (PT)"
        description="Editor de navegação com campos guiados."
        badgeText="Idioma"
      >
        <NavLanguagePanel
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
        description="Navigation editor with guided fields."
        badgeText="Idioma"
      >
        <NavLanguagePanel
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
