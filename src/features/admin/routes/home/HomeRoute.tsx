import type { ReactNode } from 'react';
import type { CmsLandingByLanguage } from '../../types';
import type { CmsLanguage, CmsLandingData } from '../../../../types/cms';
import { SectionCard } from '../../components/shared/SectionCard';
import { HeroEditor } from './editors/HeroEditor';
import { NavEditor } from './editors/NavEditor';
import { CarouselEditor } from './editors/CarouselEditor';
import { YoutubeEditor } from './editors/YoutubeEditor';
import { GalleryEditor } from './editors/GalleryEditor';
import { StatsEditor } from './editors/StatsEditor';
import { FooterEditor } from './editors/FooterEditor';

type HomeRouteProps = {
  cmsData: CmsLandingByLanguage;
  mobileLanguage: CmsLanguage;
  isFieldDirty: (language: CmsLanguage, path: Array<string | number>, section?: keyof CmsLandingData) => boolean;
  onSectionFieldChange: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>) => void;
  onRemoveArrayItem: (section: keyof CmsLandingData, language: CmsLanguage, path: Array<string | number>, index: number) => void;
  onHeroFieldChange: (language: CmsLanguage, field: 'headline' | 'subheadline' | 'ctaText' | 'backgroundImage', value: string) => void;
  onToggleGalleryBlockquote: (section: keyof CmsLandingData, language: CmsLanguage, cardIndex: number, enabled: boolean) => void;
  renderImageField: (section: keyof CmsLandingData, language: CmsLanguage, value: string, path: Array<string | number>, label: string, placeholder?: string) => ReactNode;
  getSectionDirtyCount: (section: keyof CmsLandingData, aboutMediaMode?: 'carousel' | 'youtubeVideos') => number;
};

export function HomeRoute({
  cmsData,
  mobileLanguage,
  isFieldDirty,
  onSectionFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onHeroFieldChange,
  onToggleGalleryBlockquote,
  renderImageField,
  getSectionDirtyCount,
}: HomeRouteProps) {
  
  const renderSection = (
    key: keyof CmsLandingData,
    label: string,
    editor: ReactNode,
    aboutMediaMode?: 'carousel' | 'youtubeVideos'
  ) => (
    <SectionCard
      title={label}
      dirtyCount={getSectionDirtyCount(key, aboutMediaMode)}
    >
      <div className={key !== 'aboutMedia' ? (mobileLanguage === 'pt' ? 'max-lg:[&>div>div:nth-child(2)]:hidden' : 'max-lg:[&>div>div:nth-child(1)]:hidden') : ''}>
        {editor}
      </div>
    </SectionCard>
  );

  return (
    <div className="space-y-4">
      {renderSection('nav', 'Navegação', 
        <NavEditor 
          cmsData={cmsData} 
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'nav')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('nav', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('nav', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('nav', l, p, i)} 
        />
      )}

      {renderSection('hero', 'Hero', 
        <HeroEditor 
          cmsData={cmsData} 
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'hero')} 
          onHeroFieldChange={onHeroFieldChange} 
          renderImageField={(l, v, p, lbl, ph) => renderImageField('hero', l, v, p, lbl, ph)} 
        />
      )}

      {renderSection('aboutMedia', 'Carrossel', 
        <CarouselEditor 
          cmsData={cmsData} 
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'aboutMedia')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('aboutMedia', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('aboutMedia', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('aboutMedia', l, p, i)} 
          renderImageField={(l, v, p, lbl, ph) => renderImageField('aboutMedia', l, v, p, lbl, ph)} 
        />,
        'carousel'
      )}

      {renderSection('aboutMedia', 'YouTube Videos', 
        <YoutubeEditor 
          cmsData={cmsData} 
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'aboutMedia')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('aboutMedia', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('aboutMedia', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('aboutMedia', l, p, i)} 
        />,
        'youtubeVideos'
      )}

      {renderSection('gallery', 'Galeria', 
        <GalleryEditor 
          cmsData={cmsData} 
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'gallery')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('gallery', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('gallery', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('gallery', l, p, i)} 
          onToggleGalleryBlockquote={(l, i, e) => onToggleGalleryBlockquote('gallery', l, i, e)}
          renderImageField={(l, v, p, lbl, ph) => renderImageField('gallery', l, v, p, lbl, ph)} 
        />
      )}

      {renderSection('stats', 'Estatísticas', 
        <StatsEditor 
          cmsData={cmsData} 
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'stats')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('stats', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('stats', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('stats', l, p, i)} 
        />
      )}

      {renderSection('footer', 'Rodapé', 
        <FooterEditor 
          cmsData={cmsData} 
          isFieldDirty={(l, p) => isFieldDirty(l, p, 'footer')} 
          onSectionFieldChange={(l, p, v) => onSectionFieldChange('footer', l, p, v)} 
          onAddArrayItem={(l, p) => onAddArrayItem('footer', l, p)} 
          onRemoveArrayItem={(l, p, i) => onRemoveArrayItem('footer', l, p, i)} 
        />
      )}
    </div>
  );
}
