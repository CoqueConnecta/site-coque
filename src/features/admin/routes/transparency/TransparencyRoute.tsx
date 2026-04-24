import type { ReactNode } from 'react';
import type { CmsLandingByLanguage } from '../../types';
import type { CmsLanguage, CmsLandingData } from '../../../../types/cms';
import { SectionCard } from '../../components/shared/SectionCard';
import { TransparencyEditor } from './editors/TransparencyEditor';

type TransparencyRouteProps = {
  cmsData: CmsLandingByLanguage;
  mobileLanguage: CmsLanguage;
  isFieldDirty: (language: CmsLanguage, path: Array<string | number>, section?: keyof CmsLandingData) => boolean;
  onSectionFieldChange: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>) => void;
  onRemoveArrayItem: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>, index: number) => void;
  renderImageField: (section: keyof CmsLandingData, language: CmsLanguage, value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
  getSectionDirtyCount: (section: keyof CmsLandingData) => number;
};

export function TransparencyRoute({
  cmsData,
  mobileLanguage,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
  getSectionDirtyCount,
}: TransparencyRouteProps) {
  return (
    <SectionCard
      title="Transparência"
      dirtyCount={getSectionDirtyCount('transparency')}
      defaultOpen
    >
      <div className={mobileLanguage === 'pt' ? 'max-lg:[&>div>div:nth-child(2)]:hidden' : 'max-lg:[&>div>div:nth-child(1)]:hidden'}>
        <TransparencyEditor 
          ptValue={cmsData.pt.transparency}
          enValue={cmsData.en.transparency}
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'transparency')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('transparency', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('transparency', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('transparency', l, p, i)} 
          renderImageField={(l, v, p, lbl, ph) => renderImageField('transparency', l, v, p, lbl, ph)} 
        />
      </div>
    </SectionCard>
  );
}
