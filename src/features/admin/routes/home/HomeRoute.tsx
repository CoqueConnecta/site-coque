import { SectionCard } from '../../components/shared/SectionCard';
import { HeroEditor } from './editors/HeroEditor';
import { CarouselEditor } from './editors/CarouselEditor';
import { YoutubeEditor } from './editors/YoutubeEditor';
import { GalleryEditor } from './editors/GalleryEditor';
import { StatsEditor } from './editors/StatsEditor';
import { AboutEditor } from './editors/AboutEditor';
import type { AdminRouteProps } from '../types';

const SECTIONS = [
  { key: 'pages.home.hero',          label: 'Hero'            },
  { key: 'pages.home.about',         label: 'Quem Somos'      },
  { key: 'pages.home.carousel',      label: 'Carrossel'       },
  { key: 'pages.home.youtubeVideos', label: 'YouTube Videos'  },
  { key: 'pages.home.gallery',       label: 'Galeria'         },
  { key: 'pages.home.stats',         label: 'Estatísticas'    },
];

export function HomeRoute({
  cmsData,
  isFieldDirty,
  onFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  renderImageField,
  sectionDirtyCount,
}: AdminRouteProps) {
  return (
    <div className="space-y-4">
      {SECTIONS.map(({ key, label }) => (
        <SectionCard key={key} title={label} dirtyCount={sectionDirtyCount(key)}>
          {key === 'pages.home.hero' && (
            <HeroEditor
              data={cmsData.pages.home.hero as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              renderImageField={(value, path, lbl, ph, ro) => renderImageField(key, value, path, lbl, ph, ro)}
            />
          )}
          {key === 'pages.home.about' && (
            <AboutEditor
              data={cmsData.pages.home.about as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
            />
          )}
          {key === 'pages.home.carousel' && (
            <CarouselEditor
              data={cmsData.pages.home.carousel as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
              renderImageField={(value, path, lbl, ph, ro) => renderImageField(key, value, path, lbl, ph, ro)}
            />
          )}
          {key === 'pages.home.youtubeVideos' && (
            <YoutubeEditor
              data={cmsData.pages.home.youtubeVideos as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
            />
          )}
          {key === 'pages.home.gallery' && (
            <GalleryEditor
              data={cmsData.pages.home.gallery as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
              renderImageField={(value, path, lbl, ph, ro) => renderImageField(key, value, path, lbl, ph, ro)}
            />
          )}
          {key === 'pages.home.stats' && (
            <StatsEditor
              data={cmsData.pages.home.stats as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
            />
          )}
        </SectionCard>
      ))}
    </div>
  );
}
