import type { ReactNode } from 'react';
import type { CmsLandingByLanguage } from '../../types';
import type { CmsLanguage, CmsLandingData } from '../../../../types/cms';
import { SectionCard } from '../../components/shared/SectionCard';
import { ProjectsEditor } from './editors/ProjectsEditor';

type ProjectsRouteProps = {
  cmsData: CmsLandingByLanguage;
  mobileLanguage: CmsLanguage;
  isFieldDirty: (language: CmsLanguage, path: Array<string | number>, section?: keyof CmsLandingData) => boolean;
  onSectionFieldChange: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>) => void;
  onRemoveArrayItem: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>, index: number) => void;
  renderImageField: (section: keyof CmsLandingData, language: CmsLanguage, value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
  getSectionDirtyCount: (section: keyof CmsLandingData) => number;
};

export function ProjectsRoute({
  cmsData,
  mobileLanguage,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
  getSectionDirtyCount,
}: ProjectsRouteProps) {
  return (
    <SectionCard
      title="Projetos"
      dirtyCount={getSectionDirtyCount('projects')}
      defaultOpen
    >
      <div className={mobileLanguage === 'pt' ? 'max-lg:[&>div>div:nth-child(2)]:hidden' : 'max-lg:[&>div>div:nth-child(1)]:hidden'}>
        <ProjectsEditor 
          cmsData={cmsData} 
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'projects')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('projects', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('projects', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('projects', l, p, i)} 
          renderImageField={(l, v, p, lbl, ph) => renderImageField('projects', l, v, p, lbl, ph)} 
        />
      </div>
    </SectionCard>
  );
}
