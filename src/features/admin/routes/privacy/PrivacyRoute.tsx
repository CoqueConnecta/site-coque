import type { ReactNode } from 'react';
import type { CmsLandingByLanguage } from '../../types';
import type { CmsLanguage, CmsLandingData } from '../../../../types/cms';
import { SectionCard } from '../../components/shared/SectionCard';
import { PrivacyEditor } from './editors/PrivacyEditor';

type PrivacyRouteProps = {
  cmsData: CmsLandingByLanguage;
  mobileLanguage: CmsLanguage;
  isFieldDirty: (language: CmsLanguage, path: Array<string | number>, section?: keyof CmsLandingData) => boolean;
  onSectionFieldChange: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>) => void;
  onRemoveArrayItem: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>, index: number) => void;
  renderImageField: (section: keyof CmsLandingData, language: CmsLanguage, value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
  getSectionDirtyCount: (section: keyof CmsLandingData) => number;
};

export function PrivacyRoute({
  cmsData,
  mobileLanguage,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
  getSectionDirtyCount,
}: PrivacyRouteProps) {
  return (
    <SectionCard
      title="Privacidade"
      dirtyCount={getSectionDirtyCount('privacy')}
      defaultOpen
    >
      <div className={mobileLanguage === 'pt' ? 'max-lg:[&>div>div:nth-child(2)]:hidden' : 'max-lg:[&>div>div:nth-child(1)]:hidden'}>
        <PrivacyEditor 
          ptValue={cmsData.pt.privacy}
          enValue={cmsData.en.privacy}
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'privacy')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('privacy', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('privacy', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('privacy', l, p, i)} 
          renderImageField={(l, v, p, lbl, ph) => renderImageField('privacy', l, v, p, lbl, ph)} 
        />
      </div>
    </SectionCard>
  );
}
