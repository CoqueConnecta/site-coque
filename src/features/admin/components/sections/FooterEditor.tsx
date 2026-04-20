import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';
import { AdminEditorCard } from '../AdminEditorCard';
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
  getAdminTextareaClass,
} from '../adminEditorStyles';

type FooterEditorProps = {
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

function FooterLanguagePanel({
  language,
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: {
  language: CmsLanguage;
  cmsData: CmsLandingByLanguage;
  isFieldDirty: FooterEditorProps['isFieldDirty'];
  onSectionFieldChange: FooterEditorProps['onSectionFieldChange'];
  onAddArrayItem: FooterEditorProps['onAddArrayItem'];
  onRemoveArrayItem: FooterEditorProps['onRemoveArrayItem'];
}) {
  const footerData = cmsData[language].footer;

  return (
    <div className="space-y-5">
      <label className="block">
        <span className={adminFieldLabelClass}>Copyright</span>
        <input
          type="text"
          value={footerData.copyright}
          onChange={(e) => onSectionFieldChange(language, ['copyright'], e.target.value)}
          className={getAdminInputClass(isFieldDirty(language, ['copyright']))}
        />
      </label>

      <label className="block">
        <span className={adminFieldLabelClass}>Endereço</span>
        <textarea
          value={footerData.address}
          onChange={(e) => onSectionFieldChange(language, ['address'], e.target.value)}
          className={getAdminTextareaClass(isFieldDirty(language, ['address']), 'min-h-20')}
        />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={adminFieldLabelClass}>Telefone</span>
          <input
            type="text"
            value={footerData.phone ?? ''}
            onChange={(e) => onSectionFieldChange(language, ['phone'], e.target.value)}
            className={getAdminInputClass(isFieldDirty(language, ['phone']))}
          />
        </label>

        <label className="block">
          <span className={adminFieldLabelClass}>Email</span>
          <input
            type="text"
            value={footerData.email ?? ''}
            onChange={(e) => onSectionFieldChange(language, ['email'], e.target.value)}
            className={getAdminInputClass(isFieldDirty(language, ['email']))}
          />
        </label>
      </div>

      <div className={adminSectionGroupClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={adminSectionTitleClass}>Links sociais</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(language, ['socialLinks'])}
            className={adminPrimaryGhostButtonClass}
          >
            + Adicionar link social
          </button>
        </div>

        {footerData.socialLinks.map((link, index) => (
          <div key={`${language}-social-${index}`} className={adminSectionItemClass}>
            <div className="flex items-center justify-between gap-2">
              <p className={adminMetaLabelClass}>Social {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveArrayItem(language, ['socialLinks'], index)}
                className={adminDangerButtonClass}
              >
                Remover
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => onSectionFieldChange(language, ['socialLinks', index, 'platform'], e.target.value)}
                className={getAdminInputClass(isFieldDirty(language, ['socialLinks', index, 'platform']))}
                placeholder="instagram"
              />
              <input
                type="text"
                value={link.icon}
                onChange={(e) => onSectionFieldChange(language, ['socialLinks', index, 'icon'], e.target.value)}
                className={getAdminInputClass(isFieldDirty(language, ['socialLinks', index, 'icon']))}
                placeholder="instagram"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => onSectionFieldChange(language, ['socialLinks', index, 'url'], e.target.value)}
                className={getAdminInputClass(isFieldDirty(language, ['socialLinks', index, 'url']))}
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className={adminSectionGroupClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={adminSectionTitleClass}>Links rápidos</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(language, ['quickLinks'])}
            className={adminPrimaryGhostButtonClass}
          >
            + Adicionar link rápido
          </button>
        </div>

        {footerData.quickLinks.map((link, index) => (
          <div key={`${language}-quick-${index}`} className={adminSectionItemClass}>
            <div className="flex items-center justify-between gap-2">
              <p className={adminMetaLabelClass}>Link {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveArrayItem(language, ['quickLinks'], index)}
                className={adminDangerButtonClass}
              >
                Remover
              </button>
            </div>

            <input
              type="text"
              value={link.label}
              onChange={(e) => onSectionFieldChange(language, ['quickLinks', index, 'label'], e.target.value)}
              className={getAdminInputClass(isFieldDirty(language, ['quickLinks', index, 'label']))}
              placeholder="Sobre nós"
            />

            <input
              type="text"
              value={link.href}
              onChange={(e) => onSectionFieldChange(language, ['quickLinks', index, 'href'], e.target.value)}
              className={getAdminInputClass(isFieldDirty(language, ['quickLinks', index, 'href']))}
              placeholder="/#about"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FooterEditor({
  cmsData,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: FooterEditorProps) {
  return (
    <div className={adminPanelGridClass}>
      <AdminEditorCard
        title="Português (PT)"
        description="Edite dados institucionais, sociais e links rápidos."
        badgeText="Idioma"
      >
        <FooterLanguagePanel
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
        description="Edit institutional content, social links, and quick links."
        badgeText="Idioma"
      >
        <FooterLanguagePanel
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
