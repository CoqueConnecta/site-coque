import type { ReactNode } from 'react';
import type { CmsLanguage } from '../../../../types/cms';
import type { CmsLandingByLanguage } from '../../types';
import { AdminEditorCard } from '../AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../adminEditorStyles';

type HeroEditorProps = {
  cmsData: CmsLandingByLanguage;
  isFieldDirty: (language: CmsLanguage, path: Array<string | number>) => boolean;
  onHeroFieldChange: (
    language: CmsLanguage,
    field: 'headline' | 'subheadline' | 'ctaText' | 'backgroundImage',
    value: string
  ) => void;
  renderImageField: (
    language: CmsLanguage,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string
  ) => ReactNode;
};

export function HeroEditor({
  cmsData,
  isFieldDirty,
  onHeroFieldChange,
  renderImageField,
}: HeroEditorProps) {
  return (
    <div className={adminPanelGridClass}>
      <AdminEditorCard
        title="Português (PT)"
        description="Preencha os campos abaixo para editar o Hero sem precisar de JSON."
        badgeText="Idioma"
      >

        <label className="block">
          <span className={adminFieldLabelClass}>Headline</span>
          <textarea
            value={cmsData.pt.hero.headline}
            onChange={(e) => onHeroFieldChange('pt', 'headline', e.target.value)}
            className={getAdminTextareaClass(isFieldDirty('pt', ['headline']))}
          />
        </label>

        <label className="block">
          <span className={adminFieldLabelClass}>Subheadline</span>
          <textarea
            value={cmsData.pt.hero.subheadline}
            onChange={(e) => onHeroFieldChange('pt', 'subheadline', e.target.value)}
            className={getAdminTextareaClass(isFieldDirty('pt', ['subheadline']), 'min-h-32')}
          />
        </label>

        <label className="block">
          <span className={adminFieldLabelClass}>Texto do botão (CTA)</span>
          <input
            type="text"
            value={cmsData.pt.hero.ctaText}
            onChange={(e) => onHeroFieldChange('pt', 'ctaText', e.target.value)}
            className={getAdminInputClass(isFieldDirty('pt', ['ctaText']))}
          />
        </label>

        {renderImageField(
          'pt',
          cmsData.pt.hero.backgroundImage ?? '',
          ['backgroundImage'],
          'Imagem de fundo (opcional)',
          '/assets/banner.jpg'
        )}
      </AdminEditorCard>

      <AdminEditorCard
        title="Inglês (EN)"
        description="Preencha os campos abaixo para editar o Hero sem precisar de JSON."
        badgeText="Idioma"
      >

        <label className="block">
          <span className={adminFieldLabelClass}>Headline</span>
          <textarea
            value={cmsData.en.hero.headline}
            onChange={(e) => onHeroFieldChange('en', 'headline', e.target.value)}
            className={getAdminTextareaClass(isFieldDirty('en', ['headline']))}
          />
        </label>

        <label className="block">
          <span className={adminFieldLabelClass}>Subheadline</span>
          <textarea
            value={cmsData.en.hero.subheadline}
            onChange={(e) => onHeroFieldChange('en', 'subheadline', e.target.value)}
            className={getAdminTextareaClass(isFieldDirty('en', ['subheadline']), 'min-h-32')}
          />
        </label>

        <label className="block">
          <span className={adminFieldLabelClass}>Button text (CTA)</span>
          <input
            type="text"
            value={cmsData.en.hero.ctaText}
            onChange={(e) => onHeroFieldChange('en', 'ctaText', e.target.value)}
            className={getAdminInputClass(isFieldDirty('en', ['ctaText']))}
          />
        </label>

        {renderImageField(
          'en',
          cmsData.en.hero.backgroundImage ?? '',
          ['backgroundImage'],
          'Background image (optional)',
          '/assets/banner.jpg'
        )}
      </AdminEditorCard>
    </div>
  );
}
